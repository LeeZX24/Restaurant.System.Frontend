#!/bin/bash
# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Create the meta file
cat > src/assets/app-meta.js <<EOF
window.APP_META = {
  version: "$VERSION",
  channel: "${1:-release}",
  buildTime: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
};
EOF
echo "Stamped version $VERSION"