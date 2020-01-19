<template>
  <div>
    <go-back />
    <maintain-detail-component is-edit />
  </div>
</template>

<script>
import MaintainDetailComponent from './components/MaintainDetail'

export default {
  name: 'MaintainEdit',
  components: {
    MaintainDetailComponent
  }
}
</script>

<style lang="scss" scoped>

</style>
