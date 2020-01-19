<template>
  <div>
    <TopLabel :label="$route.meta.title" />
    <result-index ref="result" />
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import ResultIndex from '../components/ResultIndex'

export default {
  name: 'Results',
  components: {
    ResultIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.result.initTableData()
    this.$_deleteOtherView()
  }
}
</script>

<style lang="scss" scoped>

</style>
