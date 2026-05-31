import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface ViolenciaMulherProps {
  data?: any;
  isLoading?: boolean;
  selectedMunicipio?: number | null;
  selectedCorede?: number | null;
}

export function ViolenciaMulher({ data, isLoading, selectedMunicipio, selectedCorede }: ViolenciaMulherProps) {
  const [activeTab, setActiveTab] = useState<'indicadores' | 'locais'>('indicadores');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'deam' | 'salas' | 'pppm'>('deam');
  const [locaisData, setLocaisData] = useState<any>(null);

  // Carregar dados de locais de atendimento
  useEffect(() => {
    fetch('/violencia-mulher-consolidado.json')
      .then(res => res.json())
      .then(data => setLocaisData(data))
      .catch(err => console.error('Erro ao carregar dados:', err));
  }, []);

  // Dados consolidados do RS (fixo, sempre visível)
  const consolidatedData = useMemo(() => {
    return {
      indicators: {
        2020: { 'Feminicídio Consumado': 80, 'Feminicídio Tentado': 318, 'Lesão Corporal': 18901, 'Ameaça': 33756, 'Estupro': 2246, 'Total Geral': 55301 },
        2021: { 'Feminicídio Consumado': 61, 'Feminicídio Tentado': 255, 'Lesão Corporal': 18007, 'Ameaça': 32762, 'Estupro': 2455, 'Total Geral': 53575 },
        2022: { 'Feminicídio Consumado': 118, 'Feminicídio Tentado': 263, 'Lesão Corporal': 18197, 'Ameaça': 31389, 'Estupro': 2783, 'Total Geral': 52743 },
        2023: { 'Feminicídio Consumado': 67, 'Feminicídio Tentado': 323, 'Lesão Corporal': 19903, 'Ameaça': 33453, 'Estupro': 2820, 'Total Geral': 56499 },
        2024: { 'Feminicídio Consumado': 80, 'Feminicídio Tentado': 237, 'Lesão Corporal': 18747, 'Ameaça': 31523, 'Estupro': 2522, 'Total Geral': 53101 },
        2025: { 'Feminicídio Consumado': 29, 'Feminicídio Tentado': 236, 'Lesão Corporal': 18501, 'Ameaça': 31975, 'Estupro': 2459, 'Total Geral': 53278 },
        2026: { 'Feminicídio Consumado': 9, 'Feminicídio Tentado': 99, 'Lesão Corporal': 6390, 'Ameaça': 11275, 'Estupro': 690, 'Total Geral': 18483 },
      },
    };
  }, []);

  // Preparar dados para gráfico de evolução (RS)
  const chartData = useMemo(() => {
    const indicators = consolidatedData.indicators;
    return [
      { year: '2020', 'Feminicídio Consumado': indicators[2020]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2020]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2020]['Lesão Corporal'], 'Ameaça': indicators[2020]['Ameaça'], 'Estupro': indicators[2020]['Estupro'] },
      { year: '2021', 'Feminicídio Consumado': indicators[2021]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2021]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2021]['Lesão Corporal'], 'Ameaça': indicators[2021]['Ameaça'], 'Estupro': indicators[2021]['Estupro'] },
      { year: '2022', 'Feminicídio Consumado': indicators[2022]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2022]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2022]['Lesão Corporal'], 'Ameaça': indicators[2022]['Ameaça'], 'Estupro': indicators[2022]['Estupro'] },
      { year: '2023', 'Feminicídio Consumado': indicators[2023]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2023]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2023]['Lesão Corporal'], 'Ameaça': indicators[2023]['Ameaça'], 'Estupro': indicators[2023]['Estupro'] },
      { year: '2024', 'Feminicídio Consumado': indicators[2024]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2024]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2024]['Lesão Corporal'], 'Ameaça': indicators[2024]['Ameaça'], 'Estupro': indicators[2024]['Estupro'] },
      { year: '2025', 'Feminicídio Consumado': indicators[2025]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2025]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2025]['Lesão Corporal'], 'Ameaça': indicators[2025]['Ameaça'], 'Estupro': indicators[2025]['Estupro'] },
      { year: '2026*', 'Feminicídio Consumado': indicators[2026]['Feminicídio Consumado'], 'Feminicídio Tentado': indicators[2026]['Feminicídio Tentado'], 'Lesão Corporal': indicators[2026]['Lesão Corporal'], 'Ameaça': indicators[2026]['Ameaça'], 'Estupro': indicators[2026]['Estupro'] },
    ];
  }, [consolidatedData]);

  // Calcular variações (RS)
  const variations = useMemo(() => {
    const indicators = consolidatedData.indicators;
    const current = indicators[2026];
    const previous = indicators[2025];

    return {
      'Feminicídio Consumado': ((current['Feminicídio Consumado'] - previous['Feminicídio Consumado']) / previous['Feminicídio Consumado'] * 100).toFixed(1),
      'Feminicídio Tentado': ((current['Feminicídio Tentado'] - previous['Feminicídio Tentado']) / previous['Feminicídio Tentado'] * 100).toFixed(1),
      'Lesão Corporal': ((current['Lesão Corporal'] - previous['Lesão Corporal']) / previous['Lesão Corporal'] * 100).toFixed(1),
      'Ameaça': ((current['Ameaça'] - previous['Ameaça']) / previous['Ameaça'] * 100).toFixed(1),
      'Estupro': ((current['Estupro'] - previous['Estupro']) / previous['Estupro'] * 100).toFixed(1),
    };
  }, [consolidatedData]);

  // Dados para gráfico de composição (ano recente - RS)
  const compositionData = useMemo(() => {
    const indicators = consolidatedData.indicators[2026];
    return [
      { name: 'Feminicídio Consumado', value: indicators['Feminicídio Consumado'] },
      { name: 'Feminicídio Tentado', value: indicators['Feminicídio Tentado'] },
      { name: 'Lesão Corporal', value: indicators['Lesão Corporal'] },
      { name: 'Ameaça', value: indicators['Ameaça'] },
      { name: 'Estupro', value: indicators['Estupro'] },
    ];
  }, [consolidatedData]);

  const COLORS = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  // Filtrar dados de locais
  const filteredLocais = useMemo(() => {
    if (!locaisData) return [];
    
    let data = [];
    if (selectedCategory === 'deam') {
      data = locaisData.locais_atendimento?.deam || [];
    } else if (selectedCategory === 'salas') {
      data = locaisData.locais_atendimento?.salas_lilias || [];
    } else {
      data = locaisData.locais_atendimento?.pppm || [];
    }
    
    return data.filter((item: any) => 
      item.municipio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locaisData, selectedCategory, searchTerm]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Carregando dados...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Destaque de Emergência */}
      <Card className="border-l-4 border-l-red-600 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Em caso de emergência:</p>
              <p className="text-red-800">
                <span className="font-bold">190</span> - Brigada Militar | <span className="font-bold">180</span> - Central de Atendimento à Mulher
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('indicadores')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'indicadores'
              ? 'border-b-yellow-500 text-yellow-600'
              : 'border-b-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Indicadores
        </button>
        <button
          onClick={() => setActiveTab('locais')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'locais'
              ? 'border-b-yellow-500 text-yellow-600'
              : 'border-b-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Locais de Atendimento
        </button>
      </div>

      {/* SEÇÃO 1: INDICADORES */}
      {activeTab === 'indicadores' && (
        <div className="space-y-8">
          {/* ========== BLOCO 1: SÉRIE HISTÓRICA DO RS (FIXO) ========== */}
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Série Histórica — Rio Grande do Sul</h2>
              <p className="text-sm text-blue-700">Dados consolidados do Estado (2020-2026) — independente de filtros municipais</p>
            </div>

            {/* Cards de Indicadores Principais (RS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="border-t-4 border-t-red-600">
                <CardHeader>
                  <CardTitle className="text-sm">Feminicídio Consumado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">{consolidatedData.indicators[2026]['Feminicídio Consumado']}</p>
                  <p className={`text-sm mt-2 ${variations['Feminicídio Consumado'].startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                    {variations['Feminicídio Consumado']}% vs 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-orange-600">
                <CardHeader>
                  <CardTitle className="text-sm">Feminicídio Tentado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600">{consolidatedData.indicators[2026]['Feminicídio Tentado']}</p>
                  <p className={`text-sm mt-2 ${variations['Feminicídio Tentado'].startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                    {variations['Feminicídio Tentado']}% vs 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-yellow-600">
                <CardHeader>
                  <CardTitle className="text-sm">Lesão Corporal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">{consolidatedData.indicators[2026]['Lesão Corporal'].toLocaleString()}</p>
                  <p className={`text-sm mt-2 ${variations['Lesão Corporal'].startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                    {variations['Lesão Corporal']}% vs 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-green-600">
                <CardHeader>
                  <CardTitle className="text-sm">Ameaça</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{consolidatedData.indicators[2026]['Ameaça'].toLocaleString()}</p>
                  <p className={`text-sm mt-2 ${variations['Ameaça'].startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                    {variations['Ameaça']}% vs 2025
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-600">
                <CardHeader>
                  <CardTitle className="text-sm">Estupro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{consolidatedData.indicators[2026]['Estupro']}</p>
                  <p className={`text-sm mt-2 ${variations['Estupro'].startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                    {variations['Estupro']}% vs 2025
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Evolução (RS) */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Evolução de Indicadores (2020-2026)</CardTitle>
                <CardDescription>Série histórica de violência contra a mulher no RS</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Feminicídio Consumado" stroke="#dc2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="Feminicídio Tentado" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="Lesão Corporal" stroke="#eab308" strokeWidth={2} />
                    <Line type="monotone" dataKey="Ameaça" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="Estupro" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Composição + Tabela Detalhada (RS) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Composição de Crimes (2026 - Parcial)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={compositionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {compositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indicadores Detalhados</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-2">Indicador</th>
                        <th className="text-right py-2 px-2">2025</th>
                        <th className="text-right py-2 px-2">2026*</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Feminicídio Consumado', 'Feminicídio Tentado', 'Lesão Corporal', 'Ameaça', 'Estupro'].map((indicator) => (
                        <tr key={indicator} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2">{indicator}</td>
                          <td className="text-right py-2 px-2">{(consolidatedData.indicators[2025] as any)[indicator].toLocaleString()}</td>
                          <td className="text-right py-2 px-2">{(consolidatedData.indicators[2026] as any)[indicator].toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Tabela Completa de Todos os Anos (RS) */}
            <Card>
              <CardHeader>
                <CardTitle>Série Histórica Completa (2020-2026)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-2">Indicador</th>
                      <th className="text-right py-2 px-2">2020</th>
                      <th className="text-right py-2 px-2">2021</th>
                      <th className="text-right py-2 px-2">2022</th>
                      <th className="text-right py-2 px-2">2023</th>
                      <th className="text-right py-2 px-2">2024</th>
                      <th className="text-right py-2 px-2">2025</th>
                      <th className="text-right py-2 px-2">2026*</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Feminicídio Consumado', 'Feminicídio Tentado', 'Lesão Corporal', 'Ameaça', 'Estupro', 'Total Geral'].map((indicator) => (
                      <tr key={indicator} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-semibold">{indicator}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2020] as any)[indicator]).toLocaleString()}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2021] as any)[indicator]).toLocaleString()}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2022] as any)[indicator]).toLocaleString()}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2023] as any)[indicator]).toLocaleString()}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2024] as any)[indicator]).toLocaleString()}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2025] as any)[indicator]).toLocaleString()}</td>
                        <td className="text-right py-2 px-2">{((consolidatedData.indicators[2026] as any)[indicator]).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <p className="text-xs text-blue-600 text-center mt-4">
              <strong>Fonte:</strong> SIP/PROCERGS — Observatório Estadual de Segurança Pública/SSP-RS. *2026 parcial (jan-abr).
            </p>
          </div>

          {/* ========== BLOCO 2: INDICADORES POR MUNICÍPIO/COREDE (DINÂMICO) ========== */}
          <div className="border-2 border-gray-300 bg-gray-50 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Indicadores por Município/COREDE</h2>
              <p className="text-sm text-gray-600">Dados locais — responde aos filtros hierárquicos</p>
            </div>

            {!selectedMunicipio && !selectedCorede ? (
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-700 font-semibold">
                    Selecione um município ou COREDE para visualizar os dados locais.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Dados Locais (em desenvolvimento)</CardTitle>
                  <CardDescription>Os dados municipais serão exibidos aqui quando disponíveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Filtro ativo: {selectedMunicipio ? 'Município' : 'COREDE'}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* SEÇÃO 2: LOCAIS DE ATENDIMENTO */}
      {activeTab === 'locais' && (
        <div className="space-y-6">
          {/* Filtros de Categoria */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('deam')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                selectedCategory === 'deam'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              DEAM (24)
            </button>
            <button
              onClick={() => setSelectedCategory('salas')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                selectedCategory === 'salas'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Salas das Margaridas (31)
            </button>
            <button
              onClick={() => setSelectedCategory('pppm')}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                selectedCategory === 'pppm'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              PPPM (12)
            </button>
          </div>

          {/* Busca */}
          <Input
            placeholder="Buscar por município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />

          {/* Tabela de Locais */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'deam' && 'DEAM - Delegacia Especializada no Atendimento à Mulher'}
                {selectedCategory === 'salas' && 'Salas das Margaridas - Plantão e Atendimento em Delegacias'}
                {selectedCategory === 'pppm' && 'PPPM - Posto Policial de Proteção à Mulher'}
              </CardTitle>
              <CardDescription>
                {selectedCategory === 'deam' && 'Total: 24 unidades'}
                {selectedCategory === 'salas' && 'Total: 31 unidades'}
                {selectedCategory === 'pppm' && 'Total: 12 unidades'}
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-2">Município</th>
                    <th className="text-left py-2 px-2">Telefone</th>
                    <th className="text-left py-2 px-2">Endereço</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocais.length > 0 ? (
                    filteredLocais.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2 font-semibold">{item.municipio}</td>
                        <td className="py-2 px-2">{item.telefone || '-'}</td>
                        <td className="py-2 px-2">{item.endereco || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 px-2 text-center text-gray-500">
                        {locaisData ? 'Nenhum resultado encontrado' : 'Carregando dados...'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Fonte */}
          <p className="text-xs text-gray-500 text-center">
            <strong>Fonte:</strong> SSP-RS — Secretaria da Segurança Pública do Rio Grande do Sul.
          </p>
        </div>
      )}
    </div>
  );
}
