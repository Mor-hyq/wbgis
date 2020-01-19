<template>
  <div>
    <TopLabel :label="$route.meta.title" />
    <staff-index ref="staff" />
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import StaffIndex from '../components/StaffIndex'
export default {
  name: 'Staff',
  components: {
    StaffIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.staff.initTableData()
    this.$_deleteOtherView()
  }
}
</script>

