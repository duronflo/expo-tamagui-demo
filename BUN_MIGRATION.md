# Bun Migration Guide

This document provides comprehensive information about migrating from Yarn to Bun for the Expo + Tamagui Demo App.

## Table of Contents
- [What is Bun?](#what-is-bun)
- [Why Migrate to Bun?](#why-migrate-to-bun)
- [Installation](#installation)
- [Migration Steps](#migration-steps)
- [Command Comparison](#command-comparison)
- [Workspace Management](#workspace-management)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Known Issues](#known-issues)

## What is Bun?

[Bun](https://bun.sh) is an all-in-one JavaScript runtime and toolkit designed for speed. It includes:
- **Package Manager**: Ultra-fast alternative to npm/yarn/pnpm
- **Bundler**: Built-in bundler and transpiler
- **Test Runner**: Native test runner
- **Runtime**: Drop-in replacement for Node.js

Key features:
- ⚡ Up to 10x faster than npm/yarn
- 🔋 Batteries included (bundler, transpiler, test runner)
- 🎯 Drop-in replacement for Node.js APIs
- 💾 Disk space efficient (uses hardlinks)
- 🔐 Built-in TypeScript support

## Why Migrate to Bun?

### Performance Benefits
- **Installation Speed**: 2-10x faster than Yarn/npm
- **Disk Usage**: Hardlinks save significant disk space
- **Startup Time**: Faster script execution
- **Memory Efficient**: Lower memory footprint

### Developer Experience
- **Simpler Toolchain**: One tool instead of Node + npm/yarn + others
- **Better Errors**: More helpful error messages
- **Modern Defaults**: Optimized for modern JavaScript/TypeScript
- **Native TypeScript**: No need for ts-node

### Compatibility
- ✅ npm package registry compatible
- ✅ package.json compatible
- ✅ Workspaces support (monorepos)
- ✅ Expo and React Native compatible
- ✅ Node.js API compatible

## Installation

### Option 1: Install Script (Recommended)
```bash
curl -fsSL https://bun.sh/install | bash
```

### Option 2: NPM (if you have Node.js)
```bash
npm install -g bun
```

### Option 3: Homebrew (macOS/Linux)
```bash
brew tap oven-sh/bun
brew install bun
```

### Option 4: Docker
```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "start"]
```

### Verify Installation
```bash
bun --version
```

## Migration Steps

### 1. Remove Yarn Artifacts
```bash
# Remove Yarn-specific files
rm -rf .yarn .yarnrc.yml yarn.lock

# Remove node_modules (optional but recommended for clean install)
rm -rf node_modules
```

### 2. Install Dependencies with Bun
```bash
# Install all dependencies
bun install

# This creates bun.lockb file
```

### 3. Verify the Installation
```bash
# Check if packages installed correctly
ls node_modules | head

# Verify workspace packages
cd packages/ui && ls node_modules/@tamagui
```

### 4. Test the Application
```bash
# Start the development server
bun start

# Run on specific platforms
bun run ios
bun run android
bun run web
```

## Command Comparison

### Package Installation

| Task | Yarn | Bun |
|------|------|-----|
| Install dependencies | `yarn install` | `bun install` |
| Add package | `yarn add <package>` | `bun add <package>` |
| Add dev package | `yarn add -D <package>` | `bun add -d <package>` |
| Remove package | `yarn remove <package>` | `bun remove <package>` |
| Global install | `yarn global add <package>` | `bun add -g <package>` |
| Update packages | `yarn up <package>` | `bun update <package>` |
| Update all | `yarn up` | `bun update` |

### Running Scripts

| Task | Yarn | Bun |
|------|------|-----|
| Run script | `yarn <script>` | `bun <script>` or `bun run <script>` |
| Run with args | `yarn <script> -- --flag` | `bun <script> --flag` |
| List scripts | `yarn run` | `bun run` |

### Workspace Commands

| Task | Yarn | Bun |
|------|------|-----|
| Run in workspace | `yarn workspace <name> <cmd>` | `bun run --filter <name> <cmd>` |
| Run in all workspaces | `yarn workspaces foreach <cmd>` | `bun run --filter '*' <cmd>` |

### Other Commands

| Task | Yarn | Bun |
|------|------|-----|
| Clean cache | `yarn cache clean` | `bun pm cache rm` |
| Check integrity | `yarn install --check-files` | `bun install --frozen-lockfile` |
| Why package | `yarn why <package>` | `bun pm ls <package>` |
| List installed | `yarn list` | `bun pm ls` |

## Workspace Management

This project uses workspaces for monorepo management. Bun fully supports this.

### Project Structure
```
expo-tamagui-demo/
├── package.json          # Root package with workspace definition
├── packages/
│   └── ui/
│       └── package.json  # Workspace package
```

### Root package.json
```json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### Working with Workspaces

#### Install dependencies for all workspaces
```bash
bun install
```

#### Add dependency to specific workspace
```bash
cd packages/ui
bun add <package>
```

#### Run script in workspace
```bash
cd packages/ui
bun run build
```

## Configuration

### bunfig.toml

Bun can be configured using `bunfig.toml` in the project root:

```toml
# Bun configuration for expo-tamagui-demo

[install]
# Use the default npm registry
registry = "https://registry.npmjs.org/"

# Enable caching for faster installs
cache = true

# Optimize for monorepo workspaces
exact = false

# Production installs
production = false

# Lockfile configuration
frozenLockfile = false
```

### Environment Variables

Configure Bun behavior with environment variables:

```bash
# Set registry
export BUN_INSTALL_REGISTRY_URL="https://registry.npmjs.org/"

# Set cache directory
export BUN_INSTALL_CACHE_DIR="$HOME/.bun/install/cache"

# Increase verbosity
export BUN_INSTALL_VERBOSE=1
```

## Troubleshooting

### Issue: Package fails to install

**Solution:**
```bash
# Clear Bun cache
bun pm cache rm

# Try install again
bun install --force
```

### Issue: Lockfile conflicts

**Solution:**
```bash
# Remove lockfile and reinstall
rm bun.lockb
bun install
```

### Issue: Native modules not working

**Solution:**
```bash
# Rebuild native modules
bun rebuild

# Or remove and reinstall
rm -rf node_modules
bun install
```

### Issue: Script not found

**Solution:**
```bash
# Bun requires explicit 'run' for some scripts
bun run <script-name>

# Check available scripts
bun run
```

### Issue: Expo compatibility issues

**Solution:**
```bash
# Clear Expo and Bun caches
expo start -c
bun pm cache rm

# Reinstall
rm -rf node_modules bun.lockb
bun install
```

### Issue: Metro bundler errors

**Solution:**
```bash
# Clear Metro cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# Clear watchman
watchman watch-del-all

# Restart
bun start
```

## Known Issues

### React Native Compatibility

Bun generally works well with React Native and Expo, but be aware:

1. **Native Modules**: Some native modules may require Node.js for building
   - **Workaround**: Use Node.js for prebuild steps if needed
   
2. **Metro Bundler**: Metro uses Node.js internally
   - **Impact**: Metro still runs on Node.js, Bun manages packages only
   
3. **Build Scripts**: Some build scripts may assume Node.js
   - **Workaround**: Use `node` prefix for problematic scripts

### Package Registry Issues

Occasionally, Bun may have issues with npm registry responses:

```bash
# If you encounter registry errors, try:
BUN_INSTALL_REGISTRY_URL=https://registry.npmjs.org/ bun install

# Or add to bunfig.toml:
[install]
registry = "https://registry.npmjs.org/"
```

### Monorepo Considerations

- Bun's workspace support is solid but may differ slightly from Yarn
- Some yarn-specific workspace commands don't have exact Bun equivalents
- Cross-workspace dependencies work the same way

## Performance Comparison

Based on typical usage with this project:

| Operation | Yarn 4 | Bun | Improvement |
|-----------|--------|-----|-------------|
| Fresh install | ~40s | ~8s | 5x faster |
| With cache | ~15s | ~2s | 7.5x faster |
| Adding package | ~5s | ~1s | 5x faster |
| Lockfile generation | ~3s | <1s | 3x+ faster |

*Note: Times are approximate and depend on hardware, network, and cache state.*

## Additional Resources

### Documentation
- [Official Bun Documentation](https://bun.sh/docs)
- [Bun Package Manager](https://bun.sh/docs/cli/install)
- [Bun Runtime](https://bun.sh/docs/runtime/index)

### Community
- [Bun Discord](https://bun.sh/discord)
- [Bun GitHub](https://github.com/oven-sh/bun)
- [Bun Twitter](https://twitter.com/bunjavascript)

### Migration Guides
- [From npm](https://bun.sh/docs/cli/install#from-npm)
- [From Yarn](https://bun.sh/docs/cli/install#from-yarn)
- [From pnpm](https://bun.sh/docs/cli/install#from-pnpm)

## Contributing

If you encounter issues with Bun that aren't covered here, please:

1. Check [Bun's GitHub Issues](https://github.com/oven-sh/bun/issues)
2. Update this document with your findings
3. Report bugs to the Bun team

---

**Happy coding with Bun! 🥟**
