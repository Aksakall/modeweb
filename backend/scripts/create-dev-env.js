import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const backendDir = join(scriptDir, '..');
const envPath = join(backendDir, '.env');
const examplePath = join(backendDir, '.env.example');

if (existsSync(envPath)) {
  console.log('backend/.env zaten var. Mevcut dosyaya dokunulmadı.');
  process.exit(0);
}

if (!existsSync(examplePath)) {
  console.error('backend/.env.example bulunamadı. Önce örnek env dosyasını kontrol edin.');
  process.exit(1);
}

copyFileSync(examplePath, envPath);
console.log('backend/.env oluşturuldu. Local PostgreSQL ve admin test bilgileri hazır.');
