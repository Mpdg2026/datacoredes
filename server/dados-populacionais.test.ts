import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Dados Populacionais - Censo IBGE 2010 e 2022', () => {
  let dadosPopulacionais: any;

  beforeEach(() => {
    const dataPath = path.join(process.cwd(), 'public', 'dados-populacionais.json');
    dadosPopulacionais = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  });

  it('deve ter estrutura correta com censo_2010 e censo_2022', () => {
    expect(Object.keys(dadosPopulacionais).length).toBeGreaterThan(0);
    
    for (const municipio of Object.values(dadosPopulacionais) as any[]) {
      expect(municipio).toHaveProperty('censo_2010');
      expect(municipio).toHaveProperty('censo_2022');
    }
  });

  it('deve ter dados para Porto Alegre em 2010 e 2022', () => {
    const portoAlegre = dadosPopulacionais['Porto Alegre'];
    expect(portoAlegre).toBeDefined();
    expect(portoAlegre.censo_2010).toBeDefined();
    expect(portoAlegre.censo_2022).toBeDefined();
    
    // Verify 2010 data
    expect(portoAlegre.censo_2010.total).toBeGreaterThan(0);
    expect(portoAlegre.censo_2010.homens).toBeGreaterThan(0);
    expect(portoAlegre.censo_2010.mulheres).toBeGreaterThan(0);
    expect(portoAlegre.censo_2010.total).toBe(portoAlegre.censo_2010.homens + portoAlegre.censo_2010.mulheres);
    
    // Verify 2022 data
    expect(portoAlegre.censo_2022.total).toBeGreaterThan(0);
    expect(portoAlegre.censo_2022.homens).toBeGreaterThan(0);
    expect(portoAlegre.censo_2022.mulheres).toBeGreaterThan(0);
    expect(portoAlegre.censo_2022.total).toBe(portoAlegre.censo_2022.homens + portoAlegre.censo_2022.mulheres);
  });

  it('deve ter caso especial para Pinto Bandeira (emancipado em 2013)', () => {
    const pintoBandeira = dadosPopulacionais['Pinto Bandeira'];
    expect(pintoBandeira).toBeDefined();
    
    // Pinto Bandeira should NOT have 2010 data (emancipated in 2013)
    expect(pintoBandeira.censo_2010).toBeNull();
    
    // But should have 2022 data
    expect(pintoBandeira.censo_2022).toBeDefined();
    expect(pintoBandeira.censo_2022.total).toBeGreaterThan(0);
  });

  it('deve ter dados para 10 municipios de teste', () => {
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

    testMunicipios.forEach((mun) => {
      expect(dadosPopulacionais[mun]).toBeDefined();
      expect(dadosPopulacionais[mun].censo_2022).toBeDefined();
      expect(dadosPopulacionais[mun].censo_2022.total).toBeGreaterThan(0);
    });
  });

  it('deve ter 500 municipios no total', () => {
    expect(Object.keys(dadosPopulacionais).length).toBe(500);
  });

  it('deve ter 496 municipios com dados de 2010', () => {
    let municipiosComDados2010 = 0;
    for (const municipio of Object.values(dadosPopulacionais) as any[]) {
      if (municipio.censo_2010) {
        municipiosComDados2010++;
      }
    }
    expect(municipiosComDados2010).toBe(496);
  });

  it('deve ter 497 municipios com dados de 2022', () => {
    let municipiosComDados2022 = 0;
    for (const municipio of Object.values(dadosPopulacionais) as any[]) {
      if (municipio.censo_2022) {
        municipiosComDados2022++;
      }
    }
    // 497 municipios tem dados 2022 (3 municipios nao tem dados em nenhum ano)
    expect(municipiosComDados2022).toBe(497);
  });

  it('deve ter distribuicao de genero consistente (homens + mulheres = total)', () => {
    for (const municipio of Object.values(dadosPopulacionais) as any[]) {
      if (municipio.censo_2010) {
        expect(municipio.censo_2010.total).toBe(municipio.censo_2010.homens + municipio.censo_2010.mulheres);
      }
      if (municipio.censo_2022) {
        expect(municipio.censo_2022.total).toBe(municipio.censo_2022.homens + municipio.censo_2022.mulheres);
      }
    }
  });

  it('deve ter valores populacionais razoaveis (entre 1000 e 5000000)', () => {
    for (const municipio of Object.values(dadosPopulacionais) as any[]) {
      if (municipio.censo_2010) {
        expect(municipio.censo_2010.total).toBeGreaterThanOrEqual(1000);
        expect(municipio.censo_2010.total).toBeLessThanOrEqual(5000000);
      }
      if (municipio.censo_2022) {
        expect(municipio.censo_2022.total).toBeGreaterThanOrEqual(1000);
        expect(municipio.censo_2022.total).toBeLessThanOrEqual(5000000);
      }
    }
  });

  it('deve ter informacoes de COREDE e RF', () => {
    for (const municipio of Object.values(dadosPopulacionais) as any[]) {
      if (municipio.censo_2022) {
        expect(municipio.censo_2022.corede).toBeDefined();
        expect(municipio.censo_2022.rf).toBeDefined();
        expect(municipio.censo_2022.rf).toMatch(/^RF\d+$/);
      }
    }
  });

  it('deve ter Porto Alegre com populacao reduzida entre 2010 e 2022', () => {
    const portoAlegre = dadosPopulacionais['Porto Alegre'];
    const variacao = ((portoAlegre.censo_2022.total - portoAlegre.censo_2010.total) / portoAlegre.censo_2010.total) * 100;
    
    // Porto Alegre population decreased between 2010 and 2022
    expect(variacao).toBeLessThan(0);
    expect(Math.abs(variacao)).toBeGreaterThan(1); // At least 1% decrease
  });
});
