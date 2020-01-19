<template>
  <div>
    <TopLabel :label="$route.meta.title" />
    <cooperation-index ref="cooperation" />
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import CooperationIndex from '../components/CooperationIndex'
export default {
  name: 'Cooperation',
  components: {
    CooperationIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.cooperation.initTableData()
    this.$_deleteOtherView()
  }
}
</script>
