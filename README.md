# @aplisay/email

Modular outbound email for Aplisay services. One small, dependency-free API with
swappable providers — **SMTP2GO** first, with a **console** transport for local
dev. Add a new provider without touching callers.

## Install

Install from GitHub (pin to a tag/commit). It's a public repo, so no auth or
token is needed — CI/hosts (Netlify, etc.) install it like any git dependency:

```bash
npm install github:aplisay/email#v0.1.0
# or in package.json:  "@aplisay/email": "github:aplisay/email#v0.1.0"
```

## Configuration

The client reads these environment variables (override any in code):

| Variable | Purpose |
|---|---|
| `EMAIL_SEND_TYPE` | provider id: `smtp2go` or `console` (default `console`) |
| `EMAIL_SEND_URL` | provider endpoint override (optional; SMTP2GO defaults to its public API) |
| `EMAIL_SEND_KEY` | provider API key (SMTP2GO: `api-…`) |
| `EMAIL_FROM_ADDRESS` / `EMAIL_FROM_NAME` | optional default sender (must be a verified sender in the provider) |

With `EMAIL_SEND_TYPE` unset (or `console`) the client logs the email instead of
sending — so the flow works locally with no credentials.

## Usage

```ts
import { createEmailClient } from "@aplisay/email";

const email = createEmailClient(); // reads EMAIL_SEND_* from the environment

await email.send({
  to: "user@example.com",            // string | {email,name} | array of either
  subject: "Confirm your subscription",
  text: "Open this link to confirm: https://…",
  // html: "<p>…</p>",               // optional
  // from: { email: "hello@aplisay.uk", name: "Aplisay" },  // or set EMAIL_FROM_*
  // cc, bcc, replyTo, headers also supported
});
```

`send()` resolves to `{ provider, id?, accepted }` and throws an `EmailError`
(with `.status` for provider HTTP errors) on failure.

Config can also be passed explicitly (handy for tests — note the injectable `fetch`):

```ts
const email = createEmailClient({ type: "smtp2go", key: "api-…", fetch: myFetch });
```

## API

- `createEmailClient(overrides?) → EmailClient` — `{ provider, send(message) }`.
- `EmailMessage` — `{ from?, to, cc?, bcc?, replyTo?, subject, text, html?, headers? }`.
  `to`/`cc`/`bcc` accept a string, `{ email, name }`, or an array.
- `SendResult` — `{ provider, id?, accepted }`.
- `EmailError` — `message`, `status?`, `cause?`.
- `SUPPORTED_PROVIDERS`, `configFromEnv()`, and the individual provider factories
  (`createSmtp2goProvider`, `createConsoleProvider`) are exported too.

## Adding a provider

1. Implement `EmailProvider` (`{ name, send(message) }`) in `src/providers/`.
2. Register it in `src/providers/index.ts` under its `EMAIL_SEND_TYPE` id.
3. Map `EmailMessage` → the provider's payload; throw `EmailError` on failure.

Callers don't change — they keep using `createEmailClient()`.

## Develop

```bash
npm install
npm run build      # → dist/ (committed, so consumers need no build step)
npm test           # builds, then runs node:test against dist
npm run typecheck
```

> `dist/` is committed so the package installs from git with no build step.
> **Run `npm run build` before committing source changes.**
