#!/usr/bin/env bash
set -euo pipefail

# =========================
# Dev
# =========================

META_VERSION=$(node -p "require('./package.json').version")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CHANNEL="dev"

cat > src/assets/app-meta.js <<EOF
window.APP_META = {
  version: "$META_VERSION",
  channel: "$CHANNEL",
  buildTime: "$BUILD_TIME"
};
EOF

CI=true corepack yarn bd
