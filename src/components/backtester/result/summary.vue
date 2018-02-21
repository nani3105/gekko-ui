<template lang='pug'>
div.contain

  .grd-row.summary
    .grd-row-col-3-6
      table.p1
        tr
          th start time
          td {{ report.startTime }}
        tr
          th end time
          td {{ report.endTime }}
        tr
          th timespan
          td {{ report.timespan }}
        tr
          th start price
          td {{ round(report.startPrice) }} {{ report.currency }}
        tr
          th end price
          td {{ round(report.endPrice) }} {{ report.currency }}
        tr
          th market
          td {{ round(report.market) }}%

    paperTradeSummary(:report='report')

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import paperTradeSummary from '@/components/global/paperTradeSummary.vue';

@Component({
  components: {
    paperTradeSummary,
  },
})
export default class Summary extends Vue {
  @Prop('report') private report: any;

  public round(n) {
    return (+n).toFixed(5);
  }
}
</script>
