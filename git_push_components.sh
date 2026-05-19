#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Initializing git repository..."
git init

# Attempt to set the default branch to main
git branch -M main || git checkout -b main

echo "Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Yoseph-M/Nuvlo.git

echo "Staging base configuration and source files..."
# Add all files first
git add .

# Check if src/components exists
if [ -d "src/components" ]; then
  # Unstage the components directory so we can commit its files separately
  git reset -- src/components
fi

# Commit the base project files
if ! git diff --cached --quiet; then
  echo "Committing initial project setup..."
  git commit -m "chore: initial project setup"
else
  echo "No base files to commit."
fi

echo "Committing components separately..."
if [ -d "src/components" ]; then
  # Find all files within src/components
  find src/components -type f | while read -r file; do
    
    # Skip .DS_Store or other hidden system files if any
    if [[ "$file" == *".DS_Store"* ]]; then
      continue
    fi

    # Extract the parent folder name (e.g., 'ui', 'listing', etc.)
    dir_path=$(dirname "$file")
    group=$(basename "$dir_path")
    
    # Extract the filename without its extension
    filename=$(basename "$file")
    component="${filename%.*}"
    
    # Determine the commit message using standard conventional commits
    if [ "$group" = "components" ]; then
       commit_msg="feat: add $component component"
    else
       commit_msg="feat($group): add $component component"
    fi
    
    # Stage the individual component file
    git add "$file"
    
    # Commit the file
    echo "Committing $file..."
    git commit -m "$commit_msg"
  done
else
  echo "src/components directory not found, skipping component commits."
fi

echo "Pushing to remote origin..."
git push -u origin main

echo "Done! All components have been pushed separately."
