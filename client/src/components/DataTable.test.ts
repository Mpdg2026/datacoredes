import { describe, it, expect } from 'vitest';

// Testes para validar a lógica de paginação e busca do DataTable
describe('DataTable Component Logic', () => {
  it('deve calcular corretamente o número de páginas', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    const pageSize = 10;
    const totalPages = Math.ceil(data.length / pageSize);
    expect(totalPages).toBe(3);
  });

  it('deve filtrar dados corretamente com base em termo de busca', () => {
    const data = [
      { id: 1, name: 'Porto Alegre', corede: 'Metropolitana' },
      { id: 2, name: 'Canoas', corede: 'Metropolitana' },
      { id: 3, name: 'Caxias do Sul', corede: 'Serra Geral' },
    ];

    const searchTerm = 'Metropolitana';
    const searchableFields = ['corede'];

    const filtered = data.filter((row) =>
      searchableFields.some((field) => {
        const value = row[field as keyof typeof row];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );

    expect(filtered).toHaveLength(2);
    expect(filtered[0]?.name).toBe('Porto Alegre');
    expect(filtered[1]?.name).toBe('Canoas');
  });

  it('deve gerar CSV corretamente com escape de aspas', () => {
    const data = [
      { id: 1, name: 'Porto Alegre', description: 'Capital do "RS"' },
      { id: 2, name: 'Canoas', description: 'Cidade próxima' },
    ];

    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nome' },
      { key: 'description', label: 'Descrição' },
    ];

    const headers = columns.map((col) => col.label).join(',');
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key as keyof typeof row];
          const stringValue = String(value ?? '').replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(',')
    );

    const csv = [headers, ...rows].join('\n');

    expect(csv).toContain('ID,Nome,Descrição');
    expect(csv).toContain('"Capital do ""RS"""'); // Aspas escapadas
  });

  it('deve paginar dados corretamente', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i, value: i * 10 }));
    const pageSize = 10;
    const currentPage = 2;

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    expect(paginatedData).toHaveLength(10);
    expect(paginatedData[0]?.id).toBe(10);
    expect(paginatedData[9]?.id).toBe(19);
  });

  it('deve retornar página vazia quando não há dados', () => {
    const data: any[] = [];
    const pageSize = 10;
    const currentPage = 1;

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    expect(paginatedData).toHaveLength(0);
  });

  it('deve combinar filtro e paginação corretamente', () => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      category: i % 2 === 0 ? 'A' : 'B',
      value: i * 10,
    }));

    const searchTerm = 'A';
    const searchableFields = ['category'];
    const pageSize = 5;
    const currentPage = 2;

    // Filtrar
    const filtered = data.filter((row) =>
      searchableFields.some((field) => {
        const value = row[field as keyof typeof row];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );

    // Paginar
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    expect(filtered).toHaveLength(25); // Metade dos dados (categoria A)
    expect(paginatedData).toHaveLength(5);
    expect(paginatedData[0]?.id).toBe(10); // Primeiro item da página 2
  });
});
