import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trpc } from '@/lib/trpc';

interface IPSProps {
  codigoIBGE?: string;
  nomeMunicipio?: string;
}

export function IPS({ codigoIBGE, nomeMunicipio }: IPSProps) {
  // Query para buscar dados IPS
  const ipsQuery = trpc.portal.ipsMunicipio.useQuery(
    { codigoIBGE: codigoIBGE || '' },
    { enabled: !!codigoIBGE }
  );

  const ipsData = ipsQuery.data;

  // Indicadores principais
  const indicadoresPrincipais = [
    { label: 'Índice de Progresso Social', key: 'Índice de Progresso Social', color: 'bg-blue-100 text-blue-900' },
    { label: 'Necessidades Humanas Básicas', key: 'Necessidades Humanas Básicas', color: 'bg-green-100 text-green-900' },
    { label: 'Fundamentos do Bem-estar', key: 'Fundamentos do Bem-estar', color: 'bg-purple-100 text-purple-900' },
    { label: 'Oportunidades', key: 'Oportunidades', color: 'bg-orange-100 text-orange-900' },
  ];

  // Subindicadores
  const subindicadores = [
    'Nutrição e Cuidados Médicos Básicos',
    'Água e Saneamento',
    'Moradia',
    'Segurança Pessoal',
    'Acesso ao Conhecimento Básico',
    'Acesso à Informação e Comunicação',
    'Saúde e Bem-estar',
    'Qualidade do Meio Ambiente',
    'Direitos Individuais',
    'Liberdades Individuais e de Escolha',
    'Inclusão Social',
    'Acesso à Educação Superior',
  ];

  // Calcular variação percentual
  const calcularVariacao = (ano: string, subind: string) => {
    if (!ipsData) return null;
    
    const anoAtual = ipsData[ano];
    let anoAnterior = null;
    
    if (ano === '2025' && ipsData['2024']) anoAnterior = ipsData['2024'];
    if (ano === '2026' && ipsData['2025']) anoAnterior = ipsData['2025'];
    
    if (!anoAtual || !anoAnterior) return null;
    
    const valAtual = anoAtual[subind];
    const valAnterior = anoAnterior[subind];
    
    if (valAtual === null || valAnterior === null) return null;
    
    const variacao = ((valAtual - valAnterior) / valAnterior) * 100;
    return variacao;
  };

  // Dados para gráfico
  const dadosGrafico = useMemo(() => {
    if (!ipsData) return [];
    
    return [
      {
        ano: '2024',
        valor: ipsData['2024']?.['Índice de Progresso Social'] || 0,
      },
      {
        ano: '2025',
        valor: ipsData['2025']?.['Índice de Progresso Social'] || 0,
      },
      {
        ano: '2026',
        valor: ipsData['2026']?.['Índice de Progresso Social'] || 0,
      },
    ];
  }, [ipsData]);

  return (
    <div className="space-y-6">
      {/* BLOCO 1 - Apresentação */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl">Índice de Progresso Social (IPS Brasil)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            O IPS Brasil mede o progresso social dos municípios além do PIB, avaliando a qualidade de vida em três dimensões: 
            <strong> Necessidades Humanas Básicas</strong> (nutrição, saneamento, moradia e segurança), 
            <strong> Fundamentos do Bem-estar</strong> (acesso ao conhecimento, informação, saúde e meio ambiente) e 
            <strong> Oportunidades</strong> (direitos, liberdades, inclusão e acesso à educação superior). 
            A pontuação vai de 0 a 100 — quanto maior, melhor o progresso social do município.
          </p>
          <p className="text-xs text-gray-600">
            <strong>Fonte:</strong> IPS Brasil — ipsbrasil.org.br | <strong>Anos disponíveis:</strong> 2024, 2025 e 2026
          </p>
        </CardContent>
      </Card>

      {/* BLOCO 2 - Indicadores do Município */}
      {!codigoIBGE ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Selecione um município para visualizar o IPS local.</p>
          </CardContent>
        </Card>
      ) : ipsQuery.isLoading ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Carregando dados IPS...</p>
          </CardContent>
        </Card>
      ) : !ipsData ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="pt-6 text-center text-gray-500">
            <p>Dados não disponíveis para este município.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cards Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {indicadoresPrincipais.map((ind) => {
              const val2024 = ipsData['2024']?.[ind.key];
              const val2025 = ipsData['2025']?.[ind.key];
              const val2026 = ipsData['2026']?.[ind.key];
              
              const variacao2025 = calcularVariacao('2025', ind.key);
              const variacao2026 = calcularVariacao('2026', ind.key);
              
              return (
                <Card key={ind.key} className={ind.color}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">{ind.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold">{val2026?.toFixed(2) || '—'}</div>
                    <div className="text-xs space-y-1">
                      <div>2024: {val2024?.toFixed(2) || '—'}</div>
                      <div>2025: {val2025?.toFixed(2) || '—'}</div>
                      <div>2026: {val2026?.toFixed(2) || '—'}</div>
                    </div>
                    {variacao2026 !== null && (
                      <div className={`text-sm font-semibold ${variacao2026 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {variacao2026 >= 0 ? '↑' : '↓'} {Math.abs(variacao2026).toFixed(1)}% vs 2025
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Gráfico de Evolução */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do IPS Geral (2024-2026)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="valor" 
                    stroke="#3b82f6" 
                    name="IPS Geral"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela de Subindicadores */}
          <Card>
            <CardHeader>
              <CardTitle>Subindicadores (2024-2026)</CardTitle>
              <CardDescription>Valores e variação percentual ano a ano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-3 font-semibold text-gray-800">Indicador</th>
                      <th className="text-center p-3 font-semibold text-gray-800">2024</th>
                      <th className="text-center p-3 font-semibold text-gray-800">2025</th>
                      <th className="text-center p-3 font-semibold text-gray-800">Var. 25</th>
                      <th className="text-center p-3 font-semibold text-gray-800">2026</th>
                      <th className="text-center p-3 font-semibold text-gray-800">Var. 26</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subindicadores.map((subind) => {
                      const val2024 = ipsData['2024']?.[subind];
                      const val2025 = ipsData['2025']?.[subind];
                      const val2026 = ipsData['2026']?.[subind];
                      
                      const var2025 = calcularVariacao('2025', subind);
                      const var2026 = calcularVariacao('2026', subind);
                      
                      return (
                        <tr key={subind} className="border-b hover:bg-gray-50">
                          <td className="text-left p-3 font-medium text-gray-700">{subind}</td>
                          <td className="text-center p-3">{val2024?.toFixed(2) || '—'}</td>
                          <td className="text-center p-3">{val2025?.toFixed(2) || '—'}</td>
                          <td className={`text-center p-3 font-semibold ${var2025 !== null ? (var2025 >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}`}>
                            {var2025 !== null ? `${var2025 >= 0 ? '↑' : '↓'} ${Math.abs(var2025).toFixed(1)}%` : '—'}
                          </td>
                          <td className="text-center p-3">{val2026?.toFixed(2) || '—'}</td>
                          <td className={`text-center p-3 font-semibold ${var2026 !== null ? (var2026 >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-500'}`}>
                            {var2026 !== null ? `${var2026 >= 0 ? '↑' : '↓'} ${Math.abs(var2026).toFixed(1)}%` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
