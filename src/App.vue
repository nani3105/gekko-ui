<template lang="pug">
  #app
    top
    .fill
      router-view
    bottom
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import top from '@/components/layout/header.vue';
import bottom from '@/components/layout/footer.vue';

@Component({
  name: 'App',
  components: {
    top,
    bottom,
  },
})
export default class App extends Vue { }
</script>


<style lang="scss">
#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.fill {
  flex: 1;
}

.hr {
  margin-top: 2rem;
  margin-bottom: 2rem;
  height: 10px;
  background-color: rgba(250,250,250,.99);
}

.btn--primary {
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 12px;
  height: 40px;
  padding: 0 18px;
  border-radius: 4px;
  background-color: #3498db;
  text-shadow: 0 1px 3px rgba(36,180,126,.4);
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
  color: #fff;
  text-decoration: none;
  line-height: 40px;
  transition: transform 250ms;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
    background-color: #3498db;
    color: #fff;
    text-decoration: none;
  }

  &:active, &:focus {
    background-color: #3498db;
    color: #fff;
    text-decoration: none;
  }

  &:active {
    transform: translateY(1px);
  }
}

</style>
