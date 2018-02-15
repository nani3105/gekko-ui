<template lang='pug'>
div
  .mx1
    label(for='exchange').wrapper Exchange:
    .custom-select.button
      select(v-model='exchange')
        option(v-for='(market, e) in exchanges') {{ e }}
  .grd-row
    .grd-row-col-3-6.mx1
      label(for='currency') Currency:
      .custom-select.button
        select(v-model='currency')
          option(v-for='cur in currencies') {{ cur }}
    .grd-row-col-3-6.mx1
      label(for='asset') Asset:
      .custom-select.button
        select(v-model='asset')
          option(v-for='asst in assets') {{ asst }}
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import _ from 'lodash';

export default class MarketPicker extends Vue {
  private exchange = 'Binance';
  private currency = 'USDT';
  private asset = 'BTC';

  get exchanges() {
    const exchanges = {...this.$store.state.exchanges};

    if (_.isEmpty(exchanges)) {
      return false;
    }

    if (this.onlyTradable) {
      _.each(exchanges, (e, name) => {
        if (!e.tradable) {
          delete exchanges[name];
        }
      });
    }

  }
}
</script>

