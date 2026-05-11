import mysql from 'mysql2/promise';

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portal_coredes',
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : undefined,
};

async function validateData() {
  const connection = await mysql.createConnection(config);

  try {
    console.log('🔍 Iniciando validação de integridade dos dados...\n');

    // 1. Validar Regiões Funcionais
    const [rfs] = await connection.query('SELECT COUNT(*) as count FROM regioes_funcionais');
    const rfCount = rfs[0].count;
    console.log(`✓ Regiões Funcionais: ${rfCount} registros`);
    if (rfCount !== 9) {
      console.warn(`  ⚠️  Esperado 9 RFs, encontrado ${rfCount}`);
    }

    // 2. Validar Coredes
    const [coredes] = await connection.query('SELECT COUNT(*) as count FROM coredes');
    const coredeCount = coredes[0].count;
    console.log(`✓ Coredes: ${coredeCount} registros`);
    if (coredeCount !== 28) {
      console.warn(`  ⚠️  Esperado 28 Coredes, encontrado ${coredeCount}`);
    }

    // 3. Validar Municípios
    const [municipios] = await connection.query('SELECT COUNT(*) as count FROM municipios');
    const municipioCount = municipios[0].count;
    console.log(`✓ Municípios: ${municipioCount} registros`);
    if (municipioCount !== 497) {
      console.warn(`  ⚠️  Esperado 497 Municípios, encontrado ${municipioCount}`);
    }

    // 4. Validar relacionamentos RF → Corede
    const [rfCoredeCheck] = await connection.query(`
      SELECT COUNT(DISTINCT c.regiaoFuncionalId) as count 
      FROM coredes c 
      WHERE c.regiaoFuncionalId NOT IN (SELECT id FROM regioes_funcionais)
    `);
    if (rfCoredeCheck[0].count > 0) {
      console.warn(`  ⚠️  ${rfCoredeCheck[0].count} Coredes com RF inválida`);
    } else {
      console.log(`✓ Relacionamento RF → Corede: válido`);
    }

    // 5. Validar relacionamentos Corede → Município
    const [coredeMunicipioCheck] = await connection.query(`
      SELECT COUNT(DISTINCT m.coredeId) as count 
      FROM municipios m 
      WHERE m.coredeId NOT IN (SELECT id FROM coredes)
    `);
    if (coredeMunicipioCheck[0].count > 0) {
      console.warn(`  ⚠️  ${coredeMunicipioCheck[0].count} Municípios com Corede inválida`);
    } else {
      console.log(`✓ Relacionamento Corede → Município: válido`);
    }

    // 6. Validar duplicidades
    const [rfDuplicates] = await connection.query(`
      SELECT codigo, COUNT(*) as count FROM regioes_funcionais 
      GROUP BY codigo HAVING count > 1
    `);
    if (rfDuplicates.length > 0) {
      console.warn(`  ⚠️  ${rfDuplicates.length} RFs duplicadas`);
    } else {
      console.log(`✓ Sem duplicidades em Regiões Funcionais`);
    }

    const [coredeDuplicates] = await connection.query(`
      SELECT nome, COUNT(*) as count FROM coredes 
      GROUP BY nome HAVING count > 1
    `);
    if (coredeDuplicates.length > 0) {
      console.warn(`  ⚠️  ${coredeDuplicates.length} Coredes duplicadas`);
    } else {
      console.log(`✓ Sem duplicidades em Coredes`);
    }

    const [municipioDuplicates] = await connection.query(`
      SELECT nome, COUNT(*) as count FROM municipios 
      GROUP BY nome HAVING count > 1
    `);
    if (municipioDuplicates.length > 0) {
      console.warn(`  ⚠️  ${municipioDuplicates.length} Municípios duplicados`);
    } else {
      console.log(`✓ Sem duplicidades em Municípios`);
    }

    // 7. Validar indicadores
    const [idese] = await connection.query('SELECT COUNT(*) as count FROM idese');
    console.log(`✓ Indicadores IDESE: ${idese[0].count} registros`);

    const [igm] = await connection.query('SELECT COUNT(*) as count FROM igm');
    console.log(`✓ Indicadores IGM: ${igm[0].count} registros`);

    const [idsc] = await connection.query('SELECT COUNT(*) as count FROM idsc');
    console.log(`✓ Indicadores IDSC: ${idsc[0].count} registros`);

    const [violenciaGeral] = await connection.query('SELECT COUNT(*) as count FROM violencia_geral');
    console.log(`✓ Violência Geral: ${violenciaGeral[0].count} registros`);

    const [violenciaMulher] = await connection.query('SELECT COUNT(*) as count FROM violencia_mulher');
    console.log(`✓ Violência contra Mulher: ${violenciaMulher[0].count} registros`);

    console.log('\n✅ Validação de integridade concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante validação:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

validateData();
