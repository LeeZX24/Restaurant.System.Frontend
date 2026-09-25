#!/usr/bin/env bash
set -euo pipefail

# =========================
# Beta
# =========================

rm -f src/assets/app-meta.js

META_VERSION=$(git describe --tags --match "v*-dev.*" --abbrev=0 || echo "0.0.0-dev.0")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CHANNEL="dev"

cat > src/assets/app-meta.js <<EOF
window.APP_META = {
  version: "$META_VERSION",
  channel: "$CHANNEL",
  buildTime: "$BUILD_TIME"
};
EOF

CI=true yarn bd -- --output-path=dist/dev
