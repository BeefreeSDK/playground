#!/usr/bin/env bash
set -euo pipefail

BUCKET="${S3_BUCKET:?Set S3_BUCKET environment variable}"
DIST_DIR="dist"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
MATOMO_FILE="$SCRIPT_DIR/matomo-tracking.txt"

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: $DIST_DIR folder not found. Run 'npm run build' first."
  exit 1
fi

if [ ! -f "$MATOMO_FILE" ]; then
  echo "Error: $MATOMO_FILE not found."
  exit 1
fi

# Inject Matomo tracking script before </head> in index.html
INDEX_FILE="$DIST_DIR/index.html"
if [ -f "$INDEX_FILE" ]; then
  MATOMO_SCRIPT=$(cat "$MATOMO_FILE")
  sed -i.bak "s|</head>|${MATOMO_SCRIPT//$'\n'/\\n}</head>|" "$INDEX_FILE"
  rm -f "$INDEX_FILE.bak"
  echo "Matomo tracking injected into index.html"
else
  echo "Warning: $INDEX_FILE not found, skipping Matomo injection."
fi

echo "Uploading $DIST_DIR to s3://$BUCKET ..."
aws s3 sync "$DIST_DIR" "s3://$BUCKET" --delete

echo "Done."
