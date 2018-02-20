import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import './registerServiceWorker';

import { connect as connectWS } from '@/helpers/ws';

Vue.config.productionTip = false;
Vue.use(Vuetify);

import 'vuetify/dist/vuetify.min.css';
import 'cryptocoins-icons/webfont/cryptocoins.css';
import 'cryptocoins-icons/webfont/cryptocoins-colors.css';

// setup some stuff
connectWS();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
