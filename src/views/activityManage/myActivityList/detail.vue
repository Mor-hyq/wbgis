<template>
  <div>
    <form-detail :activity-id="id" :is-read="true" />
  </div>
</template>

<script>
import FormDetail from '../components/FormDetail'
export default {
  name: 'ActivityDetail',
  components: {
    FormDetail
  },
  data() {
    return {
      id: this.$route.params.id || ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
