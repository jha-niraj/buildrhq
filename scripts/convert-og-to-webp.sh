#!/bin/bash
# Batch-converts all PNG/JPG images under apps/main/public/og/ to WebP.
# Deletes the originals after conversion.
# Run from the monorepo root: ./scripts/convert-og-to-webp.sh

set -e

OG_DIR="apps/main/public/og"

if ! command -v cwebp &> /dev/null; then
  echo "Error: cwebp not found. Install with: brew install webp"
  exit 1
fi

count=0

find "$OG_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r file; do
  output="${file%.*}.webp"
  echo "Converting: $file → $output"
  cwebp -q 85 -m 6 "$file" -o "$output"
  rm "$file"
  count=$((count + 1))
done

echo ""
echo "Done. All images converted to WebP."
echo "Remember to update any hardcoded .png/.jpg references in code to .webp"
