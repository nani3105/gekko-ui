<template lang="pug">
  .contain
    dataset-picker.contain.my2(v-on:dataset='updateDataset')
    .hr
    strat-picker.contain.my2(v-on:stratConfig='updateStrat')
    .hr
    paper-trader(v-on:settings='updatePaperTrader')
    .hr
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import datasetPicker from '@/components/global/config-builder/datasetpicker.vue';
import stratPicker from '@/components/global/config-builder/stratpicker.vue'
import paperTrader from '@/components/global/config-builder/papertrader.vue';
import _ from 'lodash';
import {get} from '@/helpers/ajax';

const toml = require('toml');

@Component({
  name: 'config-builder',
  components: {
    datasetPicker,
    stratPicker,
    paperTrader,
  },
})
export default class ConfigBuilder extends Vue {

  private dataset: any = {};
  private strat = {};
  private paperTrader = {};
  private performanceAnalyzer = {};

  private created() {
    get('configPart/performanceAnalyzer', (error, response) => {
      this.performanceAnalyzer = toml.parse(response.part);
      this.performanceAnalyzer.enabled = true;
    });
  }

  get range() {
    if(!this.dataset.exchange)
      return {};

    return {
      from: this.dataset.from,
      to: this.dataset.to
    }
  }

  get market() {
    if (!this.dataset.exchange) {
      return {};
    }

    return {
      exchange: this.dataset.exchange,
      currency: this.dataset.currency,
      asset: this.dataset.asset
    };
  }

  get config() {
    let config = {};
    Object.assign(
      config,
      { watch: this.market },
      { paperTrader: this.paperTrader },
      this.strat,
      {
        backtest: {
          daterange: this.range
        }
      },
      { performanceAnalyzer: this.performanceAnalyzer }
    );

    config.valid = this.validConfig(config);

    return config;
  }

  private validConfig(config) {
    if(!config.backtest)
      return false;
    if(!config.backtest.daterange)
      return false;
    if(_.isEmpty(config.backtest.daterange))
      return false;
    if(!config.watch)
      return false;
    if(!config.tradingAdvisor)
      return false;
    let strat = config.tradingAdvisor.method;
    if(_.isEmpty(config[ strat ]))
      return false;
    if(config.tradingAdvisor) {
      if(_.isNaN(config.tradingAdvisor.candleSize))
        return false;
      else if(config.tradingAdvisor.candleSize == 0)
        return false;
    }
    return true;
  }

  private updateDataset(set: any) {
    this.dataset = set;
    this.$emit('config', this.config);
  }

  private updateStrat(sc) {
    this.strat = sc;
    this.$emit('config', this.config);
  }

  private updatePaperTrader(pt) {
    this.paperTrader = pt;
    this.paperTrader.enabled = true;
    this.$emit('config', this.config);
  }

}
</script>


