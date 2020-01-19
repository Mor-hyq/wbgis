<template>
  <div>
    <go-back />
    <repaire-detail type="done" />
  </div>
</template>

<script>
import RepaireDetail from './components/RepaireDetail'

export default {
  name: 'RepairCreated',
  components: {
    RepaireDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
