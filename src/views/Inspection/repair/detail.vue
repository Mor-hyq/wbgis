<template>
  <div>
    <go-back />
    <repaire-detail is-read :type="type" />
  </div>
</template>

<script>
import RepaireDetail from './components/RepaireDetail'
export default {
  name: 'RepairDetail',
  components: {
    RepaireDetail
  },
  data() {
    return {
      type: this.$route.query.type === '1' ? 'done' : 'going'
    }
  }
}
</script>
