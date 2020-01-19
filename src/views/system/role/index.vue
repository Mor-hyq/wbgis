<template>
  <div>
    <role-index ref="roleIndex" />
  </div>
</template>

<script>
import RoleIndex from '../components/RoleIndex'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'Role',
  components: {
    RoleIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.roleIndex.initTableData()
    this.$_deleteOtherView()
  }

}
</script>
