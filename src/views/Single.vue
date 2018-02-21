<template lang='pug'>
  div.contain.my2
    div(v-if='importData && !importData.done')
      h2 Importing data..
      .grd
        .grd-row
          .grd-row-col-2-6 <strong>Market:</strong>
          .grd-row-col-4-6 {{ importData.watch.exchange }}
        .grd-row
          .grd-row-col-2-6 <strong>Currency/Asset:</strong>
          .grd-row-col-4-6 {{ importData.watch.currency }}/{{ importData.watch.asset }}

      .grd
        .grd-row
          .grd-row-col-2-6 <strong>From:</strong>
          .grd-row-col-4-6 {{ fmt(from) }}
        .grd-row
          .grd-row-col-2-6 <strong>To:</strong>
          .grd-row-col-4-6 {{ fmt(to) }}
        .grd-row(v-if='initialized')
          .grd-row-col-2-6 <strong>Imported data until:</strong>
          .grd-row-col-4-6 {{ fmt(latest) }}
        .grd-row(v-if='initialized')
          .grd-row-col-2-6 <strong>Remaining:</strong>
          .grd-row-col-4-6 {{ fromEnd }}
      spinner(v-if='!initialized')
      .contain(v-if='initialized')
        progressBar(:progress='progress')
      p
        em (you don't have to wait until the import is done,
          | you can already start
          router-link(to='/backtest') backtesting
          | ).
    div(v-if='importData && importData.done').txt--center
      h2 Import done
      p
        | Go and
        router-link(to='/backtest') backtest
        |  with your new data!
    div(v-if='!importData ').txt--center
      h2 ERROR: Uknown import
      p
        I don't know this import..
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import spinner from '@/components/global/blockSpinner.vue';
import progressBar from '@/components/global/progressBar.vue';

import * as moment from 'moment';
const humanizeDuration = require('humanize-duration');
import _ from 'lodash';

@Component({
  components: {
    progressBar,
    spinner,
  },
})
export default class SingleImport extends Vue {

  get importData() {
    return _.find(
      this.$store.state.imports,
      { id: this.$route.params.id },
    );
  }

  get initialized() {
    if (this.importData && this.latest.isValid()) {
      return true;
    }
  }

  get latest() {
    if (this.importData) {
      return this.mom(this.importData.latest);
    }
  }

  get fromEndMs() {
    if (this.importData) {
      return this.to.diff(this.latest);
    }
  }

  get fromEnd() {
    if (!this.latest) {
      return 'LOADING';
    }
    return humanizeDuration(this.fromEndMs);
  }

  get from() {
    if (this.importData) {
      return this.mom(this.importData.from);
    }
  }

  get to() {
    if (this.importData) {
      return this.mom(this.importData.to);
    }
  }

  get timespan() {
    if (this.importData) {
      return this.to.diff(this.from);
    }
  }

  get progress() {
    if (!this.importData) {
      return;
    }
    const current = this.timespan - this.fromEndMs;
    return 100 * current / this.timespan;
  }

  private fmt(mom: any) {
    return mom.format('YYYY-MM-DD HH:mm:ss');
  }

  private mom(str: string) {
    return moment.utc(str);
  }

}
</script>
