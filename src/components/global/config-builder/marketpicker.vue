<template lang='pug'>
div
  v-layout(row wrap)
    v-flex(xs12 sm6)
      v-subheader(v-text="'Exchange:'")
    v-flex(xs12 sm6)
      v-select(
        label="Select"
        :items="exchangeItems"
        v-model="exchange"
      )

  v-layout(row wrap)
    v-flex(xs12 sm6)
      v-subheader(v-text="'Currency:'")
    v-flex(xs12 sm6)
      v-select(
        label="Select"
        :items="currencies"
        v-model="currency"
      )

  v-layout(row wrap)
    v-flex(xs12 sm6)
      v-subheader(v-text="'Asset:'")
    v-flex(xs12 sm6)
      v-select(
        label="Select"
        :items="assets"
        v-model="asset"
      )

</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import _ from 'lodash';

@Component({})
export default class MarketPicker extends Vue {

  @Prop() private onlyTradable: string;
  @Prop() private onlyImportable: string;

  private exchange = 'binance';
  private currency = 'USDT';
  private asset = 'BTC';

  private created() {
    this.emitConfig();
  }

  get exchanges() {
    const exchanges = Object.assign({}, this.$store.state.exchanges);

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

    if (this.onlyImportable) {
      _.each(exchanges, (e, name) => {
        if (!e.importable) {
          delete exchanges[name];
        }
      });
    }
    return exchanges;
  }

  get exchangeItems() {
    return _.isEmpty(this.exchanges) ? [] : _.keysIn(this.exchanges);
  }

  get markets() {
    return this.exchanges ? this.exchanges[ this.exchange ] : [];
  }

  get assets() {
    return this.exchanges ? this.exchanges[this.exchange].markets[this.currency] : [];
  }

  get currencies() {
    return this.exchanges ? _.keys( this.exchanges[this.exchange].markets ) : [];
  }

  private emitConfig() {
    this.$emit('market', this.watchConfig);
  }

  get watchConfig() {
    return {
      watch: {
        exchange: this.exchange,
        currency: this.currency,
        asset: this.asset,
      },
    };
  }

  @Watch('currency')
  private currencyWatcher() {
    this.emitConfig();
  }

  @Watch('asset')
  private assetWatcher() {
    this.emitConfig();
  }

  @Watch('market')
  private marketWatcher() {
    this.emitConfig();
  }

  @Watch('exchanges')
  private exchangesWatcher() {
    this.emitConfig();
  }

  @Watch('exchange')
  private exchangeWatcher() {
    this.emitConfig();
  }
}
</script>

