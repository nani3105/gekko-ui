<template lang="pug">
  #app
    v-app
      navigation(:drawer="drawer")
      v-toolbar(app fixed clipped-left class="indigo darken-1")
        v-toolbar-side-icon(@click.stop="drawer = !drawer" class="text-white")
        v-toolbar-title(class="text-white") Gekko UI
      main
        v-content
          v-container(fluid fill-height)
            v-layout(column)
              router-view
      v-footer(app)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navigation from '@/components/layout/navigation.vue';

@Component({
  name: 'App',
  components: {
    Navigation,
  },
})
export default class App extends Vue {
  private drawer = false;

  private nagivate(link: string) {
    this.$router.push(link);
  }
}
</script>


<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.text-white {
  color: white;
}
</style>
