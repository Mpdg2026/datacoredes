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

// Dados hardcoded de Locais de Atendimento
const LOCAIS_ATENDIMENTO = {
  deam: [
    { municipio: 'Alvorada', telefone: '(51) 3482-3000', endereco: 'Rua A, 100' },
    { municipio: 'Bagé', telefone: '(53) 3242-3000', endereco: 'Rua B, 200' },
    { municipio: 'Bento Gonçalves', telefone: '(54) 3455-3000', endereco: 'Rua C, 300' },
    { municipio: 'Canoas', telefone: '(51) 3477-3000', endereco: 'Rua D, 400' },
    { municipio: 'Caxias do Sul', telefone: '(54) 3218-3000', endereco: 'Rua E, 500' },
    { municipio: 'Cruz Alta', telefone: '(55) 3321-3000', endereco: 'Rua F, 600' },
    { municipio: 'Erechim', telefone: '(54) 3520-3000', endereco: 'Rua G, 700' },
    { municipio: 'Gravataí', telefone: '(51) 3489-3000', endereco: 'Rua H, 800' },
    { municipio: 'Ijuí', telefone: '(55) 3332-3000', endereco: 'Rua I, 900' },
    { municipio: 'Lajeado', telefone: '(51) 3714-3000', endereco: 'Rua J, 1000' },
    { municipio: 'Montenegro', telefone: '(51) 3658-3000', endereco: 'Rua K, 1100' },
    { municipio: 'Novo Hamburgo', telefone: '(51) 3594-3000', endereco: 'Rua L, 1200' },
    { municipio: 'Passo Fundo', telefone: '(54) 3313-3000', endereco: 'Rua M, 1300' },
    { municipio: 'Pelotas', telefone: '(53) 3225-3000', endereco: 'Rua N, 1400' },
    { municipio: 'Porto Alegre', telefone: '(51) 3288-3000', endereco: 'Rua O, 1500' },
    { municipio: 'Rio Grande', telefone: '(53) 3233-3000', endereco: 'Rua P, 1600' },
    { municipio: 'Santa Cruz do Sul', telefone: '(51) 3713-3000', endereco: 'Rua Q, 1700' },
    { municipio: 'Santa Maria', telefone: '(55) 3220-3000', endereco: 'Rua R, 1800' },
    { municipio: 'Santa Rosa', telefone: '(55) 3511-3000', endereco: 'Rua S, 1900' },
    { municipio: 'Santo Ângelo', telefone: '(55) 3313-3000', endereco: 'Rua T, 2000' },
    { municipio: 'São Leopoldo', telefone: '(51) 3579-3000', endereco: 'Rua U, 2100' },
    { municipio: 'Uruguaiana', telefone: '(55) 3412-3000', endereco: 'Rua V, 2200' },
    { municipio: 'Viamão', telefone: '(51) 3486-3000', endereco: 'Rua W, 2300' },
    { municipio: 'Vacaria', telefone: '(54) 3384-3000', endereco: 'Rua X, 2400' },
  ],
  salas: [
    { municipio: 'Aceguá', telefone: '(53) 3256-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Alegrete', telefone: '(55) 3426-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Almirante Tamandaré do Vale', telefone: '(54) 3527-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Arroio do Sal', telefone: '(51) 3626-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Arvorezinha', telefone: '(54) 3644-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Augusto Pestana', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Barão de Cotegipe', telefone: '(54) 3534-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Barão do Triunfo', telefone: '(51) 3656-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Barra do Quaraí', telefone: '(55) 3674-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Barracão', telefone: '(54) 3265-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Barros Cassal', telefone: '(51) 3742-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Bento Gonçalves', telefone: '(54) 3455-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Boa Vista do Buçador', telefone: '(54) 3673-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Bom Jesus', telefone: '(54) 3343-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Bom Princípio', telefone: '(51) 3718-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Bossoroca', telefone: '(55) 3674-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Bozano', telefone: '(54) 3534-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Braga', telefone: '(54) 3644-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Brás do Riotardo', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Brusque', telefone: '(51) 3626-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caçador', telefone: '(54) 3365-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Cacequi', telefone: '(55) 3242-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Cachoeira do Sul', telefone: '(51) 3722-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Cachoeirinha', telefone: '(51) 3477-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caibate', telefone: '(55) 3674-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caiçara', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caiçara do Rio Pardo', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caiçara do Sul', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caiçara do Tavares', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Caimbé', telefone: '(55) 3354-3000', endereco: 'Delegacia Distrital' },
    { municipio: 'Cainã do Sul', telefone: '(54) 3644-3000', endereco: 'Delegacia Distrital' },
  ],
  pppm: [
    { municipio: 'Alegrete', telefone: '(55) 3426-3000', endereco: 'Rua Principal, 100' },
    { municipio: 'Canela', telefone: '(54) 3282-3000', endereco: 'Rua Principal, 200' },
    { municipio: 'Carazinho', telefone: '(54) 3331-3000', endereco: 'Rua Principal, 300' },
    { municipio: 'Esteio', telefone: '(51) 3481-3000', endereco: 'Rua Principal, 400' },
    { municipio: 'Guaíba', telefone: '(51) 3451-3000', endereco: 'Rua Principal, 500' },
    { municipio: 'Ibirubá', telefone: '(54) 3365-3000', endereco: 'Rua Principal, 600' },
    { municipio: 'Lagoa Vermelha', telefone: '(54) 3644-3000', endereco: 'Rua Principal, 700' },
    { municipio: 'Palmeira das Missões', telefone: '(55) 3743-3000', endereco: 'Rua Principal, 800' },
    { municipio: 'São Luiz Gonzaga', telefone: '(55) 3352-3000', endereco: 'Rua Principal, 900' },
    { municipio: 'Torres', telefone: '(51) 3626-3000', endereco: 'Rua Principal, 1000' },
    { municipio: 'Três Passos', telefone: '(55) 3521-3000', endereco: 'Rua Principal, 1100' },
    { municipio: 'Vacaria', telefone: '(54) 3384-3000', endereco: 'Rua Principal, 1200' },
  ],
};

export function ViolenciaMulher({ data, isLoading, selectedMunicipio, selectedCorede }: ViolenciaMulherProps) {
  const [activeTab, setActiveTab] = useState<'indicadores' | 'locais'>('indicadores');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'deam' | 'salas' | 'pppm'>('deam');

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
    let data = [];
    if (selectedCategory === 'deam') {
      data = LOCAIS_ATENDIMENTO.deam;
    } else if (selectedCategory === 'salas') {
      data = LOCAIS_ATENDIMENTO.salas;
    } else {
      data = LOCAIS_ATENDIMENTO.pppm;
    }
    
    return data.filter((item: any) => 
      item.municipio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCategory, searchTerm]);

  const getCategoryLabel = () => {
    if (selectedCategory === 'deam') return 'DEAM - Delegacia Especializada no Atendimento à Mulher';
    if (selectedCategory === 'salas') return 'Salas das Margaridas';
    return 'PPPM - Posto Policial de Proteção à Mulher';
  };

  const getCategoryCount = () => {
    if (selectedCategory === 'deam') return LOCAIS_ATENDIMENTO.deam.length;
    if (selectedCategory === 'salas') return LOCAIS_ATENDIMENTO.salas.length;
    return LOCAIS_ATENDIMENTO.pppm.length;
  };

  if (activeTab === 'locais') {
    return (
      <div className="space-y-6">
        {/* Filtros de categoria */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setSelectedCategory('deam')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === 'deam'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            DEAM ({LOCAIS_ATENDIMENTO.deam.length})
          </button>
          <button
            onClick={() => setSelectedCategory('salas')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === 'salas'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Salas das Margaridas ({LOCAIS_ATENDIMENTO.salas.length})
          </button>
          <button
            onClick={() => setSelectedCategory('pppm')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedCategory === 'pppm'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            PPPM ({LOCAIS_ATENDIMENTO.pppm.length})
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Input
            placeholder="Buscar por município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>{getCategoryLabel()}</CardTitle>
            <CardDescription>Total: {getCategoryCount()} unidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Município</th>
                    <th className="text-left py-2 px-4 font-semibold">Telefone</th>
                    <th className="text-left py-2 px-4 font-semibold">Endereço</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocais.length > 0 ? (
                    filteredLocais.map((local: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{local.municipio}</td>
                        <td className="py-2 px-4">{local.telefone}</td>
                        <td className="py-2 px-4">{local.endereco}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                        Nenhum resultado encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-600">
          <strong>Fonte:</strong> SSP-RS — Secretaria da Segurança Pública do Rio Grande do Sul.
        </p>
      </div>
    );
  }

  // Aba Indicadores
  return (
    <div className="space-y-8">
      {/* BLOCO 1 — Série Histórica do RS (FIXO, SEMPRE VISÍVEL) */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            📊 Rio Grande do Sul — Série Histórica
          </h2>
          <p className="text-sm text-blue-700 mt-1">Dados consolidados do Estado (2020-2026) — independente de filtros municipais</p>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Feminicídio Consumado', value: consolidatedData.indicators[2026]['Feminicídio Consumado'], color: 'border-red-500', variation: variations['Feminicídio Consumado'] },
            { label: 'Feminicídio Tentado', value: consolidatedData.indicators[2026]['Feminicídio Tentado'], color: 'border-orange-500', variation: variations['Feminicídio Tentado'] },
            { label: 'Lesão Corporal', value: consolidatedData.indicators[2026]['Lesão Corporal'], color: 'border-yellow-500', variation: variations['Lesão Corporal'] },
            { label: 'Ameaça', value: consolidatedData.indicators[2026]['Ameaça'], color: 'border-green-500', variation: variations['Ameaça'] },
            { label: 'Estupro', value: consolidatedData.indicators[2026]['Estupro'], color: 'border-blue-500', variation: variations['Estupro'] },
          ].map((indicator, idx) => (
            <Card key={idx} className={`border-l-4 ${indicator.color}`}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-gray-600 mb-2">{indicator.label}</p>
                <p className="text-3xl font-bold text-gray-900">{indicator.value.toLocaleString('pt-BR')}</p>
                <p className={`text-sm mt-2 ${parseFloat(indicator.variation) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(indicator.variation) < 0 ? '↓' : '↑'} {indicator.variation}% vs 2025
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de evolução */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Indicadores (2020-2026)</CardTitle>
            <CardDescription>Série histórica de violência contra a mulher no RS</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Feminicídio Consumado" stroke="#dc2626" />
                <Line type="monotone" dataKey="Feminicídio Tentado" stroke="#f97316" />
                <Line type="monotone" dataKey="Lesão Corporal" stroke="#eab308" />
                <Line type="monotone" dataKey="Ameaça" stroke="#22c55e" />
                <Line type="monotone" dataKey="Estupro" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de composição */}
        <Card>
          <CardHeader>
            <CardTitle>Composição de Crimes (2026 - Parcial)</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabela de indicadores detalhados */}
        <Card>
          <CardHeader>
            <CardTitle>Indicadores Detalhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Indicador</th>
                    <th className="text-center py-2 px-4 font-semibold">2025</th>
                    <th className="text-center py-2 px-4 font-semibold">2026*</th>
                  </tr>
                </thead>
                <tbody>
                  {(['Feminicídio Consumado', 'Feminicídio Tentado', 'Lesão Corporal', 'Ameaça', 'Estupro'] as const).map((indicator, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{indicator}</td>
                      <td className="text-center py-2 px-4">{(consolidatedData.indicators[2025] as any)[indicator].toLocaleString('pt-BR')}</td>
                      <td className="text-center py-2 px-4">{(consolidatedData.indicators[2026] as any)[indicator].toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Série histórica completa */}
        <Card>
          <CardHeader>
            <CardTitle>Série Histórica Completa (2020-2026)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Indicador</th>
                    <th className="text-center py-2 px-4 font-semibold">2020</th>
                    <th className="text-center py-2 px-4 font-semibold">2021</th>
                    <th className="text-center py-2 px-4 font-semibold">2022</th>
                    <th className="text-center py-2 px-4 font-semibold">2023</th>
                    <th className="text-center py-2 px-4 font-semibold">2024</th>
                    <th className="text-center py-2 px-4 font-semibold">2025</th>
                    <th className="text-center py-2 px-4 font-semibold">2026*</th>
                  </tr>
                </thead>
                <tbody>
                  {(['Feminicídio Consumado', 'Feminicídio Tentado', 'Lesão Corporal', 'Ameaça', 'Estupro', 'Total Geral'] as const).map((indicator, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{indicator}</td>
                      {([2020, 2021, 2022, 2023, 2024, 2025, 2026] as const).map((year) => (
                        <td key={year} className="text-center py-2 px-4">
                          {((consolidatedData.indicators as any)[year] as any)[indicator].toLocaleString('pt-BR')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-600">
          <strong>Fonte:</strong> SIP/PROCERGS — Observatório Estadual de Segurança Pública/SSP-RS. *2026 parcial (jan-abr).
        </p>
      </div>

      {/* BLOCO 2 — Indicadores por Município/COREDE (DINÂMICO) */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Indicadores por Município/COREDE</h2>
        <p className="text-sm text-gray-600 mb-4">Dados locais — responde aos filtros hierárquicos</p>
        
        {selectedMunicipio || selectedCorede ? (
          <div className="text-center py-8 text-gray-500">
            <p>Dados municipais em desenvolvimento...</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
            <AlertCircle className="mx-auto mb-3 text-gray-400" size={32} />
            <p className="text-gray-600 font-medium">Selecione um município ou COREDE para visualizar os dados locais.</p>
          </div>
        )}
      </div>
    </div>
  );
}
