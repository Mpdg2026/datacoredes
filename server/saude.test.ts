import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Saúde (TCE-RS) - Índice de Aplicação em ASPS 2021-2025', () => {
  // Verificar se o arquivo de dados existe
  it('deve ter arquivo saude-tce-rs.json', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  // Verificar estrutura dos dados
  it('deve ter estrutura correta com RF, COREDE e índices', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Verificar que é um objeto
    expect(typeof data).toBe('object');
    expect(data !== null).toBe(true);
    
    // Verificar alguns municípios
    const municipios = Object.keys(data);
    expect(municipios.length).toBeGreaterThan(0);
    
    // Verificar estrutura de um município
    const primeiroMunicipio = data[municipios[0]];
    expect(primeiroMunicipio).toHaveProperty('rf');
    expect(primeiroMunicipio).toHaveProperty('corede');
    expect(primeiroMunicipio).toHaveProperty('codigo_ibge');
    expect(primeiroMunicipio).toHaveProperty('indices');
  });

  // Verificar dados de Taquara
  it('deve ter dados válidos para Taquara (2021: 18.52%)', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    expect(data).toHaveProperty('Taquara');
    const taquara = data['Taquara'];
    
    // Verificar RF e COREDE
    expect(taquara.rf).toBe('RF1');
    expect(taquara.corede).toBe('Paranhana Encosta da Serra');
    
    // Verificar índices
    expect(taquara.indices).toHaveProperty('2021');
    expect(taquara.indices).toHaveProperty('2022');
    expect(taquara.indices).toHaveProperty('2023');
    expect(taquara.indices).toHaveProperty('2024');
    expect(taquara.indices).toHaveProperty('2025');
    
    // Validar valor de 2021
    expect(taquara.indices['2021']).toBe(18.52);
    expect(taquara.indices['2021']).toBeGreaterThanOrEqual(15); // Acima do mínimo
  });

  // Verificar dados de Taquara - série completa
  it('deve ter série completa de Taquara 2021-2025', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const taquara = data['Taquara'];
    
    expect(taquara.indices['2021']).toBe(18.52);
    expect(taquara.indices['2022']).toBe(22.74);
    expect(taquara.indices['2023']).toBe(23.45);
    expect(taquara.indices['2024']).toBe(21.79);
    expect(taquara.indices['2025']).toBe(21.39);
  });

  // Verificar que todos os índices estão entre 0 e 100
  it('deve ter todos os índices entre 0 e 100', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    Object.values(data).forEach((municipio: any) => {
      Object.values(municipio.indices).forEach((indice: any) => {
        if (indice !== null && indice !== undefined) {
          expect(indice).toBeGreaterThanOrEqual(0);
          expect(indice).toBeLessThanOrEqual(100);
        }
      });
    });
  });

  // Verificar total de municípios
  it('deve ter pelo menos 480 municípios com dados', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    const municipios = Object.keys(data);
    expect(municipios.length).toBeGreaterThanOrEqual(480);
  });

  // Verificar que RF e COREDE estão preenchidos
  it('deve ter RF e COREDE preenchidos para todos os municípios', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    Object.values(data).forEach((municipio: any) => {
      expect(municipio.rf).toBeTruthy();
      expect(municipio.corede).toBeTruthy();
      expect(municipio.rf).toMatch(/^RF[1-9]$/);
    });
  });

  // Verificar municípios com índice acima do mínimo (15%)
  it('deve ter maioria dos municípios acima do mínimo de 15%', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    let acimaDo15 = 0;
    let totalComDados = 0;
    
    Object.values(data).forEach((municipio: any) => {
      const indice2025 = municipio.indices['2025'];
      if (indice2025 !== null && indice2025 !== undefined) {
        totalComDados++;
        if (indice2025 >= 15) {
          acimaDo15++;
        }
      }
    });
    
    // Espera-se que pelo menos 90% estejam acima do mínimo
    const percentualAcima = (acimaDo15 / totalComDados) * 100;
    expect(percentualAcima).toBeGreaterThan(90);
  });

  // Verificar alguns municípios específicos
  it('deve ter dados para Porto Alegre', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    expect(data).toHaveProperty('Porto Alegre');
    const pa = data['Porto Alegre'];
    expect(pa.rf).toBe('RF1');
    expect(pa.indices['2021']).toBeTruthy();
  });

  // Verificar que não há valores negativos
  it('não deve ter valores negativos', () => {
    const filePath = path.join(process.cwd(), 'public', 'saude-tce-rs.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    Object.values(data).forEach((municipio: any) => {
      Object.values(municipio.indices).forEach((indice: any) => {
        if (indice !== null && indice !== undefined) {
          expect(indice).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });
});
