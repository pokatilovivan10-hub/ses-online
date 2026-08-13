# СЭС Москва

Сайт службы дезинсекции для домена `сэс.online`.

## Запуск

```bash
npm run build
TELEGRAM_BOT_TOKEN=... TELEGRAM_CHAT_ID=... npm start
```

Секреты Telegram задаются только в окружении Node-хостинга либо в закрытом PHP-конфиге вне web-root и не хранятся в репозитории.

## Проверка

```bash
npm run check
npm run build
```
