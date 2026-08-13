// Сборка проекта: готовит dist/ — статику сайта + входную точку dist/boot.js.
// Платформа запускает проект через /code/bootstrap, который ожидает dist/boot.js.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// dist должен существовать и содержать файлы сайта
const required = ['boot.js', 'index.html', path.join('img', 'hero.jpg')];
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
