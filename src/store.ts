import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

import * as importMutations from './store/modules/imports/mutations';

const mutations = {};

_.merge(mutations, importMutations);

export default new Vuex.Store({
  state: {
    warnings: {
      connected: true, // assume we will connect
    },
    imports: [],
    stratrunners: [],
    watchers: [],
    connection: {
      disconnected: false,
      reconnected: false,
    },
    apiKeys: [],
    exchanges: {},
  },
  mutations,
  actions: {

  },
});
