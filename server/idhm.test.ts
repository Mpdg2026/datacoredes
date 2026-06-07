import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('IDHM - Indice de Desenvolvimento Humano Municipal', () => {
  let hierarchyData: any;
  let idhmData: any;

  beforeEach(() => {
    const hierarchyPath = path.join(process.cwd(), 'hierarchy.json');
    const idhmPath = path.join(process.cwd(), 'public', 'idhm-municipios.json');

    hierarchyData = JSON.parse(fs.readFileSync(hierarchyPath, 'utf-8'));
    idhmData = JSON.parse(fs.readFileSync(idhmPath, 'utf-8'));
  });

  it('deve ter estrutura hierarquica RF -> COREDE -> Municipios', () => {
    expect(Object.keys(idhmData).length).toBeGreaterThan(0);
    
    // Check RF structure
    for (const rf of Object.keys(idhmData)) {
      expect(rf).toMatch(/^RF\d+$/);
      expect(typeof idhmData[rf]).toBe('object');
      
      // Check COREDE structure
      for (const corede of Object.keys(idhmData[rf])) {
        expect(Array.isArray(idhmData[rf][corede])).toBe(true);
        
        // Check municipio structure
        for (const municipio of idhmData[rf][corede]) {
          expect(municipio.nome).toBeDefined();
          expect(municipio.idhm_1991).toBeDefined();
          expect(municipio.idhm_2000).toBeDefined();
          expect(municipio.idhm_2010).toBeDefined();
        }
      }
    }
  });

  it('deve ter 9 Regioes Funcionais', () => {
    const rfs = Object.keys(idhmData).sort();
    expect(rfs.length).toBe(9);
    expect(rfs).toEqual(['RF1', 'RF2', 'RF3', 'RF4', 'RF5', 'RF6', 'RF7', 'RF8', 'RF9']);
  });

  it('deve ter 496 municipios no total (com dados IDHM)', () => {
    let totalMunicipios = 0;
    for (const rf of Object.values(idhmData) as any[]) {
      for (const coredes of Object.values(rf) as any[]) {
        if (Array.isArray(coredes)) {
          totalMunicipios += coredes.length;
        }
      }
    }
    // 496 municipios tem dados IDHM (Pinto Bandeira nao tem dados)
    expect(totalMunicipios).toBe(496);
  });

  it('deve ter dados IDHM para Porto Alegre', () => {
    let encontrado = false;
    for (const rf of Object.values(idhmData) as any[]) {
      for (const coredes of Object.values(rf) as any[]) {
        if (Array.isArray(coredes)) {
          for (const municipio of coredes) {
            if (municipio.nome === 'Porto Alegre') {
              encontrado = true;
              expect(municipio.idhm_1991).toBeDefined();
              expect(municipio.idhm_2000).toBeDefined();
              expect(municipio.idhm_2010).toBeDefined();
              expect(typeof municipio.idhm_1991).toBe('number');
              expect(typeof municipio.idhm_2000).toBe('number');
              expect(typeof municipio.idhm_2010).toBe('number');
            }
          }
        }
      }
    }
    expect(encontrado).toBe(true);
  });

  it('deve ter dados IDHM para Gravataí', () => {
    let encontrado = false;
    for (const rf of Object.values(idhmData) as any[]) {
      for (const coredes of Object.values(rf) as any[]) {
        if (Array.isArray(coredes)) {
          for (const municipio of coredes) {
            if (municipio.nome === 'Gravataí') {
              encontrado = true;
              expect(municipio.idhm_1991).toBeGreaterThan(0);
              expect(municipio.idhm_2010).toBeGreaterThan(municipio.idhm_1991);
            }
          }
        }
      }
    }
    expect(encontrado).toBe(true);
  });

  it('deve ter dados IDHM para 10 municipios de teste', () => {
    const testMunicipios = [
      'Porto Alegre',
      'Gravataí',
      'Caxias do Sul',
      'Pelotas',
      'Santa Maria',
      'Taquara',
      'Canoas',
      'Passo Fundo',
      'Rio Grande',
      'Novo Hamburgo'
    ];

    const encontrados: string[] = [];
    for (const rf of Object.values(idhmData) as any[]) {
      for (const coredes of Object.values(rf) as any[]) {
        if (Array.isArray(coredes)) {
          for (const municipio of coredes) {
            if (testMunicipios.includes(municipio.nome)) {
              encontrados.push(municipio.nome);
            }
          }
        }
      }
    }

    expect(encontrados.length).toBe(10);
    testMunicipios.forEach((mun) => {
      expect(encontrados).toContain(mun);
    });
  });

  it('deve ter valores IDHM entre 0 e 1', () => {
    for (const rf of Object.values(idhmData) as any[]) {
      for (const coredes of Object.values(rf) as any[]) {
        if (Array.isArray(coredes)) {
          for (const municipio of coredes) {
            expect(municipio.idhm_1991).toBeGreaterThanOrEqual(0);
            expect(municipio.idhm_1991).toBeLessThanOrEqual(1);
            expect(municipio.idhm_2000).toBeGreaterThanOrEqual(0);
            expect(municipio.idhm_2000).toBeLessThanOrEqual(1);
            expect(municipio.idhm_2010).toBeGreaterThanOrEqual(0);
            expect(municipio.idhm_2010).toBeLessThanOrEqual(1);
          }
        }
      }
    }
  });

  it('deve ter evolucao positiva do IDHM (1991 -> 2000 -> 2010)', () => {
    let municipiosComEvolucao = 0;
    let totalMunicipios = 0;
    for (const rf of Object.values(idhmData) as any[]) {
      for (const coredes of Object.values(rf) as any[]) {
        if (Array.isArray(coredes)) {
          for (const municipio of coredes) {
            totalMunicipios++;
            if (municipio.idhm_1991 < municipio.idhm_2000 && municipio.idhm_2000 < municipio.idhm_2010) {
              municipiosComEvolucao++;
            }
          }
        }
      }
    }
    // Maioria dos municipios deve ter evolucao positiva (>80%)
    const percentualEvolucao = (municipiosComEvolucao / totalMunicipios) * 100;
    expect(percentualEvolucao).toBeGreaterThan(80);
  });
});
