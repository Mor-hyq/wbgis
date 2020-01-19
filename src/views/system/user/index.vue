<template>
  <div>
    <user-index ref="userIndex" />
  </div>
</template>

<script>
import UserIndex from '../components/UserIndex'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'User',
  components: {
    UserIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.userIndex.initTableData()
    this.$_deleteOtherView()
  }

}
</script>
