<template>
  <div :class="{'hidden':hidden}" class="pagination-block">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      layout="total,slot,prev"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-button :disabled="firstDisabled" @click="goFirstPage">首页</el-button>
    </el-pagination>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      layout="pager,next,slot,jumper"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-button :disabled="lastDisabled" @click="goLastPage">末页</el-button>
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: { // 总条数
      required: true,
      type: Number
    },
    page: { // 页码
      type: Number,
      default: 1
    },
    limit: { // 每页条数
      type: Number,
      default: 10
    },
    pageSizes: { // 每页条数选择
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    background: { // 背景色
      type: Boolean,
      default: true
    },
    autoScroll: { // 自动返回顶部
      type: Boolean,
      default: false
    },
    hidden: { // 是否隐藏
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    },
    lastPage() {
      return Math.ceil(this.total / this.pageSize) || 1
    },
    firstDisabled() {
      return this.currentPage === 1
    },
    lastDisabled() {
      return this.currentPage === this.lastPage
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    goFirstPage() {
      this.$emit('pagination', { page: 1, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    goLastPage() {
      this.$emit('pagination', { page: this.lastPage, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
  .el-pagination {
    display: inline-block;
  }
  .hidden {
    display: none;
  }
  .pagination-block {
    padding: 15px;
    text-align: center;
  }
</style>
