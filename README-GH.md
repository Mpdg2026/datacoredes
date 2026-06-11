# DataCoredes - Indicadores Socioeconômicos do RS

Portal interativo com indicadores de desenvolvimento, governança, saúde, educação e sustentabilidade dos 497 municípios gaúchos, organizados por Região Funcional e COREDE.

## 🌐 Acesso

**Website:** https://datacoredes.org

## 📊 Indicadores Disponíveis

- **Dados Populacionais** - Censo IBGE 2010 e 2022
- **Desenvolvimento Humano** - IDHM 2010
- **Governança Municipal** - Índice de Gestão Municipal (IGM) 2025
- **Economia** - Indicadores econômicos municipais
- **Educação** - Índice de Aplicação em Educação (TCE-RS) 2021-2025
- **Saúde** - Índice de Aplicação em ASPS (TCE-RS) 2021-2025
- **Legislativo** - Gestão Fiscal das Câmaras Municipais (TCE-RS) 2021-2025
- **Saneamento** - Cobertura de saneamento básico
- **Sustentabilidade** - Índice de Desenvolvimento Sustentável das Cidades (IDSC) 2023-2025
- **Violência** - Estatísticas de violência e indicadores criminais 2020-2026
- **Violência Contra a Mulher** - Indicadores de violência de gênero 2020-2026
- **Progresso Social** - Índice de Progresso Social (IPS Brasil) 2024-2026

## 🏗️ Estrutura Hierárquica

Os dados são organizados em três níveis:

1. **Região Funcional (RF)** - 10 regiões funcionais do RS
2. **COREDE** - Conselho Regional de Desenvolvimento
3. **Município** - 497 municípios gaúchos

## 🛠️ Tecnologia

- **Frontend:** React 19 + Tailwind CSS 4 + TypeScript
- **Backend:** Express 4 + tRPC 11
- **Database:** MySQL/TiDB
- **Hosting:** GitHub Pages
- **Build:** Vite

## 📝 Fontes de Dados

- **IBGE** - Instituto Brasileiro de Geografia e Estatística
- **TCE-RS** - Tribunal de Contas do Estado do Rio Grande do Sul
- **DATASUS** - Departamento de Informática do SUS
- **INEP** - Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira
- **IDSC** - Índice de Desenvolvimento Sustentável das Cidades
- **IPS Brasil** - Índice de Progresso Social Brasil

## 🚀 Deploy

O site é automaticamente deployado para GitHub Pages quando há push na branch `main`.

### Workflow de Deploy

1. Push para `main` ativa o workflow GitHub Actions
2. Build do projeto com Vite
3. Deploy automático para GitHub Pages
4. HTTPS ativado automaticamente
5. Domínio customizado `datacoredes.org` configurado

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Última atualização:** 2026-06-10
