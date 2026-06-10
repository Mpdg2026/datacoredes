'use client';

import { useState, useEffect } from 'react';
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
import { IPS } from './IPS';
import { DADOS_POPULACIONAIS } from '@/data/dados-populacionais';
import { X, Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function Portal() {
  // ============ ESTADO ============
  const [selectedRF, setSelectedRF] = useState<string | null>(null);
  const [selectedCorede, setSelectedCorede] = useState<number | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
  const [selectedMunicipioComparacao, setSelectedMunicipioComparacao] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('idhm');
  const [showComparacao, setShowComparacao] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filterODS, setFilterODS] = useState<'todos' | 'queda' | 'crescimento' | 'estavel'>('todos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Embedded population data - no external file needed
  const dadosPopulacionaisMap = DADOS_POPULACIONAIS.reduce((acc: any, item: any) => {
    acc[item.municipio] = item;
    return acc;
  }, {});

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

  // IDHM - Dados de Desenvolvimento Humano
  const idhm = trpc.portal.idhm.useQuery(
    { codigoIBGE: codigoIBGE || 0 },
    { enabled: !!codigoIBGE }
  );

  // Legislativo (TCE-RS) - Gestão Fiscal das Câmaras Municipais 2021-2025
  const legislativoTCERS = trpc.portal.legislativoTCERS.useQuery(
    { codigoIBGE: codigoIBGE?.toString() || '' },
    { enabled: !!codigoIBGE }
  );

  // Saúde (TCE-RS) - Índice de Aplicação em ASPS 2021-2025
  const saudeTCERS = trpc.portal.saudeTCERS.useQuery(
    { codigoIBGE: codigoIBGE?.toString() || '' },
    { enabled: !!codigoIBGE }
  );

  // Educação (TCE-RS) - Índice de Aplicação em Educação 2021-2025
  const educacaoTCERS = trpc.portal.educacaoTCERS.useQuery(
    { codigoIBGE: codigoIBGE?.toString() || '' },
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
    setSearchTerm('');
  };

  // Funcao para normalizar strings (remover acentos e converter para minusculas)
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar municipios baseado no termo de busca
  const municipiosFiltrados = todosMunicipios.data
    ? todosMunicipios.data.filter((m: any) =>
        normalizeString(m.nome).includes(normalizeString(searchTerm))
      )
    : [];

  // Funcao para selecionar municipio via busca
  const handleSelectMunicipioSearch = (municipio: any) => {
    setSelectedMunicipio(municipio.id);
    setSearchTerm('');
    setShowSearchDropdown(false);
    
    // Preencher automaticamente RF e Corede
    if (municipio.regiaoFuncional && municipio.corede) {
      setSelectedRF(municipio.regiaoFuncional);
      // Encontrar o ID do Corede na lista de coredes carregados
      const coredeEncontrado = coredes.data?.find((c: any) => c.nome === municipio.corede);
      if (coredeEncontrado) {
        setSelectedCorede(coredeEncontrado.id);
      }
    }
  };

  // ============ RENDERIZAÇÃO - FILTROS ============
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header com botão de menu mobile */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden sticky top-0 z-40">
        <h1 className="text-xl font-bold text-[#001f5c]">DataCoredes</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} className="text-[#001f5c]" />
        </button>
      </div>

      {/* Layout principal com Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6 overflow-y-auto" style={{ marginLeft: window.innerWidth >= 768 ? '256px' : '0' }}>
          <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#001f5c] mb-2"><span className="font-bold">Data</span><span className="font-normal">Coredes</span></h1>
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
            <TabsList className="flex w-full mb-8 bg-[#001f5c] overflow-x-auto">
              <TabsTrigger value="dados-populacionais" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Dados Populacionais
              </TabsTrigger>
              <TabsTrigger value="idhm" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Desenvolvimento Humano
              </TabsTrigger>
              <TabsTrigger value="igm" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Governança (IGM)
              </TabsTrigger>
              <TabsTrigger value="economia" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Economia
              </TabsTrigger>
              <TabsTrigger value="educacao" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Educação (TCE-RS)
              </TabsTrigger>
              <TabsTrigger value="saude" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Saúde (TCE-RS)
              </TabsTrigger>
              <TabsTrigger value="legislativo" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Legislativo (TCE-RS)
              </TabsTrigger>
              <TabsTrigger value="saneamento" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Saneamento
              </TabsTrigger>
              <TabsTrigger value="ods" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Sustentabilidade (ODS)
              </TabsTrigger>
              <TabsTrigger value="violencia" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Violência
              </TabsTrigger>
              <TabsTrigger value="violencia-mulher" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                Violência Contra a Mulher
              </TabsTrigger>
              <TabsTrigger value="ips" className="text-white data-[state=active]:bg-[#f4b41a] data-[state=active]:text-[#001f5c]">
                IPS
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

              {/* Fonte */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📊</span>
                    <span>Índice de Governança Municipal (IGM) 2025 — Conselho Federal de Administração (CFA)</span>
                    <a href="https://igm.cfa.org.br" target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                      🔗 IGM CFA
                    </a>
                  </div>
                </CardContent>
              </Card>
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
                <>
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

                  {/* Gráfico de Evolução dos ODS */}
                  {(() => {
                    // Proteção: verificar se dados existem
                    if (!ods.data || !nomeMunicipio) {
                      return (
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-center text-gray-500">Dados ODS não disponíveis para o município selecionado.</p>
                          </CardContent>
                        </Card>
                      );
                    }

                    const anos = (ods.data as any)?.anos || {};

                    // Verificar se há dados de anos
                    if (!anos['2023'] || !anos['2024'] || !anos['2025']) {
                      return (
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-center text-gray-500">Dados ODS incompletos para este município.</p>
                          </CardContent>
                        </Card>
                      );
                    }

                    // Preparar dados para o gráfico
                    const chartData = [
                      { ano: '2023', ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`ODS ${i + 1}`, anos['2023']?.goals?.[`goal${i + 1}`] || 0])) },
                      { ano: '2024', ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`ODS ${i + 1}`, anos['2024']?.goals?.[`goal${i + 1}`] || 0])) },
                      { ano: '2025', ...Object.fromEntries(Array.from({ length: 17 }, (_, i) => [`ODS ${i + 1}`, anos['2025']?.goals?.[`goal${i + 1}`] || 0])) },
                    ];

                    // Calcular status de cada ODS
                    const odsStatus = Array.from({ length: 17 }, (_, i) => {
                      const val2023 = anos['2023']?.goals?.[`goal${i + 1}`] || 0;
                      const val2025 = anos['2025']?.goals?.[`goal${i + 1}`] || 0;
                      if (val2025 > val2023) return 'crescimento';
                      if (val2025 < val2023) return 'queda';
                      return 'estavel';
                    });

                    // Cores para cada ODS
                    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b', '#8e44ad', '#27ae60', '#2980b9', '#d35400', '#c0392b', '#f1c40f', '#95a5a6'];

                    // Filtrar ODS a exibir
                    const odsToShow = Array.from({ length: 17 }, (_, i) => {
                      const status = odsStatus[i];
                      if (filterODS === 'todos') return true;
                      if (filterODS === 'queda') return status === 'queda';
                      if (filterODS === 'crescimento') return status === 'crescimento';
                      if (filterODS === 'estavel') return status === 'estavel';
                      return false;
                    });

                    return (
                      <Card>
                        <CardHeader>
                          <CardTitle>Evolução dos ODS — 2023 a 2025</CardTitle>
                          <CardDescription>{nomeMunicipio || 'Município não selecionado'}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Botões de Filtro */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant={filterODS === 'todos' ? 'default' : 'outline'}
                              onClick={() => setFilterODS('todos')}
                            >
                              Todos os ODS
                            </Button>
                            <Button
                              size="sm"
                              variant={filterODS === 'crescimento' ? 'default' : 'outline'}
                              onClick={() => setFilterODS('crescimento')}
                              className={filterODS === 'crescimento' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              ODS em crescimento
                            </Button>
                            <Button
                              size="sm"
                              variant={filterODS === 'queda' ? 'default' : 'outline'}
                              onClick={() => setFilterODS('queda')}
                              className={filterODS === 'queda' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              ODS em queda
                            </Button>
                            <Button
                              size="sm"
                              variant={filterODS === 'estavel' ? 'default' : 'outline'}
                              onClick={() => setFilterODS('estavel')}
                              className={filterODS === 'estavel' ? 'bg-gray-600 hover:bg-gray-700' : ''}
                            >
                              ODS estáveis
                            </Button>
                          </div>

                          {/* Gráfico de Linhas */}
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="ano" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toFixed(1) : value} />
                              <Legend />
                              {Array.from({ length: 17 }, (_, i) => (
                                odsToShow[i] && (
                                  <Line
                                    key={`ODS ${i + 1}`}
                                    type="monotone"
                                    dataKey={`ODS ${i + 1}`}
                                    stroke={colors[i]}
                                    dot={false}
                                    isAnimationActive={false}
                                  />
                                )
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </>
              )}

              {/* Fonte */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📊</span>
                    <span>Fonte: Índice de Desenvolvimento Sustentável das Cidades (IDSC) — Cidades Sustentáveis</span>
                    <a href="https://idsc.cidadessustentaveis.org.br/" target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                      🔗 IDSC
                    </a>
                  </div>
                </CardContent>
              </Card>
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

              {/* Fonte */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📊</span>
                    <span>Fonte: Sistema Nacional de Informações sobre Saneamento (SNIS) / Água e Saneamento</span>
                    <a href="https://www.aguaesaneamento.org.br/municipios-e-saneamento/" target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                      🔗 SNIS
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ ABA ECONOMIA ============ */}
            <TabsContent value="economia" className="space-y-6">
              <Economia data={economiaCompleta.data || null} isLoading={economiaCompleta.isLoading} />

              {/* Fonte */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📊</span>
                    <span>Fonte: Instituto Brasileiro de Geografia e Estatística (IBGE)</span>
                    <a href="https://cidades.ibge.gov.br" target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                      🔗 IBGE Cidades
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ ABA VIOLÊNCIA ============ */}
            <TabsContent value="violencia" className="space-y-6">
              <Violencia codigoIBGE={codigoIBGE?.toString()} />
            </TabsContent>

            {/* ============ ABA VIOLÊNCIA CONTRA A MULHER ============ */}
            <TabsContent value="violencia-mulher" className="space-y-6">
              <ViolenciaMulher selectedMunicipio={codigoIBGE ? String(codigoIBGE) : undefined} nomeMunicipio={nomeMunicipio} selectedCorede={selectedCorede ? String(selectedCorede) : undefined} />
            </TabsContent>

            {/* ============ ABA IDHM ============ */}
            <TabsContent value="idhm" className="space-y-6">
              {idhm.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados IDHM...</p>
                  </CardContent>
                </Card>
              )}

              {idhm.data && (
                <>
                  {/* Cards de IDHM */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-t-4 border-t-blue-500">
                      <CardHeader>
                        <CardTitle className="text-lg">IDHM 1991</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-blue-600">{idhm.data.idhm_1991?.toFixed(3) || 'S/D'}</p>
                        <p className="text-sm text-gray-500 mt-2">Índice de Desenvolvimento Humano</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-green-500">
                      <CardHeader>
                        <CardTitle className="text-lg">IDHM 2000</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-green-600">{idhm.data.idhm_2000?.toFixed(3) || 'S/D'}</p>
                        <p className="text-sm text-gray-500 mt-2">Índice de Desenvolvimento Humano</p>
                      </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-yellow-500">
                      <CardHeader>
                        <CardTitle className="text-lg">IDHM 2010</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-4xl font-bold text-yellow-600">{idhm.data.idhm_2010?.toFixed(3) || 'S/D'}</p>
                        <p className="text-sm text-gray-500 mt-2">Índice de Desenvolvimento Humano</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Gráfico de Evolução */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do IDHM (1991-2010)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                          {
                            ano: '1991',
                            valor: idhm.data.idhm_1991 || 0,
                          },
                          {
                            ano: '2000',
                            valor: idhm.data.idhm_2000 || 0,
                          },
                          {
                            ano: '2010',
                            valor: idhm.data.idhm_2010 || 0,
                          },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis domain={[0, 1]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="valor" stroke="#f4b41a" strokeWidth={2} name="IDHM" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}

              {!idhm.data && !idhm.isLoading && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Dados não disponíveis para este município</p>
                  </CardContent>
                </Card>
              )}

              {idhm.error && (
                <Card className="border-red-500">
                  <CardContent className="pt-6">
                    <p className="text-center text-red-500">Erro ao carregar dados IDHM</p>
                  </CardContent>
                </Card>
              )}

              {/* Fonte */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📊</span>
                    <span>Fonte: Atlas do Desenvolvimento Humano no Brasil — Pnud Brasil, Ipea e FJP, 2022</span>
                    <a href="https://atlasbrasil.org.br" target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                      🔗 Atlas Brasil
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============ ABA IPS ============ */}
            <TabsContent value="ips" className="space-y-6">
              <IPS codigoIBGE={codigoIBGE ? String(codigoIBGE) : undefined} nomeMunicipio={nomeMunicipio} />
            </TabsContent>

            {/* ============ ABA DADOS POPULACIONAIS ============ */}
            <TabsContent value="dados-populacionais" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados Populacionais - Censo IBGE 2010 e 2022</CardTitle>
                  <CardDescription>
                    Comparativo de população, distribuição por gênero e variação entre 2010 e 2022
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <span>📊</span>
                    <span>Fonte: IBGE — Censo Demográfico 2010 e 2022</span>
                    <a href="https://cidades.ibge.gov.br" target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-600 hover:underline">
                      🔗 IBGE Cidades
                    </a>
                  </div>
                </CardContent>
              </Card>

              {false && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados populacionais...</p>
                  </CardContent>
                </Card>
              )}

              {!nomeMunicipio && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Selecione um município para visualizar dados populacionais</p>
                  </CardContent>
                </Card>
              )}

              {nomeMunicipio && (
                <>
                  {(() => {
                    const dados = dadosPopulacionaisMap[nomeMunicipio];
                    if (!dados) {
                      return (
                        <Card className="border-dashed">
                          <CardContent className="pt-6">
                            <p className="text-center text-gray-500">Dados não disponíveis para este município</p>
                          </CardContent>
                        </Card>
                      );
                    }

                    const total2010 = dados.total2010;
                    const total2022 = dados.total2022;
                    const homens2010 = dados.homens2010;
                    const mulheres2010 = dados.mulheres2010;
                    const homens2022 = dados.homens2022;
                    const mulheres2022 = dados.mulheres2022;

                    // Calculate variation
                    let variacao = null;
                    let variacaoAbsoluta = 0;
                    if (total2010 && total2022) {
                      variacaoAbsoluta = total2022 - total2010;
                      variacao = (variacaoAbsoluta / total2010) * 100;
                    } else if (dados.variacaoPercent !== undefined) {
                      variacao = dados.variacaoPercent;
                      variacaoAbsoluta = dados.variacaoAbsoluta || 0;
                    }

                    return (
                      <>
                        {/* Cards de Comparação */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-t-4 border-t-blue-500">
                            <CardHeader>
                              <CardTitle className="text-lg">Censo 2010</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {total2010 ? (
                                <>
                                  <div>
                                    <p className="text-sm text-gray-600">População Total</p>
                                    <p className="text-3xl font-bold text-blue-600">{total2010.toLocaleString('pt-BR')}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 pt-2">
                                    <div>
                                      <p className="text-sm text-gray-600">Homens</p>
                                      <p className="text-lg font-semibold">{homens2010?.toLocaleString('pt-BR') || '—'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Mulheres</p>
                                      <p className="text-lg font-semibold">{mulheres2010?.toLocaleString('pt-BR') || '—'}</p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <p className="text-gray-500">— Não disponível</p>
                              )}
                            </CardContent>
                          </Card>

                          <Card className="border-t-4 border-t-green-500">
                            <CardHeader>
                              <CardTitle className="text-lg">Censo 2022</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {total2022 ? (
                                <>
                                  <div>
                                    <p className="text-sm text-gray-600">População Total</p>
                                    <p className="text-3xl font-bold text-green-600">{total2022.toLocaleString('pt-BR')}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 pt-2">
                                    <div>
                                      <p className="text-sm text-gray-600">Homens</p>
                                      <p className="text-lg font-semibold">{homens2022?.toLocaleString('pt-BR') || '—'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Mulheres</p>
                                      <p className="text-lg font-semibold">{mulheres2022?.toLocaleString('pt-BR') || '—'}</p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <p className="text-gray-500">— Não disponível</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Variação */}
                        {variacao !== null && (
                          <Card className={`border-t-4 ${
                            variacaoAbsoluta > 0 ? 'border-t-green-500' : variacaoAbsoluta < 0 ? 'border-t-red-500' : 'border-t-gray-500'
                          }`}>
                            <CardHeader>
                              <CardTitle className="text-lg">Variação 2010-2022</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className={`text-4xl font-bold ${
                                variacaoAbsoluta > 0 ? 'text-green-600' : variacaoAbsoluta < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {variacaoAbsoluta > 0 ? '+' : ''}{variacao.toFixed(2)}%
                              </p>
                              <p className={`text-sm mt-2 ${
                                variacaoAbsoluta > 0 ? 'text-green-600' : variacaoAbsoluta < 0 ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {variacaoAbsoluta > 0 ? 'Crescimento' : variacaoAbsoluta < 0 ? 'Redução' : 'População estável'} de {Math.abs(Math.round(variacaoAbsoluta))?.toLocaleString('pt-BR')} habitantes
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Gráfico de Evolução */}
                        {total2010 && total2022 && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Evolução Populacional (2010-2022)</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={[
                                  {
                                    ano: '2010',
                                    total: total2010,
                                    homens: homens2010 || 0,
                                    mulheres: mulheres2010 || 0,
                                  },
                                  {
                                    ano: '2022',
                                    total: total2022,
                                    homens: homens2022 || 0,
                                    mulheres: mulheres2022 || 0,
                                  },
                                ]}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="ano" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="homens" fill="#3b82f6" name="Homens" />
                                  <Bar dataKey="mulheres" fill="#ec4899" name="Mulheres" />
                                </BarChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        )}

                        {/* Nota especial para Pinto Bandeira */}
                        {nomeMunicipio === 'Pinto Bandeira' && !total2010 && (
                          <Card className="bg-yellow-50 border-yellow-200">
                            <CardContent className="pt-6">
                              <p className="text-sm text-yellow-800">
                                <strong>ℹ️ Nota:</strong> Pinto Bandeira (RS) foi emancipado de Bento Gonçalves em 2013 e não consta no Censo 2010.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </TabsContent>

            {/* ============ ABA SAÚDE (TCE-RS) ============ */}
            <TabsContent value="saude" className="space-y-6">
              {saudeTCERS.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados de Saúde...</p>
                  </CardContent>
                </Card>
              )}

              {saudeTCERS.error && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <p className="text-center text-red-600">Erro ao carregar dados de Saúde</p>
                  </CardContent>
                </Card>
              )}

              {!selectedMunicipio && (
                <Card className="border-dashed">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-lg text-gray-500">Selecione um município para visualizar dados de Saúde</p>
                  </CardContent>
                </Card>
              )}

              {saudeTCERS.data && (
                <>
                  {/* Cards de Índices por Ano */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[2021, 2022, 2023, 2024, 2025].map((ano) => {
                      const indice = saudeTCERS.data?.indices?.[ano.toString()];
                      const atingeMinimo = indice !== null && indice !== undefined && indice >= 15;
                      return (
                        <Card key={ano} className={`border-t-4 ${
                          atingeMinimo ? 'border-t-green-500' : 'border-t-red-500'
                        }`}>
                          <CardHeader>
                            <CardTitle className="text-sm">{ano}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-3xl font-bold ${
                              atingeMinimo ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {indice !== null && indice !== undefined ? indice.toFixed(2) : '—'}%
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              {atingeMinimo ? '✅ Acima' : '⚠️ Abaixo'} de 15%
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Card de Variação */}
                  {saudeTCERS.data?.indices?.['2021'] !== null && saudeTCERS.data?.indices?.['2025'] !== null && (
                    <Card className={`border-t-4 ${
                      (saudeTCERS.data.indices['2025'] - saudeTCERS.data.indices['2021']) > 0 ? 'border-t-green-500' : 'border-t-red-500'
                    }`}>
                      <CardHeader>
                        <CardTitle>Variação 2021-2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-4xl font-bold ${
                          (saudeTCERS.data.indices['2025'] - saudeTCERS.data.indices['2021']) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(saudeTCERS.data.indices['2025'] - saudeTCERS.data.indices['2021']) > 0 ? '+' : ''}
                          {(saudeTCERS.data.indices['2025'] - saudeTCERS.data.indices['2021']).toFixed(2)} pp
                        </p>
                        <p className="text-sm text-gray-600 mt-2">Pontos percentuais</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Gráfico de Evolução */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do Índice de Aplicação em ASPS (2021-2025)</CardTitle>
                      <CardDescription>
                        Linha de referência: 15% (mínimo constitucional - EC 29/2000)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                          {
                            ano: '2021',
                            indice: saudeTCERS.data?.indices?.['2021'] || null,
                            minimo: 15,
                          },
                          {
                            ano: '2022',
                            indice: saudeTCERS.data?.indices?.['2022'] || null,
                            minimo: 15,
                          },
                          {
                            ano: '2023',
                            indice: saudeTCERS.data?.indices?.['2023'] || null,
                            minimo: 15,
                          },
                          {
                            ano: '2024',
                            indice: saudeTCERS.data?.indices?.['2024'] || null,
                            minimo: 15,
                          },
                          {
                            ano: '2025',
                            indice: saudeTCERS.data?.indices?.['2025'] || null,
                            minimo: 15,
                          },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="indice"
                            stroke="#3b82f6"
                            name="Índice de Aplicação em ASPS"
                            connectNulls
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="minimo"
                            stroke="#ef4444"
                            name="Mínimo Constitucional (15%)"
                            strokeDasharray="5 5"
                            connectNulls
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Fonte */}
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-700">
                        <strong>📊 Fonte:</strong> Tribunal de Contas do Estado do Rio Grande do Sul (TCE-RS) — Índice de Aplicação em ASPS (Ações e Serviços Públicos de Saúde)
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Referência Legal:</strong> Emenda Constitucional nº 29/2000 - Mínimo de 15% da receita líquida de impostos e transferências
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <a 
                          href="https://www.tce.rs.gov.br" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🔗 www.tce.rs.gov.br
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* ============ ABA LEGISLATIVO (TCE-RS) ============ */}
            <TabsContent value="legislativo" className="space-y-6">
              {legislativoTCERS.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados de Legislativo...</p>
                  </CardContent>
                </Card>
              )}

              {legislativoTCERS.error && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <p className="text-center text-red-600">Erro ao carregar dados de Legislativo</p>
                  </CardContent>
                </Card>
              )}

              {!selectedMunicipio && (
                <Card className="border-dashed">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-lg text-gray-500">Selecione um município para visualizar dados de Legislativo</p>
                  </CardContent>
                </Card>
              )}

              {legislativoTCERS.data && (
                <>
                  {/* Cards de Índices por Ano */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[2021, 2022, 2023, 2024, 2025].map((ano) => {
                      const dados = legislativoTCERS.data?.dados?.[ano.toString()];
                      const pctGastos = dados?.pct_gastos;
                      const atingeLimite = pctGastos !== null && pctGastos !== undefined && pctGastos <= 6;
                      return (
                        <Card key={ano} className={`border-t-4 ${
                          atingeLimite ? 'border-t-green-500' : 'border-t-red-500'
                        }`}>
                          <CardHeader>
                            <CardTitle className="text-sm">{ano}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-3xl font-bold ${
                              atingeLimite ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {pctGastos !== null && pctGastos !== undefined ? pctGastos.toFixed(2) : '—'}%
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              {atingeLimite ? '✅ Dentro' : '⚠️ Acima'} de 6%
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Card de Variação */}
                  {legislativoTCERS.data?.dados?.['2021'] !== null && legislativoTCERS.data?.dados?.['2025'] !== null && (
                    <Card className={`border-t-4 ${
                      (legislativoTCERS.data.dados['2025'].pct_gastos - legislativoTCERS.data.dados['2021'].pct_gastos) < 0 ? 'border-t-green-500' : 'border-t-red-500'
                    }`}>
                      <CardHeader>
                        <CardTitle>Variação 2021-2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-4xl font-bold ${
                          (legislativoTCERS.data.dados['2025'].pct_gastos - legislativoTCERS.data.dados['2021'].pct_gastos) < 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(legislativoTCERS.data.dados['2025'].pct_gastos - legislativoTCERS.data.dados['2021'].pct_gastos) < 0 ? '' : '+'}
                          {(legislativoTCERS.data.dados['2025'].pct_gastos - legislativoTCERS.data.dados['2021'].pct_gastos).toFixed(2)} pp
                        </p>
                        <p className="text-sm text-gray-600 mt-2">Pontos percentuais (redução é favorável)</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Card de Análise LRF */}
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle>Análise LRF</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-blue-700">
                        {legislativoTCERS.data?.dados?.['2025']?.analise_lrf === 'S' ? '✅ Concluída' : '⚠️ Não Concluída'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">Status da Análise de Conformidade com a Lei de Responsabilidade Fiscal</p>
                    </CardContent>
                  </Card>

                  {/* Gráfico de Evolução */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do Índice de Gastos Totais / RCL (2021-2025)</CardTitle>
                      <CardDescription>
                        Linha de referência: 6% (limite constitucional - art. 29-A da CF)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                          {
                            ano: '2021',
                            pctGastos: legislativoTCERS.data?.dados?.['2021']?.pct_gastos || null,
                            limite: 6,
                          },
                          {
                            ano: '2022',
                            pctGastos: legislativoTCERS.data?.dados?.['2022']?.pct_gastos || null,
                            limite: 6,
                          },
                          {
                            ano: '2023',
                            pctGastos: legislativoTCERS.data?.dados?.['2023']?.pct_gastos || null,
                            limite: 6,
                          },
                          {
                            ano: '2024',
                            pctGastos: legislativoTCERS.data?.dados?.['2024']?.pct_gastos || null,
                            limite: 6,
                          },
                          {
                            ano: '2025',
                            pctGastos: legislativoTCERS.data?.dados?.['2025']?.pct_gastos || null,
                            limite: 6,
                          },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="pctGastos"
                            stroke="#3b82f6"
                            name="% Gastos Totais / RCL"
                            connectNulls
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="limite"
                            stroke="#ef4444"
                            name="Limite Constitucional (6%)"
                            strokeDasharray="5 5"
                            connectNulls
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Fonte */}
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-700">
                        <strong>📊 Fonte:</strong> Tribunal de Contas do Estado do Rio Grande do Sul (TCE-RS) — Gestão Fiscal do Poder Legislativo Municipal
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Referência Legal:</strong> Art. 29-A da Constituição Federal — Limite de 6% da RCL para gastos totais da Câmara Municipal
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <a 
                          href="https://www.tce.rs.gov.br" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🔗 www.tce.rs.gov.br
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* ============ ABA EDUCAÇÃO (TCE-RS) ============ */}
            <TabsContent value="educacao" className="space-y-6">
              {educacaoTCERS.isLoading && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Carregando dados de Educação...</p>
                  </CardContent>
                </Card>
              )}

              {educacaoTCERS.error && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <p className="text-center text-red-600">Erro ao carregar dados de Educação</p>
                  </CardContent>
                </Card>
              )}

              {!selectedMunicipio && (
                <Card className="border-dashed">
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-lg text-gray-500">Selecione um município para visualizar dados de Educação</p>
                  </CardContent>
                </Card>
              )}

              {educacaoTCERS.data && (
                <>
                  {/* Cards de Índices por Ano */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[2021, 2022, 2023, 2024, 2025].map((ano) => {
                      const indice = educacaoTCERS.data?.indices?.[ano.toString()];
                      const atingeMinimo = indice !== null && indice !== undefined && indice >= 25;
                      return (
                        <Card key={ano} className={`border-t-4 ${
                          atingeMinimo ? 'border-t-green-500' : 'border-t-red-500'
                        }`}>
                          <CardHeader>
                            <CardTitle className="text-sm">{ano}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className={`text-3xl font-bold ${
                              atingeMinimo ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {indice !== null && indice !== undefined ? indice.toFixed(2) : '—'}%
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              {atingeMinimo ? '✅ Acima' : '⚠️ Abaixo'} de 25%
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Card de Variação */}
                  {educacaoTCERS.data?.indices?.['2021'] !== null && educacaoTCERS.data?.indices?.['2025'] !== null && (
                    <Card className={`border-t-4 ${
                      (educacaoTCERS.data.indices['2025'] - educacaoTCERS.data.indices['2021']) > 0 ? 'border-t-green-500' : 'border-t-red-500'
                    }`}>
                      <CardHeader>
                        <CardTitle>Variação 2021-2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-4xl font-bold ${
                          (educacaoTCERS.data.indices['2025'] - educacaoTCERS.data.indices['2021']) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(educacaoTCERS.data.indices['2025'] - educacaoTCERS.data.indices['2021']) > 0 ? '+' : ''}
                          {(educacaoTCERS.data.indices['2025'] - educacaoTCERS.data.indices['2021']).toFixed(2)} pp
                        </p>
                        <p className="text-sm text-gray-600 mt-2">Pontos percentuais</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Gráfico de Evolução */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do Índice de Aplicação em Educação (2021-2025)</CardTitle>
                      <CardDescription>
                        Linha de referência: 25% (mínimo constitucional)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                          {
                            ano: '2021',
                            indice: educacaoTCERS.data?.indices?.['2021'] || null,
                            minimo: 25,
                          },
                          {
                            ano: '2022',
                            indice: educacaoTCERS.data?.indices?.['2022'] || null,
                            minimo: 25,
                          },
                          {
                            ano: '2023',
                            indice: educacaoTCERS.data?.indices?.['2023'] || null,
                            minimo: 25,
                          },
                          {
                            ano: '2024',
                            indice: educacaoTCERS.data?.indices?.['2024'] || null,
                            minimo: 25,
                          },
                          {
                            ano: '2025',
                            indice: educacaoTCERS.data?.indices?.['2025'] || null,
                            minimo: 25,
                          },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="indice"
                            stroke="#3b82f6"
                            name="Índice de Aplicação"
                            connectNulls
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="minimo"
                            stroke="#ef4444"
                            name="Mínimo Constitucional (25%)"
                            strokeDasharray="5 5"
                            connectNulls
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Fonte */}
                  <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-700">
                        <strong>📊 Fonte:</strong> Tribunal de Contas do Estado do Rio Grande do Sul (TCE-RS) — Índice de Aplicação em Educação
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <a 
                          href="https://www.tce.rs.gov.br" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🔗 www.tce.rs.gov.br
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
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
      </div>
    </div>
  );
}
