import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchableFields?: (keyof T)[];
  onExport?: (data: T[]) => void;
  title?: string;
}

export function DataTable<T extends Record<string, any>>(
  {
    data,
    columns,
    pageSize = 10,
    searchableFields = [],
    onExport,
    title,
  }: DataTableProps<T>
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar dados com base no termo de busca
  const filteredData = useMemo(() => {
    if (!searchTerm || searchableFields.length === 0) return data;

    return data.filter((row) =>
      searchableFields.some((field) => {
        const value = (row as any)[field];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchableFields]);

  // Paginar dados
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Exportar para CSV
  const handleExport = () => {
    if (onExport) {
      onExport(filteredData);
      return;
    }

    // CSV padrão
    const headers = columns.map((col) => col.label).join(',');
    const rows = filteredData.map((row) =>
      columns
        .map((col) => {
          const value = (row as any)[col.key];
          // Escapar aspas duplas em valores CSV
          const stringValue = String(value ?? '').replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dados-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header com título e controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {title && <h3 className="text-lg font-semibold text-[#001f5c]">{title}</h3>}
        <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
          {searchableFields.length > 0 && (
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48"
            />
          )}
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      {col.render ? col.render((row as any)[col.key], row) : String((row as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página {currentPage} de {totalPages} ({filteredData.length} registros)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Próxima
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
