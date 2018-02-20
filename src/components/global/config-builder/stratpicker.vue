<template lang='pug'>
div
  h3 Strategy
  v-form
    v-layout(row wrap)
      v-flex(xs12 sm6)
        v-subheader(v-text="'Select Stratergy: '")
      v-flex(xs12 sm6)
        v-select(:items='strategies' item-text="name")
    v-layout(row wrap)
      v-flex(xs4 sm6)
        v-subheader(v-text="'Select Candle Size: '")
      v-flex(xs8 sm6)
        v-layout(row wrap)
          v-text-field()
          v-select(:items="candleSizeUnits")
    v-layout(row wrap)
      v-flex(xs4 sm6)
        v-subheader Warmup period (in {{ rawCandleSize }} {{ singularCandleSizeUnit }} candles):
      v-flex(xs8 sm6)
        v-layout(row wrap)
          v-text-field()
          em (will use {{ humanizeDuration(candleSize * historySize * 1000 * 60) }} of data as history)
    div
      h3 Parameters
      p {{ strategy }} Parameters:
      v-text-field(multi-line v-model='rawStratParams')
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import _ from 'lodash';
import {get} from '@/helpers/ajax';

const humanizeDuration = require('humanize-duration');
const toml = require('toml');

@Component({

})
export default class StratPicker extends Vue {

  private strategies = [];

  private candleSizeUnit: string = 'hours';

  private rawCandleSize: number = 1;

  private strategy: string = 'MACD';

  private historySize: number = 10;

  private rawStratParams = '';

  private rawStratParamsError = false;

  private emptyStrat: false;

  private stratParams: {};

  private candleSizeUnits = [
    'minutes',
    'hours',
    'days',
  ];

  get candleSize() {
    if(this.candleSizeUnit === 'minutes')
      return this.rawCandleSize;
    else if(this.candleSizeUnit === 'hours')
      return this.rawCandleSize * 60;
    else if(this.candleSizeUnit === 'days')
      return this.rawCandleSize * 60 * 24;
  }

  get singularCandleSizeUnit() {
    return this.candleSizeUnit.slice(0, -1);
  }

  get config() {
    let config = {
      tradingAdvisor: {
        enabled: true,
        method: this.strategy,
        candleSize: +this.candleSize,
        historySize: +this.historySize
      }
    }
    if(this.emptyStrat)
      config[this.strategy] = {__empty: true}
    else
      config[this.strategy] = this.stratParams;
      return config;
  }

  humanizeDuration (n) { return humanizeDuration(n); }

  created() {
    get('strategies', (err: any, data: any) => {
      this.strategies = data;

      _.each(this.strategies, function(s) {
          s.empty = s.params === '';
      });

      this.rawStratParams = _.find(this.strategies, { name: this.strategy }).params;
      this.emptyStrat = _.find(this.strategies, { name: this.strategy }).empty;
      this.emitConfig();
    });
  }

  emitConfig() {
    this.parseParams();
    this.$emit('stratConfig', this.config);
  }

  parseParams() {
    try {
      this.stratParams = toml.parse(this.rawStratParams);
      this.rawStratParamsError = false;
    } catch(e) {
      this.rawStratParamsError = e;
      this.stratParams = {};
    }
  }

  @Watch('strategy')
  private StratWatcher(strat) {
    strat = _.find(this.strategies, { name: strat });
    this.rawStratParams = strat.params;
    this.emptyStrat = strat.empty;
    this.emitConfig();
  }

  @Watch('candleSize')
  private candleSizeWatcher() {
    this.emitConfig();
  }

  @Watch('historySize')
  private historySizeWatcher() {
    this.emitConfig();
  }

  @Watch('rawStratParams')
  private rawStratParamsWatcher() {
    this.emitConfig();
  }
}
</script>


