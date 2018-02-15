<template lang="pug">
  footer.p2.bg--off-white
    .contain
      p
        em Use Gekko at your own risk.
      p Using Gekko v{{ version.gekko }} and Gekko UI v{{ version.ui }}.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Footer extends Vue {
  private version = {
    gekko: 0.1,
    ui: 0.1,
  };
}
</script>


