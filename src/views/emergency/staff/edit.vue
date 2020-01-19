<template>
  <div>
    <go-back />
    <staff-detail is-edit />

  </div>
</template>

<script>
import StaffDetail from './components/StaffDetail'
export default {
  name: 'StaffEdit',
  components: {
    StaffDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
