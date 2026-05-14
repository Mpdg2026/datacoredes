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
import { X } from 'lucide-react';

export default function Portal() {
  // ============ ESTADO ============
  const [selectedRF, setSelectedRF] = useState<string | null>(null);
  const [selectedCorede, setSelectedCorede] = useState<number | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
  const [selectedMunicipioComparacao, setSelectedMunicipioComparacao] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('igm');
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
  // Obter código IBGE do município selecionado
  const municipioSelecionado = municipios.data?.find((m: any) => m.id === selectedMunicipio);
  const codigoIBGE = municipioSelecionado?.codigoIBGE;

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
        {selectedMunicipio && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#001f5c]">
              <TabsTrigger value="igm" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Governança (IGM)
              </TabsTrigger>
              <TabsTrigger value="ods" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Sustentabilidade (ODS)
              </TabsTrigger>
              <TabsTrigger value="saneamento" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Saneamento
              </TabsTrigger>
              <TabsTrigger value="mapa" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Mapa
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
                        const goal2023 = (ods.data as any)?.[`${goalKey}_2023`] || 0;
                        const goal2024 = (ods.data as any)?.[`${goalKey}_2024`] || 0;
                        const goal2025 = (ods.data as any)?.[`${goalKey}_2025`] || 0;

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
                        <CardTitle className="text-lg">Água</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-blue-600">{(saneamento.data as any)?.agua_total?.toFixed(1) || 'S/D'}%</p>
                        <p className="text-sm text-gray-500 mt-2">Cobertura de Água</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-green-400">
                      <CardHeader>
                        <CardTitle className="text-lg">Esgoto</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-green-600">{(saneamento.data as any)?.esgoto_total?.toFixed(1) || 'S/D'}%</p>
                        <p className="text-sm text-gray-500 mt-2">Cobertura de Esgoto</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-yellow-400">
                      <CardHeader>
                        <CardTitle className="text-lg">Resíduos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-yellow-600">{(saneamento.data as any)?.residuos_coleta?.toFixed(1) || 'S/D'}%</p>
                        <p className="text-sm text-gray-500 mt-2">Coleta de Resíduos</p>
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
                            indicador: 'Água',
                            valor: (saneamento.data as any)?.agua_total || 0,
                          },
                          {
                            indicador: 'Esgoto',
                            valor: (saneamento.data as any)?.esgoto_total || 0,
                          },
                          {
                            indicador: 'Resíduos',
                            valor: (saneamento.data as any)?.residuos_coleta || 0,
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

            {/* ============ ABA MAPA ============ */}
            <TabsContent value="mapa" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização Geográfica</CardTitle>
                  <CardDescription>
                    {municipioSelecionado?.nome} - {selectedCorede && coredes.data?.find(c => c.id === selectedCorede)?.nome}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapView />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Mensagem quando nenhum município é selecionado */}
        {!selectedMunicipio && (
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
