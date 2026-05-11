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
  const [selectedRF, setSelectedRF] = useState<string | null>(null);
  const [selectedCorede, setSelectedCorede] = useState<number | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
  const [selectedMunicipioComparacao, setSelectedMunicipioComparacao] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('desenvolvimento');
  const [showComparacao, setShowComparacao] = useState(false);
  const [selectedODS, setSelectedODS] = useState<number>(1);
  const [selectedAnoODS, setSelectedAnoODS] = useState<number>(2025);

  // Queries - Filtros em Cascata
  const regioesFuncionais = trpc.portal.regioesFuncionais.useQuery();
  const coredes = trpc.portal.coredes.useQuery({ regiaoFuncionalId: selectedRF || undefined });
  const municipios = trpc.portal.municipios.useQuery({
    coredeId: selectedCorede || undefined,
    regiaoFuncionalId: selectedRF || undefined,
  });

  // Query para buscar todos os municípios (para seletor de comparação)
  const todosMunicipios = trpc.portal.todosMunicipios.useQuery();

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

  // Queries ODS e Saneamento
  const ods = trpc.portal.ods.useQuery({ 
    ano: selectedAnoODS,
    odsId: selectedODS,
  });
  const saneamento = trpc.portal.saneamento.useQuery({});

  // Queries para município de comparação
  const ideseComparacao = trpc.portal.idese.useQuery({ 
    municipioId: selectedMunicipioComparacao || undefined,
  }, { enabled: !!selectedMunicipioComparacao });

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

  const handleResetFiltros = () => {
    setSelectedRF(null);
    setSelectedCorede(null);
    setSelectedMunicipio(null);
    setSelectedMunicipioComparacao(null);
    setShowComparacao(false);
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

  const getMunicipioComparacaoLabel = () => {
    if (selectedMunicipioComparacao) {
      const mun = todosMunicipios.data?.find((m: any) => m.id === selectedMunicipioComparacao);
      return mun?.nome || 'Município de comparação';
    }
    return 'Nenhum município selecionado';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filtros em Cascata */}
      <div className="container py-8">
        <Card className="mb-8 border-l-4 border-l-[#f4b41a]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Filtros em Cascata</CardTitle>
              <CardDescription>Selecione a Região Funcional, Corede e Município para visualizar os dados</CardDescription>
            </div>
            <Button
              onClick={handleResetFiltros}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Limpar Filtros
            </Button>
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

        {/* Comparação de Municípios */}
        <Card className="mb-8 border-l-4 border-l-[#f4b41a]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Comparação de Municípios</CardTitle>
                <CardDescription>Selecione um segundo município para comparação</CardDescription>
              </div>
              <Button
                onClick={() => setShowComparacao(!showComparacao)}
                variant="outline"
                size="sm"
                className="bg-[#f4b41a] text-[#001f5c] border-[#f4b41a] hover:bg-[#e0a317]"
              >
                {showComparacao ? '- Ocultar' : '+ Adicionar'}
              </Button>
            </div>
          </CardHeader>
          {showComparacao && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Município Principal</label>
                  <div className="p-3 bg-gray-100 rounded border border-gray-300 font-medium">
                    {municipios.data?.find((m: any) => m.id === selectedMunicipio)?.nome || 'Nenhum selecionado'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Município para Comparação</label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedMunicipioComparacao?.toString() || ''}
                      onValueChange={(v) => setSelectedMunicipioComparacao(parseInt(v))}
                    >
                      <SelectTrigger className="border-2 border-gray-200 flex-1">
                        <SelectValue placeholder="Selecione um município" />
                      </SelectTrigger>
                      <SelectContent>
                        {todosMunicipios.data?.map((municipio: any) => (
                          <SelectItem key={municipio.id} value={municipio.id.toString()}>
                            {municipio.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedMunicipioComparacao && (
                      <Button
                        onClick={() => setSelectedMunicipioComparacao(null)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {selectedMunicipioComparacao && (
                <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200 text-sm">
                  <strong>Comparação ativa:</strong> {getMunicipioComparacaoLabel()}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Abas de Indicadores */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="desenvolvimento">Desenvolvimento Humano</TabsTrigger>
            <TabsTrigger value="governanca">Governança</TabsTrigger>
            <TabsTrigger value="sustentabilidade">Sustentabilidade</TabsTrigger>
            <TabsTrigger value="perfil">Perfil Municipal</TabsTrigger>
            <TabsTrigger value="ods">ODS</TabsTrigger>
            <TabsTrigger value="saneamento">Saneamento</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
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
                          <Legend />
                          <Bar dataKey="valor" fill="#001f5c" name="IDESE" />
                        </BarChart>
                      </ResponsiveContainer>
                      <DataTable
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          { key: 'valor', label: 'Valor', render: (value) => Number(value).toFixed(3) },
                          { key: 'fonte', label: 'Fonte' },
                        ]}
                        data={idese.data}
                        searchableFields={['ano']}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível</p>
                  )
                ) : (
                  <p className="text-gray-500">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Governança (IGM) */}
          <TabsContent value="governanca">
            <Card>
              <CardHeader>
                <CardTitle>Governança Municipal - IGM 2025</CardTitle>
                <CardDescription>Índice de Gestão Municipal | {getSelectedLocationLabel()}</CardDescription>
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
                          <Line type="monotone" dataKey="dimensao1" stroke="#001f5c" name="Gestão Fiscal" />
                          <Line type="monotone" dataKey="dimensao2" stroke="#f4b41a" name="Gestão de Pessoas" />
                          <Line type="monotone" dataKey="dimensao3" stroke="#00a86b" name="Índice Consolidado" />
                        </LineChart>
                      </ResponsiveContainer>
                      <DataTable
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          { key: 'dimensao1', label: 'Gestão Fiscal', render: (value) => Number(value).toFixed(2) },
                          { key: 'dimensao2', label: 'Gestão de Pessoas', render: (value) => Number(value).toFixed(2) },
                          { key: 'dimensao3', label: 'Índice Consolidado', render: (value) => Number(value).toFixed(2) },
                        ]}
                        data={igm.data}
                        searchableFields={['ano']}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível</p>
                  )
                ) : (
                  <p className="text-gray-500">Selecione uma Região Funcional para visualizar os dados</p>
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
                          <XAxis dataKey="classificacao" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="quantidade" fill="#001f5c" name="Quantidade de Municípios" />
                        </BarChart>
                      </ResponsiveContainer>
                      <DataTable
                        columns={[
                          { key: 'classificacao', label: 'Classificação' },
                          { key: 'quantidade', label: 'Quantidade' },
                        ]}
                        data={idsc.data}
                        searchableFields={['classificacao']}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível</p>
                  )
                ) : (
                  <p className="text-gray-500">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Perfil Municipal (Placeholder) */}
          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle>Perfil Municipal</CardTitle>
                <CardDescription>Dados demográficos e econômicos do IBGE | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: ODS (Placeholder) */}
          <TabsContent value="ods">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos de Desenvolvimento Sustentável (ODS)</CardTitle>
                <CardDescription>Dados dos 17 ODS | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Saneamento (Placeholder) */}
          <TabsContent value="saneamento">
            <Card>
              <CardHeader>
                <CardTitle>Saneamento</CardTitle>
                <CardDescription>Indicadores de água, esgoto e resíduos | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {saneamento.isLoading ? (
                  <p className="text-gray-500">Carregando dados...</p>
                ) : saneamento.data && saneamento.data.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-2 border-[#001f5c]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-[#001f5c]">Cobertura de Água</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-[#f4b41a]">
                            {saneamento.data[0]?.['Índice da População Total Atendida com Abastecimento de Água (%)'] || 'N/A'}%
                          </div>
                          <p className="text-xs text-gray-500 mt-2">População total atendida</p>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-[#001f5c]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-[#001f5c]">Cobertura de Esgoto</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-[#f4b41a]">
                            {saneamento.data[0]?.['Índice da População Total Atendida com Esgotamento Sanitário (%)'] || 'N/A'}%
                          </div>
                          <p className="text-xs text-gray-500 mt-2">População total atendida</p>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-[#001f5c]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-[#001f5c]">Coleta de Resíduos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-[#f4b41a]">
                            {saneamento.data[0]?.['Índice de Cobertura por Coleta de Resíduos Domiciliares (%)'] || 'N/A'}%
                          </div>
                          <p className="text-xs text-gray-500 mt-2">População coberta</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum dado disponível</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Segurança Pública */}
          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Segurança Pública</CardTitle>
                <CardDescription>Indicadores de violência e criminalidade | {getSelectedLocationLabel()}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRF ? (
                  violenciaGeral.isLoading ? (
                    <p className="text-gray-500">Carregando dados...</p>
                  ) : violenciaGeral.data && violenciaGeral.data.length > 0 ? (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={violenciaGeral.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="cvli" fill="#001f5c" name="CVLI" />
                          <Bar dataKey="homicidios" fill="#ff6b6b" name="Homicídios" />
                        </BarChart>
                      </ResponsiveContainer>
                      <DataTable
                        columns={[
                          { key: 'ano', label: 'Ano' },
                          { key: 'cvli', label: 'CVLI' },
                          { key: 'homicidios', label: 'Homicídios' },
                        ]}
                        data={violenciaGeral.data}
                        searchableFields={['ano']}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum dado disponível</p>
                  )
                ) : (
                  <p className="text-gray-500">Selecione uma Região Funcional para visualizar os dados</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
