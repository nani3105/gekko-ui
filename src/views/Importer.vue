<template lang="pug">
  div.contain.my2
    div.text(v-html='intro')
    .hr
    h3 Currently running imports
    p(v-if='imports.length === 0') You currently don't have any imports running.
    v-list(three-line)
      template(v-for="(_import, index) in imports")
        v-list-tile
          v-list-tile-content
            v-list-tile-title(v-html="_import.watch.exchange")
            v-list-tile-sub-title {{_import.watch.currency}} / {{_import.watch.asset}}
            v-list-tile-sub-title
              progressBar(:progress='calcProgress(_import)')
    ul(v-if='imports.length')
      li(v-for='_import in imports')
        router-link(:to='"/data/importer/import/" + _import.id') {{ _import.watch.exchange }}:{{ _import.watch.currency }}/{{ _import.watch.asset }}

    .hr
    h3 Start a new import
    import-config-builder(v-on:config='updateConfig')

    v-btn(color="info" :loading="loading" @click.native="run" :disabled="loading") Import
      span(slot="loader" class="custom-loader")
        v-icon(light) cached
    .hr
    .txt--center
      a.w100--s.my1.btn--primary(href='#', v-on:click.prevent='run') Import
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as marked from 'marked';
import importConfigBuilder from '@/components/import/importConfigBuilder.vue';
import { post } from '@/helpers/ajax';
import * as moment from 'moment';
import progressBar from '@/components/global/progressBar.vue';

const intro = marked(`
## Import data
The importer can download historical market data directly from the exchange.
`);

@Component({
  components: {
    importConfigBuilder,
    progressBar,
  },
})
export default class Importer extends Vue {
  private intro = intro;
  private config: any = {};
  private loading = false;
  private loader = null;

  get imports() {
    return this.$store.state.imports;
  }

  private updateConfig(config: any) {
    this.config = config;
  }

  private daysApart(range: any) {
    const to = moment(range.to);
    const from = moment(range.from);
    return to.diff(from, 'days');
  }

  private calcProgress(_import: any) {
    const to = this.mom(_import.to);
    const from = this.mom(_import.from);
    const latest = this.mom(_import.latest);
    const timespan = to.diff(from);
    const fromEndMs = to.diff(latest);
    const current = timespan - fromEndMs;
    return 100 * current / timespan;
  }

  private mom(str: string) {
    return moment.utc(str);
  }

  private run() {
    const daysApart = this.daysApart(this.config.importer.daterange);
    if (daysApart < 1) {
      return alert('You can only import at least one day of data..');
    }
    const l = this.loader;
    this[l] = !this[l];
    this.loader = null;
    post('import', this.config, (error, response) => {
      if (error) {
        return alert(error);
      }
      this.$store.commit('addImport', response);
      this[l] = false;
      this.$router.push({
        path: `/data/importer/import/${response.id}`,
      });
    });
  }
}
</script>

<style>

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

