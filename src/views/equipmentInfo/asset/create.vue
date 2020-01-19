<template>
  <div>
    <go-back />
    <asset-detail-component />
  </div>
</template>

<script>
import AssetDetailComponent from './components/AssetDetail'
export default {
  name: 'AssetCreate',
  components: {
    AssetDetailComponent
  }
}
</script>

<style lang="scss" scoped>

</style>
