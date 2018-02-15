<template lang="pug">
  div
    h2.contain Backtest
    .hr.contain
    config-builder(v-on:config='check')
    div(v-if='backtestable')
      .txt--center
        a.w100--s.my1.btn--primary(href='#', v-if='backtestState !== "fetching"', v-on:click.prevent='run') Backtest
        div(v-if='backtestState === "fetching"').scan-btn
          p Running backtest..
          spinner
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import configBuilder from '@/components/backtester/backtesterConfigBuilder.vue';
import spinner from '@/components/global/blockSpinner.vue';

@Component({
  components: {
    configBuilder,
    spinner,
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
}
</script>


<style lang="scss">
.contain {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
</style>

