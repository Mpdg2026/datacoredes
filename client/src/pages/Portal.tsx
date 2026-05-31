'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DataTable } from '@/components/DataTable';
import { MapView } from '@/components/Map';
import { Economia } from './Economia';
import { Violencia } from './Violencia';
import { ViolenciaMulher } from './ViolenciaMulher';
import { X } from 'lucide-react';

export default function Portal() {
  // ============ ESTADO ============
  const [selectedRF, setSelectedRF] = useState<string | null>(null);
  const [selectedCorede, setSelectedCorede] = useState<number | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
  const [selectedMunicipioComparacao, setSelectedMunicipioComparacao] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('violencia');
  const [showComparacao, setShowComparacao] = useState(false);

  // ============ QUERIES - FILTROS EM CASCATA ============
  const regioesFuncionais = trpc.portal.regioesFuncionais.useQuery();
  const coredes = trpc.portal.coredes.useQuery({ 
    regiaoFuncionalId: selectedRF || undefined 
  });
  const municipios = trpc.portal.municipios.useQuery({
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });
  const todosMunicipios = trpc.portal.todosMunicipios.useQuery();

  // ============ QUERIES - INDICADORES ============
  // Obter código IBGE e nome do município selecionado
  const municipioSelecionado = municipios.data?.find((m: any) => m.id === selectedMunicipio);
  const codigoIBGE = municipioSelecionado?.codigoIBGE;
  const nomeMunicipio = municipioSelecionado?.nome;

  // IGM - Dados reais (Gestão, Desempenho, Finanças)
  const igm = trpc.portal.igm.useQuery(
    { codigoIBGE: codigoIBGE || 0 },
    { enabled: !!codigoIBGE }
  );

  // ODS/IDSC - Dados reais
  const ods = trpc.portal.ods.useQuery(
    { codigoIBGE: codigoIBGE || 0 },
    { enabled: !!codigoIBGE }
  );

  // Saneamento - Dados reais
  const saneamento = trpc.portal.saneamento.useQuery(
    { codigoIBGE: codigoIBGE || 0 },
    { enabled: !!codigoIBGE }
  );

  // Economia - IBGE Cidades
  const economia = trpc.portal.ibgeCidades.useQuery(
    { codigoIBGE: codigoIBGE || 0 },
    { enabled: !!codigoIBGE }
  );
  // Economia Completa - PIB 2010-2023 + Demografia 2022
  const economiaCompleta = trpc.portal.economiaCompleta.useQuery(
    { codigoIBGE: codigoIBGE || 0 },
    { enabled: !!codigoIBGE }
  );

  // Rankings de Economia
  const rankingEconomia = trpc.portal.rankingEconomia.useQuery(
    { indicador: "pib_total", limite: 10 }
  );

  // ============ HANDLERS - FILTROS ============
  const handleRFChange = (rfId: string) => {
    setSelectedRF(rfId);
    setSelectedCorede(null);
    setSelectedMunicipio(null);
  };

  const handleCoredeChange = (coredeId: number) => {
    setSelectedCorede(coredeId);
    setSelectedMunicipio(null);
  };

  const handleMunicipioChange = (municipioId: number) => {
    setSelectedMunicipio(municipioId);
  };

  const handleResetFiltros = () => {
    setSelectedRF(null);
    setSelectedCorede(null);
    setSelectedMunicipio(null);
    setSelectedMunicipioComparacao(null);
    setShowComparacao(false);
  };

  // ============ RENDERIZAÇÃO - FILTROS ============
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#001f5c] mb-2">Portal Coredes em Números</h1>
          <p className="text-gray-600">Indicadores Socioeconômicos do Rio Grande do Sul</p>
        </div>

        {/* Filtros em Cascata */}
        <Card className="mb-8 border-l-4 border-l-[#f4b41a]">
          <CardHeader>
            <CardTitle className="text-[#001f5c]">Filtros Hierárquicos</CardTitle>
            <CardDescription>Selecione Região Funcional → Corede → Município</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Região Funcional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Região Funcional</label>
                <Select value={selectedRF || ''} onValueChange={handleRFChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma RF..." />
                  </SelectTrigger>
                  <SelectContent>
                    {regioesFuncionais.data?.map((rf) => (
                      <SelectItem key={rf.id} value={rf.id}>
                        {rf.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Corede */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Corede</label>
                <Select 
                  value={selectedCorede?.toString() || ''} 
                  onValueChange={(val) => handleCoredeChange(Number(val))}
                  disabled={!selectedRF}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um Corede..." />
                  </SelectTrigger>
                  <SelectContent>
                    {coredes.data?.map((corede) => (
                      <SelectItem key={corede.id} value={corede.id.toString()}>
                        {corede.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Município */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Município</label>
                <Select 
                  value={selectedMunicipio?.toString() || ''} 
                  onValueChange={(val) => handleMunicipioChange(Number(val))}
                  disabled={!selectedCorede}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um município..." />
                  </SelectTrigger>
                  <SelectContent>
                    {municipios.data?.map((municipio: any) => (
                      <SelectItem key={municipio.id} value={municipio.id.toString()}>
                        {municipio.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botão Reset */}
            <Button 
              onClick={handleResetFiltros}
              variant="outline"
              className="w-full md:w-auto"
            >
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>

        {/* Abas Temáticas */}
        {selectedMunicipio || activeTab === 'violencia' || activeTab === 'violencia-mulher' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8 bg-[#001f5c]">
              <TabsTrigger value="igm" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Governança (IGM)
              </TabsTrigger>
              <TabsTrigger value="ods" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Sustentabilidade (ODS)
              </TabsTrigger>
              <TabsTrigger value="saneamento" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Saneamento
              </TabsTrigger>
              <TabsTrigger value="economia" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Economia
              </TabsTrigger>
              <TabsTrigger value="violencia" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Violência
              </TabsTrigger>
              <TabsTrigger value="violencia-mulher" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Violência Mulher
              </TabsTrigger>

            </TabsList>

            {/* ============ ABA IGM ============ */}
            <TabsContent value="igm" className="space-y-6">
              {igm.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados IGM...</p>
                  </CardContent>
                </Card>
              )}

              {igm.data && (
                <>
                  {/* Cards de Dimensões */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-t-4 border-t-blue-500">
                      <CardHeader>
                        <CardTitle className="text-lg">Gestão</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-blue-600">{igm.data.gestao?.toFixed(2) || 'S/D'}</p>
                        <p className="text-sm text-gray-500 mt-2">Índice de Gestão Municipal</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-green-500">
                      <CardHeader>
                        <CardTitle className="text-lg">Desempenho</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-green-600">{igm.data.desempenho?.toFixed(2) || 'S/D'}</p>
                        <p className="text-sm text-gray-500 mt-2">Índice de Desempenho</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-yellow-500">
                      <CardHeader>
                        <CardTitle className="text-lg">Finanças</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-yellow-600">{igm.data.financas?.toFixed(2) || 'S/D'}</p>
                        <p className="text-sm text-gray-500 mt-2">Índice de Saúde Financeira</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Gráfico de Barras */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparativo de Dimensões</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          {
                            dimensao: 'Gestão',
                            valor: igm.data.gestao || 0,
                          },
                          {
                            dimensao: 'Desempenho',
                            valor: igm.data.desempenho || 0,
                          },
                          {
                            dimensao: 'Finanças',
                            valor: igm.data.financas || 0,
                          },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="dimensao" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="valor" fill="#f4b41a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}

              {igm.error && (
                <Card className="border-red-500">
                  <CardContent className="pt-6">
                    <p className="text-center text-red-500">Erro ao carregar dados IGM</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ============ ABA ODS ============ */}
            <TabsContent value="ods" className="space-y-6">
              {ods.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados ODS...</p>
                  </CardContent>
                </Card>
              )}

              {ods.data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Objetivos de Desenvolvimento Sustentável (ODS)</CardTitle>
                    <CardDescription>Série histórica 2023-2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.from({ length: 17 }, (_, i) => {
                        const goalKey = `goal${i + 1}`;
                        const anos = (ods.data as any)?.anos || {};
                        const goal2023 = anos['2023']?.goals?.[goalKey] || 0;
                        const goal2024 = anos['2024']?.goals?.[goalKey] || 0;
                        const goal2025 = anos['2025']?.goals?.[goalKey] || 0;

                        return (
                          <Card key={i + 1} className="border-l-4 border-l-[#f4b41a]">
                            <CardHeader>
                              <CardTitle className="text-sm">ODS {i + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-bold text-[#001f5c]">{goal2025?.toFixed(1) || 'S/D'}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                2023: {goal2023?.toFixed(1)} | 2024: {goal2024?.toFixed(1)} | 2025: {goal2025?.toFixed(1)}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ============ ABA SANEAMENTO ============ */}
            <TabsContent value="saneamento" className="space-y-6">
              {saneamento.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados de Saneamento...</p>
                  </CardContent>
                </Card>
              )}

              {saneamento.data && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-t-4 border-t-blue-400">
                      <CardHeader>
                        <CardTitle className="text-lg">Água com Tratamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-blue-600">{(saneamento.data as any)?.agua_coleta_tratamento?.toFixed(1) || 'S/D'}%</p>
                        <p className="text-sm text-gray-500 mt-2">Coleta com Tratamento</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-green-400">
                      <CardHeader>
                        <CardTitle className="text-lg">Água sem Tratamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-green-600">{(saneamento.data as any)?.agua_coleta_sem_tratamento?.toFixed(1) || 'S/D'}%</p>
                        <p className="text-sm text-gray-500 mt-2">Coleta sem Tratamento</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-yellow-400">
                      <CardHeader>
                        <CardTitle className="text-lg">Solução Individual</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-yellow-600">{(saneamento.data as any)?.agua_solucao_individual?.toFixed(1) || 'S/D'}%</p>
                        <p className="text-sm text-gray-500 mt-2">Solução Individual</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Indicadores de Saneamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          {
                            indicador: 'Água com Tratamento',
                            valor: (saneamento.data as any)?.agua_coleta_tratamento || 0,
                          },
                          {
                            indicador: 'Água sem Tratamento',
                            valor: (saneamento.data as any)?.agua_coleta_sem_tratamento || 0,
                          },
                          {
                            indicador: 'Solução Individual',
                            valor: (saneamento.data as any)?.agua_solucao_individual || 0,
                          },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="indicador" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="valor" fill="#001f5c" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* ============ ABA ECONOMIA ============ */}
            <TabsContent value="economia" className="space-y-6">
              <Economia data={economiaCompleta.data || null} isLoading={economiaCompleta.isLoading} />
            </TabsContent>

            {/* ============ ABA VIOLÊNCIA ============ */}
            <TabsContent value="violencia" className="space-y-6">
              <Violencia codigoIBGE={codigoIBGE?.toString()} />
            </TabsContent>

            {/* ============ ABA VIOLÊNCIA CONTRA A MULHER ============ */}
            <TabsContent value="violencia-mulher" className="space-y-6">
              <ViolenciaMulher selectedMunicipio={codigoIBGE ? String(codigoIBGE) : undefined} nomeMunicipio={nomeMunicipio} selectedCorede={selectedCorede ? String(selectedCorede) : undefined} />
            </TabsContent>


          </Tabs>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-lg text-gray-500">Selecione um município para visualizar os indicadores</p>
            </CardContent>
          </Card>
        )}


      </div>
    </div>
  );
}
