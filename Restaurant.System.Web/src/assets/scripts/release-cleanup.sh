#!/bin/bash
# $1 is the new tag (e.g., v1.2.4)
NEW_TAG=$1

echo "Starting back-merge for $NEW_TAG..."

# Configure Git identity (if not already done in YAML)
git config --global user.name "github-actions[bot]"
git config --global user.email "github-actions[bot]@users.noreply.github.com"

# Define the cascade
# release -> release-beta -> master -> master-beta
branches=("release-beta" "master" "master-beta")

for branch in "${branches[@]}"
do
  echo "Merging $NEW_TAG into $branch..."
  git checkout $branch
  git pull origin $branch
  git merge $NEW_TAG -m "chore(release): backmerge $NEW_TAG [skip ci]"
  git push origin $branch
done

# Go back to the original branch to finish the process
git checkout -

# Delete the previous version (the 2nd tag in the list)
OLD_TAG=$(git tag --sort=-v:refname | grep '^v' | sed -n '2p')

if [ ! -z "$OLD_TAG" ]; then
  echo "Deleting old version: $OLD_TAG"
  gh release delete "$OLD_TAG" --yes
  git push --delete origin "$OLD_TAG"
fi