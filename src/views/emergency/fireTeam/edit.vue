<template>
  <div>
    <go-back />
    <fire-team-detail is-edit />
  </div>
</template>

<script>
import FireTeamDetail from './components/FireTeamDetail'

export default {
  name: 'FireTeamEdit',
  components: {
    FireTeamDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
