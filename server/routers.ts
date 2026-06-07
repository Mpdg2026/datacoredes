import { z } from 'zod';
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import hierarchyData from '../hierarchy.json' assert { type: 'json' };

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
        codigoIBGE: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const igmPath = path.join(process.cwd(), 'public', 'igm-consolidado.json');
        
        if (!input.codigoIBGE) {
          return null;
        }
        
        const igmData = JSON.parse(fs.readFileSync(igmPath, 'utf-8'));
        const municipioData = igmData[input.codigoIBGE.toString()];
        
        if (!municipioData) {
          return null;
        }
        
        return {
          municipio: municipioData.municipio,
          gestao: municipioData.gestao,
          desempenho: municipioData.desempenho,
          financas: municipioData.financas,
        };
      } catch (error) {
        console.error('Erro ao carregar dados IGM:', error);
        return null;
      }
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
  /**
   * ODS (Objetivos de Desenvolvimento Sustentavel) - Dados consolidados 2023-2025
   * Busca dados por municipio e retorna os 17 Goals com serie historica
   */
  ods: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const odsPath = path.join(process.cwd(), 'public', 'ods-consolidado-v2.json');
        
        // Fallback para dist se em produção
        if (!fs.existsSync(odsPath)) {
          const distPath = path.join(process.cwd(), 'dist', 'public', 'ods-consolidado-v2.json');
          if (fs.existsSync(distPath)) {
            if (input.codigoIBGE) {
              return JSON.parse(fs.readFileSync(distPath, 'utf-8'))[input.codigoIBGE.toString()] || null;
            }
          }
        }
        const odsData = JSON.parse(fs.readFileSync(odsPath, 'utf-8'));
        
        // Se nenhum municipio especificado, retornar vazio
        if (!input.codigoIBGE) {
          return null;
        }
        
        // Buscar dados do municipio
        const municipioData = odsData[input.codigoIBGE.toString()];
        if (!municipioData) {
          return null;
        }
        
        // Retornar estrutura com os 17 Goals para cada ano
        return {
          municipio: municipioData.municipio,
          anos: {
            2023: municipioData.anos['2023'] || { pontuacao: null, classificacao: 'S/D', goals: {} },
            2024: municipioData.anos['2024'] || { pontuacao: null, classificacao: 'S/D', goals: {} },
            2025: municipioData.anos['2025'] || { pontuacao: null, classificacao: 'S/D', goals: {} },
          },
        };
      } catch (error) {
        console.error('Erro ao carregar dados ODS:', error);
        return null;
      }
    }),

  /**
   * Saneamento - Índices de cobertura de água, esgoto e resíduos
   * Lê dados do arquivo CSV processado
   */
  saneamento: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const sanPath = path.join(process.cwd(), 'public', 'saneamento-consolidado.json');
        
        if (!fs.existsSync(sanPath)) {
          return null;
        }
        
        const sanData = JSON.parse(fs.readFileSync(sanPath, 'utf-8'));
        
        if (!input.codigoIBGE) {
          return null;
        }
        
        return sanData[input.codigoIBGE.toString()] || null;
      } catch (error) {
        console.error('Erro ao carregar dados Saneamento:', error);
        return null;
      }
    }),

  /**
   * Violência Geral - CVLI e Homicídios 2025
   */
  violenciaGeral: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const vgPath = path.join(process.cwd(), 'public', 'violencia-geral-2025.json');
        
        if (!fs.existsSync(vgPath)) {
          return null;
        }
        
        const vgData = JSON.parse(fs.readFileSync(vgPath, 'utf-8'));
        
        if (!input.codigoIBGE) {
          return null;
        }
        
        return vgData[input.codigoIBGE.toString()] || null;
      } catch (error) {
        console.error('Erro ao carregar dados Violência Geral:', error);
        return null;
      }
    }),

  /**
   * Dados do IBGE Cidades - PIB, População, etc.
   * Tenta dados locais primeiro, depois API IBGE como fallback
   */
  ibgeCidades: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        // Primeiro tentar dados locais consolidados
        const economiaPath = path.join(process.cwd(), 'public', 'economia-consolidada.json');
        if (fs.existsSync(economiaPath)) {
          const economiaData = JSON.parse(fs.readFileSync(economiaPath, 'utf-8'));
          const municipioData = economiaData[input.codigoIBGE.toString()];
          if (municipioData) {
            return municipioData;
          }
        }
        
        // Fallback para dist se em produção
        const distPath = path.join(process.cwd(), 'dist', 'public', 'economia-consolidada.json');
        if (fs.existsSync(distPath)) {
          const economiaData = JSON.parse(fs.readFileSync(distPath, 'utf-8'));
          const municipioData = economiaData[input.codigoIBGE.toString()];
          if (municipioData) {
            return municipioData;
          }
        }
        
        // Fallback para API IBGE (pode estar indisponível)
        const { buscarDadosIBGE } = await import("./_core/ibge");
        const dados = await buscarDadosIBGE(input.codigoIBGE);
        return dados || { codigoIBGE: input.codigoIBGE, nome: "Desconhecido" };
      } catch (error) {
        console.error(`Erro ao buscar dados econômicos para ${input.codigoIBGE}:`, error);
        return { codigoIBGE: input.codigoIBGE, nome: "Desconhecido" };
      }
    }),

  /**
   * Dados Econômicos Completos - PIB 2010-2023, Demografia 2022
   */
  economiaCompleta: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const economiaPath = path.join(process.cwd(), 'public', 'economia-completa.json');
        if (!fs.existsSync(economiaPath)) {
          return null;
        }
        const economiaData = JSON.parse(fs.readFileSync(economiaPath, 'utf-8'));
        for (const [municipioNome, municipioData] of Object.entries(economiaData.municipios || {})) {
          if ((municipioData as any).codigo_ibge === input.codigoIBGE) {
            return { nome: municipioNome, ...(municipioData as any) };
          }
        }
        return null;
      } catch (error) {
        console.error(`Erro ao buscar economia completa para ${input.codigoIBGE}:`, error);
        return null;
      }
    }),

  /**
   * Rankings de Municípios
   */
  rankingEconomia: publicProcedure
    .input(
      z.object({
        indicador: z.enum(['pib_total', 'pib_pc', 'populacao', 'densidade']).default('pib_total'),
        limite: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const economiaPath = path.join(process.cwd(), 'public', 'economia-completa.json');
        if (!fs.existsSync(economiaPath)) {
          return [];
        }
        const economiaData = JSON.parse(fs.readFileSync(economiaPath, 'utf-8'));
        const municipios = Object.entries(economiaData.municipios || {}).map(([nome, dados]: any) => {
          let valor = 0;
          switch (input.indicador) {
            case 'pib_total':
              valor = dados.pib_recente?.pib_total_mil || 0;
              break;
            case 'pib_pc':
              valor = dados.pib_recente?.pib_pc || 0;
              break;
            case 'populacao':
              valor = dados.demografia_2022?.populacao || 0;
              break;
            case 'densidade':
              valor = dados.demografia_2022?.densidade || 0;
              break;
          }
          return {
            nome,
            codigoIBGE: dados.codigo_ibge,
            valor,
            pibTotal: dados.pib_recente?.pib_total_mil,
            pibPC: dados.pib_recente?.pib_pc,
            populacao: dados.demografia_2022?.populacao,
            densidade: dados.demografia_2022?.densidade,
          };
        });
        return municipios.sort((a, b) => b.valor - a.valor).slice(0, input.limite);
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
        return [];
      }
    }),

  /**
   * Dados CVLI - Violência por Município (2020-2025 + 2026 parcial)
   * Fonte: OESP/SSP-RS
   */
  violenciaCVLI: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        // Se nao ha codigoIBGE, retorna dados consolidados do RS
        if (!input.codigoIBGE) {
          const rsPath = path.join(process.cwd(), 'public', 'cvli-rs-consolidado.json');
          if (!fs.existsSync(rsPath)) {
            return null;
          }
          const rsData = JSON.parse(fs.readFileSync(rsPath, 'utf-8'));
          return rsData['RS'] || null;
        }
        
        // Se ha codigoIBGE, busca dados do municipio
        const cvliPath = path.join(process.cwd(), 'public', 'cvli-consolidado.json');
        if (!fs.existsSync(cvliPath)) {
          return null;
        }
        const cvliData = JSON.parse(fs.readFileSync(cvliPath, 'utf-8'));
        return cvliData[input.codigoIBGE] || null;
      } catch (error) {
        console.error('Erro ao carregar dados CVLI:', error);
        return null;
      }
    }),

  /**
   * Dados de Violência contra a Mulher por Município
   */
  violenciaMulherMunicipio: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        // Se nao ha codigoIBGE, retorna null (dados do RS sao hardcoded no frontend)
        if (!input.codigoIBGE) {
          console.log('[ViolenciaMulherMunicipio] Sem codigoIBGE');
          return null;
        }
        
        console.log('[ViolenciaMulherMunicipio] Procurando codigoIBGE:', input.codigoIBGE);
        
        // Busca dados do municipio
        const vmPath = path.join(process.cwd(), 'public', 'violencia-mulher-municipios.json');
        if (!fs.existsSync(vmPath)) {
          return null;
        }
        const vmData = JSON.parse(fs.readFileSync(vmPath, 'utf-8'));
        
        // Mapear código IBGE para nome do município em MAIÚSCULAS (normalizado)
        // O hierarchy.json tem a estrutura: RF -> Corede -> [[codigoIBGE, nomeMunicipio], ...]
        let municipioNome = null;
        for (const rf of Object.values(hierarchyData) as any[]) {
          for (const corede of Object.values(rf) as any[]) {
            if (Array.isArray(corede)) {
              for (const [codigo, nome] of corede) {
                if (String(codigo) === input.codigoIBGE) {
                  municipioNome = normalizeString(nome);
                  break;
                }
              }
              if (municipioNome) break;
            }
          }
          if (municipioNome) break;
        }
        
        if (!municipioNome) {
          console.log('[ViolenciaMulherMunicipio] Município não encontrado para código:', input.codigoIBGE);
          return null;
        }
        
        console.log('[ViolenciaMulherMunicipio] Procurando com nome normalizado:', municipioNome);
        const resultado = vmData[municipioNome];
        console.log('[ViolenciaMulherMunicipio] Dados encontrados:', !!resultado);
        return resultado || null;
      } catch (error) {
        console.error('Erro ao carregar dados de Violência contra a Mulher:', error);
        return null;
      }
    }),

  /**
   * Buscar dados IPS (Índice de Progresso Social) de um município
   */
  ipsMunicipio: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        if (!input.codigoIBGE) {
          return null;
        }
        
        const ipsPath = path.join(process.cwd(), 'public', 'ips-brasil-municipios.json');
        if (!fs.existsSync(ipsPath)) {
          return null;
        }
        const ipsData = JSON.parse(fs.readFileSync(ipsPath, 'utf-8'));
        
        let municipioNome = null;
        let municipioNomeOriginal = null;
        for (const rf of Object.values(hierarchyData) as any[]) {
          for (const corede of Object.values(rf) as any[]) {
            if (Array.isArray(corede)) {
              for (const [codigo, nome] of corede) {
                if (String(codigo) === input.codigoIBGE) {
                  municipioNomeOriginal = nome;
                  municipioNome = normalizeString(nome);
                  break;
                }
              }
              if (municipioNome) break;
            }
          }
          if (municipioNome) break;
        }
        
        if (!municipioNome) {
          return null;
        }
        
        // Tentar primeiro com acento (chave original em maiusculas)
        const nomeComAcento = municipioNomeOriginal?.toUpperCase();
        if (nomeComAcento && ipsData[nomeComAcento]) {
          console.log('[IPS] Encontrado com acento:', nomeComAcento);
          return ipsData[nomeComAcento];
        }
        
        // Fallback: tentar sem acento (normalizado)
        if (ipsData[municipioNome]) {
          console.log('[IPS] Encontrado sem acento:', municipioNome);
          return ipsData[municipioNome];
        }
        
        console.log('[IPS] Dados nao encontrados para:', municipioNome);
        return null;
      } catch (error) {
        console.error('Erro ao carregar dados de IPS:', error);
        return null;
      }
    }),

  /**
   * Buscar dados IDHM (Indice de Desenvolvimento Humano Municipal) de um municipio
   */
  idhm: publicProcedure
    .input(
      z.object({
        codigoIBGE: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        if (!input.codigoIBGE) {
          return null;
        }
        
        const idhmPath = path.join(process.cwd(), 'public', 'idhm-municipios.json');
        if (!fs.existsSync(idhmPath)) {
          return null;
        }
        const idhmData = JSON.parse(fs.readFileSync(idhmPath, 'utf-8'));
        
        let municipioNome = null;
        let municipioNomeOriginal = null;
        for (const rf of Object.values(hierarchyData) as any[]) {
          for (const corede of Object.values(rf) as any[]) {
            if (Array.isArray(corede)) {
              for (const [codigo, nome] of corede) {
                if (String(codigo) === input.codigoIBGE.toString()) {
                  municipioNomeOriginal = nome;
                  municipioNome = normalizeString(nome);
                  break;
                }
              }
              if (municipioNome) break;
            }
          }
          if (municipioNome) break;
        }
        
        if (!municipioNome) {
          return null;
        }
        
        // Procurar nos dados IDHM (estrutura: RF -> COREDE -> [{ nome, idhm_1991, idhm_2000, idhm_2010 }])
        for (const rf of Object.values(idhmData) as any[]) {
          for (const coredes of Object.values(rf) as any[]) {
            if (Array.isArray(coredes)) {
              for (const municipio of coredes) {
                const municipioDataNormalized = normalizeString(municipio.nome);
                if (municipioDataNormalized === municipioNome) {
                  console.log('[IDHM] Encontrado:', municipio.nome);
                  return municipio;
                }
              }
            }
          }
        }
        
        console.log('[IDHM] Dados nao encontrados para:', municipioNome);
        return null;
      } catch (error) {
        console.error('Erro ao carregar dados de IDHM:', error);
        return null;
      }
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
