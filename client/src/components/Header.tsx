import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useLocation } from 'wouter';

interface HeaderProps {
  onHomeClick?: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  const [, navigate] = useLocation();

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-[#001f5c] to-[#003d99] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo FACCAT */}
          <a
            href="https://www2.faccat.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Acesse o site da FACCAT"
          >
            <img
              src="/manus-storage/faccat-logo_9b29a3bf.png"
              alt="FACCAT Logo"
              className="h-12 w-auto"
            />
          </a>

          {/* Título Central */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-white">Portal Coredes em Números</h1>
            <p className="text-sm text-blue-100 mt-1">Indicadores Socioeconômicos do RS</p>
          </div>

          {/* Logo Mestrado */}
          <a
            href="https://www.faccat.br/mestrado"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Acesse o site do Mestrado em Desenvolvimento Regional"
          >
            <img
              src="/manus-storage/mestrado-logo_efa81ce8.png"
              alt="Mestrado em Desenvolvimento Regional"
              className="h-12 w-auto"
            />
          </a>

          {/* Botão Home */}
          <Button
            onClick={handleHomeClick}
            variant="outline"
            size="sm"
            className="bg-[#f4b41a] text-[#001f5c] border-[#f4b41a] hover:bg-[#e0a317] hover:text-[#001f5c]"
            title="Voltar à página inicial"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </header>
  );
}
