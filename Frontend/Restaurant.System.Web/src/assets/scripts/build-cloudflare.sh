[ -f src/assets/app-meta.js ] && rm src/assets/app-meta.js
git fetch origin master && git checkout origin/master
git fetch --tags --force
META_VERSION=$(git describe --tags --match "v*-build.*" --abbrev=0 || echo "0.0.0-build.0")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CHANNEL="beta"
mkdir -p src/assets
cat > src/assets/app-meta.js <<EOF
window.APP_META = {
  version: "$META_VERSION",
  channel: "$CHANNEL",
  buildTime: "$BUILD_TIME"
};
EOF
CI=true npm run build:beta -- --output-path=dist/beta

[ -f src/assets/app-meta.js ] && rm src/assets/app-meta.js
git fetch origin release && git checkout origin/release
git fetch --tags --force
META_VERSION=$(git describe --tags --abbrev=0 || echo "0.0.0")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CHANNEL="release"
mkdir -p src/assets
cat > src/assets/app-meta.js <<EOF
window.APP_META = {
  version: "$META_VERSION",
  channel: "$CHANNEL",
  buildTime: "$BUILD_TIME"
};
EOF
CI=true npm run build:production -- --output-path=dist/release

mkdir -p site;
mkdir -p site/beta;
cp -r dist/release/browser/* site/;
cp -r dist/beta/browser/* site/beta/;
