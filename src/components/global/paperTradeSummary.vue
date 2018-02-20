<template lang='pug'>
.grd-row-col-3-6
  table.p1
    tr
      th amount of trades
      td {{ report.trades }}
    tr
      th sharpe ratio
      td {{ round2(report.sharpe) }}
    tr
      th start balance
      td {{ round(report.startBalance) }} {{ report.currency }}
    tr
      th final balance
      td {{ round(report.balance) }} {{ report.currency }}
    tr
      th simulated profit

  .big.txt--right.price(:class='profitClass') {{ round(report.relativeProfit) }}%

</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class PaperTradeSummary extends Vue {
  @Prop() private report: any;

  private round2(n) {
    return (+n).toFixed(2);
  }

  private round(n) {
    return (+n).toFixed(5);
  }

  get profitClass() {
    if(this.report.relativeProfit > 0)
      return 'profit'
    else
      return 'loss'
  }
}
</script>

<style>
.summary td {
  text-align: right;
}
.big {
  font-size: 1.3em;
  width: 80%;
}
.summary table {
  width: 80%;
}
.price.profit {
  color: #7FFF00;
}
.price.loss {
  color: red;
}
</style>
