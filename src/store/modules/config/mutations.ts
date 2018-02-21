import Vue from 'vue';

export const syncApiKeys = (state: any, apiKeys: any) => {
  Vue.set(state, 'apiKeys', apiKeys);
  return state;
};

export const syncExchanges = (state: any, exchanges: any) => {
  Vue.set(state, 'exchanges', exchanges);
  return state;
};
