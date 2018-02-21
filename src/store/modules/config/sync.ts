import { get } from '@/helpers/ajax';
import store from '@/store';
import { bus } from '@/helpers//ws';

const transformMarkets = (backendData: any) => {
  const exchangesRaw = backendData;
  const exchangesTemp: any = {};

  exchangesRaw.forEach((e: any) => {
    exchangesTemp[e.slug] = exchangesTemp[e.slug] || {markets: {}};

    e.markets.forEach( (pair: any) => {
      const [ currency, asset ] = pair.pair;
      exchangesTemp[e.slug].markets[currency] = exchangesTemp[e.slug].markets[currency] || [];
      exchangesTemp[e.slug].markets[currency].push( asset );
    });

    exchangesTemp[e.slug].importable = e.providesFullHistory ? true : false;
    exchangesTemp[e.slug].tradable = e.tradable ? true : false;
    exchangesTemp[e.slug].requires = e.requires;
  });

  return exchangesTemp;
};

function init() {
  get('apiKeys', (err, resp) => {
    store.commit('syncApiKeys', resp);
  });

  get('exchanges', (err, resp) => {
    store.commit('syncExchanges', transformMarkets(resp));
  });
}

const sync = () => {
  bus.$on('apiKeys', (data: any) => {
    store.commit('syncApiKeys', data.exchanges);
  });
};

export default function() {
  init();
  sync();
}
