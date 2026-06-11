import { useLocation } from "wouter";

interface RegionalFunctional {
  id: string;
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
    coords: { x: 60, y: 65, width: 25, height: 20 }, // Metropolitano - direita inferior
  },
  {
    id: "RF2",
    coords: { x: 50, y: 48, width: 22, height: 22 }, // Vale do Taquari - centro
  },
  {
    id: "RF3",
    coords: { x: 65, y: 30, width: 20, height: 25 }, // Serra - direita superior
  },
  {
    id: "RF4",
    coords: { x: 75, y: 60, width: 12, height: 18 }, // Litoral - extrema direita
  },
  {
    id: "RF5",
    coords: { x: 50, y: 72, width: 18, height: 22 }, // Sul - centro-sul
  },
  {
    id: "RF6",
    coords: { x: 25, y: 60, width: 25, height: 25 }, // Fronteira - esquerda
  },
  {
    id: "RF7",
    coords: { x: 20, y: 30, width: 30, height: 32 }, // Noroeste - esquerda superior
  },
  {
    id: "RF8",
    coords: { x: 38, y: 42, width: 20, height: 25 }, // Central - centro-oeste
  },
  {
    id: "RF9",
    coords: { x: 48, y: 15, width: 35, height: 30 }, // Norte - topo
  },
];

export default function InteractiveMapCOREDEs() {
  const [, navigate] = useLocation();

  const handleRFClick = (rfId: string) => {
    navigate(`/portal?rf=${rfId}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Imagem do mapa - LIMPA E CENTRALIZADA, SEM NENHUM ELEMENTO EXTRA */}
      <img
        src="/manus-storage/pasted_file_CZkmI9_image_c5b60359.png"
        alt="Mapa de COREDEs e Regiões Funcionais do RS"
        className="w-full h-auto block"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        }}
      />

      {/* SVG overlay com áreas clicáveis INVISÍVEIS - SEM NENHUMA EXIBIÇÃO VISUAL */}
      <svg
        className="absolute inset-0 w-full h-full"
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
          pointerEvents: "auto",
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
            strokeWidth="0"
            onClick={() => handleRFClick(rf.id)}
            style={{ 
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
