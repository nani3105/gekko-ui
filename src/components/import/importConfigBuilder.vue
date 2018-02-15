<template lang="pug">
.grd.contain
  .grd-row
    .grd-row-col-3-6.mx1
      h3 Market
      market-picker.contain(v-on:market='updateMarketConfig', only-importable='true')
    .grd-row-col-3-6.mx1
      range-creator(v-on:range='updateRange')
</template>

