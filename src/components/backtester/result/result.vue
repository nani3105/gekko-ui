<template lang='pug'>
  div
    .hr.contain
    div.contain
      h3 Backtest result
    result-summary(:report='result.report')
    .hr.contain
    chart(:data='result', height='500')
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import resultSummary from '@/components/global/paperTradeSummary.vue';
import chart from './chartWrapper.vue';

@Component({
  components: {
    resultSummary,
    chart,
  }
})
export default class Results extends Vue {
  @Prop() private result: any;
}
</script>
