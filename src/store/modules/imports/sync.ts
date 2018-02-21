import { get } from '@/helpers/ajax';
import store from '@/store';
import { bus } from '@/helpers//ws';

const init = () => {
  get('imports', (err: any, resp: any) => {
    store.commit('syncImports', resp);
  });
};

const sync = () => {
  bus.$on('import_update', (data: any) => {
    store.commit('updateImport', data);
  });
};


export default function() {
  init();
  sync();
}
