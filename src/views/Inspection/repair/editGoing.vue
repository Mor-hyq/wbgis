<template>
  <div>
    <go-back />
    <repaire-detail is-edit type="going" />
  </div>
</template>

<script>
import RepaireDetail from './components/RepaireDetail'

export default {
  name: 'RepairEditing',
  components: {
    RepaireDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
