<template>
  <div>
    <go-back />
    <plan-detail is-read />
  </div>
</template>

<script>
import PlanDetail from './components/PlanDetail'
export default {
  name: 'PlansDetail',
  components: {
    PlanDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
