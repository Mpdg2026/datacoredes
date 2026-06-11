import { useLocation } from "wouter";

interface RegionalFunctional {
  id: string;
  name: string;
  coords: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Coordenadas percentuais (0-100) para cada RF no mapa
const REGIOES_FUNCIONAIS: RegionalFunctional[] = [
  {
    id: "RF1",
    name: "RF 1",
    coords: { x: 60, y: 65, width: 25, height: 20 }, // Metropolitano - direita inferior
  },
  {
    id: "RF2",
    name: "RF 2",
    coords: { x: 50, y: 48, width: 22, height: 22 }, // Vale do Taquari - centro
  },
  {
    id: "RF3",
    name: "RF 3",
    coords: { x: 65, y: 30, width: 20, height: 25 }, // Serra - direita superior
  },
  {
    id: "RF4",
    name: "RF 4",
    coords: { x: 75, y: 60, width: 12, height: 18 }, // Litoral - extrema direita
  },
  {
    id: "RF5",
    name: "RF 5",
    coords: { x: 50, y: 72, width: 18, height: 22 }, // Sul - centro-sul
  },
  {
    id: "RF6",
    name: "RF 6",
    coords: { x: 25, y: 60, width: 25, height: 25 }, // Fronteira - esquerda
  },
  {
    id: "RF7",
    name: "RF 7",
    coords: { x: 20, y: 30, width: 30, height: 32 }, // Noroeste - esquerda superior
  },
  {
    id: "RF8",
    name: "RF 8",
    coords: { x: 38, y: 42, width: 20, height: 25 }, // Central - centro-oeste
  },
  {
    id: "RF9",
    name: "RF 9",
    coords: { x: 48, y: 15, width: 35, height: 30 }, // Norte - topo
  },
];

export default function InteractiveMapCOREDEs() {
  const [, navigate] = useLocation();

  const handleRFClick = (rfId: string) => {
    navigate(`/portal?rf=${rfId}`);
  };

  return (
    <div className="flex flex-col items-center gap-6 my-12">
      {/* Container do mapa com overlay */}
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Imagem do mapa - LIMPA E CENTRALIZADA */}
        <img
          src="/manus-storage/mapa-coredes-rs_0592a642.png"
          alt="Mapa de COREDEs e Regiões Funcionais do RS"
          className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-300 block"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        />

        {/* SVG overlay com áreas clicáveis - COORDENADAS PERCENTUAIS */}
        <svg
          className="absolute inset-0 w-full h-full rounded-lg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "8px",
          }}
        >
          {REGIOES_FUNCIONAIS.map((rf) => (
            <rect
              key={rf.id}
              x={rf.coords.x}
              y={rf.coords.y}
              width={rf.coords.width}
              height={rf.coords.height}
              fill="transparent"
              stroke="transparent"
              className="hover:fill-yellow-300 hover:fill-opacity-5 transition-all duration-200"
              onClick={() => handleRFClick(rf.id)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </svg>
      </div>

      {/* Legenda */}
      <div className="text-center text-sm text-gray-600">
        <p className="font-medium">Fonte: SEPLAG/DEPLAN — Regiões Funcionais de Planejamento do RS (2011)</p>
        <p className="text-xs text-gray-500 mt-1">Clique em uma região para filtrar indicadores</p>
      </div>
    </div>
  );
}
