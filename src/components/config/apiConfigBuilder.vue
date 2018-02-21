<template lang='pug'>
.grd.contain
  h3 Add an API key
  p Make sure that the API key has the permissions to create and cancel orders and view balances.
  .grd-row
    .grd-row-col-3-6.mx1
      h3 Exchange
      exchange-picker.contain(v-on:exchange='updateExchange', only-tradable='true')
    .grd-row-col-3-6.mx1
      h3 Credentials
      template(v-for='cred in requires')
        label {{ cred }}
        input(v-model='credentials[cred]')
  .txt--center
    a.w100--s.my1.btn--primary(href='#', v-on:click.prevent='upload') Add
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import exchangePicker from '@/components/global/config-builder/exchangepicker.vue';
import { post } from '@/helpers/ajax';

@Component({
  components: {
    exchangePicker,
  },
})
export default class ApiConfigBuilder extends Vue {
  private exchange: boolean | any = false;
  private credentials: any = {};

  get apiKeySets() {
    return this.$store.state.apiKeys;
  }

  get exchanges() {
    return this.$store.state.exchanges;
  }

  get requires() {
    if (!this.exchanges) {
      return [];
    }

    if (!this.exchange) {
      return [];
    }

    return this.exchanges[this.exchange].requires;
  }

  get config() {
    const config = {
      exchange: this.exchange,
      values: this.credentials,
    };
    return config;
  }

  public updateExchange(exchange: string) {
    this.credentials = {};
    this.exchange = exchange;
    this.emitConfig();
  }

  private emitConfig() {
    this.$emit('config', this.config);
  }

  private upload() {
    const exchange = this.config.exchange;

    if (
      this.exchanges &&
      this.apiKeySets.includes(exchange) &&
      !confirm(`You already have API keys for ${exchange} defined, do you want to overwrite them?`)
    ) {
      return;
    }
    post('addApiKey', this.config, (error, response) => {
      if (error) {
        return alert(error);
      }
      this.credentials = {};
    });
  }
}
</script>
