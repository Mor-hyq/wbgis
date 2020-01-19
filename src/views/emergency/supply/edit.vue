<template>
  <div>
    <go-back />
    <supply-detail is-edit />
  </div>
</template>

<script>
import SupplyDetail from './components/SupplyDetail'
export default {
  name: 'SupplyEdit',
  components: {
    SupplyDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
