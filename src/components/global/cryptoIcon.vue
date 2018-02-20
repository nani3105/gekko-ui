<template lang='pug'>
  i.cc(v-bind:class="asset")
    span.asset-text {{ asset }}
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class CryptoIcon extends Vue {
  @Prop() private asset: string;
}
</script>

<style>
.asset-text {
  margin-left: 4px;
}
</style>
