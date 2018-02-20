<template lang="pug">
  div
    .headline backtest
    v-stepper
      v-stepper-header
        v-stepper-step(step="1" editable) Select Dataset
        v-divider
        v-stepper-step(step="2" editable) Select Stratergy
        v-divider
        v-stepper-step(step="3" editable) Papertrader Settings
        v-divider
        v-stepper-step(step="4" editable) Results
      v-stepper-items
        v-stepper-content(step="1")
          dataset-picker(v-on:dataset='updateDataset')
          v-btn(color="primary" @click.native="e1 = 2") Continue
        v-stepper-content(step="2")
          strat-picker.contain.my2(v-on:stratConfig='check')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import configBuilder from '@/components/backtester/backtesterConfigBuilder.vue';
import spinner from '@/components/global/blockSpinner.vue';
import {post} from '@/helpers/ajax';
import result from '@/components/backtester/result/result.vue';
import stratPicker from '@/components/global/config-builder/stratpicker.vue'
import datasetPicker from '@/components/global/config-builder/datasetpicker.vue';

@Component({
  components: {
    configBuilder,
    spinner,
    result,
    stratPicker,
    datasetPicker,
  },
})
export default class Backtester extends Vue {

  private backtestable = false;
  private backtestState = 'idle';
  private backtestResult = false;
  private config = false;

  private check(config: any) {
    this.config = config;
    // if(!config.valid)
    //   return this.backtestable = false;
    this.backtestable = true;
  }

  private run() {
    this.backtestState = 'fetching';

    const req = {
      gekkoConfig: this.config,
      data: {
        candleProps: ['close', 'start'],
        indicatorResults: true,
        report: true,
        roundtrips: true,
        trades: true
      }
    }

    post('backtest', req, (error: any, response: any) => {
      this.backtestState = 'fetched';
      this.backtestResult = response;
    });

  }

  private updateDataset(set: any) {
    this.dataset = set;
    this.$emit('config', this.config);
  }
}
</script>


<style lang="scss">
.contain {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
</style>

