// Run ONCE with internet: downloads every exercise photo into public/exercise-photos
// and rewrites src/data/exercisePhotos.ts to use the local copies (so the APK works offline).
import fs from 'node:fs';
import path from 'node:path';

const file = 'src/data/exercisePhotos.ts';
let src = fs.readFileSync(file, 'utf8');
const urls = [...new Set([...src.matchAll(/'(https:\/\/[^']+)'/g)].map(m => m[1]))];
fs.mkdirSync('public/exercise-photos', { recursive: true });

let ok = 0;
for (const url of urls) {
  const name = url.split('/exercises/')[1]?.replace(/\//g, '_') ?? path.basename(url);
  const dest = `public/exercise-photos/${name}`;
  try {
    if (!fs.existsSync(dest)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    }
    src = src.split(`'${url}'`).join(`'/exercise-photos/${name}'`);
    ok++;
  } catch (e) {
    console.warn('FAILED (kept online URL):', url, e.message);
  }
}
fs.writeFileSync(file, src);
console.log(`Done: ${ok}/${urls.length} photos saved locally.`);
