<template>
  <div>
    <form-detail :activity-id="id" :is-edit="true" />
  </div>
</template>

<script>
import FormDetail from '../components/FormDetail'
export default {
  name: 'EditActivity',
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
