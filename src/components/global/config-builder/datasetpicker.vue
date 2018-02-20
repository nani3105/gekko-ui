<template lang="pug">
  div
    v-toolbar
      v-toolbar-title Dataset
      v-spacer
      v-tooltip(bottom)
        v-btn(icon slot="activator" @click.prevent='scan')
          v-icon gps_fixed
        span Scan Dataset
      v-tooltip(bottom)
        v-btn(icon slot="activator" to='/data/importer')
          v-icon launch
        span Add New Import

    v-data-table(:headers="headers" :items="datasets" class="elevation-1")
      template(slot="items" slot-scope="props")
        tr
          td
            v-radio-group(v-model="setIndex" name="rowSelector")
              v-radio(:value="props.item.id")
          td {{ props.item.exchange }}
          td
            crypto-icon(:asset="props.item.currency")
          td
            crypto-icon(:asset="props.item.asset")
          td {{ fmt(props.item.from) }}
          td {{ fmt(props.item.to) }}
          td {{ humanizeDuration(props.item.to.diff(props.item.from)) }}
      template(slot="no-data")
        v-alert(:value="true" color="error" icon="warning") Sorry, nothing to display here :(

    div.adjust-range
      v-btn(color="blue-grey" class="white--text" @click.prevent='openRange' v-if='!rangeVisible') Adjust Range
        v-icon(right dark) date_range
    template(v-if='rangeVisible')
      v-layout(row)
        v-flex(xs2)
          v-subheader From:
        v-flex(xs4)
          v-text-field(v-model='customFrom' hint="YYYY-MM-DD HH:mm" persistent-hint)
        v-flex(xs2)
          v-subheader To:
        v-flex(xs4)
          v-text-field(v-model='customTo' hint="YYYY-MM-DD HH:mm" persistent-hint)
</template>

<script lang="ts">
import { Vue, Watch } from 'vue-property-decorator';
import { Component, Mixins } from 'vue-mixin-decorator';
import { Dataset } from '../mixins/dataset';
import spinner from '@/components/global/blockSpinner.vue';
import cryptoIcon from '@/components/global/cryptoIcon.vue';
import * as moment from 'moment';
const humanizeDuration = require('humanize-duration');
import _ from 'lodash';

@Component({
  name: 'dataset-picker',
  components: {
    spinner,
    cryptoIcon
  },
})
export default class Datasetpicker extends Mixins<Dataset>(Dataset) {

  private headers = [
    { text: '', value: '', sortable: false },
    { text: 'Exchange', value: 'exchange' },
    { text: 'Currency', value: 'currency' },
    { text: 'Asset', value: 'asset' },
    { text: 'From', value: 'from' },
    { text: 'To', value: 'to' },
    { text: 'Duration', value: '' }
  ];

  public setIndex = -1;
  public rangeVisible = false;
  public set: boolean = false;
  public customTo: string | boolean = false;
  public customFrom: string | boolean = false;

  public fmt(mom: any) {
    return mom.utc().format('YYYY-MM-DD HH:mm');
  }

  public humanizeDuration(n: number) {
    return humanizeDuration(n, {largest: 4});
  }

  private updateCustomRange() {
    this.customTo = this.fmt(this.set.to);
    this.customFrom = this.fmt(this.set.from);
  }

  private openRange() {
    if (this.setIndex === -1) {
      return alert('Select a dataset to adjust range');
    }
    this.updateCustomRange();
    this.rangeVisible = true;
  }

  private emitSet(val: any) {
    if (!val) {
      return;
    }

    let set;
    if (!this.customTo) {
      set = val;
    } else {
      set = (Vue as any).util.extend({}, val);
      set.to = moment.utc(this.customTo as string, 'YYYY-MM-DD HH:mm').format();
      set.from = moment.utc(this.customFrom as string, 'YYYY-MM-DD HH:mm').format();
    }
    this.$emit('dataset', set);
  }

  @Watch('setIndex')
  private setIndexWatcher() {
    this.set = _.find(this.datasets, dataset => dataset.id === this.setIndex);
    this.updateCustomRange();
    this.emitSet(this.set);
  }

  @Watch('customTo')
  private customToWatcher() {
    this.emitSet(this.set);
  }

  @Watch('customFrom')
  private customFromWatcher() {
    this.emitSet(this.set);
  }
}
</script>

<style lang="scss" scoped>
  .spinner-container {
    position: relative;
  }

  td {
    &.radio {
      width: 45px;
    }

    label {
      display: inline;
      font-size: 1em;
    }
  }

  .adjust-range {
    text-align: left;
  }
</style>



