import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { eq } from 'drizzle-orm';
import {
  regioesFuncionais,
  coredes,
  municipios,
} from '../drizzle/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hierarchyPath = path.join(__dirname, '../hierarchy.json');
const hierarchyData = JSON.parse(fs.readFileSync(hierarchyPath, 'utf-8'));

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

async function importHierarchy() {
  const pool = mysql.createPool(connection);
  const db = drizzle(pool);

  try {
    console.log('🚀 Iniciando importação de hierarquia territorial...\n');

    // 1. Importar Regiões Funcionais
    console.log('📍 Importando Regiões Funcionais...');
    const rfData = Object.keys(hierarchyData).map((rf) => ({
      codigo: rf,
      nome: `Região Funcional ${rf}`,
      descricao: null,
    }));

    for (const rf of rfData) {
      await db
        .insert(regioesFuncionais)
        .values(rf)
        .onDuplicateKeyUpdate({ set: { nome: rf.nome } });
    }
    console.log(`✅ ${rfData.length} Regiões Funcionais importadas\n`);

    // 2. Importar Coredes e Municípios
    console.log('🏘️  Importando Coredes e Municípios...');
    let coredeCount = 0;
    let municipioCount = 0;

    for (const [rfCode, rfData] of Object.entries(hierarchyData)) {
      // Get RF ID
      const rfResult = await db
        .select()
        .from(regioesFuncionais)
        .where(eq(regioesFuncionais.codigo, rfCode));
      
      if (rfResult.length === 0) {
        console.error(`❌ RF ${rfCode} não encontrada`);
        continue;
      }

      const rfId = rfResult[0].id;

      // Process each Corede
      for (const [coredeName, municipiosList] of Object.entries(rfData)) {
        // Insert Corede
        const coredeResult = await db
          .insert(coredes)
          .values({
            nome: coredeName,
            regiaoFuncionalId: rfId,
            descricao: null,
          })
          .onDuplicateKeyUpdate({ set: { regiaoFuncionalId: rfId } });

        // Get Corede ID
        const coredeQuery = await db
          .select()
          .from(coredes)
          .where(eq(coredes.nome, coredeName));
        
        if (coredeQuery.length === 0) {
          console.error(`❌ Corede ${coredeName} não encontrada`);
          continue;
        }

        const coredeId = coredeQuery[0].id;
        coredeCount++;

        // Insert Municípios
        for (const [codigoIbge, municipioName] of municipiosList) {
          await db
            .insert(municipios)
            .values({
              codigoIbge,
              nome: municipioName,
              coredeId,
              regiaoFuncionalId: rfId,
              latitude: null,
              longitude: null,
            })
            .onDuplicateKeyUpdate({
              set: {
                nome: municipioName,
                coredeId,
                regiaoFuncionalId: rfId,
              },
            });
          municipioCount++;
        }
      }
    }

    console.log(`✅ ${coredeCount} Coredes importadas`);
    console.log(`✅ ${municipioCount} Municípios importados\n`);

    console.log('🎉 Importação concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante importação:', error);
    process.exit(1);
  }
}

importHierarchy();
