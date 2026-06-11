/**
 * Footer Component - Global sticky footer
 * Appears at the bottom of all pages and sections
 */
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#001f5c] text-white py-4 z-50 border-t border-gray-700">
      <div className="container flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex-1">
          <p className="font-semibold text-sm">
            DataCoredes | Faculdades Integradas de Taquara (FACCAT) — Programa de Pós-Graduação Mestrado em Desenvolvimento Regional
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Responsável pela compilação dos dados: Prof. Marcos Paulo Dhein Griebeler — marcosdhein@faccat.br
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Dados atualizados até: Junho/2026
          </p>
        </div>
      </div>
    </footer>
  );
}
