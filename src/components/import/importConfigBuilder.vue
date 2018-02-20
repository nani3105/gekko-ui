<template lang="pug">
.grd.contain
  .grd-row
    .grd-row-col-3-6.mx1
      h3 Market
      market-picker.contain(v-on:market='updateMarketConfig', only-importable='true')
    .grd-row-col-3-6.mx1
      range-creator(v-on:range='updateRange')
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import marketPicker from '@/components/global/config-builder/marketpicker.vue';
import rangeCreator from '@/components/global/config-builder/rangecreator.vue';

@Component({
  components: {
    marketPicker,
    rangeCreator,
  }
})
export default class ImportConfigBuilder extends Vue {

  private market: any = {};
  private range: any = {};

  get config() {
    let config = {};

    Object.assign(
      config,
      this.market,
      {
        importer: {
          daterange: this.range
        }
      },
      {
        candleWriter: { enabled: true }
      }
    );
    return config;
  }

  private updateMarketConfig(mc) {
    this.market = mc;
    this.emitConfig();
  }

  private updateRange(range) {
    this.range = range;
    this.emitConfig();
  }

  private emitConfig() {
    this.$emit('config', this.config);
  }

}
</script>


