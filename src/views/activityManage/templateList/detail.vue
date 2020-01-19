<template>
  <div>
    <form-detail :template-id="id" :is-edit="true" />
  </div>
</template>

<script>
import FormDetail from '../components/FormDetail'
export default {
  name: 'TemplateDetail',
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
