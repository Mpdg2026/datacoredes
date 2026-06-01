'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Search } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trpc } from '@/lib/trpc';

interface ViolenciaMulherProps {
  selectedMunicipio?: string | number;
  nomeMunicipio?: string;
  selectedCorede?: string;
}

// Dados hardcoded de Locais de Atendimento
const LOCAIS_ATENDIMENTO = {
  deam: [
    { municipio: 'Alvorada', telefone: '(51)3442-1114' },
    { municipio: 'Bagé', telefone: '(53)3241-3709' },
    { municipio: 'Bento Gonçalves', telefone: '(54)3454-2899' },
    { municipio: 'Canoas', telefone: '(51)3462-6700' },
    { municipio: 'Caxias do Sul', telefone: '(54)3220-9280' },
    { municipio: 'Cruz Alta', telefone: '(55)3322-6160' },
    { municipio: 'Erechim', telefone: '(54)3520-4561' },
    { municipio: 'Gravataí', telefone: '(51)3945-2711' },
    { municipio: 'Ijuí', telefone: '(55)3331-9750' },
    { municipio: 'Lajeado', telefone: '(51)3748-6912' },
    { municipio: 'Montenegro', telefone: '(51)3649-0000' },
    { municipio: 'Novo Hamburgo', telefone: '(51)3584-5805' },
    { municipio: 'Passo Fundo', telefone: '(54)3581-0725' },
    { municipio: 'Pelotas', telefone: '(53)3310-8181' },
    { municipio: 'Porto Alegre', telefone: '(51)3288-2327' },
    { municipio: 'Rio Grande', telefone: '(53)3237-4884' },
    { municipio: 'Santa Cruz do Sul', telefone: '(51)3715-6963' },
    { municipio: 'Santa Maria', telefone: '(55)3222-9646' },
    { municipio: 'Santa Rosa', telefone: '(55)3513-1620' },
    { municipio: 'Santo Ângelo', telefone: '(55)3313-1742' },
    { municipio: 'São Leopoldo', telefone: '(51)3591-3333' },
    { municipio: 'Uruguaiana', telefone: '(55)3411-1125' },
    { municipio: 'Viamão', telefone: '(51)3435-9315' },
  ],
  salas: [
    { municipio: 'Alvorada', telefone: '(51)3412-1201' },
    { municipio: 'Bagé', telefone: '(53)3241-6247' },
    { municipio: 'Canoas', telefone: '(51)3425-9000' },
    { municipio: 'Caxias do Sul', telefone: '(54)3238-7700' },
    { municipio: 'Cruz Alta', telefone: '(55)3322-6160' },
    { municipio: 'Farroupilha', telefone: '(54)3261-6794' },
    { municipio: 'Gravataí', telefone: '(51)3431-6083' },
    { municipio: 'Lajeado', telefone: '(51)3714-5796' },
    { municipio: 'Montenegro', telefone: '(51)3649-0000' },
    { municipio: 'Novo Hamburgo', telefone: '(51)3584-5848' },
    { municipio: 'Passo Fundo', telefone: '(54)3313-6499' },
    { municipio: 'Pelotas', telefone: '(53)3310-8604' },
    { municipio: 'Porto Alegre', telefone: '(51)3288-2172' },
    { municipio: 'Rio Grande', telefone: '(53)3237-4854' },
    { municipio: 'Santa Cruz do Sul', telefone: '(51)3719-9916' },
    { municipio: 'Santa Rosa', telefone: '(55)3513-6000' },
    { municipio: 'São Leopoldo', telefone: '(51)3592-1013' },
    { municipio: 'Uruguaiana', telefone: '(55)3411-3839' },
    { municipio: 'Viamão', telefone: '(51)3435-9315' },
  ],
  pppm: [
    { municipio: 'Alegrete', telefone: '(55)3427-0326' },
    { municipio: 'Canela', telefone: '(54)3278-0032' },
    { municipio: 'Carazinho', telefone: '(54)3329-8600' },
    { municipio: 'Esteio', telefone: '(51)3458-9650' },
    { municipio: 'Guaíba', telefone: '(51)3401-7101' },
    { municipio: 'Ibirubá', telefone: '(54)3324-4171' },
    { municipio: 'Lagoa Vermelha', telefone: '(54)3358-0430' },
    { municipio: 'Palmeira das Missões', telefone: '(55)3742-1180' },
    { municipio: 'São Luiz Gonzaga', telefone: '(55)3352-8111' },
    { municipio: 'Torres', telefone: '(51)3664-1282' },
    { municipio: 'Três Passos', telefone: '(55)98428-8664' },
    { municipio: 'Vacaria', telefone: '(54)3232-0100' },
  ],
};

export function ViolenciaMulher({ selectedMunicipio, nomeMunicipio, selectedCorede }: ViolenciaMulherProps) {
  const [activeTab, setActiveTab] = useState<'indicadores' | 'locais'>('indicadores');
  const [selectedCategory, setSelectedCategory] = useState<'deam' | 'salas' | 'pppm'>('deam');
  const [searchTerm, setSearchTerm] = useState('');
  const [municipioData, setMunicipioData] = useState<any>(null);
  
  // Estados para comparação entre municípios
  const [municipioA, setMunicipioA] = useState<string>('');
  const [municipioB, setMunicipioB] = useState<string>('');
  const [indicadorComparacao, setIndicadorComparacao] = useState<string>('Feminicídio Consumado');
  const [municipioAData, setMunicipioAData] = useState<any>(null);
  const [municipioBData, setMunicipiBData] = useState<any>(null);
  const [nomeA, setNomeA] = useState<string>('');
  const [nomeB, setNomeB] = useState<string>('');
  
  // Carregar lista de todos os municípios
  const todosMunicipiosQuery = trpc.portal.todosMunicipios.useQuery();
  const todosMunicipios = todosMunicipiosQuery.data;

  // Chamar procedure do backend para carregar dados municipais
  const municipioQuery = trpc.portal.violenciaMulherMunicipio.useQuery(
    { codigoIBGE: selectedMunicipio ? String(selectedMunicipio) : undefined },
    { enabled: !!selectedMunicipio }
  );

  // Atualizar dados quando a query retorna
  useEffect(() => {
    if (municipioQuery.data) {
      // A procedure retorna o objeto diretamente (com chaves como "Feminicídio Consumado", etc.)
      setMunicipioData(municipioQuery.data);
    } else {
      setMunicipioData(null);
    }
  }, [municipioQuery.data]);
  // Carregar dados de Município A para comparação
  const municipioAQuery = trpc.portal.violenciaMulherMunicipio.useQuery(
    { codigoIBGE: municipioA || undefined },
    { enabled: !!municipioA }
  );

  useEffect(() => {
    if (municipioA && todosMunicipios) {
      const municipioInfo = todosMunicipios.find(m => m.codigoIBGE === municipioA);
      setNomeA(municipioInfo?.nome || '');
    } else {
      setNomeA('');
    }
  }, [municipioA, todosMunicipios]);

  useEffect(() => {
    if (municipioAQuery.data) {
      setMunicipioAData(municipioAQuery.data);
    } else if (!municipioA) {
      setMunicipioAData(null);
    }
  }, [municipioAQuery.data, municipioA]);

  // Carregar dados de Município B para comparação
  const municipioBQuery = trpc.portal.violenciaMulherMunicipio.useQuery(
    { codigoIBGE: municipioB || undefined },
    { enabled: !!municipioB }
  );

  useEffect(() => {
    if (municipioB && todosMunicipios) {
      const municipioInfo = todosMunicipios.find(m => m.codigoIBGE === municipioB);
      setNomeB(municipioInfo?.nome || '');
    } else {
      setNomeB('');
    }
  }, [municipioB, todosMunicipios]);

  useEffect(() => {
    if (municipioBQuery.data) {
      setMunicipiBData(municipioBQuery.data);
    } else if (!municipioB) {
      setMunicipiBData(null);
    }
  }, [municipioBQuery.data, municipioB]);

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

            {municipioQuery.isLoading ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg">⏳ Carregando dados...</p>
              </div>
            ) : municipioData && selectedMunicipio ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📍 {nomeMunicipio || selectedMunicipio}</h3>
                  
                  {/* Cards de Indicadores */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {[
                      { label: 'Feminicídio Consumado', key: 'Feminicídio Consumado', color: 'red' },
                      { label: 'Feminicídio Tentado', key: 'Feminicídio Tentado', color: 'orange' },
                      { label: 'Lesão Corporal', key: 'Lesão Corporal', color: 'yellow' },
                      { label: 'Ameaça', key: 'Ameaça', color: 'purple' },
                      { label: 'Estupro', key: 'Estupro', color: 'blue' },
                    ].map((ind) => {
                      const anos = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
                      const dados = anos.map(ano => Number(municipioData[ind.key]?.[ano] || 0));
                      
                      let ultimoAnoIndex = dados.length - 1;
                      while (ultimoAnoIndex > 0 && dados[ultimoAnoIndex] === 0 && dados[ultimoAnoIndex - 1] === 0) {
                        ultimoAnoIndex--;
                      }
                      
                      const valorAtual = dados[ultimoAnoIndex];
                      const anoAtual = anos[ultimoAnoIndex];
                      
                      let variacao = '0';
                      let seta = '→';
                      let colorClass = 'text-gray-600';
                      let anoComparacao = 'N/A';
                      
                      if (ultimoAnoIndex > 0) {
                        const valorAnterior = dados[ultimoAnoIndex - 1];
                        anoComparacao = anos[ultimoAnoIndex - 1];
                        
                        if (valorAnterior > 0) {
                          const variacaoNum = ((valorAtual - valorAnterior) / valorAnterior * 100);
                          variacao = Math.abs(variacaoNum).toFixed(1);
                          
                          if (variacaoNum > 0) {
                            seta = '↑';
                            colorClass = 'text-red-600';
                          } else if (variacaoNum < 0) {
                            seta = '↓';
                            colorClass = 'text-green-600';
                          }
                        }
                      }
                      
                      return (
                        <Card key={ind.key} className={`border-l-4 border-l-${ind.color}-500`}>
                          <CardContent className="pt-4">
                            <p className="text-xs text-gray-600 mb-1">{ind.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{valorAtual.toLocaleString('pt-BR')}</p>
                            <p className={`text-xs font-semibold ${colorClass}`}>{seta} {variacao}% vs {anoComparacao}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Gráfico de Evolução */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Evolução de Indicadores (2020-2026)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                          { ano: '2020', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2020'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2020'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2020'] || 0 },
                          { ano: '2021', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2021'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2021'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2021'] || 0 },
                          { ano: '2022', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2022'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2022'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2022'] || 0 },
                          { ano: '2023', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2023'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2023'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2023'] || 0 },
                          { ano: '2024', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2024'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2024'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2024'] || 0 },
                          { ano: '2025', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2025'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2025'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2025'] || 0 },
                          { ano: '2026*', Feminicídio_Consumado: municipioData['Feminicídio Consumado']?.['2026'] || 0, Feminicídio_Tentado: municipioData['Feminicídio Tentado']?.['2026'] || 0, Lesão_Corporal: municipioData['Lesão Corporal']?.['2026'] || 0 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ano" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Feminicídio_Consumado" stroke="#dc2626" name="Feminicídio Consumado" />
                          <Line type="monotone" dataKey="Feminicídio_Tentado" stroke="#f97316" name="Feminicídio Tentado" />
                          <Line type="monotone" dataKey="Lesão_Corporal" stroke="#eab308" name="Lesão Corporal" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : selectedMunicipio || selectedCorede ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg">📍 Dados não disponíveis para este município</p>
                <p className="text-sm mt-2">Selecione outro município para visualizar dados.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">Selecione um município ou COREDE para ver os dados locais.</p>
              </div>
            )}
          </div>

      {/* ========== SEÇÃO LOCAIS DE ATENDIMENTO ========== */}
          {/* Destaque de Emergência */}
          <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-900">Em caso de emergência:</p>
              <p className="text-red-800"><strong>190</strong> - Brigada Militar | <strong>180</strong> - Central de Atendimento à Mulher</p>
            </div>
          </div>

          {/* Abas de Categoria */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { id: 'deam', label: `DEAM (${LOCAIS_ATENDIMENTO.deam.length})` },
              { id: 'salas', label: `Salas das Margaridas (${LOCAIS_ATENDIMENTO.salas.length})` },
              { id: 'pppm', label: `PPPM (${LOCAIS_ATENDIMENTO.pppm.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-4 py-2 font-semibold border-b-2 transition ${
                  selectedCategory === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por município..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tabela de Locais */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-3 font-semibold text-gray-800">Município</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocais.length > 0 ? (
                  filteredLocais.map((local, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-900">{local.municipio}</td>
                      <td className="p-3 text-gray-700 font-mono">{local.telefone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-3 text-center text-gray-500">
                      Nenhum resultado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


      {/* ========== BLOCO C: COMPARAR MUNICÍPIOS ========== */}
      <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔄 Comparar Municípios</h2>
        <p className="text-sm text-gray-600 mb-6">Compare indicadores de violência entre dois municípios</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Seletor Município A */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Município A</label>
            <select
              value={municipioA}
              onChange={(e) => setMunicipioA(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um município...</option>
              {todosMunicipios?.map((m) => (
                <option key={m.codigoIBGE} value={m.codigoIBGE}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor Município B */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Município B</label>
            <select
              value={municipioB}
              onChange={(e) => setMunicipioB(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um município...</option>
              {todosMunicipios?.map((m) => (
                <option key={m.codigoIBGE} value={m.codigoIBGE}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Seletor Indicador */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Indicador</label>
            <select
              value={indicadorComparacao}
              onChange={(e) => setIndicadorComparacao(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Feminicídio Consumado">Feminicídio Consumado</option>
              <option value="Feminicídio Tentado">Feminicídio Tentado</option>
              <option value="Lesão Corporal">Lesão Corporal</option>
              <option value="Ameaça">Ameaça</option>
              <option value="Estupro">Estupro</option>
            </select>
          </div>
        </div>

        {municipioA && municipioB ? (
          <div className="space-y-6">
            {/* Gráfico de Comparação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evolução Comparativa: {indicadorComparacao}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { ano: '2020', A: Number((municipioAData?.[indicadorComparacao]?.['2020']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2020']) || 0) },
                    { ano: '2021', A: Number((municipioAData?.[indicadorComparacao]?.['2021']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2021']) || 0) },
                    { ano: '2022', A: Number((municipioAData?.[indicadorComparacao]?.['2022']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2022']) || 0) },
                    { ano: '2023', A: Number((municipioAData?.[indicadorComparacao]?.['2023']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2023']) || 0) },
                    { ano: '2024', A: Number((municipioAData?.[indicadorComparacao]?.['2024']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2024']) || 0) },
                    { ano: '2025', A: Number((municipioAData?.[indicadorComparacao]?.['2025']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2025']) || 0) },
                    { ano: '2026*', A: Number((municipioAData?.[indicadorComparacao]?.['2026']) || 0), B: Number((municipioBData?.[indicadorComparacao]?.['2026']) || 0) },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="A" stroke="#3b82f6" name={nomeA || "Município A"} strokeWidth={2} />
                    <Line type="monotone" dataKey="B" stroke="#ef4444" name={nomeB || "Município B"} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela Comparativa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Anuais - {indicadorComparacao}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="text-left p-3 font-semibold text-gray-800">Ano</th>
                        <th className="text-center p-3 font-semibold text-gray-800">{nomeA || "Município A"}</th>
                        <th className="text-center p-3 font-semibold text-gray-800">{nomeB || "Município B"}</th>
                        <th className="text-center p-3 font-semibold text-gray-800">Diferença</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((ano) => {
                        const valA = Number(municipioAData[indicadorComparacao]?.[ano] || 0);
                        const valB = Number(municipioBData[indicadorComparacao]?.[ano] || 0);
                        const diff = valA - valB;
                        const diffClass = diff > 0 ? 'text-red-600 font-semibold' : diff < 0 ? 'text-green-600 font-semibold' : 'text-gray-600';
                        return (
                          <tr key={ano} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-800">{ano}</td>
                            <td className="text-center p-3">{valA.toLocaleString('pt-BR')}</td>
                            <td className="text-center p-3">{valB.toLocaleString('pt-BR')}</td>
                            <td className={`text-center p-3 ${diffClass}`}>{diff > 0 ? '+' : ''}{diff.toLocaleString('pt-BR')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p className="text-lg">Selecione dois municípios para comparar</p>
          </div>
        )}
      </div>

      {/* Renderização da aba Locais de Atendimento */}
      {activeTab === 'locais' && (
        <div className="mt-6">
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory('deam')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === 'deam'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              DEAM ({LOCAIS_ATENDIMENTO.deam.length})
            </button>
            <button
              onClick={() => setSelectedCategory('salas')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === 'salas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Salas das Margaridas ({LOCAIS_ATENDIMENTO.salas.length})
            </button>
            <button
              onClick={() => setSelectedCategory('pppm')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedCategory === 'pppm'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              PPPM ({LOCAIS_ATENDIMENTO.pppm.length})
            </button>
          </div>

          {/* Campo de busca */}
          <div className="mb-6 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Buscar por munícipio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-600"
            />
          </div>

          {/* Tabela de Locais */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'deam' && 'Delegacias Especializadas de Atendimento à Mulher'}
                {selectedCategory === 'salas' && 'Salas das Margaridas'}
                {selectedCategory === 'pppm' && 'Programa de Prevenção e Proteção à Mulher'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left p-3 font-semibold text-gray-800">Município</th>
                    <th className="text-left p-3 font-semibold text-gray-800">Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {LOCAIS_ATENDIMENTO[selectedCategory]
                    .filter((local: any) => local.municipio.toLowerCase().includes(searchTerm))
                    .map((local: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-800">{local.municipio}</td>
                        <td className="p-3 text-gray-800 font-semibold">{local.telefone}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Aba de Navegação - Apenas Locais de Atendimento */}
      <div className="flex gap-2 border-b border-gray-200 sticky bottom-0 bg-white">
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
