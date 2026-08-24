# Telegram Leads Implementation Plan

> **For implementer:** Use TDD throughout. Write failing test first. Watch it fail. Then implement.

**Goal:** Route valid `сэс.online` form submissions through the secure PHP endpoint so they arrive in the Telegram group `Заявки СЭС`.

**Architecture:** The browser sends same-origin JSON to `/api/lead`. The PHP handler reads Telegram credentials from a private hosting-only config outside web root, sends email and Telegram, and returns JSON used by the existing success/error UI.

**Tech Stack:** Static HTML/JavaScript, PHP, Telegram Bot API, Node.js built-in test runner, npm build.

---

### Task 1: Make the form use the secure endpoint

**Files:**
- Modify: `test/site.test.js`
- Modify: `test/vercel-lead.test.js`
- Modify: `index.html`
- Generated: `dist/index.html`

**Step 1: Write the failing test**

Require `fetch('/api/lead', {` in the form and reject direct FormSubmit calls.

**Step 2: Run test — confirm it fails**

Command: `node --test test/site.test.js test/vercel-lead.test.js`

Expected: FAIL because the live form currently posts directly to FormSubmit.

**Step 3: Write minimal implementation**

Change the form fetch target to `/api/lead`, keep the existing JSON fields, and
treat only an HTTP-successful `{ "ok": true }` response as delivery success.

**Step 4: Run test — confirm it passes**

Command: `npm run check && npm run build && npm run check`

Expected: all tests pass and generated `dist/index.html` matches the source.

**Step 5: Commit**

`git add docs/plans test index.html dist && git commit -m "feat: deliver ses.online leads to Telegram"`

### Task 2: Publish and configure hosting

**Files:**
- Deploy: public build files to the existing `сэс.online` document root
- Create on hosting only: `private/ses-config.php`

**Step 1: Push the tested commit**

Command: `git push origin main`

Expected: GitHub `main` points at the new commit.

**Step 2: Install private configuration**

Store `telegram_bot_token` and `telegram_chat_id` outside the document root with
restrictive permissions. Do not add this file to Git.

**Step 3: Deploy public build**

Publish the generated site and PHP endpoint using the available hosting access.

**Step 4: Verify live delivery**

POST a marked test lead to `https://сэс.online/api/lead` and require HTTP 200
with `{ "ok": true }`. Confirm the public HTML now calls `/api/lead` and does
not contain the token.
