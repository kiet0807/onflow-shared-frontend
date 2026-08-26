# `@onflow/onflow-shared-frontend`

Shared component library, hooks, utilities, and API factories for Onflow OMS and the Open Platform web apps.

> Built for **React 18 + TypeScript**. Designed for **tree-shaking** via deep imports.

---

## Why this package exists

Building multiple frontend apps (OMS, Open Platform, and future ones) means the same UI patterns — a paginated table, a file upload, a date picker, an i18n setup, an axios wrapper — get recreated and diverged in every repo. When a bug is fixed or a design changes, it has to be applied N times.

This package solves that by consolidating everything that **repeats across apps** into one published, versioned package:

| Benefit | Detail |
|---|---|
| **Single source of truth** | Fix a bug once, publish a new version, update wherever it's installed. |
| **Consistent UX** | Every app uses the same table component, loading state, error banner, date formatting. |
| **Faster onboarding** | New apps just run `yarn add` — no need to copy-paste components from other repos. |
| **Shared business logic** | Address validation, file upload constraints, API factory defaults — shared and tested in one place. |
| **Feature modules** | Domain-specific components (e.g. `FinanceConfigTable`) live here so they can be reused across apps without duplication. |
| **Independent versioning** | Each app pins its own compatible version via semver. |

### Trade-offs to be aware of

- **Peer dependencies** must be installed at the host app — not all apps use every feature, so optional peer deps keep bundle size in check.
- **Breaking changes** require a major version bump and downstream app updates. Careful semver discipline and a changelog are essential.
- **Tailwind + remixicon** must be available in the host app — this package provides Tailwind utility classes, not a full CSS reset or icon font.

---

## Overview

This package collects the primitives that repeat across Onflow frontend apps into a single, versioned, published library. It ensures consistent UI, shared business logic, and a single source of truth for bugs and features — instead of copy-pasting components across repos.

### What it provides

| Layer | Entry | Highlights |
|---|---|---|
| **Components** | `./common` | Buttons (Base, Copy, Dropdown, Switch), Inputs (Text, Date, File, Image, Search…), Modals (Confirm, Lightbox, Video), Tables (Paginate, PaginateTable), Displays (Banner, Loading, Empty, Error, MetricsCard…), Navigations (UnderlineTabs, VerticalTabs), Forms (CheckboxField, FormCard…) |
| **Hooks** | `./common/hooks` | `useLocalStorage`, `useToggle`, `useAddressSelector` |
| **Utilities** | `./common/utils` | Date formatting, number/string/object/array helpers, HTTP utilities, pagination, regex patterns, file helpers |
| **Constants** | `./common/constants` | Address config, upload config |
| **API layer** | `./core` | `createApiInstance` (axios factory), `setAuthToken`, `setLanguage` |
| **Config** | `./core` | `createAppConfig` for per-app runtime settings |
| **i18n** | `./core` | `initializeI18n`, `registerFeatureResources`, `getI18nInstance` + built-in `vi`/`en` locale bundles |
| **Feature modules** | `./features/e-invoice` | `FinanceConfigTable`, domain types, queries, constants |

### Tech stack

- **React 18** + **TypeScript** — strict, tree-shakeable
- **Vite** + `vite-plugin-dts` — emits `.mjs`, `.cjs`, and `.d.ts`
- **reactstrap** + **Tailwind CSS** — host app must provide both
- **react-hook-form** + **yup** — form and validation
- **@tanstack/react-query** + **axios** — data fetching
- **i18next** + **react-i18next** — internationalization with bundled locale JSONs
- **Vitest** + Testing Library — tests in `src/**/__tests__/`
- **remixicon** — icon font (host app provides CSS)

---

## Install

```bash
yarn add @onflow/onflow-shared-frontend
```

You also need to install the **peer dependencies** your app actually uses:

```bash
yarn add react@^18 react-dom@^18 \
  react-i18next@^11 i18next@^21 i18next-browser-languagedetector@^7 \
  dayjs@^1.11 axios@^1 \
  @tanstack/react-query@^5 react-hook-form@^7 @hookform/resolvers@^3 yup@^0.32 \
  reactstrap@^9 react-select@^5 react-router-dom@^6 \
  flatpickr@^4 react-flatpickr@^3.10
```

Packages marked **optional** in `peerDependenciesMeta` can be omitted if your app does not use them.

### Required host-app setup

- **Tailwind CSS** must be configured — we ship utility classes only.
- **`remixicon` CSS** (or an icon font of your choice) must be loaded.

---

## Usage

### 1. Boot i18n once in your app root

```tsx
import {
  initializeI18n,
  registerFeatureResources,
} from '@onflow/onflow-shared-frontend';
import viBundle from '@onflow/onflow-shared-frontend/common/locales/vi.json';
import enBundle from '@onflow/onflow-shared-frontend/common/locales/en.json';

initializeI18n({
  lng: 'vi',
  fallbackLng: ['vi', 'en'],
});

// Register shared locale resources (included in the package)
registerFeatureResources('common', { vi: viBundle, en: enBundle });
```

### 2. Create an API instance per service

```ts
import { createApiInstance, setAuthToken } from '@onflow/onflow-shared-frontend';

export const eInvoiceApi = createApiInstance({
  baseURL: process.env.NEXT_PUBLIC_EINVOICE_API!,
  system: 'e-invoice',
  debug: process.env.NODE_ENV !== 'production',
});

setAuthToken(eInvoiceApi, token);
```

### 3. App config

```ts
import { createAppConfig } from '@onflow/onflow-shared-frontend';

export const appConfig = createAppConfig({
  env: process.env.NEXT_PUBLIC_APP_ENV,
  mode: process.env.NODE_ENV as 'development' | 'production',
  eInvoiceApiBaseUrl: process.env.NEXT_PUBLIC_EINVOICE_API,
});
```

### 4. Use components (deep-import for tree-shaking)

```tsx
// Feature-specific components
import { FinanceConfigTable } from '@onflow/onflow-shared-frontend/features/e-invoice';

// Reusable primitives
import { ImageUpload }  from '@onflow/onflow-shared-frontend/common/inputs';
import { useLocalStorage } from '@onflow/onflow-shared-frontend/common/hooks';
import { formatDateTime }  from '@onflow/onflow-shared-frontend/common/utils/date';
import { PaginateTable }   from '@onflow/onflow-shared-frontend/common/tables';
import { ConfirmModal }    from '@onflow/onflow-shared-frontend/common/modals';
import { BrandedLoading }  from '@onflow/onflow-shared-frontend/common/displays';
```

---

## Package layout

```
src/
├─ common/          Components, hooks, utils, constants, shared i18n bundles
│   ├─ components/  buttons · displays · forms · inputs · modals · navigations · tables · viewers
│   ├─ hooks/       useLocalStorage · useToggle · useAddressSelector
│   ├─ utils/       date · data (array/number/object/string) · http · regex · ui · file · pagination
│   ├─ constants/   address · upload
│   ├─ locales/     vi.json · en.json
│   ├─ queries/
│   └─ types/
├─ core/            API factory, runtime config, i18n bootstrap
│   ├─ api/
│   ├─ config/
│   └─ i18n/
├─ features/        Feature modules (e-invoice, …)
│   └─ e-invoice/   FinanceConfigTable, domain types, queries, constants
└─ index.ts         Root barrel — cross-cutting exports only
```

Each top-level folder is published as its own sub-entry in `package.json#exports`:

```ts
import '@onflow/onflow-shared-frontend';                  // root barrel
import '@onflow/onflow-shared-frontend/common';           // all common primitives
import '@onflow/onflow-shared-frontend/core';            // api + config + i18n
import '@onflow/onflow-shared-frontend/features/e-invoice';
```

---

## Development

```bash
yarn install       # install dependencies
yarn dev          # watch-mode build (writes to /dist)
yarn build        # production build to /dist
yarn type-check   # tsc --noEmit
yarn test:run     # vitest --run
yarn lint         # eslint --ext .ts,.tsx
```

Before publishing:

```bash
yarn prepublishOnly
```

`prepublishOnly` runs `type-check` → `test:run` → `build` in sequence.

---

## Versioning

This package follows [semver](https://semver.org/). Breaking changes to any public export bump the **major** version. Internal file paths under `/src/` are not part of the public API.

---

## Publishing

The package is published to GitHub Packages (`@onflow` scope, `access: restricted`).

Registry is configured in `.npmrc`:

```
@onflow:registry=https://npm.pkg.github.com
```

You must be authenticated with GitHub Packages before publishing. See [GitHub Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) for setup instructions.

---

## License

UNLICENSED — internal use only.
