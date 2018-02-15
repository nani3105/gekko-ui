<template lang="pug">
  .contain
    dataset-picker.contain.my2(v-on:dataset='updateDataset')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import datasetPicker from '@/components/global/config-builder/datasetpicker.vue';

@Component({
  name: 'config-builder',
  components: {
    datasetPicker,
  },
})
export default class ConfigBuilder extends Vue {

  private dataset = {};

  get config() {
    return {};
  }

  private updateDataset(set: any) {
    this.dataset = set;
    this.$emit('config', this.config);
  }

}
</script>


