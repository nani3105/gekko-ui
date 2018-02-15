<template lang="pug">
  div
    h3 Select a dataset
    .txt--center.my2(v-if='datasetScanstate === "idle"')
      a.w100--s.btn--primary.scan-btn(href='#', v-on:click.prevent='scan') Scan available data
    .txt--center.my2.spinner-container(v-if='datasetScanstate === "scanning"')
      spinner
    .my2(v-if='datasetScanstate === "scanned"')

      div(v-if='datasets.length != 0')
        table.full
          thead
            tr
              th
              th exchange
              th currency
              th asset
              th from
              th to
              th duration
          tbody
            tr(v-for='(set, i) in datasets')
              td.radio
                input(type='radio', name='dataset', :value='i', v-model='setIndex', v-bind:id='set.id')
              td
                label(v-bind:for='set.id') {{ set.exchange }}
              td
                label(v-bind:for='set.id') {{ set.currency }}
              td
                label(v-bind:for='set.id') {{ set.asset }}
              td
                label(v-bind:for='set.id') {{ fmt(set.from) }}
              td
                label(v-bind:for='set.id') {{ fmt(set.to) }}
              td
                label(v-bind:for='set.id') {{ humanizeDuration(set.to.diff(set.from)) }}
        a.btn--primary(href='#', v-on:click.prevent='openRange', v-if='!rangeVisible') Adjust range
        template(v-if='rangeVisible')
          div
            label(for='customFrom') From:
            input(v-model='customFrom')
          div
            label(for='customTo') To:
            input(v-model='customTo')

    em(v-else) No Data found
      a(href='#/data/importer') Lets add some
</template>

<script lang="ts">
import { Vue, Watch } from 'vue-property-decorator';
import { Component, Mixins } from 'vue-mixin-decorator';
import { Dataset } from '../mixins/dataset';
import spinner from '@/components/global/blockSpinner.vue';
import * as moment from 'moment';
import humanizeDuration from 'humanize-duration';

@Component({
  name: 'dataset-picker',
  components: {
    spinner,
  },
})
export default class Datasetpicker extends Mixins<Dataset>(Dataset) {
  public setIndex = -1;
  public rangeVisible = false;
  public set: any = false;
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
    this.set = this.datasets[this.setIndex];
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
</style>



