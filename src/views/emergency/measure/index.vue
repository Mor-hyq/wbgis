<template>
  <div>
    <measure-index ref="measure" />
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import MeasureIndex from '../components/MeasureIndex'
export default {
  name: 'Measures',
  components: {
    MeasureIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.measure.initTableData()
    this.$_deleteOtherView()
  }
}
</script>
