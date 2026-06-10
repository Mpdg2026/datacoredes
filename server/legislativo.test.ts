import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Legislativo (TCE-RS) - Gestão Fiscal das Câmaras Municipais', () => {
  const legislativoPath = path.join(process.cwd(), 'public', 'legislativo-tce-rs.json');
  
  let legislativoData: Record<string, any> = {};
  
  it('deve carregar arquivo de dados de Legislativo', () => {
    expect(fs.existsSync(legislativoPath)).toBe(true);
    const content = fs.readFileSync(legislativoPath, 'utf-8');
    legislativoData = JSON.parse(content);
    expect(Object.keys(legislativoData).length).toBeGreaterThan(0);
  });

  it('deve conter dados para Taquara', () => {
    expect(legislativoData['Taquara']).toBeDefined();
    expect(legislativoData['Taquara'].rf).toBe('RF1');
    expect(legislativoData['Taquara'].corede).toBe('Paranhana Encosta da Serra');
  });

  it('deve ter dados de 2021 para Taquara com valores corretos', () => {
    const taquara = legislativoData['Taquara'];
    const dados2021 = taquara.dados['2021'];
    
    expect(dados2021).toBeDefined();
    expect(dados2021.rcl).toBe(158781921.09);
    expect(dados2021.gastos_totais).toBe(2863466.71);
    expect(dados2021.pct_gastos).toBe(1.8);
    expect(dados2021.pct_despesa_pessoal).toBe(1.52);
    expect(dados2021.analise_lrf).toBe('S');
  });

  it('deve calcular percentuais corretamente', () => {
    const taquara = legislativoData['Taquara'];
    
    for (const ano of ['2021', '2022', '2023', '2024', '2025']) {
      const dados = taquara.dados[ano];
      if (dados && dados.rcl > 0) {
        const pctGastosCalculado = (dados.gastos_totais / dados.rcl) * 100;
        expect(Math.abs(dados.pct_gastos - pctGastosCalculado)).toBeLessThan(0.01);
      }
    }
  });

  it('deve ter limite constitucional de 6% para gastos totais', () => {
    const taquara = legislativoData['Taquara'];
    const dados2021 = taquara.dados['2021'];
    
    // Taquara em 2021 deve estar abaixo de 6%
    expect(dados2021.pct_gastos).toBeLessThanOrEqual(6);
  });

  it('deve conter dados para pelo menos 400 municípios', () => {
    expect(Object.keys(legislativoData).length).toBeGreaterThanOrEqual(400);
  });

  it('deve ter estrutura consistente em todos os municípios', () => {
    for (const [municipio, dados] of Object.entries(legislativoData)) {
      expect(dados.rf).toBeDefined();
      expect(dados.corede).toBeDefined();
      expect(dados.codigo_ibge).toBeDefined();
      expect(dados.dados).toBeDefined();
      expect(typeof dados.dados).toBe('object');
    }
  });

  it('deve ter dados para todos os anos (2021-2025) ou estar vazio', () => {
    for (const [municipio, dados] of Object.entries(legislativoData)) {
      for (const ano of ['2021', '2022', '2023', '2024', '2025']) {
        if (dados.dados[ano]) {
          expect(dados.dados[ano].rcl).toBeDefined();
          expect(dados.dados[ano].gastos_totais).toBeDefined();
          expect(dados.dados[ano].pct_gastos).toBeDefined();
          expect(dados.dados[ano].pct_despesa_pessoal).toBeDefined();
          expect(dados.dados[ano].pct_folha).toBeDefined();
        }
      }
    }
  });

  it('deve ter análise LRF como S ou N', () => {
    for (const [municipio, dados] of Object.entries(legislativoData)) {
      for (const ano of ['2021', '2022', '2023', '2024', '2025']) {
        if (dados.dados[ano]) {
          expect(['S', 'N', '']).toContain(dados.dados[ano].analise_lrf);
        }
      }
    }
  });

  it('deve ter percentuais positivos', () => {
    for (const [municipio, dados] of Object.entries(legislativoData)) {
      for (const ano of ['2021', '2022', '2023', '2024', '2025']) {
        if (dados.dados[ano]) {
          expect(dados.dados[ano].pct_gastos).toBeGreaterThanOrEqual(0);
          expect(dados.dados[ano].pct_despesa_pessoal).toBeGreaterThanOrEqual(0);
          expect(dados.dados[ano].pct_folha).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
