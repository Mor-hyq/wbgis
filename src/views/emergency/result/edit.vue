<template>
  <div>
    <go-back />
    <result-detail is-edit />

  </div>
</template>

<script>
import ResultDetail from './components/ResultDetail'

export default {
  name: 'ResultsEdit',
  components: {
    ResultDetail
  }
}
</script>

