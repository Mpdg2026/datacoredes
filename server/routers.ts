import { z } from 'zod';
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import hierarchyData from '../hierarchy.json' assert { type: 'json' };

/**
 * Portal Router - Procedures para filtros em cascata e dados temáticos
 * Fonte de verdade: hierarchy.json (497 municípios, 28 coredes, 9 RFs)
 */
export const portalRouter = router({
  // ==================== FILTROS EM CASCATA ====================

  /**
   * Listar todas as Regiões Funcionais
   */
  regioesFuncionais: publicProcedure.query(() => {
    const rfs = Object.keys(hierarchyData);
    return rfs.map((rf) => ({
      id: rf,
      codigo: rf,
      nome: `Região Funcional ${rf}`,
    }));
  }),

  /**
   * Listar Coredes de uma Região Funcional
   */
  coredes: publicProcedure
    .input(
      z.object({
        regiaoFuncionalId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      if (!input.regiaoFuncionalId) {
        return [];
      }

      const rf = input.regiaoFuncionalId;
      const rfData = (hierarchyData as any)[rf];
      if (!rfData) {
        return [];
      }

      const coredes = Object.keys(rfData);
      return coredes.map((corede, idx) => ({
        id: idx + 1,
        nome: corede,
        regiaoFuncionalId: rf,
      }));
    }),

  /**
   * Listar TODOS os Municípios do RS (para seletor de comparação)
   */
  todosMunicipios: publicProcedure.query(() => {
    const todosMunicipios: any[] = [];
    Object.keys(hierarchyData).forEach((rf) => {
      const rfData = (hierarchyData as any)[rf];
      Object.keys(rfData).forEach((corede) => {
        const municipios = rfData[corede];
        municipios.forEach((mun: any) => {
          todosMunicipios.push({
            id: mun[0],
            codigoIBGE: mun[0],
            nome: mun[1],
            corede: corede,
            regiaoFuncional: rf,
          });
        });
      });
    });
    return todosMunicipios.sort((a, b) => a.nome.localeCompare(b.nome));
  }),

  /**
   * Listar Municípios de um Corede
   */
  municipios: publicProcedure
    .input(
      z.object({
        regiaoFuncionalId: z.string().optional(),
        coredeId: z.number().optional(),
        coredes: z.string().optional(), // Nome do Corede
      })
    )
    .query(({ input }) => {
      if (!input.regiaoFuncionalId) {
        return [];
      }

      const rf = input.regiaoFuncionalId;
      const rfData = (hierarchyData as any)[rf];
      if (!rfData) {
        return [];
      }

      // Encontrar o Corede pelo índice ou nome
      const coredesArray = Object.keys(rfData);
      let targetCorede: string | null = null;

      if (input.coredes) {
        // Se passou o nome do Corede
        targetCorede = coredesArray.find((c) => c === input.coredes) || null;
      } else if (input.coredeId !== undefined) {
        // Se passou o ID (índice)
        targetCorede = coredesArray[input.coredeId - 1] || null;
      }

      if (!targetCorede) {
        return [];
      }

      const municipios = rfData[targetCorede];
      const coredeIndex = coredesArray.indexOf(targetCorede) + 1;
      return municipios.map((mun: any, idx: number) => ({
        id: mun[0], // CODIGO IBGE
        codigoIBGE: mun[0],
        nome: mun[1],
        coredeId: input.coredeId || coredeIndex,
        corede: targetCorede,
        regiaoFuncional: rf,
      }));
    }),

  // ==================== INDICADORES TEMÁTICOS ====================

  /**
   * IDESE 2020 - Índice de Desenvolvimento Socioeconômico
   * Dados filtrados por município/corede
   */
  idese: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        coredeId: z.number().optional(),
        regiaoFuncionalId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      // Dados de exemplo - em produção, vir do banco de dados
      // com filtro por municipioId, coredeId ou regiaoFuncionalId
      const baseData = [
        { ano: 2020, valor: 0.742, fonte: 'SEPOG-RS' },
      ];

      // TODO: Conectar ao banco de dados real
      // SELECT * FROM idese WHERE municipio_id = ? OR corede_id = ? OR rf_id = ?

      return baseData.map((item, idx) => ({
        id: idx + 1,
        ...item,
      }));
    }),

  /**
   * IGM 2025 - Índice de Gestão Municipal
   * 3 Dimensões: Finanças, Gestão, Desempenho
   */
  igm: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        coredeId: z.number().optional(),
        regiaoFuncionalId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      // Dados de exemplo com as 3 dimensões exigidas
      const baseData = [
        {
          ano: 2025,
          dimensao1: 7.5, // Finanças
          dimensao2: 6.8, // Gestão
          dimensao3: 7.2, // Desempenho
          indiceConsolidado: 7.17,
        },
      ];

      // TODO: Conectar ao banco de dados real
      // SELECT * FROM igm WHERE municipio_id = ? AND ano = 2025

      return baseData.map((item, idx) => ({
        id: idx + 1,
        ...item,
      }));
    }),

  /**
   * IDSC 2023-2025 - Índice de Desenvolvimento Sustentável das Cidades
   * Série histórica obrigatória: 2023, 2024, 2025
   */
  idsc: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        coredeId: z.number().optional(),
        regiaoFuncionalId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      // Série histórica 2023-2025
      const baseData = [
        { ano: 2023, pontuacao: 65.3, classificacao: 'Bom' },
        { ano: 2024, pontuacao: 68.7, classificacao: 'Bom' },
        { ano: 2025, pontuacao: 72.1, classificacao: 'Bom' },
      ];

      // TODO: Conectar ao banco de dados real
      // SELECT * FROM idsc WHERE municipio_id = ? AND ano IN (2023, 2024, 2025)

      return baseData.map((item, idx) => ({
        id: idx + 1,
        ...item,
      }));
    }),

  /**
   * Violência Geral - CVLI e Homicídios
   * Dados da SSP-RS filtrados por localidade
   */
  violenciaGeral: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        coredeId: z.number().optional(),
        regiaoFuncionalId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      // Dados de exemplo - série 2020-2026
      const baseData = [
        { ano: 2020, cvli: 12, homicidios: 8 },
        { ano: 2021, cvli: 14, homicidios: 10 },
        { ano: 2022, cvli: 11, homicidios: 7 },
        { ano: 2023, cvli: 9, homicidios: 5 },
        { ano: 2024, cvli: 8, homicidios: 4 },
        { ano: 2025, cvli: 7, homicidios: 3 },
        { ano: 2026, cvli: 6, homicidios: 2 },
      ];

      // TODO: Conectar ao banco de dados real
      // SELECT * FROM violencia_geral WHERE municipio_id = ? AND ano >= 2020

      return baseData.map((item, idx) => ({
        id: idx + 1,
        ...item,
      }));
    }),

  /**
   * Violência contra a Mulher - Série 2020-2026
   * Dados de violência física, sexual e femicídio
   */
  violenciaMulher: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        coredeId: z.number().optional(),
        regiaoFuncionalId: z.string().optional(),
      })
    )
    .query(({ input }) => {
      // Dados de exemplo - série 2020-2026
      const baseData = [
        { ano: 2020, violenciaFisica: 45, violenciaSexual: 12, femicidio: 2 },
        { ano: 2021, violenciaFisica: 52, violenciaSexual: 15, femicidio: 3 },
        { ano: 2022, violenciaFisica: 48, violenciaSexual: 13, femicidio: 1 },
        { ano: 2023, violenciaFisica: 41, violenciaSexual: 11, femicidio: 2 },
        { ano: 2024, violenciaFisica: 38, violenciaSexual: 9, femicidio: 1 },
        { ano: 2025, violenciaFisica: 35, violenciaSexual: 8, femicidio: 1 },
        { ano: 2026, violenciaFisica: 32, violenciaSexual: 7, femicidio: 0 },
      ];

      // TODO: Conectar ao banco de dados real
      // SELECT * FROM violencia_mulher WHERE municipio_id = ? AND ano >= 2020

      return baseData.map((item, idx) => ({
        id: idx + 1,
        ...item,
      }));
    }),

  /**
   * ODS (Objetivos de Desenvolvimento Sustentável) - IDSC 2023-2025
   * Lê dados do arquivo Excel processado
   */
  ods: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        ano: z.number().optional(),
        odsId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const odsPath = path.join(process.cwd(), 'public', 'ods-data.json');
        const odsData = JSON.parse(fs.readFileSync(odsPath, 'utf-8'));
        
        const ano = input.ano?.toString() || '2025';
        const dados = odsData[ano] || [];
        
        if (!dados || dados.length === 0) {
          return [];
        }
        
        // Retornar dados consolidados de ODS
        return dados.slice(0, 10).map((d: any, idx: number) => ({
          id: idx + 1,
          ano: parseInt(ano),
          municipio: d['Município'] || 'Desconhecido',
          pontuacao: d['Pontuação Indice ODS 2025'] || 0,
          classificacao: d['Classificação 2025'] || 'N/A',
          goal1: d['Goal 1 Score'] || 0,
          goal2: d['Goal 2 Score'] || 0,
          goal3: d['Goal 3 Score'] || 0,
          goal4: d['Goal 4 Score'] || 0,
          goal5: d['Goal 5 Score'] || 0,
        }));
      } catch (error) {
        console.error('Erro ao carregar dados ODS:', error);
        return [];
      }
    }),

  /**
   * Saneamento - Índices de cobertura de água, esgoto e resíduos
   * Lê dados do arquivo CSV processado
   */
  saneamento: publicProcedure
    .input(
      z.object({
        municipioId: z.number().optional(),
        codigoIBGE: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const sanPath = path.join(process.cwd(), 'public', 'saneamento-data.json');
        const sanData = JSON.parse(fs.readFileSync(sanPath, 'utf-8'));
        
        // Filtrar por código IBGE se fornecido
        if (input.codigoIBGE) {
          const registro = sanData.find((r: any) => parseInt(r['Código IBGE']) === input.codigoIBGE);
          return registro ? [registro] : [];
        }
        
        // Retornar primeiros 10 registros
        return sanData.slice(0, 10);
      } catch (error) {
        console.error('Erro ao carregar dados Saneamento:', error);
        return [];
      }
    }),

  /**
   * Dados do IBGE Cidades - PIB, População, etc.
   * Utiliza CODIGO IBGE para requisições à API
   */
  ibgeCidades: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { buscarDadosIBGE } = await import("./_core/ibge");
      const dados = await buscarDadosIBGE(input.codigoIBGE);
      return dados || { codigoIBGE: input.codigoIBGE, nome: "Desconhecido" };
    }),
});

export const appRouter = router({
  system: systemRouter,
  portal: portalRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
