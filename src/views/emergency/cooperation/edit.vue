<template>
  <div>
    <go-back />
    <cooperation-detail is-edit />
  </div>
</template>

<script>
import CooperationDetail from './components/CooperationDetail'
export default {
  name: 'CooperationEdit',
  components: {
    CooperationDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
