/**
 * Helper para integração com API do IBGE Cidades
 * Documentação: https://servicodados.ibge.gov.br/api/docs
 */

export interface IBGEMunicipio {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      uf: {
        id: number;
        nome: string;
        sigla: string;
      };
    };
  };
  populacao?: number;
  area?: number;
  pib?: number;
  pibPerCapita?: number;
}

export interface IBGEDados {
  codigoIBGE: number;
  nome: string;
  populacao?: number;
  populacaoUrbana?: number;
  populacaoRural?: number;
  areaTerritorial?: number;
  pib?: number;
  pibPerCapita?: number;
  densidade?: number;
}

/**
 * Buscar dados do IBGE Cidades por código IBGE
 */
export async function buscarDadosIBGE(codigoIBGE: number): Promise<IBGEDados | null> {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/municipios/${codigoIBGE}`
    );

    if (!response.ok) {
      console.error(`[IBGE] Erro ao buscar dados: ${response.status}`);
      return null;
    }

    const data: IBGEMunicipio = await response.json();

    return {
      codigoIBGE,
      nome: data.nome,
      populacao: data.populacao,
      areaTerritorial: data.area,
      pib: data.pib,
      pibPerCapita: data.pibPerCapita,
      densidade: data.area ? (data.populacao || 0) / data.area : undefined,
    };
  } catch (error) {
    console.error(`[IBGE] Erro ao buscar dados para ${codigoIBGE}:`, error);
    return null;
  }
}

/**
 * Buscar dados agregados para uma lista de municípios
 */
export async function buscarDadosAgregados(
  codigosIBGE: number[]
): Promise<IBGEDados[]> {
  const resultados: IBGEDados[] = [];

  for (const codigo of codigosIBGE) {
    const dados = await buscarDadosIBGE(codigo);
    if (dados) {
      resultados.push(dados);
    }
    // Pequeno delay para não sobrecarregar a API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return resultados;
}

/**
 * Calcular agregações para uma lista de dados
 */
export function calcularAgregacoes(dados: IBGEDados[]) {
  if (dados.length === 0) {
    return null;
  }

  const populacaoTotal = dados.reduce((sum, d) => sum + (d.populacao || 0), 0);
  const areaTotal = dados.reduce((sum, d) => sum + (d.areaTerritorial || 0), 0);
  const pibTotal = dados.reduce((sum, d) => sum + (d.pib || 0), 0);

  return {
    municipiosCount: dados.length,
    populacaoTotal,
    areaTerritorial: areaTotal,
    pibTotal,
    pibPerCapitaMedio: populacaoTotal > 0 ? pibTotal / populacaoTotal : 0,
    densidadeMedia: areaTotal > 0 ? populacaoTotal / areaTotal : 0,
  };
}
