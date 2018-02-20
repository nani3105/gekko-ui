<template lang='pug'>
div
  h3 Daterange
  div
    label(for='from') From
    input(v-model='from')
  div
    label(for='to') To
    input(v-model='to')
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {get} from '@/helpers/ajax';
import * as moment from 'moment';

@Component({})
export default class RangeCreator extends Vue {

  private from = '';
  private to = '';

  private created() {
    let now = moment().startOf('minute');
    let then = now.clone().subtract(3, 'months');
    this.to = this.fmt(now);
    this.from = this.fmt(then);
    this.emitRange();
  }

  private fmtTs(mom) {
    return moment.unix(mom).utc();
  }

  private fmt(mom) {
    return mom.utc().format('YYYY-MM-DD HH:mm');
  }

  private emitRange() {
    this.$emit('range', {
      from: this.fmtTs(this.from),
      to: this.fmtTs(this.to)
    });
  }

  private emitManualEntry() {
    if(this.from.length < '4' || this.from.length < '4')
      return this.$emit('range', {});
    let from = moment.utc(this.from);
    let to = moment.utc(this.to);
    if(from.isValid() && to.isValid()) {
      this.$emit('range', {
        from: this.fmt(from),
        to: this.fmt(to)
      });
    } else {
      this.$emit('range', {});
    }
  }

  @Watch('from')
  private fromWatcher() {
    this.emitManualEntry();
  }

  @Watch('to')
  private toWatcher() {
    this.emitManualEntry();
  }

  @Watch('config')
  private configWatcher() {
    this.scanned = false;
  }

  @Watch('tab')
  private tabWatcher() {
    this.scanned = false;
    this.$emit('range', {});
  }

  @Watch('selectedRangeIndex')
  private selectedRangeIndexWatcher() {
    let selectedRange = this.ranges[this.selectedRangeIndex];
    if(selectedRange)
      this.emitRange(selectedRange);
  }
}
</script>

<style>
.scan-btn {
  margin-top: 80px;
  margin-bottom: 30px;
}
.radio label {
  margin-top: 0;
}
</style>
