<template>
  <div>
    <header-item :is-show-nav="true" />
    <!-- <div class="dashboard-container">
      <div class="dashboard-text">name: {{ userInfo.username }}</div>
    </div> -->
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import HeaderItem from '@/components/Header'
export default {
  name: 'Dashboard',
  components: {
    HeaderItem
  }

  // computed: {
  //   ...mapGetters([
  //     'userInfo'
  //   ])
  // }
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
