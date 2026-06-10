import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, TrendingUp, DollarSign, Leaf, Shield } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'population',
    label: '👥 População',
    children: [
      { id: 'dados-populacionais', label: 'Dados Populacionais' },
    ],
  },
  {
    id: 'development',
    label: '🏛️ Desenvolvimento',
    children: [
      { id: 'idhm', label: 'Desenvolvimento Humano' },
      { id: 'igm', label: 'Governança (IGM)' },
      { id: 'economia', label: 'Economia' },
    ],
  },
  {
    id: 'public-management',
    label: '💰 Gestão Pública (TCE-RS)',
    children: [
      { id: 'educacao', label: 'Educação' },
      { id: 'saude', label: 'Saúde' },
      { id: 'legislativo', label: 'Legislativo' },
    ],
  },
  {
    id: 'sustainability',
    label: '🌱 Sustentabilidade',
    children: [
      { id: 'saneamento', label: 'Saneamento' },
      { id: 'ods', label: 'Sustentabilidade (ODS)' },
    ],
  },
  {
    id: 'security',
    label: '🔒 Segurança',
    children: [
      { id: 'violencia', label: 'Violência' },
      { id: 'violencia-mulher', label: 'Violência Contra a Mulher' },
      { id: 'ips', label: 'IPS' },
    ],
  },
];

export default function Sidebar({ activeTab, onTabChange, isOpen = true, onClose }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['population', 'development', 'public-management', 'sustainability', 'security'])
  );

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    // Fechar sidebar no mobile após clicar
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-[#001f5c] text-white overflow-y-auto z-50 transform transition-transform duration-300 md:relative md:transform-none md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ paddingTop: '80px' }}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-6 text-[#f4b41a]">📊 DataCoredes</h2>

          <nav className="space-y-2">
            {menuItems.map((group) => (
              <div key={group.id}>
                {/* Grupo expansível */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#003d99] transition-colors text-sm font-medium"
                >
                  <span>{group.label}</span>
                  {expandedGroups.has(group.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {/* Itens do grupo */}
                {expandedGroups.has(group.id) && group.children && (
                  <div className="ml-2 space-y-1 border-l border-[#003d99] pl-2">
                    {group.children.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeTab === item.id
                            ? 'bg-[#f4b41a] text-[#001f5c] font-semibold'
                            : 'text-white hover:bg-[#003d99]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
