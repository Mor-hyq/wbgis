<template>
  <div>
    <el-button type="primary" @click="goCreatePage">创建模板</el-button>
    <ul class="list">
      <li v-for="item in list" :key="item.id" class="item">
        <div class="top">
          <img :src="item.thumb" alt="">
        </div>
        <div class="bot">
          <span>{{ item.title }}</span>
        </div>
        <div class="view-bg">
          <div class="view">
            <div class="btn" @click="goDetailPage(item.id)"><i class="el-icon-view" /><div>使用模板</div></div>
            <div class="btn" @click="goEditPage(item.id)"><i class="el-icon-edit" /><div>编辑模板</div></div>
          </div>
        </div>
      </li>
    </ul>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />

  </div>
</template>

<script>
import { getFormList } from '@/api/activity'
export default {
  name: 'TemplateList',
  data() {
    return {
      list: [],
      total: 0, // 列表总条数
      listQuery: { // 列表查询参数
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList({
      page = this.listQuery.page,
      pageSize = this.listQuery.limit
    } = {}) {
      const { code, data } = await getFormList({
        page,
        pageSize
      })
      if (code === 200) {
        this.total = data.total
        this.list = data.list || []
      }
    },
    // 表格数据分页
    handleCurrentChange(val) {
      this.getList({
        page: val.page,
        pageSize: val.limit
      })
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
    },
    goEditPage(id) {
      this.$router.push({
        name: 'GenerateFormManage',
        query: {
          id
        }
      })
    },
    goDetailPage(id) {
      this.$router.push({
        name: 'TemplateDetail',
        params: {
          id
        }
      })
    },
    goCreatePage() {
      this.$router.push({
        name: 'GenerateFormManage'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: 216px;
    flex: 0 0 216px;
    margin-right: 20px;
    margin-bottom: 30px;
    border-radius: 10px;
    box-shadow: 0px 0px 4px #e3e3e3;
    overflow: hidden;
    cursor: pointer;
    .top {
      width: 100%;
      height: 110px;
      overflow: hidden;
      img {
        width: 100%;
        object-fit: contain;
      }
    }
    .bot {
      padding: 15px 10px;
      text-align: center;
      font-size: 14px;
      color: #333;
    }
    &:hover {
      .view-bg {
        display: block;
      }
    }
    .view-bg {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      background-color: rgba(0, 0, 0, 0.5);
      >.view {
        display: flex;
        width: 100%;
        height: 100%;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        >.btn {
          >i {
            font-size: 26px;
            margin-bottom: 5px;
          }
          padding: 0 5px;
          color: #fff;
          text-align: center;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }
  }
}
</style>
