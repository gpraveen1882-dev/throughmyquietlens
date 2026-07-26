# Substack Publishing Pack

This pack adds 6 full Substack essays and 8 full DC Decoded articles.

## Upload to GitHub

Upload the contents of this ZIP to the root of your `throughmyquietlens` repository and allow GitHub to replace files with the same names.

The key changed files are:

- `content/essays.json`
- `content/dcdecoded.json`
- `scripts/build.mjs`
- `public/styles.css`
- rebuilt `dist/`

Then commit the changes. Cloudflare should redeploy automatically.

## Verification

> throughmyquietlens@1.0.0 build
> node scripts/build.mjs

Built 25 files in /mnt/data/tml_substack_publish_pack/dist
> throughmyquietlens@1.0.0 check
> node scripts/check.mjs

Checks passed: 22 HTML pages plus core assets.

## Notes

- Full article bodies were preserved from the Substack export.
- Substack subscribe/share boilerplate was removed.
- The duplicate Equality or Equity export was consolidated.
- Blank export files and the Substack editor tutorial draft were excluded.
- Original publication dates were not present in the individual exported HTML files, so the site displays “Originally published on Substack” rather than inventing dates.
