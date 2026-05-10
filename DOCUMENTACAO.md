# Portal Coredes em Números - Documentação de Uso

## Visão Geral

O **Portal Coredes em Números** é uma plataforma interativa de análise de indicadores socioeconômicos dos municípios e Coredes do Rio Grande do Sul. O portal oferece visualizações em tempo real através de gráficos, tabelas e filtros avançados.

## Acesso ao Portal

O portal está disponível em: **https://coredesport-hypsqkdb.manus.space**

## Funcionalidades Principais

### 1. Filtros em Cascata

O portal utiliza um sistema de filtros hierárquico que permite seleção progressiva:

- **Região Funcional (RF)**: Selecione uma das 9 regiões funcionais do RS (RF1 a RF9)
- **Corede**: Após selecionar uma RF, escolha uma das Coredes pertencentes àquela região
- **Município**: Após selecionar uma Corede, escolha um dos municípios da região

**Importante**: Os filtros funcionam em cascata - ao mudar a seleção de uma RF, as opções de Corede e Município são atualizadas automaticamente.

### 2. Abas Temáticas

O portal oferece 6 abas principais com diferentes indicadores:

#### **Aba 1: Desenvolvimento Humano (IDESE 2020)**

Apresenta o Índice de Desenvolvimento Socioeconômico (IDESE) dos municípios.

- **Gráfico**: Visualização em barras do IDESE ao longo dos anos
- **Tabela**: Dados detalhados com valores e fontes
- **Exportação**: Clique em "Exportar CSV" para baixar os dados em formato CSV

**Como interpretar**: Valores mais altos indicam maior desenvolvimento socioeconômico.

#### **Aba 2: Governança Municipal (IGM 2025)**

Apresenta o Índice de Gestão Municipal (IGM) 2025.

- **Gráfico**: Visualização em linhas mostrando evolução das dimensões de gestão
- **Dimensões**: Gestão Fiscal, Gestão de Pessoas e Índice Consolidado
- **Tabela**: Dados desagregados por dimensão
- **Exportação**: Disponível para todos os dados

**Como interpretar**: Valores mais altos indicam melhor gestão municipal. O índice consolidado oferece uma visão geral da qualidade da administração pública.

#### **Aba 3: Sustentabilidade (IDSC 2023-2025)**

Apresenta o Índice de Desenvolvimento Sustentável das Cidades (IDSC).

- **Gráfico**: Visualização em barras da pontuação de sustentabilidade
- **Classificação**: Categorias de desempenho (Excelente, Bom, Regular, Fraco)
- **Tabela**: Dados com pontuação e classificação
- **Exportação**: Disponível para análise comparativa

**Como interpretar**: O índice avalia o alinhamento com os Objetivos de Desenvolvimento Sustentável (ODS) da ONU.

#### **Aba 4: Segurança Pública**

Apresenta estatísticas de violência e indicadores criminais.

- **Gráfico**: Visualização em barras de CVLI (Crimes Violentos Letais Intencionais) e homicídios
- **Indicadores**: CVLI, homicídios e outros crimes violentos
- **Tabela**: Série histórica de indicadores criminais
- **Exportação**: Para análise de tendências de segurança

**Como interpretar**: Valores menores indicam melhor situação de segurança pública. CVLI é um indicador-chave de violência letal.

#### **Aba 5: Violência contra a Mulher**

Apresenta indicadores de violência de gênero.

- **Gráfico**: Visualização em barras de diferentes tipos de violência
- **Indicadores**: Violência física, sexual e femicídio
- **Tabela**: Série histórica 2020-2026
- **Exportação**: Para análise de políticas de proteção à mulher

**Como interpretar**: Valores menores indicam melhor proteção às mulheres. O femicídio é o indicador mais grave.

#### **Aba 6: Mapa**

Visualização geográfica dos indicadores (em desenvolvimento).

## Como Usar a Tabela de Dados

### Busca

Algumas tabelas possuem campo de busca. Digite um termo para filtrar os registros:

- Busca por nome de município
- Busca por Corede
- Busca por classificação ou categoria

### Paginação

As tabelas mostram 10 registros por página. Use os botões "Anterior" e "Próxima" para navegar:

- Botão **Anterior**: Vai para a página anterior
- Botão **Próxima**: Vai para a próxima página
- Indicador: Mostra a página atual e o total de registros

### Exportação

Clique em **"Exportar CSV"** para baixar os dados em formato CSV:

- O arquivo contém todos os registros filtrados (não apenas a página atual)
- Pode ser aberto em Excel, Google Sheets ou qualquer editor de planilhas
- Mantém a formatação e estrutura dos dados

## Interpretação dos Indicadores

### IDESE (Índice de Desenvolvimento Socioeconômico)

- **Escala**: 0 a 1
- **Componentes**: Educação, Renda e Saúde
- **Interpretação**: 
  - 0,800 ou mais: Muito Alto
  - 0,700 a 0,799: Alto
  - 0,600 a 0,699: Médio
  - Abaixo de 0,600: Baixo

### IGM (Índice de Gestão Municipal)

- **Escala**: 0 a 10
- **Dimensões**: Gestão Fiscal, Gestão de Pessoas, Gestão Patrimonial, etc.
- **Interpretação**:
  - 8,0 ou mais: Excelente
  - 6,0 a 7,9: Bom
  - 4,0 a 5,9: Regular
  - Abaixo de 4,0: Fraco

### IDSC (Índice de Desenvolvimento Sustentável das Cidades)

- **Escala**: 0 a 100
- **Baseado em**: 17 Objetivos de Desenvolvimento Sustentável (ODS)
- **Interpretação**:
  - 80 ou mais: Excelente
  - 60 a 79: Bom
  - 40 a 59: Regular
  - Abaixo de 40: Fraco

### Indicadores de Violência

- **CVLI**: Crimes Violentos Letais Intencionais (homicídios, latrocínios, lesão corporal seguida de morte)
- **Unidade**: Taxa por 100 mil habitantes
- **Interpretação**: Quanto menor, melhor

## Dicas de Uso

1. **Comparação Regional**: Use os filtros para comparar indicadores entre municípios da mesma Corede
2. **Análise Temporal**: Observe as tendências nos gráficos para identificar melhorias ou pioras
3. **Exportação para Relatórios**: Exporte os dados em CSV para incluir em relatórios e análises
4. **Múltiplas Abas**: Explore diferentes abas para ter uma visão holística do município
5. **Responsividade**: O portal funciona em desktop, tablet e mobile

## Suporte Técnico

Para dúvidas sobre os dados ou funcionalidades do portal, entre em contato com a equipe de desenvolvimento.

## Fontes de Dados

- **IDESE**: Secretaria de Planejamento, Orçamento e Gestão (SEPOG-RS)
- **IGM**: Tribunal de Contas do Estado (TCE-RS)
- **IDSC**: Instituto de Pesquisa Econômica Aplicada (IPEA)
- **Violência**: Secretaria de Segurança Pública (SSP-RS)
- **Violência contra Mulher**: Instituto de Segurança Pública (ISP-RJ) / SSP-RS

## Versão

Portal Coredes em Números v1.0.0 - Maio 2026
