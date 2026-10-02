import React from 'react';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found',
  className = '',
  stickyHeader = false,
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto w-full border border-slate-200 rounded-lg bg-white ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className={`bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`py-3 px-4 ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-slate-400 font-medium italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-amber-50/40' : 'hover:bg-slate-50/60'
                } ${index % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 text-slate-800 ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${col.className || ''}`}
                  >
                    {col.render ? col.render(row, index) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
