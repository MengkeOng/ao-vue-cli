<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <router-view></router-view>
  </div>
</template>
<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
export default {
  components: {
    NprogressContainer
  }
}
</script>
<style lang="scss">
@import "styles/app.scss";
</style>
