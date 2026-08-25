/**
 * Public surface of the e-invoice feature module.
 *
 * Re-exports only the components and types host apps should consume. Internal
 * helpers stay inside the feature folder.
 */

export { FinanceConfigTable } from './components/FinanceConfigTable';
export type {
  FinanceConfig,
  FinancePlatform,
  PublicInfo,
  Store,
} from './components/FinanceConfigTable/types';