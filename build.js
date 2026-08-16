// Сборка проекта: готовит dist/ — статику сайта + входную точку dist/boot.js.
// Платформа запускает проект через /code/bootstrap, который ожидает dist/boot.js.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Исходная статика хранится в корне, а runtime — в dist/.
// Перед проверкой синхронизируем публикуемые HTML-файлы и доменное имя.
for (const file of ['index.html', 'thanks.html', 'CNAME']) {
  fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
}

// dist должен существовать и содержать файлы сайта
const required = ['boot.js', 'index.html', 'thanks.html', path.join('img', 'hero.jpg')];
let ok = true;
for (const f of required) {
  if (!fs.existsSync(path.join(DIST, f))) {
    console.error('Отсутствует обязательный файл: dist/' + f);
    ok = false;
  }
}
if (!ok) process.exit(1);

// Синтаксис входной точки
require('child_process').execSync(process.execPath + ' --check ' + JSON.stringify(path.join(DIST, 'boot.js')), { stdio: 'inherit' });
console.log('Сборка завершена: dist/boot.js и статика на месте.');
