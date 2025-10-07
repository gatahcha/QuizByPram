# Installation Instructions

## Before You Begin

⚠️ **Important**: You may see TypeScript errors in `vite.config.ts` until you install dependencies. This is normal!

The errors you might see:
- Cannot find module 'vite'
- Cannot find module 'path'
- Cannot find name 'process'
- Cannot find name '__dirname'

These will be resolved after running `npm install`.

## Step-by-Step Installation

### 1. Verify Prerequisites

Make sure you have Node.js 18 or higher installed:

```bash
node --version
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

Run the following command in the project root:

```bash
npm install
```

This will install:
- `vite@^5.0.0` - Build tool and dev server
- `typescript@^5.3.0` - TypeScript compiler
- `@types/node@^20.10.0` - Node.js type definitions

### 3. Verify Installation

After installation, verify there are no TypeScript errors:

```bash
npm run type-check
```

You should see no errors if everything is installed correctly.

### 4. Start Development Server

```bash
npm run dev
```

Your browser should automatically open to `http://localhost:3000`

## Troubleshooting

### `npm install` fails

**Problem**: Installation fails with errors

**Solutions**:
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Try using `npm install --legacy-peer-deps`
- Make sure you're using Node.js 18+

### TypeScript errors persist after installation

**Problem**: Still seeing "Cannot find module" errors

**Solutions**:
- Restart your editor/IDE
- Run `npm run type-check` to verify
- Make sure `node_modules` was created
- Check that `package.json` has all devDependencies

### Port 3000 is already in use

**Problem**: Cannot start dev server because port is in use

**Solutions**:
- Kill the process using port 3000
- Or change the port in `vite.config.ts`:
  ```typescript
  server: {
    port: 3001, // Change to any available port
    open: true,
  }
  ```

### Module resolution errors

**Problem**: Imports with `.ts` extensions cause errors

**Solution**: This is expected and correct! The `allowImportingTsExtensions` flag in `tsconfig.json` allows this. Vite handles it correctly during build.

## What Gets Installed

After `npm install`, you'll have:

```
node_modules/          # Dependencies (ignored by git)
package-lock.json      # Locked dependency versions (committed to git)
```

Total installation size: ~100-150 MB (typical for Vite + TypeScript projects)

## Next Steps

Once installation is complete:

1. See [QUICKSTART.md](QUICKSTART.md) for immediate usage
2. See [README.md](README.md) for full documentation
3. See [SETUP.md](SETUP.md) for deployment instructions

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **OS**: macOS, Windows, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for project + dependencies

## Development Tools (Recommended)

- **VS Code** with extensions:
  - TypeScript (built-in)
  - ESLint
  - Prettier
  - Vite

- **Alternative editors**:
  - WebStorm
  - Sublime Text with LSP-typescript
  - Vim with CoC or ALE

Happy coding with QuizByPram! 🚀

