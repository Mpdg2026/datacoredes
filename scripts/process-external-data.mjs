import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ler dados já processados
const odsDataPath = path.join(__dirname, '../public/ods-data.json');
const saneamentoDataPath = path.join(__dirname, '../public/saneamento-data.json');

console.log('Verificando dados processados...');

if (fs.existsSync(odsDataPath)) {
  const odsData = JSON.parse(fs.readFileSync(odsDataPath, 'utf-8'));
  console.log(`✅ ODS Data: ${Object.keys(odsData).length} anos carregados`);
  console.log(`   - 2023: ${odsData['2023']?.length || 0} municípios`);
  console.log(`   - 2024: ${odsData['2024']?.length || 0} municípios`);
  console.log(`   - 2025: ${odsData['2025']?.length || 0} municípios`);
} else {
  console.log('⚠️  ODS Data não encontrado');
}

if (fs.existsSync(saneamentoDataPath)) {
  const sanData = JSON.parse(fs.readFileSync(saneamentoDataPath, 'utf-8'));
  console.log(`✅ Saneamento Data: ${sanData.length} registros carregados`);
  
  // Extrair indicadores principais
  if (sanData.length > 0) {
    const firstRecord = sanData[0];
    const keys = Object.keys(firstRecord);
    console.log(`   - Total de colunas: ${keys.length}`);
    console.log(`   - Primeiras colunas: ${keys.slice(0, 5).join(', ')}`);
  }
} else {
  console.log('⚠️  Saneamento Data não encontrado');
}

console.log('\n✅ Processamento concluído!');
