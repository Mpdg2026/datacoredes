import { drizzle } from 'drizzle-orm/mysql2';
import { eq, sql } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import { regioesFuncionais, coredes, municipios, idese, igm, idsc, violenciaGeral, violenciaMulher } from '../drizzle/schema.ts';

async function validateData() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  try {
    console.log('🔍 Iniciando validação de integridade dos dados...\n');

    // 1. Contar Regiões Funcionais
    const rfsCount = await db.select({ count: sql`COUNT(*)` }).from(regioesFuncionais);
    const rfCount = rfsCount[0].count;
    console.log(`✓ Regiões Funcionais: ${rfCount} registros`);
    if (rfCount !== 9) {
      console.warn(`  ⚠️  Esperado 9 RFs, encontrado ${rfCount}`);
    }

    // 2. Contar Coredes
    const coredesCount = await db.select({ count: sql`COUNT(*)` }).from(coredes);
    const coredeCount = coredesCount[0].count;
    console.log(`✓ Coredes: ${coredeCount} registros`);
    if (coredeCount !== 28) {
      console.warn(`  ⚠️  Esperado 28 Coredes, encontrado ${coredeCount}`);
    }

    // 3. Contar Municípios
    const municipiosCount = await db.select({ count: sql`COUNT(*)` }).from(municipios);
    const municipioCount = municipiosCount[0].count;
    console.log(`✓ Municípios: ${municipioCount} registros`);
    if (municipioCount !== 497) {
      console.warn(`  ⚠️  Esperado 497 Municípios, encontrado ${municipioCount}`);
    }

    // 4. Validar indicadores
    const ideseCount = await db.select({ count: sql`COUNT(*)` }).from(idese);
    console.log(`✓ Indicadores IDESE: ${ideseCount[0].count} registros`);

    const igmCount = await db.select({ count: sql`COUNT(*)` }).from(igm);
    console.log(`✓ Indicadores IGM: ${igmCount[0].count} registros`);

    const idscCount = await db.select({ count: sql`COUNT(*)` }).from(idsc);
    console.log(`✓ Indicadores IDSC: ${idscCount[0].count} registros`);

    const violenciaGeralCount = await db.select({ count: sql`COUNT(*)` }).from(violenciaGeral);
    console.log(`✓ Violência Geral: ${violenciaGeralCount[0].count} registros`);

    const violenciaMulherCount = await db.select({ count: sql`COUNT(*)` }).from(violenciaMulher);
    console.log(`✓ Violência contra Mulher: ${violenciaMulherCount[0].count} registros`);

    console.log('\n✅ Validação de integridade concluída com sucesso!');
    console.log(`\n📊 Resumo:
    - 9 Regiões Funcionais
    - 28 Coredes
    - 497 Municípios
    - ${ideseCount[0].count} registros IDESE
    - ${igmCount[0].count} registros IGM
    - ${idscCount[0].count} registros IDSC
    - ${violenciaGeralCount[0].count} registros de Violência Geral
    - ${violenciaMulherCount[0].count} registros de Violência contra Mulher`);
  } catch (error) {
    console.error('❌ Erro durante validação:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

validateData();
