import * as fs from 'fs';
import * as path from 'path';
import XLSX from 'xlsx';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import {
  regioesFuncionais,
  coredes,
  municipios,
  idese,
  igm,
  idsc,
  violenciaGeral,
  violenciaMulher,
} from '../drizzle/schema.ts';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not set');
}

// Parse connection string
const url = new URL(DATABASE_URL);
const connection = {
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
};

async function importData() {
  const pool = mysql.createPool(connection);
  const db = drizzle(pool);

  const dataDir = '/home/ubuntu/data_portal/Dados Portal Coredes em Números - Nova Versão';

  try {
    console.log('🚀 Iniciando importação de dados...\n');

    // 1. Importar Regiões Funcionais
    console.log('📍 Importando Regiões Funcionais...');
    const rfData = [
      { codigo: 'RF1', nome: 'Região Funcional 1' },
      { codigo: 'RF2', nome: 'Região Funcional 2' },
      { codigo: 'RF3', nome: 'Região Funcional 3' },
      { codigo: 'RF4', nome: 'Região Funcional 4' },
      { codigo: 'RF5', nome: 'Região Funcional 5' },
      { codigo: 'RF6', nome: 'Região Funcional 6' },
      { codigo: 'RF7', nome: 'Região Funcional 7' },
      { codigo: 'RF8', nome: 'Região Funcional 8' },
      { codigo: 'RF9', nome: 'Região Funcional 9' },
    ];
    
    for (const rf of rfData) {
      await db.insert(regioesFuncionais).values(rf).onDuplicateKeyUpdate({ set: rf });
    }
    console.log('✅ Regiões Funcionais importadas\n');

    // 2. Importar Municípios, Coredes e Regiões Funcionais
    console.log('🏘️  Importando Municípios e Coredes...');
    const municipiosFile = path.join(
      dataDir,
      '09172616-tabela-dos-municipios-por-corede-e-regiao-funcional-de-planejamento.xlsx'
    );
    
    const workbook = XLSX.readFile(municipiosFile);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const municipiosData = XLSX.utils.sheet_to_json(sheet);

    // Mapear Coredes e Regiões Funcionais
    const coredesMap = new Map();
    const rfMap = new Map();

    for (const row of municipiosData) {
      const rfCodigo = row['REGIÃO FUNCIONAL'];
      const coredeName = row['COREDE'];
      const municipioName = row['MUNICÍPIO'];
      const codigoIbge = row['CODIGO IBGE'];

      // Obter ID da Região Funcional
      if (!rfMap.has(rfCodigo)) {
        const rf = await db.query.regioesFuncionais.findFirst({
          where: (table, { eq }) => eq(table.codigo, rfCodigo),
        });
        rfMap.set(rfCodigo, rf?.id);
      }

      // Criar ou obter Corede
      if (!coredesMap.has(coredeName)) {
        const rfId = rfMap.get(rfCodigo);
        const existingCorede = await db.query.coredes.findFirst({
          where: (table, { eq }) => eq(table.nome, coredeName),
        });

        if (existingCorede) {
          coredesMap.set(coredeName, existingCorede.id);
        } else {
          const result = await db.insert(coredes).values({
            nome: coredeName,
            regiaoFuncionalId: rfId,
          });
          coredesMap.set(coredeName, result[0].insertId);
        }
      }

      // Inserir Município
      const coredeId = coredesMap.get(coredeName);
      const rfId = rfMap.get(rfCodigo);

      await db
        .insert(municipios)
        .values({
          codigoIbge: parseInt(codigoIbge),
          nome: municipioName,
          coredeId,
          regiaoFuncionalId: rfId,
        })
        .onDuplicateKeyUpdate({
          set: {
            nome: municipioName,
            coredeId,
            regiaoFuncionalId: rfId,
          },
        });
    }
    console.log(`✅ ${municipiosData.length} Municípios importados\n`);

    // 3. Importar IDSC
    console.log('🌱 Importando IDSC 2023-2025...');
    const idscFile = path.join(dataDir, 'IDSC 2023-2025.xlsx');
    const idscWorkbook = XLSX.readFile(idscFile);
    const idscSheet = idscWorkbook.Sheets[idscWorkbook.SheetNames[0]];
    const idscData = XLSX.utils.sheet_to_json(idscSheet);

    for (const row of idscData) {
      const municipio = await db.query.municipios.findFirst({
        where: (table, { eq }) => eq(table.nome, row['Município']),
      });

      if (municipio) {
        await db
          .insert(idsc)
          .values({
            municipioId: municipio.id,
            ano: 2023,
            pontuacao: parseFloat(row['Pontuação Indice ODS 2023']),
            classificacao: row['Classificação 2023'],
            fonte: 'IDSC BR 2023-2025',
          })
          .onDuplicateKeyUpdate({
            set: {
              pontuacao: parseFloat(row['Pontuação Indice ODS 2023']),
              classificacao: row['Classificação 2023'],
            },
          });
      }
    }
    console.log(`✅ ${idscData.length} registros IDSC importados\n`);

    // 4. Importar IGM
    console.log('🏛️  Importando IGM 2025...');
    const igmFile = path.join(dataDir, 'IGM-2025.xlsx');
    const igmWorkbook = XLSX.readFile(igmFile);
    const igmSheet = igmWorkbook.Sheets[igmWorkbook.SheetNames[0]];
    const igmData = XLSX.utils.sheet_to_json(igmSheet);

    for (const row of igmData) {
      const municipioName = row['nome']?.toUpperCase() || '';
      const municipio = await db.query.municipios.findFirst({
        where: (table, { like }) => like(table.nome, `%${municipioName}%`),
      });

      if (municipio) {
        const dim1 = parseFloat(row['Gestão Fiscal - Dimensão IGM/CFA'] || 0);
        const dim2 = parseFloat(row['Gestão de Pessoas - Dimensão IGM/CFA'] || 0);
        const dim3 = parseFloat(row['Gestão de Planejamento - Dimensão IGM/CFA'] || 0);
        const consolidated = parseFloat(row['Desempenho - Dimensão IGM/CFA'] || 0);

        await db
          .insert(igm)
          .values({
            municipioId: municipio.id,
            ano: 2025,
            dimensao1: dim1 || null,
            dimensao2: dim2 || null,
            dimensao3: dim3 || null,
            indiceConsolidado: consolidated || null,
            fonte: 'IGM-CFA 2025',
          })
          .onDuplicateKeyUpdate({
            set: {
              dimensao1: dim1 || null,
              dimensao2: dim2 || null,
              dimensao3: dim3 || null,
              indiceConsolidado: consolidated || null,
            },
          });
      }
    }
    console.log(`✅ ${igmData.length} registros IGM importados\n`);

    console.log('✨ Importação concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante importação:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importData();
