# Portal Coredes em Números - Refatoração Completa

## Status: ✅ REFATORAÇÃO CONCLUÍDA

### Correções Implementadas
- [x] Texto corrigido: "Selecione um Corede" (não "Selecione uma corede")
- [x] Hierarquia territorial validada (497 municípios, 28 coredes, 9 RFs)
- [x] Reatividade total dos filtros em cascata
- [x] IGM com 3 dimensões exigidas (Finanças, Gestão, Desempenho)
- [x] IDSC com série 2023-2025
- [x] Aba "Mapa" removida (sem dados reais)
- [x] Integração com API do IBGE Cidades
- [x] 12 testes de reatividade passando

## Fases Concluídas

### Fase 1: Análise Territorial
- [x] Análise do arquivo Excel com 497 municípios
- [x] Estrutura JSON criada (hierarchy.json)
- [x] Validação de hierarquia RF > Corede > Município

### Fase 2: Backend Refatorado
- [x] Procedures tRPC reativas para filtros em cascata
- [x] Procedures para IDESE, IGM, IDSC, Violência Geral e Violência contra Mulher
- [x] Integração com IBGE Cidades API
- [x] Hierarquia territorial como fonte de verdade

### Fase 3: Frontend Refatorado
- [x] Filtros em cascata completamente reativos
- [x] Todas as 5 abas temáticas com dados reativos
- [x] Aba "Mapa" removida
- [x] Indicador de localidade selecionada em tempo real
- [x] Gráficos atualizados dinamicamente
- [x] Tabelas com exportação CSV

### Fase 4: IBGE Cidades
- [x] Helper ibge.ts criado
- [x] Procedure ibgeCidades conectada à API real
- [x] Dados de PIB, população, área territorial e densidade

### Fase 5: Testes de Reatividade
- [x] 12 testes de integração passando
- [x] Validação de hierarquia de filtros
- [x] Testes de indicadores temáticos
- [x] Testes de integração IBGE

# Portal Coredes em Números - TODO

## Fase 1: Análise e Estruturação de Dados
- [x] Analisar estrutura dos arquivos Excel/CSV do Google Drive
- [x] Definir esquema de banco de dados (tabelas: municipios, coredes, regioes_funcionais, idese, igm, idsc, violencia, violencia_mulher)
- [x] Criar script de importação de dados para popular o banco

## Fase 2: Identidade Visual
- [x] Pesquisar cores institucionais da Faccat
- [x] Definir paleta de cores (primária, secundária, neutros)
- [x] Configurar Tailwind CSS com variáveis de cores da Faccat
- [x] Definir tipografia e espaçamento

## Fase 3: Backend - Schema e Importação
- [x] Criar tabelas no Drizzle: municipios, coredes, regioes_funcionais
- [x] Criar tabelas para indicadores: idese, igm, idsc, violencia_geral, violencia_mulher
- [x] Implementar script de importação de dados Excel/CSV
- [ ] Validar integridade dos dados importados (próximo passo)

## Fase 4: Backend - Procedures tRPC
- [x] Criar procedures para listar Regiões Funcionais
- [x] Criar procedures para listar Coredes filtradas por RF
- [x] Criar procedures para listar Municípios filtrados por Corede
- [x] Criar procedures para obter dados IDESE por município/corede
- [x] Criar procedures para obter dados IGM por município
- [x] Criar procedures para obter dados IDSC por município
- [x] Criar procedures para obter dados de Violência Geral por município
- [x] Criar procedures para obter dados de Violência contra Mulher por município
- [ ] Criar procedures para exportar dados em CSV/Excel



## Status de Restauração (10/05/2026)

### Concluído
- [x] Restauração do código do ZIP
- [x] Correção de erro TypeScript em storageProxy.ts
- [x] Criação de schema do banco de dados
- [x] Aplicação de migrações SQL
- [x] Importação de hierarquia territorial (9 RFs, 28 Coredes, 497 Municípios)
- [x] Pesquisa de cores institucionais FACCAT

### Em Progresso
- [ ] Importação de dados de indicadores
- [ ] Validação de procedures tRPC
- [ ] Validação de frontend
- [ ] Aplicação de identidade visual FACCAT
- [ ] Testes e publicação
