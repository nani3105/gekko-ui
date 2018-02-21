<template lang="pug">
div.contain
  h2 Config
  .hr
  h3 Available API keys
  p(v-if='!apiKeySets.length')
    em You don't have any API keys yet.
  ul
    li(v-for='exchange in apiKeySets') {{ exchange }} (
      a(href='#', v-on:click.prevent='removeApiKey(exchange)') remove
      | )
  a.btn--primary(href='#', v-if='!addApiToggle', v-on:click.prevent='openAddApi') Add an API key
  template(v-if='addApiToggle')
    .hr
    apiConfigBuilder
  .hr

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { post } from '@/helpers/ajax';
import apiConfigBuilder from '@/components/config/apiConfigBuilder.vue';

@Component({
  components: {
    apiConfigBuilder,
  },
})
export default class Config extends Vue {
  private addApiToggle = false;

  get apiKeySets() {
    return this.$store.state.apiKeys;
  }

  private openAddApi() {
    this.addApiToggle = true;
  }

  private removeApiKey(exchange: string) {
    if (!confirm('Are you sure you want to delete these API keys?')) {
      return;
    }

    post('removeApiKey', {exchange}, (error: any, response: any) => {
      if (error) {
        return alert(error);
      }
    });
  }

  @Watch('apiKeySets')
  private apiKeySetsWatcher() {
    this.addApiToggle = false;
  }

}
</script>
