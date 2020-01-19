<template>
  <div>
    <TopLabel :label="$route.meta.title" />
    <fire-team-index ref="fireteam" />
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import FireTeamIndex from '../components/FireTeamIndex'
export default {
  name: 'FireTeam',
  components: {
    FireTeamIndex
  },
  mixins: [deleteCache],
  mounted() {
    this.$refs.fireteam.initTableData()
    this.$_deleteOtherView()
  }
}
</script>

<style lang="scss" scoped>

</style>
