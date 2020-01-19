<template>
  <div>
    <go-back />
    <result-detail is-read />
  </div>
</template>

<script>
import ResultDetail from './components/ResultDetail'

export default {
  name: 'ResultsDetail',
  components: {
    ResultDetail
  }
}
</script>

