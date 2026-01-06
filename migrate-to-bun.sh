#!/bin/bash

# Bun Migration Script for expo-tamagui-demo
# This script helps migrate from Yarn to Bun

set -e

echo "🥟 Bun Migration Script"
echo "======================"
echo ""

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed."
    echo ""
    echo "Please install Bun first:"
    echo "  curl -fsSL https://bun.sh/install | bash"
    echo ""
    echo "Or with npm:"
    echo "  npm install -g bun"
    exit 1
fi

BUN_VERSION=$(bun --version)
echo "✅ Bun is installed: v$BUN_VERSION"
echo ""

# Confirm migration
echo "This script will:"
echo "  1. Remove Yarn-specific files (.yarn, .yarnrc.yml, yarn.lock)"
echo "  2. Remove node_modules for a clean install"
echo "  3. Install dependencies with Bun"
echo ""
read -p "Do you want to continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "🧹 Cleaning up Yarn files..."

# Remove Yarn-specific files
if [ -d ".yarn" ]; then
    echo "  Removing .yarn directory..."
    rm -rf .yarn
fi

if [ -f ".yarnrc.yml" ]; then
    echo "  Removing .yarnrc.yml..."
    rm -f .yarnrc.yml
fi

if [ -f "yarn.lock" ]; then
    echo "  Removing yarn.lock..."
    rm -f yarn.lock
fi

# Remove node_modules
if [ -d "node_modules" ]; then
    echo "  Removing node_modules..."
    rm -rf node_modules
fi

echo "✅ Cleanup complete"
echo ""

# Install with Bun
echo "📦 Installing dependencies with Bun..."
echo ""

if bun install; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🎉 Migration successful!"
    echo ""
    echo "Next steps:"
    echo "  1. Test the app: bun start"
    echo "  2. Check the migration guide: cat BUN_MIGRATION.md"
    echo "  3. Report any issues to the Bun team"
    echo ""
else
    echo ""
    echo "❌ Installation failed!"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Clear Bun cache: bun pm cache rm"
    echo "  2. Try again: bun install"
    echo "  3. Check the migration guide: cat BUN_MIGRATION.md"
    echo "  4. If issues persist, you can restore Yarn:"
    echo "     - git checkout .yarn .yarnrc.yml yarn.lock"
    echo "     - yarn install"
    exit 1
fi
