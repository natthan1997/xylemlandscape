import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const sourcePath = process.argv[2]
  ? path.resolve(repoRoot, process.argv[2])
  : path.resolve(repoRoot, 'vendor/thailand-geography-json/src/geography.json');

const outPath = process.argv[3]
  ? path.resolve(repoRoot, process.argv[3])
  : path.resolve(repoRoot, 'supabase/postal_code_areas.csv');

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[\n\r",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function normalizePostalCode(v) {
  const s = String(v ?? '').trim();
  // Dataset uses numbers; we keep 5-digit strings.
  const digits = s.replace(/\D/g, '');
  return digits.length ? digits.padStart(5, '0').slice(0, 5) : '';
}

function cleanThai(v) {
  return String(v ?? '').trim();
}

const raw = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
if (!Array.isArray(raw)) {
  throw new Error(`Unexpected dataset shape: expected array in ${sourcePath}`);
}

const seen = new Set();
const rows = [];

for (const r of raw) {
  const postal_code = normalizePostalCode(r.postalCode);
  const province = cleanThai(r.provinceNameTh);
  const district = cleanThai(r.districtNameTh);
  const subdistrict = cleanThai(r.subdistrictNameTh);

  if (!postal_code || !province || !district || !subdistrict) continue;

  const key = `${postal_code}|${province}|${district}|${subdistrict}`;
  if (seen.has(key)) continue;
  seen.add(key);

  rows.push({ postal_code, province, district, subdistrict });
}

rows.sort((a, b) =>
  a.postal_code.localeCompare(b.postal_code) ||
  a.province.localeCompare(b.province) ||
  a.district.localeCompare(b.district) ||
  a.subdistrict.localeCompare(b.subdistrict)
);

await fs.mkdir(path.dirname(outPath), { recursive: true });

const header = ['postal_code', 'province', 'district', 'subdistrict'];
const csv = [header.join(',')]
  .concat(rows.map((r) => header.map((h) => csvEscape(r[h])).join(',')))
  .join('\n');

await fs.writeFile(outPath, csv, 'utf8');

console.log(`Wrote ${rows.length.toLocaleString()} rows to ${path.relative(repoRoot, outPath)}`);
console.log(`Source: ${path.relative(repoRoot, sourcePath)}`);
