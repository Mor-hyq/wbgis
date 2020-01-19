<template>
  <div>
    <go-back />
    <info-detail is-edit />
  </div>
</template>

<script>
import InfoDetail from './components/InfoDetail'
export default {
  name: 'TunnelInfoEdit',
  components: {
    InfoDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
