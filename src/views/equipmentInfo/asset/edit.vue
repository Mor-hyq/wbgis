<template>
  <div>
    <go-back />
    <asset-detail-component is-edit />

  </div>
</template>

<script>
import AssetDetailComponent from './components/AssetDetail'

export default {
  name: 'AssetEdit',
  components: {
    AssetDetailComponent
  }
}
</script>

<style lang="scss" scoped>

</style>
