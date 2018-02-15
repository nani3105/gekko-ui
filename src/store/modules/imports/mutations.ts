import Vue from 'vue';

export function addImport(state: any, imp: any) {
  state.imports.push(imp);
  return state;
}

export function syncImports(state: any, imports: any) {
  state.imports = imports;
  return state;
}

export function updateImport(state: any, update: any) {
  const index = state.imports.findIndex((i: any) => i.id === update.import_id);
  const item = state.imports[index];
  if (!item) {
    return state;
  }

  const updated = (Vue as any).util.extend(item, update.updates);
  Vue.set(state.imports, index, updated);

  return state;
}
