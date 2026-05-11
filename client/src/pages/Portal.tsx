import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DataTable } from '@/components/DataTable';
import { MapView } from '@/components/Map';

export default function Portal() {
  const [selectedRF, setSelectedRF] = useState<string | null>(null);
  const [selectedCorede, setSelectedCorede] = useState<number | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('desenvolvimento');

  // Queries - Filtros em Cascata
  const regioesFuncionais = trpc.portal.regioesFuncionais.useQuery();
  const coredes = trpc.portal.coredes.useQuery({ regiaoFuncionalId: selectedRF || undefined });
  const municipios = trpc.portal.municipios.useQuery({
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });

  // Queries - Indicadores Temáticos (Reativas)
  const idese = trpc.portal.idese.useQuery({ 
    municipioId: selectedMunicipio || undefined,
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });
  const igm = trpc.portal.igm.useQuery({ 
    municipioId: selectedMunicipio || undefined,
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });
  const idsc = trpc.portal.idsc.useQuery({ 
    municipioId: selectedMunicipio || undefined,
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });
  const violenciaGeral = trpc.portal.violenciaGeral.useQuery({ 
    municipioId: selectedMunicipio || undefined,
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });
  const violenciaMulher = trpc.portal.violenciaMulher.useQuery({ 
    municipioId: selectedMunicipio || undefined,
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });

  // Handlers - Reset de filtros dependentes
  const handleRFChange = (rfId: string) => {
    setSelectedRF(rfId);
    setSelectedCorede(null);
    setSelectedMunicipio(null);
  };

  const handleCoredeChange = (coredeId: number) => {
    setSelectedCorede(coredeId);
    setSelectedMunicipio(null);
  };

  // Helper para exibir localidade selecionada
  const getSelectedLocationLabel = () => {
    if (selectedMunicipio) {
      const mun = municipios.data?.find((m: any) => m.id === selectedMunicipio);
      return mun?.nome || 'Município selecionado';
    }
    if (selectedCorede) {
      const cor = coredes.data?.find(c => c.id === selectedCorede);
      return cor?.nome || 'Corede selecionado';
    }
    if (selectedRF) {
      return `Região Funcional ${selectedRF}`;
    }
    return 'Nenhuma localidade selecionada';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#001f5c] text-white shadow-lg">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#f4b41a] rounded-full flex items-center justify-center">
              <span className="text-[#001f5c] font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Portal Coredes em Números</h1>
              <p className="text-gray-300">Indicadores Socioeconômicos do Rio Grande do Sul</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros em Cascata */}
      <div className="container py-8">
        <Card className="mb-8 border-l-4 border-l-[#f4b41a]">
          <CardHeader>
            <CardTitle>Filtros em Cascata</CardTitle>
            <CardDescription>Selecione a Região Funcional, Corede e Município para visualizar os dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Região Funcional */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Região Funcional</label>
                <Select value={selectedRF || ''} onValueChange={(v) => handleRFChange(v)}>
                  <SelectTrigger className="border-2 border-gray-200">
                    <SelectValue placeholder="Selecione uma RF" />
                  </SelectTrigger>
                  <SelectContent>
                    {regioesFuncionais.data?.map((rf) => (
                      <SelectItem key={rf.id} value={rf.id.toString()}>
                        {rf.codigo} - {rf.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Corede */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Corede</label>
                <Select
                  value={selectedCorede?.toString() || ''}
                  onValueChange={(v) => handleCoredeChange(parseInt(v))}
                  disabled={!selectedRF}
                >
                  <SelectTrigger className="border-2 border-gray-200">
                    <SelectValue placeholder={selectedRF ? 'Selecione um Corede' : 'Selecione uma RF primeiro'} />
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
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Município</label>
                <Select
                  value={selectedMunicipio?.toString() || ''}
                  onValueChange={(v) => setSelectedMunicipio(parseInt(v))}
                  disabled={!selectedCorede}
                >
                  <SelectTrigger className="border-2 border-gray-200">
                    <SelectValue placeholder={selectedCorede ? 'Selecione um Município' : 'Selecione um Corede primeiro'} />
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
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <strong>Localidade Selecionada:</strong> {getSelectedLocationLabel()}
            </div>
          </CardContent>
        </Card>

        {/* Abas de Indicadores */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="desenvolvimento">Desenvolvimento Humano</TabsTrigger>
            <TabsTrigger value="governanca">Governança</TabsTrigger>
            <TabsTrigger value="sustentabilidade">Sustentabilidade</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança Pública</TabsTrigger>
            <TabsTrigger value="violencia-mulher">Violência contra Mulher</TabsTrigger>
            <TabsTrigger value="mapa">Mapa</TabsTrigger>
          </TabsList>

          {/* Aba: Desenvolvimento Humano (IDESE) */}
          <TabsContent value="desenvolvimento">
            <Card>
              <CardHeader>
                <CardTitle>Desenvolvimento Humano - IDESE 2020</CardTitle>
                <CardDescription>Índice de Desenvolvimento Socioeconômico | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  idese.isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                  ) : idese.data && idese.data.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={idese.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="valor" fill="#f4b41a" name="IDESE" />
                        </BarChart>
                      </ResponsiveContainer>
                      <DataTable
                        data={idese.data}
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          {
                            key: 'valor',
                            label: 'Valor IDESE',
                            render: (value) => value?.toFixed(3) || '-',
                          },
                          { key: 'fonte', label: 'Fonte' },
                        ]}
                        title="Dados IDESE"
                        searchableFields={['fonte']}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível para a localidade selecionada</p>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Governança (IGM) */}
          <TabsContent value="governanca">
            <Card>
              <CardHeader>
                <CardTitle>Governança Municipal - IGM 2025</CardTitle>
                <CardDescription>Índice de Gestão Municipal (3 Dimensões) | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  igm.isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                  ) : igm.data && igm.data.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={igm.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="dimensao1" stroke="#001f5c" name="Finanças" strokeWidth={2} />
                          <Line type="monotone" dataKey="dimensao2" stroke="#f4b41a" name="Gestão" strokeWidth={2} />
                          <Line type="monotone" dataKey="dimensao3" stroke="#003d99" name="Desempenho" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                      <DataTable
                        data={igm.data}
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          {
                            key: 'dimensao1',
                            label: 'Finanças',
                            render: (value) => value?.toFixed(2) || '-',
                          },
                          {
                            key: 'dimensao2',
                            label: 'Gestão',
                            render: (value) => value?.toFixed(2) || '-',
                          },
                          {
                            key: 'dimensao3',
                            label: 'Desempenho',
                            render: (value) => value?.toFixed(2) || '-',
                          },
                          {
                            key: 'indiceConsolidado',
                            label: 'Índice Consolidado',
                            render: (value) => value?.toFixed(2) || '-',
                          },
                        ]}
                        title="Dados IGM 2025"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível para a localidade selecionada</p>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Sustentabilidade (IDSC) */}
          <TabsContent value="sustentabilidade">
            <Card>
              <CardHeader>
                <CardTitle>Sustentabilidade - IDSC 2023-2025</CardTitle>
                <CardDescription>Índice de Desenvolvimento Sustentável das Cidades | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  idsc.isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                  ) : idsc.data && idsc.data.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={idsc.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Bar dataKey="pontuacao" fill="#001f5c" name="Pontuação IDSC" />
                        </BarChart>
                      </ResponsiveContainer>
                      <DataTable
                        data={idsc.data}
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          {
                            key: 'pontuacao',
                            label: 'Pontuação',
                            render: (value) => value?.toFixed(1) || '-',
                          },
                          { key: 'classificacao', label: 'Classificação' },
                        ]}
                        title="Dados IDSC 2023-2025"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível para a localidade selecionada</p>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Segurança Pública */}
          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança Pública - Violência Geral</CardTitle>
                <CardDescription>CVLI e Homicídios (2020-2026) | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  violenciaGeral.isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                  ) : violenciaGeral.data && violenciaGeral.data.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={violenciaGeral.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="cvli" stroke="#d32f2f" name="CVLI" strokeWidth={2} />
                          <Line type="monotone" dataKey="homicidios" stroke="#f57c00" name="Homicídios" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                      <DataTable
                        data={violenciaGeral.data}
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          { key: 'cvli', label: 'CVLI' },
                          { key: 'homicidios', label: 'Homicídios' },
                        ]}
                        title="Dados de Violência Geral"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível para a localidade selecionada</p>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Violência contra a Mulher */}
          <TabsContent value="violencia-mulher">
            <Card>
              <CardHeader>
                <CardTitle>Violência contra a Mulher</CardTitle>
                <CardDescription>Série Histórica 2020-2026 | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  violenciaMulher.isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                  ) : violenciaMulher.data && violenciaMulher.data.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={violenciaMulher.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="violenciaFisica" stroke="#d32f2f" name="Violência Física" strokeWidth={2} />
                          <Line type="monotone" dataKey="violenciaSexual" stroke="#f57c00" name="Violência Sexual" strokeWidth={2} />
                          <Line type="monotone" dataKey="femicidio" stroke="#c2185b" name="Femicídio" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                      <DataTable
                        data={violenciaMulher.data}
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          { key: 'violenciaFisica', label: 'Violência Física' },
                          { key: 'violenciaSexual', label: 'Violência Sexual' },
                          { key: 'femicidio', label: 'Femicídio' },
                        ]}
                        title="Dados de Violência contra a Mulher"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível para a localidade selecionada</p>
                  )
                ) : (
                  <p className="text-gray-500 text-center py-8">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Mapa */}
          <TabsContent value="mapa">
            <Card>
              <CardHeader>
                <CardTitle>Visualização Geográfica</CardTitle>
                <CardDescription>Mapa interativo dos indicadores | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-xs font-semibold text-gray-600">Região Funcional</p>
                        <p className="text-sm font-bold text-blue-900">{selectedRF}</p>
                      </div>
                      {selectedCorede && (
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <p className="text-xs font-semibold text-gray-600">Corede</p>
                          <p className="text-sm font-bold text-green-900">{coredes.data?.find(c => c.id === selectedCorede)?.nome || '-'}</p>
                        </div>
                      )}
                      {selectedMunicipio && (
                        <div className="bg-purple-50 p-3 rounded border border-purple-200">
                          <p className="text-xs font-semibold text-gray-600">Município</p>
                          <p className="text-sm font-bold text-purple-900">{municipios.data?.find((m: any) => m.id === selectedMunicipio)?.nome || '-'}</p>
                        </div>
                      )}
                    </div>
                    <MapView
                      initialCenter={{ lat: -30.0346, lng: -51.2177 }}
                      initialZoom={8}
                      className="h-[600px] rounded-lg border border-gray-200"
                      onMapReady={(map) => {
                        console.log('Mapa pronto para visualizar indicadores da região:', selectedRF);
                      }}
                    />
                    <div className="bg-amber-50 p-4 rounded border border-amber-200">
                      <p className="text-sm text-amber-900">
                        <strong>Informação:</strong> O mapa exibe a localização geográfica da região selecionada. 
                        Use os controles de zoom para explorar diferentes áreas e visualizar os municípios.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Selecione uma Região Funcional para visualizar o mapa</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
