<template>
  <div>
    <go-back />
    <measure-detail is-edit />
  </div>
</template>

<script>
import MeasureDetail from './components/MeasureDetail'
export default {
  name: 'MeasuresEdit',
  components: {
    MeasureDetail
  }
}
</script>

<style lang="scss" scoped>

</style>
