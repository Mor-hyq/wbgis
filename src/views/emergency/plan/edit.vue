<template>
  <div>
    <go-back />
    <plan-detail is-edit />
  </div>
</template>

<script>
import PlanDetail from './components/PlanDetail'
export default {
  name: 'PlansEdit',
  components: {
    PlanDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
