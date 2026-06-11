import { useAuth } from "@/_core/hooks/useAuth";
import InteractiveMapCOREDEs from "@/components/InteractiveMapCOREDEs";
import { getLoginUrl } from "@/const";

/**
 * DataCoredes - Landing Page
 */
export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#001f5c] to-[#003d99] text-white py-20">
          <div className="container text-center">
            <p className="text-xl text-gray-300 mb-8">Acesse indicadores de desenvolvimento, governança, saúde, educação e sustentabilidade dos 497 municípios gaúchos — organizados por Região Funcional e COREDE.</p>
            
            {/* Mapa Interativo */}
            <div className="my-12 bg-white rounded-lg p-8 shadow-md">
              <InteractiveMapCOREDEs />
            </div>
            
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
            <h3 className="text-3xl font-bold text-[#001f5c] mb-8 text-center">Sobre o DataCoredes</h3>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-700 mb-4">
                DataCoredes é uma plataforma interativa desenvolvida pela Faccat (Faculdades Integradas de Taquara) para disponibilizar indicadores socioeconômicos dos municípios e Coredes do Rio Grande do Sul.
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

        {/* Links Úteis Section */}
        <section className="py-16">
          <div className="container">
            <h3 className="text-3xl font-bold text-[#001f5c] mb-12 text-center">Links Úteis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Coredes RS */}
              <a
                href="https://conselhosregionais.rs.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">Coredes RS</h4>
                <p className="text-gray-600 text-sm">Conselhos Regionais de Desenvolvimento do RS</p>
              </a>

              {/* Atlas Socioeconômico */}
              <a
                href="https://atlassocioeconomico.rs.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">Atlas Socioeconômico RS</h4>
                <p className="text-gray-600 text-sm">Indicadores socioeconômicos e territoriais do RS</p>
              </a>

              {/* IBGE Cidades */}
              <a
                href="https://cidades.ibge.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">IBGE Cidades</h4>
                <p className="text-gray-600 text-sm">Dados municipais do Instituto Brasileiro de Geografia e Estatística</p>
              </a>

              {/* PNUD Brasil */}
              <a
                href="https://br.undp.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">PNUD Brasil</h4>
                <p className="text-gray-600 text-sm">Programa das Nações Unidas para o Desenvolvimento</p>
              </a>

              {/* Consulta Popular RS */}
              <a
                href="https://consultapopular.rs.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">Consulta Popular RS</h4>
                <p className="text-gray-600 text-sm">Participação cidadã nas decisões de investimento do Estado</p>
              </a>

              {/* IPEA */}
              <a
                href="https://ipea.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">IPEA</h4>
                <p className="text-gray-600 text-sm">Instituto de Pesquisa Econômica Aplicada</p>
              </a>

              {/* MDIR */}
              <a
                href="https://mdr.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">MDIR</h4>
                <p className="text-gray-600 text-sm">Ministério do Desenvolvimento e Integração Regional</p>
              </a>

              {/* ENCE/IBGE */}
              <a
                href="https://ence.ibge.gov.br/index.php/trilhas/ceplam"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">ENCE/IBGE</h4>
                <p className="text-gray-600 text-sm">Escola Nacional de Ciências Estatísticas - Trilhas CEPLAM</p>
              </a>

              {/* CIAP */}
              <a
                href="https://ciap.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#f4b41a] hover:shadow-lg transition-shadow"
              >
                <h4 className="text-xl font-bold text-[#001f5c] mb-2">CIAP</h4>
                <p className="text-gray-600 text-sm">Centro de Integração de Análise e Planejamento</p>
              </a>
            </div>
          </div>
        </section>

        {/* Footer is now global in App.tsx */}
      </main>
    </div>
  );
}
