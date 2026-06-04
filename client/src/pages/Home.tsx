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
            <h2 className="text-4xl font-bold mb-4">Indicadores Socioeconômicos do RS</h2>
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

        {/* Info Section */}
        <section className="bg-gray-50 py-16">
          <div className="container">
            <h3 className="text-3xl font-bold text-[#001f5c] mb-8 text-center">Sobre o Portal</h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-4">
                O Portal Coredes em Números é uma plataforma interativa desenvolvida pela Faccat (Faculdades Integradas de Taquara) para disponibilizar indicadores socioeconômicos dos municípios e Coredes do Rio Grande do Sul.
              </p>
              <p className="text-gray-700 mb-4">
                O portal integra dados de múltiplas fontes oficiais, incluindo o IDESE (Índice de Desenvolvimento Socioeconômico), IGM (Índice de Gestão Municipal), IDSC (Índice de Desenvolvimento Sustentável das Cidades), IPS Brasil (Índice de Progresso Social), e estatísticas de segurança pública.
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
            <p className="font-semibold">Portal Coredes em Números</p>
            <p className="text-gray-300 text-sm mt-2">Faculdades Integradas de Taquara (Faccat)</p>
            <p className="text-gray-400 text-xs mt-2">Dados atualizados até abril de 2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
