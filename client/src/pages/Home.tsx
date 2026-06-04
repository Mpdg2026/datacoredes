import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

/**
 * Portal Coredes em Números - Landing Page
 */
export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-[#001f5c] text-white shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f4b41a] rounded-full flex items-center justify-center">
                <span className="text-[#001f5c] font-bold">F</span>
              </div>
              <h1 className="text-2xl font-bold">Portal Coredes em Números</h1>
            </div>
            {isAuthenticated && (
              <button onClick={logout} className="px-4 py-2 bg-[#f4b41a] text-[#001f5c] rounded font-semibold hover:bg-opacity-90">
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#001f5c] to-[#003d99] text-white py-20">
          <div className="container text-center">
            <p className="text-xl text-gray-300 mb-8">Explore dados de desenvolvimento humano, governança, sustentabilidade e segurança pública dos municípios e Coredes do Rio Grande do Sul</p>
            <a href="/portal" className="inline-block px-8 py-3 bg-[#f4b41a] text-[#001f5c] rounded-lg font-bold text-lg hover:bg-opacity-90 transition">
              Acessar Portal
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <h3 className="text-3xl font-bold text-[#001f5c] mb-12 text-center">Funcionalidades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a]">
              <h4 className="text-xl font-bold text-[#001f5c] mb-2">Desenvolvimento Humano</h4>
              <p className="text-gray-600">Índice de Desenvolvimento Socioeconômico (IDESE) 2020</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a]">
              <h4 className="text-xl font-bold text-[#001f5c] mb-2">Governança Municipal</h4>
              <p className="text-gray-600">Índice de Gestão Municipal (IGM) 2025</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a]">
              <h4 className="text-xl font-bold text-[#001f5c] mb-2">Sustentabilidade</h4>
              <p className="text-gray-600">Índice de Desenvolvimento Sustentável das Cidades (IDSC) 2023-2025</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a]">
              <h4 className="text-xl font-bold text-[#001f5c] mb-2">Segurança Pública</h4>
              <p className="text-gray-600">Estatísticas de Violência e Indicadores Criminais 2020-2026</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a]">
              <h4 className="text-xl font-bold text-[#001f5c] mb-2">Violência contra Mulher</h4>
              <p className="text-gray-600">Indicadores de Violência de Gênero 2020-2026</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a]">
              <h4 className="text-xl font-bold text-[#001f5c] mb-2">Progresso Social</h4>
              <p className="text-gray-600">Índice de Progresso Social (IPS Brasil) 2024-2026</p>
            </div>
          </div>
        </section>

        {/* Regiões Funcionais e Coredes */}
        <section className="py-16">
          <div className="container">
            <h3 className="text-3xl font-bold text-[#001f5c] mb-8 text-center">Regiões Funcionais e Coredes do RS</h3>
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-gray-700 mb-4">
                O Rio Grande do Sul é organizado em 9 Regiões Funcionais de Planejamento e 28 Conselhos Regionais de Desenvolvimento (Coredes), criados pela Lei Estadual nº 10.283/1994. Os Coredes são fóruns de discussão e decisão sobre políticas e ações voltadas ao desenvolvimento regional, integrando municípios com características socioeconômicas semelhantes. Cada Corede elabora sua Consulta Popular e contribui para o planejamento estratégico do Estado.
              </p>
              <p className="text-gray-600 text-sm italic">
                Fonte: Atlas Socioeconômico do RS — atlassocioeconomico.rs.gov.br
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* RF1 */}
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF1</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Centro-Sul</li>
                  <li className="font-semibold">Metropolitano Delta do Jacuí</li>
                  <li className="font-semibold">Paranhana Encosta da Serra</li>
                  <li className="font-semibold">Vale do Caí</li>
                  <li className="font-semibold">Vale do Rio dos Sinos</li>
                </ul>
              </div>
              {/* RF2 */}
              <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF2</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Vale do Rio Pardo</li>
                  <li className="font-semibold">Vale do Taquari</li>
                </ul>
              </div>
              {/* RF3 */}
              <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF3</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Campos de Cima da Serra</li>
                  <li className="font-semibold">Hortênsias</li>
                  <li className="font-semibold">Serra</li>
                </ul>
              </div>
              {/* RF4 */}
              <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF4</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Litoral</li>
                </ul>
              </div>
              {/* RF5 */}
              <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF5</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Sul</li>
                </ul>
              </div>
              {/* RF6 */}
              <div className="bg-pink-50 rounded-lg p-6 border-l-4 border-pink-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF6</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Campanha</li>
                  <li className="font-semibold">Fronteira Oeste</li>
                </ul>
              </div>
              {/* RF7 */}
              <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF7</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Celeiro</li>
                  <li className="font-semibold">Fronteira Noroeste</li>
                  <li className="font-semibold">Missões</li>
                  <li className="font-semibold">Noroeste Colonial</li>
                </ul>
              </div>
              {/* RF8 */}
              <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF8</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Alto Jacuí</li>
                  <li className="font-semibold">Central</li>
                  <li className="font-semibold">Jacuí Centro</li>
                  <li className="font-semibold">Vale do Jaguari</li>
                </ul>
              </div>
              {/* RF9 */}
              <div className="bg-cyan-50 rounded-lg p-6 border-l-4 border-cyan-500">
                <h4 className="text-lg font-bold text-[#001f5c] mb-3">RF9</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li className="font-semibold">Alto da Serra do Botucaraí</li>
                  <li className="font-semibold">Médio Alto Uruguai</li>
                  <li className="font-semibold">Nordeste</li>
                  <li className="font-semibold">Norte</li>
                  <li className="font-semibold">Produção</li>
                  <li className="font-semibold">Rio da Várzea</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h3 className="text-3xl font-bold text-[#001f5c] mb-8 text-center">Sobre o Portal</h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-4">
                O Portal Coredes em Números é uma plataforma interativa desenvolvida pela Faccat (Faculdades Integradas de Taquara) para disponibilizar indicadores socioeconômicos dos municípios e Coredes do Rio Grande do Sul.
              </p>
              <p className="text-gray-700 mb-4">
                O portal integra dados de múltiplas fontes oficiais: IDESE — Índice de Desenvolvimento Socioeconômico; IGM — Índice de Gestão Municipal; IDSC — Índice de Desenvolvimento Sustentável das Cidades; IPS Brasil — Índice de Progresso Social; e estatísticas de segurança pública da SSP/RS — Secretaria da Segurança Pública do Rio Grande do Sul.
              </p>
              <p className="text-gray-700">
                Todos os dados são atualizados regularmente e podem ser filtrados por Região Funcional, Corede ou Município, permitindo análises detalhadas e comparativas.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#001f5c] text-white py-8 mt-12">
          <div className="container text-center">
            <p className="font-semibold">Portal Coredes em Números | Faculdades Integradas de Taquara (Faccat)</p>
            <p className="text-gray-300 text-sm mt-2">Responsável pela compilação dos dados: Prof. Marcos Paulo Dhein Griebeler — marcosdhein@faccat.br</p>
            <p className="text-gray-400 text-xs mt-2">Dados atualizados até: Junho/2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
