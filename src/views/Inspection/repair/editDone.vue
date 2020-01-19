<template>
  <div>
    <go-back />
    <repaire-detail is-edit type="done" />
  </div>
</template>

<script>
import RepaireDetail from './components/RepaireDetail'

export default {
  name: 'RepairEdited',
  components: {
    RepaireDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
