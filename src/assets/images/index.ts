/**
 * Brand image assets.
 *
 * In a real host app these would resolve to `.png`/`.svg` files at build time
 * (via Vite's `?url` loader or static paths). The shared library ships a
 * typed contract here so callers can `import { logo, defaultImage } from
 * '@onflow/onflow-shared-frontend/common/assets/images'`.
 *
 * To customize, declare an ambient module on the host:
 *
 * ```ts
 * declare module '@onflow/onflow-shared-frontend/common/assets/images' {
 *   export const logo: string;
 *   export const defaultImage: string;
 * }
 * ```
 */

export const logo: string = '';
export const defaultImage: string = '';
