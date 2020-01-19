<template>
  <div>
    <go-back />
    <route-detail is-edit />
  </div>
</template>

<script>
import RouteDetail from './components/RouteDetail'

export default {
  name: 'TunnelRouterEdit',
  components: {
    RouteDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
