#!/bin/bash
# Usage: ./scripts/to-webp.sh public/og/blog/my-image.png
# Converts a PNG (or JPG/JPEG) to WebP and deletes the original.

set -e

INPUT="$1"

if [ -z "$INPUT" ]; then
  echo "Usage: $0 <image.png|image.jpg>"
  exit 1
fi

if [ ! -f "$INPUT" ]; then
  echo "Error: file not found: $INPUT"
  exit 1
fi

OUTPUT="${INPUT%.*}.webp"

cwebp -q 85 -m 6 "$INPUT" -o "$OUTPUT"

rm "$INPUT"

echo "Done: $OUTPUT"
