<template>
  <div>
    <go-back />
    <route-detail is-read />
  </div>
</template>

<script>
import RouteDetail from './components/RouteDetail'

export default {
  name: 'TunnelRouterDetail',
  components: {
    RouteDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
