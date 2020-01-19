<template>
  <div>
    <TopLabel :label="$route.meta.title" />
    <cars-index ref="cars" />
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import CarsIndex from '../components/CarsIndex'
export default {
  name: 'Cars',
  components: {
    CarsIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.cars.initTableData()
    this.$_deleteOtherView()
  }
}
</script>
