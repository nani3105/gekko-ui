<template lang="pug">
  div.contain.my2
    div.text(v-html='intro')
    .hr
    h3 Currently running imports
    p(v-if='imports.length === 0') You currently don't have any imports running.
    ul(v-if='imports.length')
      li(v-for='_import in imports')
        router-link(:to='"/data/importer/import/" + _import.id') {{ _import.watch.exchange }}:{{ _import.watch.currency }}/{{ _import.watch.asset }}

    .hr
    h3 Start a new import
    import-config-builder(v-on:config='updateConfig')
    .hr
    .txt--center
      a.w100--s.my1.btn--primary(href='#', v-on:click.prevent='run') Import
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as marked from 'marked';
import spinner from '@/components/global/blockSpinner.vue';
import importConfigBuilder from '@/components/import/importConfigBuilder.vue';

const intro = marked(`
## Import data
The importer can download historical market data directly from the exchange.
`);

@Component({
  components: {
    importConfigBuilder,
    spinner,
  },
})
export default class Importer extends Vue {
  private intro = intro;
  private config = {};

  get imports() {
    return this.$store.state.imports;
  }
}
</script>

