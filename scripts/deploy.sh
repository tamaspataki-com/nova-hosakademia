#!/bin/sh
# Build and publish dist/ to the gh-pages branch (served by GitHub Pages).
# Usage: npm run deploy
set -e
cd "$(dirname "$0")/.."
npm run build
touch dist/.nojekyll
rev=$(git rev-parse --short HEAD)
tmp=$(mktemp -d)
cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $rev"
git push -q -f "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
cd - >/dev/null
rm -rf "$tmp"
echo "Deployed $rev to gh-pages."
