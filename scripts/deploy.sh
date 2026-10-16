#!/bin/sh
# Build and publish dist/ to Cloudflare Pages: https://nova-hosakademia.pages.dev
# Usage: npm run deploy   (needs `npx wrangler login` once on this machine)
set -e
cd "$(dirname "$0")/.."
npm run build
npx wrangler pages deploy dist --project-name nova-hosakademia --branch main --commit-dirty=true
