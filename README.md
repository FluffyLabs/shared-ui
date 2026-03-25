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
// styles.css
@import "tailwindcss/preflight" layer(base);
@import "@fluffylabs/shared-ui/theme.css";
@import "@fluffylabs/shared-ui/style.css";
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);
```

### Fonts

The library uses **Poppins** as the default sans-serif font and **Inconsolata** as the monospace font. Consuming projects must load these fonts themselves, for example via Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Inconsolata:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

To override the default fonts, redefine the Tailwind theme tokens in your CSS:

```css
@theme {
  --font-sans: "Inter", sans-serif;
  --font-mono: "Fira Code", monospace;
}
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

### Supabase Integration (Auth, User Data)

The library includes optional Supabase-powered components for authentication, user menus, settings, and per-user data storage. These are exported from a separate subpath so apps that don't use auth are unaffected.

#### Install the Supabase SDK

```bash
npm install @supabase/supabase-js
```

#### Create the `user_data` table

Run this in your Supabase SQL editor:

```sql
create table user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  app_id text,
  key text not null,
  value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, app_id, key)
);

alter table user_data enable row level security;

create policy "Users can manage their own data"
  on user_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

#### Wrap your app

```tsx
import { SupabaseProvider, UserMenu, AuthFlow, Settings } from "@fluffylabs/shared-ui/supabase";
import { Header } from "@fluffylabs/shared-ui/components";

function App() {
  return (
    <SupabaseProvider supabaseUrl="https://your-project.supabase.co" supabaseAnonKey="your-anon-key" appId="my-app">
      <Header
        toolNameSrc={logo}
        endSlot={<UserMenu onLoginClick={() => navigate("/login")} onSettingsClick={() => navigate("/settings")} />}
      />
      <Routes>
        <Route path="/login" element={<AuthFlow onSuccess={() => navigate("/")} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </SupabaseProvider>
  );
}
```

#### Available exports

| Export             | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `SupabaseProvider` | Context provider — creates the Supabase client                                 |
| `AuthFlow`         | Combined login/register screen                                                 |
| `UserMenu`         | Header dropdown with login/email/settings/sign-out                             |
| `Settings`         | Settings panel with theme selector                                             |
| `useUser`          | `{ user, isLoading }`                                                          |
| `useSession`       | `{ session, isLoading }`                                                       |
| `useSignOut`       | Sign-out callback                                                              |
| `useUserData`      | Per-user key-value storage (`{ appScoped }` option for shared vs per-app data) |

For detailed docs and interactive examples, see the [Supabase section in Storybook](http://fluffylabs.dev/shared-ui/?path=/docs/supabase-getting-started--docs).

## Deployment

### Releasing a New Version

The release process involves two steps:

#### Step 1: Create a Version Bump PR and Draft Release

1. Go to [Actions → Release step 1](../../actions/workflows/shared-ui-bump-version-and-create-pr.yml)
2. Click "Run workflow"
3. Select:
   - **Branch**: `main` (releases should always be from main)
   - **Version bump type**: `patch`, `minor`, or `major`
4. The workflow will create a pull request with the version bump and a draft GitHub release
5. Review and merge the PR

#### Step 2: Publish to NPM

1. Go to [Releases](../../releases) and find the draft release
2. Click "Publish release" — this creates the git tag and triggers the [Publish to NPM](../../actions/workflows/shared-ui-npm-publish.yml) workflow, which automatically:
   - Checks out the exact tag from the release
   - Verifies the tag matches the package.json version
   - Builds the component library
   - Publishes the package to NPM registry

### Storybook Deployment

The Storybook is automatically deployed to GitHub Pages and available at:
http://fluffylabs.dev/shared-ui/
