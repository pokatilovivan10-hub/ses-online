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
  assert.match(source, /fetch\('\/api\/lead',/);
  assert.doesNotMatch(source, /fetch\('\/api\/lead\.php',/);
  assert.ok(fs.existsSync(path.join(root, 'thanks.html')), 'thanks page is missing');
  assert.match(source, /mc\.yandex\.ru\/metrika\/tag\.js\?id=111531771/);
  assert.match(source, /ym\(111531771, 'init'/);
  assert.match(source, /img\/specialist-v2\.jpg/);
});

test('online thank-you page includes the same Metrika counter', () => {
  const thanks = fs.readFileSync(path.join(root, 'thanks.html'), 'utf8');
  assert.match(thanks, /mc\.yandex\.ru\/metrika\/tag\.js\?id=111531771/);
  assert.match(thanks, /ym\(111531771, 'init'/);
  assert.match(thanks, /mc\.yandex\.ru\/watch\/111531771/);
});

test('replacement specialist image is present in source and build output', () => {
  for (const image of ['img/specialist-v2.jpg', path.join('dist', 'img', 'specialist-v2.jpg')]) {
    assert.ok(fs.existsSync(path.join(root, image)), `${image} is missing`);
    assert.ok(fs.statSync(path.join(root, image)).size > 100000, `${image} is unexpectedly small`);
  }
});

test('build produces synchronized public assets', () => {
  const dist = path.join(root, 'dist');
  assert.equal(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'), source);
  assert.ok(fs.existsSync(path.join(dist, 'thanks.html')), 'built thanks page is missing');
  assert.equal(fs.readFileSync(path.join(dist, 'api', 'lead.php'), 'utf8'), fs.readFileSync(path.join(root, 'api', 'lead.php'), 'utf8'));
});

test('Apache serves the thank-you page without bypassing canonical redirects', () => {
  const rules = fs.readFileSync(path.join(root, '.htaccess'), 'utf8');
  assert.match(rules, /RewriteRule \^thanks\/\?\$ thanks\.html \[END\]/);
  assert.match(rules, /RewriteRule \^api\/lead\/\?\$ api\/lead\.php \[END\]/);
  assert.ok(rules.indexOf('R=301') < rules.indexOf('^thanks/?$'), 'canonical redirect must run before internal thanks rewrite');
  assert.equal(fs.readFileSync(path.join(root, 'dist', '.htaccess'), 'utf8'), rules);
});

test('Docker build includes the source files required by the asset sync step', () => {
  const dockerfile = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8');
  assert.match(dockerfile, /COPY index\.html thanks\.html CNAME \.htaccess \.\/\n/);
  assert.match(dockerfile, /COPY api \.\/api/);
});
