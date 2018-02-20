import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Backtester from './views/BackTester.vue';
import Importer from './views/Importer.vue';
import Config from './views/Config.vue';
import SingleImport from './views/Single.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    {
      path: '/backtest',
      name: 'backtester',
      component: Backtester,
    },
    { path: '/config', component: Config },
    { path: '/data/importer', component: Importer },
    { path: '/data/importer/import/:id', component: SingleImport },
  ],
});
