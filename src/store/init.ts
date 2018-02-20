import syncConfig from './modules/config/sync';
import syncImports from './modules/imports/sync';

export default function() {
  syncImports();
  syncConfig();
}
