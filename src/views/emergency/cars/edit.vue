<template>
  <div>
    <go-back />
    <car-detail is-edit />
  </div>
</template>

<script>
import CarDetail from './components/CarDetail'
export default {
  name: 'CarsEdit',
  components: {
    CarDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
