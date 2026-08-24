# Telegram delivery for ses.online — Design

## Goal

Deliver every valid lead submitted on `сэс.online` to the Telegram supergroup
`Заявки СЭС` through the approved bot, while keeping the bot token out of the
public repository and browser code.

## Architecture

The browser posts JSON to the same-origin endpoint `/api/lead`. The existing
PHP handler validates the phone number, sends the email copy, loads Telegram
credentials from `private/ses-config.php` outside the public web root, and calls
Telegram Bot API `sendMessage` for the configured group.

The public repository contains only the handler and the form endpoint. The live
hosting contains the untracked secret configuration. Success redirects to
`/thanks`; any delivery failure keeps the form visible and shows the existing
fallback phone number.

## Data flow

1. Visitor submits name, phone, and address.
2. Browser validates an 11-digit phone and POSTs JSON to `/api/lead`.
3. PHP validates input and creates the email and Telegram messages.
4. PHP sends the email copy, then sends the Telegram message.
5. Only a successful handler response redirects the visitor to `/thanks`.

## Error handling and security

- Reject non-POST requests, invalid JSON, oversized bodies, and invalid phones.
- Escape user data for Telegram HTML parse mode.
- Keep the bot token and chat ID outside the web root and Git.
- Never expose the bot token in HTML, JavaScript, logs, or API responses.
- Return a non-success response when required delivery fails.

## Verification

- Add a test that requires the form to use `/api/lead` and forbids Telegram
  secrets in public source.
- Run the complete test/build check.
- Verify the bot can access the target Telegram group.
- Deploy the public files and private configuration to hosting.
- Submit one marked test lead to the live endpoint and confirm API success.
