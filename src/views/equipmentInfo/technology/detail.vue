<template>
  <div>
    <go-back />
    <data-manage-detail is-read />
  </div>
</template>

<script>
import DataManageDetail from './components/DataManageDetail'
export default {
  name: 'TechnologyInfoDetail',
  components: {
    DataManageDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
