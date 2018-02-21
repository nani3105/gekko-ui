<template lang="pug">
  v-navigation-drawer(v-model="drawer" clipped enable-resize-watcher app)
    v-list(dense)
      v-list-tile(v-for="(item, i) in items" :key="i" :to="item.link" class="full-width")
        v-list-tile-action
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title {{ item.text }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class Navigation extends Vue {

  @Prop() public drawer: boolean = true;

  private items = [
      { text: 'Home', icon: 'home', link: '/home' },
      { text: 'Live Gekkos', icon: 'play_arrow', link: '/live-gekkos' },
      { text: 'Backtest', icon: 'first_page', link: '/backtest' },
      { text: 'Local data', icon: 'storage', link: '/data' },
      { text: 'Config', icon: 'settings', link: '/config' },
      { text: 'Documentation', icon: 'more', link: 'https://gekko.wizb.it/docs/introduction/about_gekko.html' },
  ];

  @Watch('drawer')
  public drawerWatcher(value) {
    return value;
  }
}
</script>

<style>
li.full-width {
  width: 100%
}
</style>
