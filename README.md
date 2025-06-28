# @fluffylabs/shared-ui

Shared UI components library for Fluffy Labs applications

## Features

- React: A JavaScript library for web and native user interfaces.
- TypeScript: A strongly typed superset of JavaScript.
- Tailwind: A utility-first CSS framework.
- Storybook: A frontend workshop for building UI components and pages in isolation. [View live Storybook](http://fluffylabs.dev/shared-ui/)
- Vite: A next generation frontend tooling that runs and builds your library incredibly fast.
- Vitest: A next generation testing framework.
- ESLint: A tool that finds and fixes problems in your code.
- Prettier: A code formatter.
- Husky: A pre-commit hook.
- Github Action: A tool that deploys your Storybook to GitHub page automatically.

## Installation

```bash
npm install @fluffylabs/shared-ui
```

## Development

1. Clone this repository
2. Install dependencies using `pnpm i` (or `npm i` if you like)
3. Run `pnpm dev` to start the local Storybook server

## Scripts

- `dev`: Starts the local Storybook server, use this to develop and preview your components.
- `test`: Runs all your tests with vitest.
- `test:watch`: Runs tests in watch mode.
- `build`: Builds your Storybook as a static web application.
- `build:lib`: Builds your component library with Vite.
- `lint`: Runs ESLint.
- `format`: Formats your code with Prettier.

## Usage

### Basic Import

```tsx
import { AppsSidebar } from "@fluffylabs/shared-ui";
```

### Importing Styles

Use the precompiled styles in your app:

```tsx
// main.tsx or App.tsx
import "@fluffylabs/shared-ui/style.css";
```

### Tailwind Configuration

To prevent class duplication when using Tailwind CSS in your project, add the shared-ui dist folder to your Tailwind content paths:

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../node_modules/@fluffylabs/shared-ui/dist/**/*.js"],
  // ... rest of your config
};
```

### Example Usage

```tsx
import { AppsSidebar } from "@fluffylabs/shared-ui";
import "@fluffylabs/shared-ui/style.css";

function App() {
  return (
    <div className="app">
      <AppsSidebar />
      {/* Your app content */}
    </div>
  );
}
```

For more usage examples and component documentation, visit our [Storybook](http://fluffylabs.dev/shared-ui/).

## Deployment

### Releasing a New Version

The release process involves three steps:

#### Step 1: Create a Version Bump PR

1. Go to [Actions → Release step 1 - Bump version and create PR](../../actions/workflows/shared-ui-bump-version-and-create-pr.yml)
2. Click "Run workflow"
3. Select:
   - **Branch**: `main` (releases should always be from main)
   - **Version bump type**: `patch`, `minor`, or `major`
4. The workflow will create a pull request with the version bump
5. Review and merge the PR

#### Step 2: Create GitHub Release

After merging the version bump PR:

1. Go to [Actions → Release step 2 - create Github Release](../../actions/workflows/shared-ui-create-release.yml)
2. Click "Run workflow"
3. The workflow will:
   - Create a git tag for the new version
   - Create a GitHub release (as draft) with commit history
   - The release includes installation instructions and changes

#### Step 3: Publish to NPM

Once a GitHub release is published (not draft), the [Release step 3 - Publish to NPM](.github/workflows/shared-ui-npm-publish.yml) workflow automatically:

- Checks out the exact tag from the release
- Verifies the tag matches the package.json version
- Builds the component library
- Publishes the package to NPM registry

The publish workflow ensures you're always publishing the exact code that was tagged and released.

### Storybook Deployment

The Storybook is automatically deployed to GitHub Pages and available at:
http://fluffylabs.dev/shared-ui/
