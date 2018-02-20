<template lang='pug'>
.grd
  .px1
    h3 Paper trader
    a.btn--primary(href='#', v-on:click.prevent='switchToggle', v-if='toggle === "closed"') Change paper trader settings
    template(v-if='toggle === "open"')
      p Settings:
      textarea.params(v-model='rawPaperTraderParams')
      p.bg--red.p1(v-if='rawPaperTraderParamsError') {{ rawPaperTraderParamsError.message }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {get} from '@/helpers/ajax';

const toml = require('toml');

@Component({})
export default class PaperTrader extends Vue {
  private rawPaperTraderParams = '';
  private rawPaperTraderParamsError = false;
  private paperTraderParams = {};
  private toggle = 'closed';

  private created() {
    get('configPart/paperTrader', (error, response) => {
      this.rawPaperTraderParams = response.part;
    });
  }

  private switchToggle() {
    if(this.toggle === 'open')
      this.toggle = 'closed';
    else
      this.toggle = 'open';
  }

  private emitConfig() {
    this.parseParams();
    this.$emit('settings', this.paperTraderParams);
  }

  private parseParams() {
    try {
      this.paperTraderParams = toml.parse(this.rawPaperTraderParams);
      this.paperTraderParams.reportRoundtrips = true;
      this.rawPaperTraderParamsError = false;
    } catch(e) {
      this.rawPaperTraderParamsError = e;
      this.paperTraderParams = {};
    }
  }

  @Watch('rawPaperTraderParams')
  rawPaperTraderParamsWatcher() {
    this.emitConfig()
  }
}
</script>
