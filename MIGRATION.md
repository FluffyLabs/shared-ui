# Migration Guide

## v0.5.0 to v0.6.0

This release contains no breaking changes to the component API. All components, hooks, and utilities retain their existing signatures and behavior. The changes are limited to upgraded transitive dependencies.

### Peer dependencies (unchanged)

The required peer dependencies have not changed:

- `react` ^19.0.0
- `react-dom` ^19.0.0
- `tailwind-merge` ^3.1.0

No action needed if you already satisfy these.

### lucide-react 0.487 -> 0.577

`@fluffylabs/shared-ui` now depends on `lucide-react@^0.577.0`. If your project also depends on `lucide-react` directly, you should upgrade to a compatible version to avoid duplicate installs:

```bash
npm install lucide-react@^0.577.0
```

Between 0.487 and 0.577, some icons were renamed or removed upstream. If you import icons directly from `lucide-react` in your own code, check the [lucide changelog](https://github.com/lucide-icons/lucide/releases) for any renamed icons. Common renames follow the pattern `FooBar` -> `FooBaz`; your build will fail at import time if an icon was removed, making this easy to catch.

### Radix UI minor bumps

All `@radix-ui/*` packages received minor or patch updates. These are backward-compatible. If you use Radix primitives directly alongside `@fluffylabs/shared-ui`, no changes are needed, but upgrading to matching versions avoids duplicate bundles:

| Package                       | Old    | New     |
| ----------------------------- | ------ | ------- |
| @radix-ui/react-dropdown-menu | ^2.1.6 | ^2.1.16 |
| @radix-ui/react-select        | ^2.1.6 | ^2.2.6  |
| @radix-ui/react-separator     | ^1.1.2 | ^1.1.8  |
| @radix-ui/react-slot          | ^1.1.2 | ^1.2.4  |
| @radix-ui/react-tooltip       | ^1.1.8 | ^1.2.8  |

### Tailwind CSS 4.2

The internal `@tailwindcss/postcss` dependency moved from ^4.1.3 to ^4.2.2. If your project uses Tailwind CSS 4.x, this is fully compatible. If you are still on Tailwind CSS 3.x, you are unaffected as this is a dependency of the library itself, not a peer dependency.

### tw-animate-css 1.2 -> 1.4

Minor version bump with new animation utilities. Fully backward-compatible.

### No action required for

The following were upgraded internally and do not affect downstream consumers:

- **Build tooling**: Vite 6 -> 8, Vitest 3 -> 4, @vitejs/plugin-react-swc 3 -> 4
- **Linting**: ESLint 8 -> 9 (migrated to flat config), eslint-plugin-react-hooks 4 -> 7
- **Storybook**: 8 -> 10
- **commitlint**: 19 -> 20
- **TypeScript**: 5.7 -> 5.9
- **Type definitions**: @types/node 22 -> 25, @types/react and @types/react-dom to latest
