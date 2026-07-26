# Through My Quiet Lens

The source for [throughmyquietlens.com](https://throughmyquietlens.com), an independent publication by Praveen Gangaraju.

## Edit content

Most text lives in `content/`:

- `site.json` — site details and links
- `essays.json` — essays
- `principles.json` — Working Principles
- `conversations.json` — podcast introduction
- `dcdecoded.json` — DC Decoded articles

After editing content, run:

```bash
npm run build
npm run check
```

The generated website appears in `dist/`.

## Cloudflare deployment

This repository is configured for Cloudflare Workers Static Assets, matching Cloudflare's current **Create a Worker** Git deployment screen.

Use these settings:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Non-production deploy command: `npx wrangler versions upload`
- Path: `/`

Cloudflare reads `wrangler.jsonc` and publishes the generated `dist/` directory.

## Local preview

After running `npm run build`, open `dist/index.html`, or serve the directory with any simple local server.

## Design intent

- Ideas before biography
- Reading before decoration
- Calm, accessible and responsive
- No framework lock-in for the content layer


## Email subscriptions (Buttondown)

The site now uses a Buttondown email form and no longer generates or links to RSS.
The Buttondown publication username is set in `content/site.json` as `buttondownUsername`.
It currently uses `throughmyquietlens`. If your Buttondown username differs, replace that value and run `npm run build`.
