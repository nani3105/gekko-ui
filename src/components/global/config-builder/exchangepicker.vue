<template lang='pug'>
div
  .mx1
    label(for='exchange').wrapper Exchange:
    .custom-select.button
      select(v-model='exchange')
        option(v-for='(market, e) in exchanges') {{ e }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import _ from 'lodash';

@Component({})
export default class exchangePicker extends Vue {
  @Prop() private onlyTradable: string;
  @Prop() private onlyImportable: any;

  private exchange = 'poloniex';

  get exchanges() {
    let exchanges = Object.assign({}, this.$store.state.exchanges);

    if(_.isEmpty(exchanges))
      return false;

    if(this.onlyTradable) {
      _.each(exchanges, (e, name) => {
        if(!e.tradable)
          delete exchanges[name];
      });
    }

    if(this.onlyImportable) {
      _.each(exchanges, (e, name) => {
        if(!e.importable)
          delete exchanges[name];
      });
    }

    return exchanges;
  }

  private created() {
    this.emitExchange();
  }

  private emitExchange() {
    this.$emit('exchange', this.exchange);
  }

  @Watch('exchange')
  private watcherExchange() {
    this.emitExchange();
  }

  @Watch('exchanges')
  private watcher() {
    this.emitExchange();
  }
}
</script>
