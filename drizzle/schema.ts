import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, year } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Portal Coredes em Números - Tabelas de Dados Territoriais e Indicadores

// Tabela de Regiões Funcionais
export const regioesFuncionais = mysqlTable("regioes_funcionais", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 10 }).notNull().unique(), // RF1, RF2, ..., RF9
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
});

export type RegiaoFuncional = typeof regioesFuncionais.$inferSelect;
export type InsertRegiaoFuncional = typeof regioesFuncionais.$inferInsert;

// Tabela de Coredes
export const coredes = mysqlTable("coredes", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull().unique(),
  regiaoFuncionalId: int("regiao_funcional_id").notNull(),
  descricao: text("descricao"),
});

export type Corede = typeof coredes.$inferSelect;
export type InsertCorede = typeof coredes.$inferInsert;

// Tabela de Municípios
export const municipios = mysqlTable("municipios", {
  id: int("id").autoincrement().primaryKey(),
  codigoIbge: int("codigo_ibge").notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  coredeId: int("corede_id").notNull(),
  regiaoFuncionalId: int("regiao_funcional_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
});

export type Municipio = typeof municipios.$inferSelect;
export type InsertMunicipio = typeof municipios.$inferInsert;

// Tabela de IDESE (Índice de Desenvolvimento Socioeconômico)
export const idese = mysqlTable("idese", {
  id: int("id").autoincrement().primaryKey(),
  municipioId: int("municipio_id").notNull(),
  ano: year("ano").notNull(),
  valor: decimal("valor", { precision: 5, scale: 3 }),
  fonte: varchar("fonte", { length: 255 }),
});

export type Idese = typeof idese.$inferSelect;
export type InsertIdese = typeof idese.$inferInsert;

// Tabela de IGM (Índice de Gestão Municipal)
export const igm = mysqlTable("igm", {
  id: int("id").autoincrement().primaryKey(),
  municipioId: int("municipio_id").notNull(),
  ano: year("ano").notNull(),
  dimensao1: decimal("dimensao1", { precision: 5, scale: 3 }), // Gestão Fiscal
  dimensao2: decimal("dimensao2", { precision: 5, scale: 3 }), // Gestão de Pessoas
  dimensao3: decimal("dimensao3", { precision: 5, scale: 3 }), // Gestão de Planejamento
  indiceConsolidado: decimal("indice_consolidado", { precision: 5, scale: 3 }),
  fonte: varchar("fonte", { length: 255 }),
});

export type Igm = typeof igm.$inferSelect;
export type InsertIgm = typeof igm.$inferInsert;

// Tabela de IDSC (Índice de Desenvolvimento Sustentável das Cidades)
export const idsc = mysqlTable("idsc", {
  id: int("id").autoincrement().primaryKey(),
  municipioId: int("municipio_id").notNull(),
  ano: year("ano").notNull(),
  pontuacao: decimal("pontuacao", { precision: 5, scale: 2 }),
  classificacao: varchar("classificacao", { length: 50 }),
  fonte: varchar("fonte", { length: 255 }),
});

export type Idsc = typeof idsc.$inferSelect;
export type InsertIdsc = typeof idsc.$inferInsert;

// Tabela de Violência Geral
export const violenciaGeral = mysqlTable("violencia_geral", {
  id: int("id").autoincrement().primaryKey(),
  municipioId: int("municipio_id").notNull(),
  ano: year("ano").notNull(),
  cvli: int("cvli"), // Crimes Violentos Letais Intencionais
  homicidios: int("homicidios"),
  latrocinio: int("latrocinio"),
  lesaoCorporalSeguida: int("lesao_corporal_seguida"),
  estupro: int("estupro"),
  outrosIndicadores: text("outros_indicadores"),
  fonte: varchar("fonte", { length: 255 }),
});

export type ViolenciaGeral = typeof violenciaGeral.$inferSelect;
export type InsertViolenciaGeral = typeof violenciaGeral.$inferInsert;

// Tabela de Violência contra a Mulher
export const violenciaMulher = mysqlTable("violencia_mulher", {
  id: int("id").autoincrement().primaryKey(),
  municipioId: int("municipio_id").notNull(),
  ano: year("ano").notNull(),
  violenciaFisica: int("violencia_fisica"),
  violenciaEmocional: int("violencia_emocional"),
  violenciaSexual: int("violencia_sexual"),
  violenciaPatrimonial: int("violencia_patrimonial"),
  violenciaMoral: int("violencia_moral"),
  femicidio: int("femicidio"),
  outrosIndicadores: text("outros_indicadores"),
  fonte: varchar("fonte", { length: 255 }),
});

export type ViolenciaMulher = typeof violenciaMulher.$inferSelect;
export type InsertViolenciaMulher = typeof violenciaMulher.$inferInsert;