'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { AlertCircle, Phone, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViolenciaMulherProps {
  selectedMunicipio?: number | null;
  selectedCorede?: number | null;
}

// Dados hardcoded de Locais de Atendimento com telefones corretos
const LOCAIS_ATENDIMENTO = {
  deam: [
    { municipio: 'Alvorada', telefone: '(51) 3442-1114' },
    { municipio: 'Bagé', telefone: '(53) 3241-3709' },
    { municipio: 'Bento Gonçalves', telefone: '(54) 3454-2899' },
    { municipio: 'Canoas', telefone: '(51) 3462-6700' },
    { municipio: 'Caxias do Sul', telefone: '(54) 3220-9280' },
    { municipio: 'Cruz Alta', telefone: '(55) 3322-6160' },
    { municipio: 'Erechim', telefone: '(54) 3520-4561' },
    { municipio: 'Gravataí', telefone: '(51) 3945-2711' },
    { municipio: 'Ijuí', telefone: '(55) 3331-9750' },
    { municipio: 'Lajeado', telefone: '(51) 3748-6912' },
    { municipio: 'Montenegro', telefone: '(51) 3649-0000' },
    { municipio: 'Novo Hamburgo', telefone: '(51) 3584-5805' },
    { municipio: 'Passo Fundo', telefone: '(54) 3581-0725' },
    { municipio: 'Pelotas', telefone: '(53) 3310-8181' },
    { municipio: 'Porto Alegre', telefone: '(51) 3288-2327' },
    { municipio: 'Rio Grande', telefone: '(53) 3237-4884' },
    { municipio: 'Santa Cruz do Sul', telefone: '(51) 3715-6963' },
    { municipio: 'Santa Maria', telefone: '(55) 3222-9646' },
    { municipio: 'Santa Rosa', telefone: '(55) 3513-1620' },
    { municipio: 'Santo Ângelo', telefone: '(55) 3313-1742' },
    { municipio: 'São Leopoldo', telefone: '(51) 3591-3333' },
    { municipio: 'Uruguaiana', telefone: '(55) 3411-1125' },
    { municipio: 'Viamão', telefone: '(51) 3435-9315' },
  ],
  salas: [
    { municipio: 'Alvorada', telefone: '(51) 3412-1201' },
    { municipio: 'Bagé', telefone: '(53) 3241-6247' },
    { municipio: 'Canoas', telefone: '(51) 3425-9000' },
    { municipio: 'Caxias do Sul', telefone: '(54) 3238-7700' },
    { municipio: 'Cruz Alta', telefone: '(55) 3322-6160' },
    { municipio: 'Farroupilha', telefone: '(54) 3261-6794' },
    { municipio: 'Gravataí', telefone: '(51) 3431-6083' },
    { municipio: 'Lajeado', telefone: '(51) 3714-5796' },
    { municipio: 'Montenegro', telefone: '(51) 3649-0000' },
    { municipio: 'Novo Hamburgo', telefone: '(51) 3584-5848' },
    { municipio: 'Passo Fundo', telefone: '(54) 3313-6499' },
    { municipio: 'Pelotas', telefone: '(53) 3310-8604' },
    { municipio: 'Porto Alegre', telefone: '(51) 3288-2172' },
    { municipio: 'Rio Grande', telefone: '(53) 3237-4854' },
    { municipio: 'Santa Cruz do Sul', telefone: '(51) 3719-9916' },
    { municipio: 'Santa Rosa', telefone: '(55) 3513-6000' },
    { municipio: 'São Leopoldo', telefone: '(51) 3592-1013' },
    { municipio: 'Uruguaiana', telefone: '(55) 3411-3839' },
    { municipio: 'Viamão', telefone: '(51) 3435-9315' },
  ],
  pppm: [
    { municipio: 'Alegrete', telefone: '(55) 3427-0326' },
    { municipio: 'Canela', telefone: '(54) 3278-0032' },
    { municipio: 'Carazinho', telefone: '(54) 3329-8600' },
    { municipio: 'Esteio', telefone: '(51) 3458-9650' },
    { municipio: 'Guaíba', telefone: '(51) 3401-7101' },
    { municipio: 'Ibirubá', telefone: '(54) 3324-4171' },
    { municipio: 'Lagoa Vermelha', telefone: '(54) 3358-0430' },
    { municipio: 'Palmeira das Missões', telefone: '(55) 3742-1180' },
    { municipio: 'São Luiz Gonzaga', telefone: '(55) 3352-8111' },
    { municipio: 'Torres', telefone: '(51) 3664-1282' },
    { municipio: 'Três Passos', telefone: '(55) 98428-8664' },
    { municipio: 'Vacaria', telefone: '(54) 3232-0100' },
  ],
};

// Dados consolidados do RS (2020-2026)
const RS_CONSOLIDATED_DATA = {
  2020: { Feminicídio_Consumado: 80, Feminicídio_Tentado: 318, Lesão_Corporal: 18901, Ameaça: 33756, Estupro: 2246, Total_Geral: 55301 },
  2021: { Feminicídio_Consumado: 61, Feminicídio_Tentado: 255, Lesão_Corporal: 18007, Ameaça: 32762, Estupro: 2455, Total_Geral: 53575 },
  2022: { Feminicídio_Consumado: 118, Feminicídio_Tentado: 263, Lesão_Corporal: 18197, Ameaça: 31389, Estupro: 2783, Total_Geral: 52743 },
  2023: { Feminicídio_Consumado: 67, Feminicídio_Tentado: 323, Lesão_Corporal: 19903, Ameaça: 33453, Estupro: 2820, Total_Geral: 56499 },
  2024: { Feminicídio_Consumado: 80, Feminicídio_Tentado: 237, Lesão_Corporal: 18747, Ameaça: 31523, Estupro: 2522, Total_Geral: 53101 },
  2025: { Feminicídio_Consumado: 29, Feminicídio_Tentado: 236, Lesão_Corporal: 18501, Ameaça: 31975, Estupro: 2459, Total_Geral: 53278 },
  '2026_parcial': { Feminicídio_Consumado: 9, Feminicídio_Tentado: 99, Lesão_Corporal: 6390, Ameaça: 11275, Estupro: 690, Total_Geral: 18483 },
};

export function ViolenciaMulher({ selectedMunicipio, selectedCorede }: ViolenciaMulherProps) {
  const [activeTab, setActiveTab] = useState<'indicadores' | 'locais'>('indicadores');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'deam' | 'salas' | 'pppm'>('deam');

  // BLOCO A: Dados consolidados do RS (sempre visível)
  const rsIndicadores = useMemo(() => {
    return [
      { ano: '2020', Feminicídio_Consumado: 80, Feminicídio_Tentado: 318, Lesão_Corporal: 18901, Ameaça: 33756, Estupro: 2246 },
      { ano: '2021', Feminicídio_Consumado: 61, Feminicídio_Tentado: 255, Lesão_Corporal: 18007, Ameaça: 32762, Estupro: 2455 },
      { ano: '2022', Feminicídio_Consumado: 118, Feminicídio_Tentado: 263, Lesão_Corporal: 18197, Ameaça: 31389, Estupro: 2783 },
      { ano: '2023', Feminicídio_Consumado: 67, Feminicídio_Tentado: 323, Lesão_Corporal: 19903, Ameaça: 33453, Estupro: 2820 },
      { ano: '2024', Feminicídio_Consumado: 80, Feminicídio_Tentado: 237, Lesão_Corporal: 18747, Ameaça: 31523, Estupro: 2522 },
      { ano: '2025', Feminicídio_Consumado: 29, Feminicídio_Tentado: 236, Lesão_Corporal: 18501, Ameaça: 31975, Estupro: 2459 },
      { ano: '2026*', Feminicídio_Consumado: 9, Feminicídio_Tentado: 99, Lesão_Corporal: 6390, Ameaça: 11275, Estupro: 690 },
    ];
  }, []);

  // Filtrar locais de atendimento por categoria e busca
  const filteredLocais = useMemo(() => {
    const category = selectedCategory === 'deam' ? LOCAIS_ATENDIMENTO.deam : selectedCategory === 'salas' ? LOCAIS_ATENDIMENTO.salas : LOCAIS_ATENDIMENTO.pppm;
    return category.filter(local => local.municipio.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
      {activeTab === 'indicadores' ? (
        <>
          {/* ========== BLOCO A: RIO GRANDE DO SUL — SÉRIE HISTÓRICA (SEMPRE VISÍVEL) ========== */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">📊 Rio Grande do Sul — Série Histórica</h2>
              <p className="text-sm text-gray-600">Dados consolidados do Estado (2020-2026) — independente de filtros municipais</p>
            </div>

            {/* Tabela estática com todos os anos */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-gray-400">
                    <th className="text-left p-3 font-semibold text-gray-800">Indicador</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2020</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2021</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2022</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2023</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2024</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2025</th>
                    <th className="text-center p-3 font-semibold text-gray-800">2026*</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="p-3 font-semibold text-gray-800">Feminicídio Consumado</td>
                    <td className="text-center p-3">80</td>
                    <td className="text-center p-3">61</td>
                    <td className="text-center p-3">118</td>
                    <td className="text-center p-3">67</td>
                    <td className="text-center p-3">80</td>
                    <td className="text-center p-3">29</td>
                    <td className="text-center p-3 font-bold text-red-600">9</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="p-3 font-semibold text-gray-800">Feminicídio Tentado</td>
                    <td className="text-center p-3">318</td>
                    <td className="text-center p-3">255</td>
                    <td className="text-center p-3">263</td>
                    <td className="text-center p-3">323</td>
                    <td className="text-center p-3">237</td>
                    <td className="text-center p-3">236</td>
                    <td className="text-center p-3 font-bold text-red-600">99</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="p-3 font-semibold text-gray-800">Lesão Corporal</td>
                    <td className="text-center p-3">18.901</td>
                    <td className="text-center p-3">18.007</td>
                    <td className="text-center p-3">18.197</td>
                    <td className="text-center p-3">19.903</td>
                    <td className="text-center p-3">18.747</td>
                    <td className="text-center p-3">18.501</td>
                    <td className="text-center p-3 font-bold text-red-600">6.390</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="p-3 font-semibold text-gray-800">Ameaça</td>
                    <td className="text-center p-3">33.756</td>
                    <td className="text-center p-3">32.762</td>
                    <td className="text-center p-3">31.389</td>
                    <td className="text-center p-3">33.453</td>
                    <td className="text-center p-3">31.523</td>
                    <td className="text-center p-3">31.975</td>
                    <td className="text-center p-3 font-bold text-red-600">11.275</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100">
                    <td className="p-3 font-semibold text-gray-800">Estupro</td>
                    <td className="text-center p-3">2.246</td>
                    <td className="text-center p-3">2.455</td>
                    <td className="text-center p-3">2.783</td>
                    <td className="text-center p-3">2.820</td>
                    <td className="text-center p-3">2.522</td>
                    <td className="text-center p-3">2.459</td>
                    <td className="text-center p-3 font-bold text-red-600">690</td>
                  </tr>
                  <tr className="bg-blue-100 border-b-2 border-blue-400">
                    <td className="p-3 font-bold text-blue-900">Total Geral</td>
                    <td className="text-center p-3 font-bold text-blue-900">55.301</td>
                    <td className="text-center p-3 font-bold text-blue-900">53.575</td>
                    <td className="text-center p-3 font-bold text-blue-900">52.743</td>
                    <td className="text-center p-3 font-bold text-blue-900">56.499</td>
                    <td className="text-center p-3 font-bold text-blue-900">53.101</td>
                    <td className="text-center p-3 font-bold text-blue-900">53.278</td>
                    <td className="text-center p-3 font-bold text-blue-900">18.483</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 border-t pt-3">
              <strong>Fonte:</strong> SIP/PROCERGS — Observatório Estadual de Segurança Pública/SSP-RS. *2026 parcial (jan-abr).
            </p>
          </div>

          {/* ========== BLOCO B: DADOS POR MUNICÍPIO/COREDE (CONDICIONAL) ========== */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados por Município/COREDE</h2>
            <p className="text-sm text-gray-600 mb-4">Dados locais — responde aos filtros hierárquicos</p>

            {selectedMunicipio || selectedCorede ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg">📍 Dados municipais em desenvolvimento</p>
                <p className="text-sm mt-2">Selecione um município para visualizar dados específicos.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Selecione um município ou COREDE para ver os dados locais.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* ========== SEÇÃO LOCAIS DE ATENDIMENTO ========== */}
          {/* Destaque de Emergência */}
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-900">Em caso de emergência:</p>
              <p className="text-red-800">
                <strong>190</strong> - Brigada Militar | <strong>180</strong> - Central de Atendimento à Mulher
              </p>
            </div>
          </div>

          {/* Abas de Categorias */}
          <Card>
            <CardHeader>
              <CardTitle>Locais de Atendimento à Mulher Vítima de Violência</CardTitle>
              <CardDescription>Selecione a categoria e busque por município</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Abas de Categorias */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setSelectedCategory('deam')}
                  className={`px-4 py-2 font-semibold border-b-2 transition ${
                    selectedCategory === 'deam'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  DEAM ({LOCAIS_ATENDIMENTO.deam.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('salas')}
                  className={`px-4 py-2 font-semibold border-b-2 transition ${
                    selectedCategory === 'salas'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Salas das Margaridas ({LOCAIS_ATENDIMENTO.salas.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('pppm')}
                  className={`px-4 py-2 font-semibold border-b-2 transition ${
                    selectedCategory === 'pppm'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  PPPM ({LOCAIS_ATENDIMENTO.pppm.length})
                </button>
              </div>

              {/* Campo de Busca */}
              <Input
                placeholder="Buscar por município..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              {/* Tabela de Locais */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-3 font-semibold">Município</th>
                      <th className="text-left p-3 font-semibold">Telefone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLocais.length > 0 ? (
                      filteredLocais.map((local, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3">{local.municipio}</td>
                          <td className="p-3 text-blue-600 font-semibold">{local.telefone}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-6 text-center text-gray-500">
                          Nenhum resultado encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Abas de Navegação */}
      <div className="flex gap-2 border-b mt-8">
        <button
          onClick={() => setActiveTab('indicadores')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'indicadores'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Indicadores
        </button>
        <button
          onClick={() => setActiveTab('locais')}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === 'locais'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Locais de Atendimento
        </button>
      </div>
    </div>
  );
}
