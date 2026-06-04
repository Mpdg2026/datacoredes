import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Normaliza string removendo acentos, convertendo para maiúsculas e removendo espaços extras
 */
function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .toUpperCase()
    .trim();
}

describe('normalizeString', () => {
  it('deve remover acentos corretamente', () => {
    expect(normalizeString('Gravataí')).toBe('GRAVATAI');
    expect(normalizeString('São Paulo')).toBe('SAO PAULO');
    expect(normalizeString('Caxias do Sul')).toBe('CAXIAS DO SUL');
  });

  it('deve converter para maiúsculas', () => {
    expect(normalizeString('porto alegre')).toBe('PORTO ALEGRE');
    expect(normalizeString('PeLotAs')).toBe('PELOTAS');
  });

  it('deve remover espaços extras', () => {
    expect(normalizeString('  Novo Hamburgo  ')).toBe('NOVO HAMBURGO');
    expect(normalizeString('Passo   Fundo')).toBe('PASSO FUNDO');
  });

  it('deve lidar com caracteres especiais', () => {
    expect(normalizeString('Não-Me-Toque')).toBe('NAO-ME-TOQUE');
    expect(normalizeString('Entre-Ijuís')).toBe('ENTRE-IJUIS');
  });
});

describe('Violência Contra a Mulher - Data Matching', () => {
  let hierarchyData: any;
  let vmData: any;

  // Load data before tests
  beforeEach(() => {
    const hierarchyPath = path.join(process.cwd(), 'hierarchy.json');
    const vmPath = path.join(process.cwd(), 'public', 'violencia-mulher-municipios.json');

    hierarchyData = JSON.parse(fs.readFileSync(hierarchyPath, 'utf-8'));
    vmData = JSON.parse(fs.readFileSync(vmPath, 'utf-8'));
  });

  it('deve encontrar dados para Gravataí', () => {
    const normalized = normalizeString('Gravataí');
    expect(vmData[normalized]).toBeDefined();
    expect(vmData[normalized]['Feminicídio Consumado']).toBeDefined();
  });

  it('deve encontrar dados para os 10 municípios de teste', () => {
    const testMunicipios = [
      'Porto Alegre',
      'Gravataí',
      'Caxias do Sul',
      'Pelotas',
      'Santa Maria',
      'Novo Hamburgo',
      'Passo Fundo',
      'Canoas',
      'Rio Grande',
      'Taquara'
    ];

    testMunicipios.forEach((municipio) => {
      const normalized = normalizeString(municipio);
      expect(vmData[normalized]).toBeDefined(`Dados não encontrados para ${municipio} (normalizado: ${normalized})`);
    });
  });

  it('deve ter pelo menos 490 municípios com dados', () => {
    // Collect all municipalities from hierarchy
    const allMunicipios: string[] = [];
    Object.keys(hierarchyData).forEach((rf) => {
      const rfData = hierarchyData[rf];
      Object.keys(rfData).forEach((corede) => {
        const municipios = rfData[corede];
        municipios.forEach((mun: any) => {
          allMunicipios.push(mun[1]);
        });
      });
    });

    // Count how many have data
    const comDados = allMunicipios.filter((mun) => {
      const normalized = normalizeString(mun);
      return vmData[normalized];
    });

    expect(comDados.length).toBeGreaterThanOrEqual(490);
    expect(allMunicipios.length).toBe(497);
  });

  it('deve ter estrutura de dados correta para cada indicador', () => {
    const normalized = normalizeString('Porto Alegre');
    const dados = vmData[normalized];

    expect(dados['Feminicídio Consumado']).toBeDefined();
    expect(dados['Feminicídio Tentado']).toBeDefined();
    expect(dados['Lesão Corporal']).toBeDefined();
    expect(dados['Ameaça']).toBeDefined();
    expect(dados['Estupro']).toBeDefined();

    // Check that each indicator has data for years 2020-2026
    Object.keys(dados).forEach((indicador) => {
      expect(dados[indicador]['2020']).toBeDefined();
      expect(dados[indicador]['2026']).toBeDefined();
    });
  });
});
