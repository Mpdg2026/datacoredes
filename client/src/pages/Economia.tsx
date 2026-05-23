import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, MapPin } from 'lucide-react';

interface EconomiaData {
  nome: string;
  codigo_ibge: number;
  pib_recente: {
    ano: number;
    pib_total_mil: number;
    pib_pc: number;
    agropecuaria: number;
    industria: number;
    servicos: number;
    administracao: number;
    top_atividades: string[];
  };
  demografia_2022: {
    populacao: number;
    area_km2: number;
    densidade: number;
  };
  historico_pib: Record<string, any>;
}

interface EconomiaProps {
  data: EconomiaData | null;
  isLoading: boolean;
}

export function Economia({ data, isLoading }: EconomiaProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Selecione um município para visualizar dados econômicos</p>
      </div>
    );
  }

  // Preparar dados para gráficos
  const historicoPIB = useMemo(() => {
    return Object.entries(data.historico_pib || {})
      .map(([ano, dados]: any) => ({
        ano: parseInt(ano),
        pib: dados.pib_total || 0,
        pib_pc: dados.pib_pc || 0,
      }))
      .sort((a, b) => a.ano - b.ano);
  }, [data.historico_pib]);

  const composicaoSetorial = useMemo(() => {
    const recente = data.pib_recente;
    return [
      { name: 'Agropecuária', value: recente.agropecuaria, color: '#10b981' },
      { name: 'Indústria', value: recente.industria, color: '#3b82f6' },
      { name: 'Serviços', value: recente.servicos, color: '#f59e0b' },
      { name: 'Administração', value: recente.administracao, color: '#8b5cf6' },
    ].filter(item => item.value > 0);
  }, [data.pib_recente]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Análise automática de vocação econômica
  const analiseVocacao = useMemo(() => {
    const { agropecuaria, industria, servicos } = data.pib_recente;
    const total = agropecuaria + industria + servicos;
    
    const agro_pct = (agropecuaria / total) * 100;
    const ind_pct = (industria / total) * 100;
    const serv_pct = (servicos / total) * 100;
    
    let vocacao = [];
    
    if (agro_pct > 20) vocacao.push('Forte base agroindustrial');
    if (ind_pct > 20) vocacao.push('Indústria de transformação relevante');
    if (serv_pct > 50) vocacao.push('Economia baseada em serviços');
    if (data.demografia_2022.populacao > 100000) vocacao.push('Centro urbano importante');
    
    return vocacao.length > 0 ? vocacao.join(' • ') : 'Economia diversificada';
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PIB Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {formatNumber(data.pib_recente.pib_total_mil)}M</div>
            <p className="text-xs text-muted-foreground">Ano {data.pib_recente.ano}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PIB Per Capita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.pib_recente.pib_pc)}</div>
            <p className="text-xs text-muted-foreground">Por habitante</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">População</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.demografia_2022.populacao)}</div>
            <p className="text-xs text-muted-foreground">Censo 2022</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Densidade</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.demografia_2022.densidade.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">hab/km²</p>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Vocação Econômica */}
      <Card>
        <CardHeader>
          <CardTitle>Análise Econômica</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{analiseVocacao}</p>
          {data.pib_recente.top_atividades.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Principais Atividades:</p>
              <div className="flex flex-wrap gap-2">
                {data.pib_recente.top_atividades.map((atividade, idx) => (
                  <span key={idx} className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                    {atividade}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução do PIB */}
        {historicoPIB.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Evolução do PIB (2010-2023)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicoPIB}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="pib" stroke="#3b82f6" name="PIB (Milhões)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Composição Setorial */}
        {composicaoSetorial.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Composição Setorial ({data.pib_recente.ano})</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={composicaoSetorial}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatNumber(value as number)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {composicaoSetorial.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabela de Dados Históricos */}
      {historicoPIB.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Série Histórica de PIB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Ano</th>
                    <th className="text-right py-2 px-4">PIB (Milhões)</th>
                    <th className="text-right py-2 px-4">PIB Per Capita</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoPIB.map((row) => (
                    <tr key={row.ano} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{row.ano}</td>
                      <td className="text-right py-2 px-4">{formatNumber(row.pib)}</td>
                      <td className="text-right py-2 px-4">{formatCurrency(row.pib_pc)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
