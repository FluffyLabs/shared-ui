# Vite React Component Library Starter

Components library for Fluffy Labs

## Features

- React: A JavaScript library for web and native user interfaces.
- TypeScript: A strongly typed superset of JavaScript.
- Tailwind: A utility-first CSS framework.
- Storybook: A frontend workshop for building UI components and pages in isolation.
- Vite: A next generation frontend tooling that runs and builds your library incredibly fast.
- Vitest: A next generation testing framework.
- ESLint: A tool that finds and fixes problems in your code.
- Prettier: A code formatter.
- Husky: A pre-commit hook.
- Github Action: A tool that deploys your Storybook to GitHub page automatically.

## Get Started

1. Clone this repository
2. Install dependencies using `pnpm i` (or `npm i` if you like)

## Scripts

- `dev`: Starts the local Storybook server, use this to develop and preview your components.
- `test`: Runs all your tests with vitest.
- `test:watch`: Runs tests in watch mode.
- `build`: Builds your Storybook as a static web application.
- `build:lib`: Builds your component library with Vite.
- `lint`: Runs ESLint.
- `format`: Formats your code with Prettier.

## Usage

```
// main.tsx
import "@fluffylabs/shared-ui/style.css";

//header-wrapper.tsx
import { Header as FluffyHeader } from "@fluffylabs/shared-ui";
import ToolName from "@/assets/tool-name.svg";

const EndSlot = () => {
  return <div className="w-full"></div>;
};

export const Header = () => {
  return <FluffyHeader endSlot={<EndSlot />} toolNameSrc={ToolName} />;
};
```

## Release
some release here
