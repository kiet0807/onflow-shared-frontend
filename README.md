# `@onflow/onflow-shared-frontend`

Shared component library, hooks, utilities, and API factories for Onflow OMS and the Open Platform web apps.

> Built for React 18 + TypeScript. Designed for **tree-shaking** via deep imports.

---

## Install

```bash
yarn add @onflow/onflow-shared-frontend
```

You also need to install the **peer dependencies** your app actually consumes:

```bash
yarn add react@^18 react-dom@^18 react-i18next@^11 i18next@^21 \
         i18next-browser-languagedetector@^7 dayjs@^1.11 \
         axios@^1 @tanstack/react-query@^5 react-hook-form@^7 \
         @hookform/resolvers@^3 yup@^0.32 reactstrap@^9 \
         react-select@^5 react-router-dom@^6 flatpickr@^4 \
         react-flatpickr@^3.10
```

### Required peer CSS

- **Tailwind CSS** configured in your host app (we ship utility classes).
- **`remixicon` CSS** (or an icon font of your choice) — used by several
  buttons/inputs.

---

## Usage

### 1. Boot i18n once in your app root

```tsx
import {
  initializeI18n,
  registerFeatureResources,
} from '@onflow/onflow-shared-frontend';
import viEInvoice from '@onflow/onflow-shared-frontend/features/e-invoice/locales/vi.json';
import enEInvoice from '@onflow/onflow-shared-frontend/features/e-invoice/locales/en.json';

initializeI18n({
  lng: 'vi',
  fallbackLng: ['vi', 'en'],
});

registerFeatureResources('eInvoice', { vi: viEInvoice, en: enEInvoice });
```

### 2. Use components (deep-import for tree-shaking)

```tsx
import { FinanceConfigTable } from '@onflow/onflow-shared-frontend/features/e-invoice';
import { useLocalStorage } from '@onflow/onflow-shared-frontend/common/hooks';
import { formatDateTime } from '@onflow/onflow-shared-frontend/common/utils';
```

### 3. Build an API instance per host

```ts
import { createApiInstance, setAuthToken } from '@onflow/onflow-shared-frontend';

export const eInvoiceApi = createApiInstance({
  baseURL: process.env.NEXT_PUBLIC_EINVOICE_API!,
  system: 'e-invoice',
  debug: process.env.NODE_ENV !== 'production',
});

setAuthToken(eInvoiceApi, token);
```

### 4. App config

```ts
import { createAppConfig } from '@onflow/onflow-shared-frontend';

export const appConfig = createAppConfig({
  env: process.env.NEXT_PUBLIC_APP_ENV,
  mode: process.env.NODE_ENV as 'development' | 'production',
  eInvoiceApiBaseUrl: process.env.NEXT_PUBLIC_EINVOICE_API,
});
```

---

## Package layout

```
src/
├─ common/        # Components, hooks, utils, constants — drop-in primitives
├─ core/          # API factory, runtime config, i18n bootstrap
└─ features/      # Feature modules (e-invoice, ...)
```

Each top-level folder is published as its own sub-entry:

```ts
import '@onflow/onflow-shared-frontend/common';
import '@onflow/onflow-shared-frontend/core';
import '@onflow/onflow-shared-frontend/features/e-invoice';
```

---

## Development

```bash
yarn install
yarn dev          # watch-mode build of all entries
yarn build        # production build to /dist
yarn type-check   # tsc --noEmit
yarn test:run     # vitest --run
yarn lint
yarn storybook    # dev server at http://localhost:6006
yarn build-storybook  # static build to /storybook-static
```

Before publishing:

```bash
yarn prepublishOnly
```

This runs type-check → tests → build, in that order.

---

## Versioning

This package follows [semver](https://semver.org/). Breaking changes to any
public export (`./common`, `./core`, `./features/*`) bump the **major**
version. Internal file paths under `/src/` are not part of the public API.

---

## License

UNLICENSED — internal use only.