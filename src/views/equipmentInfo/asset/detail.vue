<template>
  <div>
    <go-back />
    <asset-detail-component is-read />
  </div>
</template>

<script>
import AssetDetailComponent from './components/AssetDetail'

export default {
  name: 'AssetDetail',
  components: {
    AssetDetailComponent
  }
}
</script>

<style lang="scss" scoped>

</style>
