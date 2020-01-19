<template>
  <div>
    <go-back />
    <maintain-detail-component is-read />
  </div>
</template>

<script>
import MaintainDetailComponent from './components/MaintainDetail'

export default {
  name: 'MaintainDetail',
  components: {
    MaintainDetailComponent
  }
}
</script>

<style lang="scss" scoped>

</style>
