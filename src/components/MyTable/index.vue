<template>
  <div>
    <slot name="search" />
    <slot />
    <pagination :total="total" :page="page" :limit="limit" @pagination="handleCurrentChange" />

  </div>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'

export default {
  name: 'MyTable',
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    total: { // 列表总条数
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 10
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      provideSearchForm: {}
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('update:page', val.page)
      this.$emit('update:limit', val.limit)
      this.$emit('handlePageChange', { page: val, search: this.provideSearchForm })
      this.saveSearchForm()
    },
    saveSearchForm() {
      // 当搜索条件改变但是没有点击搜索按钮时改变页码 搜索条件不变
      if (!isEqual(this.searchData, this.provideSearchForm)) {
        this.$emit('update:searchData', cloneDeep(this.provideSearchForm))
      }
    },
    handleSearch() {
      this.provideSearchForm = cloneDeep(this.searchData)
      return this.provideSearchForm
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
