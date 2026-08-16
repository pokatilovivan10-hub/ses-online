const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('landing includes the approved service, offer, license and legal copy', () => {
  [
    'Уничтожение клопов и тараканов',
    'Высокая температура пара уничтожает яйца и личинки клопов и тараканов',
    'Комплексная барьерная защита от проникновения насекомых',
    'Лицензия № Л064-00111-50/02006211',
    'от 1 990 ₽',
    'от 2 490 ₽',
    'от 3 190 ₽',
    '© 2011-2026 СЭС Москва. Все права защищены.',
    'ИП Репников Алексей Андреевич. ОГРН: 322508100080737',
    'Вызвать дезинфектора со скидкой'
  ].forEach(copy => assert.ok(source.includes(copy), `missing: ${copy}`));
});

test('online landing loads Gudok and redirects successful leads to thanks page', () => {
  assert.match(source, /mod\.gudok\.tel\/script\.js\?sid=/);
  assert.match(source, /k9e3j6xpn5/);
  assert.match(source, /window\.location\.assign\('\/thanks'\)/);
  assert.ok(fs.existsSync(path.join(root, 'thanks.html')), 'thanks page is missing');
});

test('build produces synchronized public assets', () => {
  const dist = path.join(root, 'dist');
  assert.equal(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'), source);
  assert.ok(fs.existsSync(path.join(dist, 'thanks.html')), 'built thanks page is missing');
});
