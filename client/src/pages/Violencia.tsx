import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { trpc } from '@/lib/trpc';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface ViolenciaProps {
  codigoIBGE?: string;
}

// Procedure para carregar dados CVLI de um município específico
const INDICADORES_CVLI = [
  'Homicídio Doloso',
  'Total de Vítimas de CVLI*',
  'Latrocínio',
  'Furtos',
  'Roubos',
  'Furto de Veículo',
  'Roubo de Veículo',
  'Estelionato',
  'Entorpecentes - Tráfico',
  'Delitos Relacionados à Armas e Munições',
]

export function Violencia({ codigoIBGE }: ViolenciaProps) {
  const { data: cvliData, isLoading } = trpc.portal.violenciaCVLI.useQuery({
    codigoIBGE: codigoIBGE || undefined,
  });

  // Estados para comparação entre municípios
  const [municipioA, setMunicipioA] = useState('');
  const [municipioB, setMunicipioB] = useState('');
  const [indicadorComparacao, setIndicadorComparacao] = useState('Homicídio Doloso');
  const [nomeA, setNomeA] = useState('');
  const [nomeB, setNomeB] = useState('');
  const [municipioAData, setMunicipioAData] = useState<any>(null);
  const [municipioBData, setMunicipiBData] = useState<any>(null);
  const [todosMunicipios, setTodosMunicipios] = useState<any[]>([]);

  // Carregar lista de todos os municípios
  const { data: municipiosData } = trpc.portal.municipios.useQuery({
    coredeId: undefined,
    regiaoFuncionalId: undefined,
  });
  useEffect(() => {
    if (municipiosData) {
      setTodosMunicipios(municipiosData);
    }
  }, [municipiosData]);

  // Carregar dados de Município A para comparação
  const municipioAQuery = trpc.portal.violenciaCVLI.useQuery(
    { codigoIBGE: municipioA || undefined },
    { enabled: !!municipioA }
  );

  useEffect(() => {
    if (municipioA && todosMunicipios) {
      const municipioInfo = todosMunicipios.find(m => m.codigoIBGE === municipioA);
      setNomeA(municipioInfo?.nome || '');
    } else {
      setNomeA('');
    }
  }, [municipioA, todosMunicipios]);

  useEffect(() => {
    if (municipioAQuery.data?.historico) {
      setMunicipioAData(municipioAQuery.data.historico);
    } else if (!municipioA) {
      setMunicipioAData(null);
    }
  }, [municipioAQuery.data, municipioA]);

  // Carregar dados de Município B para comparação
  const municipioBQuery = trpc.portal.violenciaCVLI.useQuery(
    { codigoIBGE: municipioB || undefined },
    { enabled: !!municipioB }
  );

  useEffect(() => {
    if (municipioB && todosMunicipios) {
      const municipioInfo = todosMunicipios.find(m => m.codigoIBGE === municipioB);
      setNomeB(municipioInfo?.nome || '');
    } else {
      setNomeB('');
    }
  }, [municipioB, todosMunicipios]);

  useEffect(() => {
    if (municipioBQuery.data?.historico) {
      setMunicipiBData(municipioBQuery.data.historico);
    } else if (!municipioB) {
      setMunicipiBData(null);
    }
  }, [municipioBQuery.data, municipioB]);


  // Indicadores principais
  const indicadoresPrincipais = useMemo(() => {
    if (!cvliData?.historico) return null;

    const anos = Object.keys(cvliData.historico).sort();
    const anoRecente = anos[anos.length - 1];
    const anoPrevio = anos[anos.length - 2];

    const dadosRecentes = cvliData.historico[anoRecente] || {};
    const dadosPrevios = cvliData.historico[anoPrevio] || {};

    return {
      homicidio: {
        valor: dadosRecentes['Homicídio  Doloso'] || 0,
        anterior: dadosPrevios['Homicídio  Doloso'] || 0,
      },
      cvli: {
        valor: dadosRecentes['Total de Vítimas de CVLI*'] || 0,
        anterior: dadosPrevios['Total de Vítimas de CVLI*'] || 0,
      },
      latrocinio: {
        valor: dadosRecentes['Latrocínio'] || 0,
        anterior: dadosPrevios['Latrocínio'] || 0,
      },
      roubo: {
        valor: dadosRecentes['Roubos'] || 0,
        anterior: dadosPrevios['Roubos'] || 0,
      },
    };
  }, [cvliData]);

  // Dados para gráfico de evolução
  const dadosEvolucao = useMemo(() => {
    if (!cvliData?.historico) return [];

    return Object.entries(cvliData.historico)
      .filter(([ano]) => ano !== 'nota')
      .sort(([anoA], [anoB]) => anoA.localeCompare(anoB))
      .map(([ano, dados]: any) => ({
        ano: ano.toString().slice(-4),
        'Homicídio': dados['Homicídio  Doloso'] || 0,
        'CVLI': dados['Total de Vítimas de CVLI*'] || 0,
        'Latrocínio': dados['Latrocínio'] || 0,
        'Roubo': dados['Roubos'] || 0,
      }));
  }, [cvliData]);

  // Dados para gráfico de composição
  const dadosComposicao = useMemo(() => {
    if (!cvliData?.historico) return [];

    const anoRecente = Object.keys(cvliData.historico).sort().pop();
    if (!anoRecente) return [];

    const dados = cvliData.historico[anoRecente] || {};
    return [
      { name: 'Furto', value: dados['Furtos'] || 0, color: '#3b82f6' },
      { name: 'Roubo', value: dados['Roubos'] || 0, color: '#ef4444' },
      { name: 'Estelionato', value: dados['Estelionato'] || 0, color: '#f59e0b' },
      { name: 'Entorpecentes', value: dados['Entorpecentes - Tráfico'] || 0, color: '#8b5cf6' },
      { name: 'Outros', value: (dados['Latrocínio'] || 0) + (dados['Furto de Veículo'] || 0) + (dados['Roubo de Veículo'] || 0), color: '#6b7280' },
    ].filter(item => item.value > 0);
  }, [cvliData]);

  // Análise de tendência
  const analise = useMemo(() => {
    if (!indicadoresPrincipais) return null;

    const variacaoHomicidio = ((indicadoresPrincipais.homicidio.valor - indicadoresPrincipais.homicidio.anterior) / indicadoresPrincipais.homicidio.anterior) * 100;
    const variacaoCVLI = ((indicadoresPrincipais.cvli.valor - indicadoresPrincipais.cvli.anterior) / indicadoresPrincipais.cvli.anterior) * 100;

    let tendencia = 'Estável';
    let cor = 'text-gray-600';

    if (variacaoHomicidio < -10) {
      tendencia = 'Redução significativa de homicídios';
      cor = 'text-green-600';
    } else if (variacaoHomicidio > 10) {
      tendencia = 'Aumento de homicídios';
      cor = 'text-red-600';
    } else if (variacaoCVLI < -10) {
      tendencia = 'Redução de crimes violentos';
      cor = 'text-green-600';
    } else if (variacaoCVLI > 10) {
      tendencia = 'Aumento de crimes violentos';
      cor = 'text-red-600';
    }

    return { tendencia, cor, variacaoHomicidio, variacaoCVLI };
  }, [indicadoresPrincipais]);

  if (isLoading) {
    return <div className="p-4">Carregando dados de violência...</div>;
  }

  if (!cvliData) {
    return (
      <div className="p-4 text-center text-gray-500">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Dados de violência não disponíveis para este município.</p>
        <p className="text-sm mt-2">Fonte: OESP/SSP-RS</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicadoresPrincipais && (
          <>
            <Card className="p-4 border-l-4 border-l-red-500">
              <div className="text-sm text-gray-600">Homicídio Doloso</div>
              <div className="text-3xl font-bold text-red-600 mt-2">
                {indicadoresPrincipais.homicidio.valor.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                {indicadoresPrincipais.homicidio.valor < indicadoresPrincipais.homicidio.anterior ? (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                )}
                <span className={indicadoresPrincipais.homicidio.valor < indicadoresPrincipais.homicidio.anterior ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(((indicadoresPrincipais.homicidio.valor - indicadoresPrincipais.homicidio.anterior) / indicadoresPrincipais.homicidio.anterior) * 100).toFixed(1)}%
                </span>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-orange-500">
              <div className="text-sm text-gray-600">Vítimas de CVLI</div>
              <div className="text-3xl font-bold text-orange-600 mt-2">
                {indicadoresPrincipais.cvli.valor.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                {indicadoresPrincipais.cvli.valor < indicadoresPrincipais.cvli.anterior ? (
                  <TrendingDown className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                )}
                <span className={indicadoresPrincipais.cvli.valor < indicadoresPrincipais.cvli.anterior ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(((indicadoresPrincipais.cvli.valor - indicadoresPrincipais.cvli.anterior) / indicadoresPrincipais.cvli.anterior) * 100).toFixed(1)}%
                </span>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="text-sm text-gray-600">Latrocínio</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">
                {indicadoresPrincipais.latrocinio.valor.toLocaleString()}
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="text-sm text-gray-600">Roubo</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                {indicadoresPrincipais.roubo.valor.toLocaleString()}
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Análise de Tendência */}
      {analise && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-semibold mb-2">Análise de Tendência</h3>
          <p className={`text-lg font-semibold ${analise.cor}`}>
            {analise.tendencia}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Variação de homicídios: {analise.variacaoHomicidio > 0 ? '+' : ''}{analise.variacaoHomicidio.toFixed(1)}% | 
            Variação de CVLI: {analise.variacaoCVLI > 0 ? '+' : ''}{analise.variacaoCVLI.toFixed(1)}%
          </p>
        </Card>
      )}

      {/* Gráfico de Evolução */}
      {dadosEvolucao.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Evolução de Crimes Violentos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosEvolucao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="Homicídio" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="CVLI" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="Roubo" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Gráfico de Composição */}
      {dadosComposicao.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Composição de Crimes (Ano Recente)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosComposicao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosComposicao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Tabela de Indicadores */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Indicadores Detalhados</h3>
            <div className="space-y-3 text-sm max-h-96 overflow-y-auto">
              {cvliData.historico &&
                Object.entries(cvliData.historico)
                  .filter(([ano]) => ano !== 'nota')
                  .sort(([anoA], [anoB]) => {
                    // Ordenar cronologicamente: 2020-2025, depois 2026_parcial
                    const aNum = anoA === '2026_parcial' ? 9999 : parseInt(anoA);
                    const bNum = anoB === '2026_parcial' ? 9999 : parseInt(anoB);
                    return aNum - bNum;
                  })
                  .map(([ano, dados]: any) => {
                    const anoDisplay = ano === '2026_parcial' ? '2026 (parcial jan-abr)' : ano;
                    return (
                      <div key={ano} className="border-t pt-3 pb-2">
                        <div className="font-semibold text-gray-800 mb-2">{anoDisplay}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Homicídio Doloso:</span>
                            <span className="font-semibold">{dados['Homicídio  Doloso']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vítimas CVLI:</span>
                            <span className="font-semibold">{dados['Total de Vítimas de CVLI*']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Latrocínio:</span>
                            <span className="font-semibold">{dados['Latrocínio']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Furto:</span>
                            <span className="font-semibold">{dados['Furtos']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Roubo:</span>
                            <span className="font-semibold">{dados['Roubo']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Furto de Veículo:</span>
                            <span className="font-semibold">{dados['Furto de Veículo']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Roubo de Veículo:</span>
                            <span className="font-semibold">{dados['Roubo de Veículo']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Estelionato:</span>
                            <span className="font-semibold">{dados['Estelionato']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tráfico:</span>
                            <span className="font-semibold">{dados['Entorpecentes - Tráfico']?.toLocaleString() || '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Armas/Munições:</span>
                            <span className="font-semibold">{dados['Delitos Relacionados à Armas e Munições']?.toLocaleString() || '-'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </Card>
        </div>
      )}

      {/* Rodapé com Fonte */}
      <div className="text-xs text-gray-500 border-t pt-4">
        <p>
          <strong>Fonte:</strong> OESP/SSP-RS — PROCERGS/GESEG. Dados CVLI.
          {cvliData.historico?.['2026_parcial'] && ' 2026 parcial (jan-abr).'}
        </p>
      </div>
    </div>
  );
}
