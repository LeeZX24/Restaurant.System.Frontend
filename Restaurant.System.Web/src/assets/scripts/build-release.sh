#!/usr/bin/env bash
set -euo pipefail

# =========================
# Release
# =========================

rm -f src/assets/app-meta.js

META_VERSION=$(git describe --tags --abbrev=0 || echo "0.0.0")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CHANNEL="release"

cat > src/assets/app-meta.js <<EOF
window.APP_META = {
  version: "$META_VERSION",
  channel: "$CHANNEL",
  buildTime: "$BUILD_TIME"
};
EOF

CI=true corepack yarn br -- --output-path=dist/release