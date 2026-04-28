npm run build:forms; 

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

npm run build:${1:-release} -- --output-path=dist/${1:-release}

echo "Creating Folder 'Site' ..."
mkdir -p site
echo "Creating Folder 'Site' ... Done"

echo "Copying build files to 'Site' ..."
cp -r dist/${1:-release}/browser/* site/
echo "Copying build files to 'Site' ... Done"

echo "Renaming index.csr.html to index.html ..."
mv site/index.csr.html site/index.html
echo "Renaming index.csr.html to index.html ... Done"