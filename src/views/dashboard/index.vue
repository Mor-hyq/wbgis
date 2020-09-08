<template>
  <div>
    <header-item :is-show-nav="true" />
  </div>
</template>

<script>
import HeaderItem from '@/components/Header'
export default {
  name: 'Dashboard',
  components: {
    HeaderItem
  }
}
</script>

<style lang="scss" scoped>
 @import "~@/styles/variables.scss";
.dashboard {
  &-container {
    padding-top: $headerHeight;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
