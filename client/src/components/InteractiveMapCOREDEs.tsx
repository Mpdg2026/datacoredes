import { useState } from "react";
import { useLocation } from "wouter";

interface RegionalFunctional {
  id: string;
  name: string;
  coredes: string[];
  coords: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const REGIOES_FUNCIONAIS: RegionalFunctional[] = [
  {
    id: "RF1",
    name: "RF 1 - Metropolitano",
    coredes: [
      "Metropolitano Delta do Jacuí",
      "Centro-Sul",
      "Paranhana Encosta da Serra",
      "Vale do Caí",
      "Vale do Rio dos Sinos",
      "Litoral",
    ],
    coords: { x: 65, y: 70, width: 20, height: 15 },
  },
  {
    id: "RF2",
    name: "RF 2 - Vale do Taquari",
    coredes: ["Vale do Taquari", "Vale do Rio Pardo", "Jacuí Centro", "Alto da Serra do Botucaraí"],
    coords: { x: 55, y: 50, width: 18, height: 18 },
  },
  {
    id: "RF3",
    name: "RF 3 - Serra",
    coredes: ["Serra", "Hortênsias", "Campos de Cima da Serra"],
    coords: { x: 70, y: 35, width: 15, height: 18 },
  },
  {
    id: "RF4",
    name: "RF 4 - Litoral",
    coredes: ["Litoral (Região dos Lagos)"],
    coords: { x: 75, y: 65, width: 8, height: 12 },
  },
  {
    id: "RF5",
    name: "RF 5 - Sul",
    coredes: ["Sul"],
    coords: { x: 55, y: 75, width: 15, height: 18 },
  },
  {
    id: "RF6",
    name: "RF 6 - Fronteira",
    coredes: ["Fronteira Oeste", "Campanha"],
    coords: { x: 30, y: 65, width: 20, height: 20 },
  },
  {
    id: "RF7",
    name: "RF 7 - Noroeste",
    coredes: ["Fronteira Noroeste", "Missões", "Noroeste Colonial", "Celeiro"],
    coords: { x: 25, y: 35, width: 25, height: 25 },
  },
  {
    id: "RF8",
    name: "RF 8 - Central",
    coredes: ["Central", "Vale do Jaguari", "Alto Jacuí"],
    coords: { x: 40, y: 45, width: 18, height: 20 },
  },
  {
    id: "RF9",
    name: "RF 9 - Norte",
    coredes: ["Norte", "Nordeste", "Produção", "Médio Alto Uruguai", "Rio da Várzea"],
    coords: { x: 50, y: 20, width: 30, height: 25 },
  },
];

export default function InteractiveMapCOREDEs() {
  const [hoveredRF, setHoveredRF] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [, navigate] = useLocation();

  const handleRFClick = (rfId: string) => {
    navigate(`/portal?rf=${rfId}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, rf: RegionalFunctional) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredRF(rf.id);
  };

  return (
    <div className="flex flex-col items-center gap-6 my-12">
      <div className="relative w-full max-w-2xl">
        {/* Mapa base */}
        <div className="relative inline-block w-full">
          <img
            src="/assets/mapa-coredes-rs.png"
            alt="Mapa de COREDEs e Regiões Funcionais do RS"
            className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200"
          />

          {/* Áreas clicáveis sobrepostas */}
          <svg
            className="absolute inset-0 w-full h-full rounded-lg cursor-pointer"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {REGIOES_FUNCIONAIS.map((rf) => (
              <g key={rf.id}>
                <rect
                  x={rf.coords.x}
                  y={rf.coords.y}
                  width={rf.coords.width}
                  height={rf.coords.height}
                  fill="transparent"
                  stroke={hoveredRF === rf.id ? "#f4b41a" : "transparent"}
                  strokeWidth="0.5"
                  className="transition-all duration-200 hover:fill-yellow-300 hover:fill-opacity-10"
                  onClick={() => handleRFClick(rf.id)}
                  onMouseEnter={() => setHoveredRF(rf.id)}
                  onMouseLeave={() => setHoveredRF(null)}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Tooltip */}
        {hoveredRF && (
          <div
            className="absolute bg-[#001f5c] text-white px-3 py-2 rounded shadow-lg text-xs z-50 pointer-events-none max-w-xs"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 60}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="font-bold text-yellow-400 mb-1">
              {REGIOES_FUNCIONAIS.find((rf) => rf.id === hoveredRF)?.name}
            </div>
            <div className="text-gray-200 text-xs">
              {REGIOES_FUNCIONAIS.find((rf) => rf.id === hoveredRF)?.coredes.join(" • ")}
            </div>
            <div className="text-gray-400 text-xs mt-1">Clique para filtrar</div>
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="text-center text-sm text-gray-600">
        <p className="font-medium">Fonte: SEPLAG/DEPLAN — Regiões Funcionais de Planejamento do RS (2011)</p>
        <p className="text-xs text-gray-500 mt-1">Clique em uma região para filtrar indicadores</p>
      </div>
    </div>
  );
}
