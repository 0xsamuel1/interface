import * as React from 'react'

import { cn } from '@workspace/ui/lib/utils'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { EmptyState } from '@workspace/ui/components/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyRow,
  TableHead,
  TableHeadRow,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

interface Column<T> {
  id: string
  header: string
  accessor: (row: T) => React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

interface DataTableProps<T> {
  columns: Array<Column<T>>
  data: Array<T>
  isLoading?: boolean
  emptyMessage?: string
  emptyAction?: React.ReactNode
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  selectedRowKey?: string
  /** FLIP insertion/removal/reorder animations for live trading data. */
  animateRows?: boolean
  className?: string
}

function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data',
  emptyAction,
  keyExtractor,
  onRowClick,
  selectedRowKey,
  animateRows = false,
  className,
}: DataTableProps<T>) {
  const currentNodes = React.useRef(new Map<string, HTMLTableRowElement>())
  const previousRows = React.useRef(
    new Map<string, { rect: DOMRect; node: HTMLTableRowElement; widths: Array<number> }>(),
  )
  const initialized = React.useRef(false)

  React.useLayoutEffect(() => {
    if (!animateRows || isLoading) {
      previousRows.current.clear()
      initialized.current = false
      return
    }
    const old = previousRows.current
    const next = new Map<string, { rect: DOMRect; node: HTMLTableRowElement; widths: Array<number> }>()
    const css = getComputedStyle(document.documentElement)
    const duration = Number.parseFloat(css.getPropertyValue('--duration-moderate')) || 200
    const easing = css.getPropertyValue('--ease-out').trim() || 'ease-out'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.reducedMotion === 'true'

    for (const row of data) {
      const key = keyExtractor(row)
      const node = currentNodes.current.get(key)
      if (!node) continue
      const rect = node.getBoundingClientRect()
      next.set(key, {
        rect,
        node,
        widths: Array.from(node.children, cell => cell.getBoundingClientRect().width),
      })
      if (!initialized.current || reduced) continue
      const previous = old.get(key)
      const dy = previous ? previous.rect.top - rect.top : 10
      if (!previous || Math.abs(dy) > 1) {
        // Web Animations interrupts from current compositor state instead of
        // replaying a CSS keyframe when live data changes during an animation.
        node.getAnimations().forEach(animation => animation.cancel())
        node.animate(
          [
            { transform: `translateY(${dy}px)`, opacity: previous ? 1 : 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          { duration, easing },
        )
      }
    }

    // Exiting rows are inert visual ghosts: the DOM table is updated
    // immediately for accessibility while the remaining rows FLIP into place.
    if (initialized.current && !reduced) {
      for (const [key, previous] of old) {
        if (next.has(key) || previous.rect.bottom < 0 || previous.rect.top > innerHeight) continue
        const ghost = document.createElement('table')
        const body = document.createElement('tbody')
        const clone = previous.node.cloneNode(true) as HTMLTableRowElement
        Array.from(clone.children).forEach((cell, index) => {
          ;(cell as HTMLElement).style.width = `${previous.widths[index]}px`
        })
        body.append(clone)
        ghost.append(body)
        ghost.setAttribute('aria-hidden', 'true')
        ghost.inert = true
        Object.assign(ghost.style, {
          position: 'fixed',
          left: `${previous.rect.left}px`,
          top: `${previous.rect.top}px`,
          width: `${previous.rect.width}px`,
          tableLayout: 'fixed',
          pointerEvents: 'none',
          zIndex: '50',
        })
        document.body.append(ghost)
        const animation = ghost.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }],
          { duration, easing },
        )
        void animation.finished.finally(() => ghost.remove()).catch(() => ghost.remove())
      }
    }
    previousRows.current = next
    initialized.current = true
  }, [data, animateRows, isLoading, keyExtractor])

  if (isLoading) {
    return (
      <Table containerClassName={className}>
        <TableBody>
          {[0, 1, 2].map((i) => (
            <TableRow key={i} interactive={false}>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (data.length === 0) {
    const colSpan = columns.length || 1
    return (
      <Table containerClassName={className}>
        <TableBody>
          <TableEmptyRow colSpan={colSpan}>
            <EmptyState
              title={emptyMessage}
              actions={emptyAction ? { primary: emptyAction } : undefined}
            />
          </TableEmptyRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table containerClassName={className}>
      <TableHeader>
        <TableHeadRow>
          {columns.map((col) => (
            <TableHead key={col.id} align={col.align} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableHeadRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          const key = keyExtractor(row)
          const isSelected = selectedRowKey !== undefined && selectedRowKey === key

          return (
            <TableRow
              key={key}
              ref={animateRows ? (node) => {
                if (node) currentNodes.current.set(key, node)
                else currentNodes.current.delete(key)
              } : undefined}
              interactive={!!onRowClick}
              aria-current={isSelected ? 'true' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick(row)
                      }
                    }
                  : undefined
              }
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(onRowClick && 'cursor-pointer', isSelected && 'bg-muted/30')}
            >
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align} className={col.className}>
                  {col.accessor(row)}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { DataTable }
export type { Column, DataTableProps }
