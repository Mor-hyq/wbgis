<template>
  <div>
    <go-back />
    <data-manage-detail is-edit />
  </div>
</template>

<script>
import DataManageDetail from './components/DataManageDetail'
export default {
  name: 'TechnologyInfoEdit',
  components: {
    DataManageDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
