#!/bin/sh
# Usage:  sh set-domain.sh https://your-domain.com
# Replaces the placeholder address in index.html, course.html, sitemap.xml and robots.txt (run once, before publishing).
# No trailing slash. For a GitHub Pages project site use e.g. https://yourname.github.io/your-repo
[ -z "$1" ] && { echo "Usage: sh set-domain.sh https://your-domain.com"; exit 1; }
D="${1%/}"
for f in index.html course.html sitemap.xml robots.txt; do
  sed -i.bak "s|https://REPLACE-WITH-YOUR-DOMAIN|$D|g" "$f" && rm -f "$f.bak"
done
echo "Done. Domain set to $D"
