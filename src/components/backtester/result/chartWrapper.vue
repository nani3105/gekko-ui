<template lang='pug'>
#chartWrapper(v-bind:class='{ clickable: !isClicked }')
  .shield(v-on:click.prevent='click')
  svg#chart(width='960', :height='height')
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
const d3 = require('d3');
import chart from '@/d3/chart4';
import { draw as drawMessage, clear as clearMessage } from '@/d3/message'

const MIN_CANDLES = 4;
@Component({})
export default class chartWrapper extends Vue {
  @Prop() private data;
  @Prop() private height: string;

  private isClicked = false;

  @Watch('data')
  private dataWatcher() {
    this.render();
  }

  private created() {
    let self = this;
    setTimeout(self.foo, 100);
  }

  private beforeDestroy() {
    this.remove();
  }

  private click() {
    this.isClicked = true;
  }

  private foo() {
    this.remove();
    if(_.size(this.data.candles) < MIN_CANDLES) {
      drawMessage('Not enough data to spawn chart');
    } else {
      chart(this.data.candles, this.data.trades, this.height);
    }
  }

  private remove() {
    d3.select('#chart').html('');
  }
}
</script>

<style>
#chartWrapper.clickable {
  position: relative;
}
#chartWrapper.clickable .shield {
  cursor: zoom-in;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: grey;
  opacity: 0.1;
}
#chart {
  background-color: #eee;
  width: 100%;
}
#chart circle {
  clip-path: url(#clip);
}
#chart .zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}
#chart .line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
  clip-path: url(#clip);
}
/*#chart .price.line {
  stroke-width: 2.5px;
}*/
#chart circle.buy {
  fill: #7FFF00;
}
#chart circle.sell {
  fill: red;
}
</style>
