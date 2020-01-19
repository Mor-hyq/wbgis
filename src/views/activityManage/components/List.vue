<template>
  <div>
    <!-- 查询栏插槽 -->
    <slot name="search" />
    <ul class="list">
      <template v-if="dataList.length > 0">
        <li v-for="item in dataList" :key="item.id" class="list-item">
          <div class="top">
            <div class="title">{{ item.name }} <div v-if="copyLink" class="copy-link"><span @click="copyLinkHandle(item, $event)">复制活动链接</span><i class="el-icon-question" /></div></div>
            <span v-if="timeType === 'create'" class="time">创建时间：{{ item.create_time }}</span>
            <span v-if="timeType === 'publish'" class="time">发布时间：{{ item.examine_time }}</span>
            <span v-if="timeType === 'under'" class="time">发布时间：{{ item.under_time }}</span>
          </div>
          <div class="middle">
            <p>活动类型：单一活动</p>
            <p v-if="item.state">活动状态：{{ item.state }}</p>
            <p v-if="item.send_temp">消息状态：{{ item.send_temp }}</p>
          </div>
          <div class="bottom">
            <div class="info">
              <p v-if="item.username">审核人：{{ item.username }}</p>
              <p v-if="item.phone">联系方式：{{ item.phone }}</p>
              <p v-if="item.examine_info"><span class="strong">审核意见：</span>{{ item.examine_info }}</p>

            </div>
            <div class="btns">
              <!-- 列表右下角按钮插槽 -->
              <slot name="buttons" :list="item" />
            </div>
          </div>
        </li>
      </template>
      <template v-else>
        <div class="empty">暂无数据</div>
      </template>
    </ul>
    <pagination :hidden="total < 1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />

  </div>
</template>

<script>
import clip from '@/utils/clipboard'
export default {
  props: {
    getHandle: { // 获取列表接口的函数
      type: Function,
      default: () => {}
    },
    requestParams: { // 列表接口参数
      type: Object,
      default: () => {}
    },
    timeType: { // 显示的时间类型 create => 创建时间 publish => 发布时间 under => 下架时间
      type: String,
      default: 'create'
    },
    copyLink: { // 是否显示复制链接按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      total: 10, // 账号管理列表总条数
      listQuery: { // 账号管理列表查询参数
        page: 1,
        limit: 10
      },
      searchData: {}, // 搜索条件
      dataList: []
    }
  },
  mounted() {
    this.initList()
  },
  methods: {
    initList({
      page = 1,
      pageSize = this.listQuery.limit
    } = {}) {
      // 初始化列表数据
      this.listQuery.page = 1
      this.getList({ page, pageSize })
    },
    async getList({
      page = this.listQuery.page,
      pageSize = this.listQuery.limit
    } = {}) {
      const { code, data } = await this.getHandle({
        page,
        pageSize,
        ...this.requestParams, // 请求参数
        ...this.searchData // 请求查询参数
      })
      if (code === 200) {
        this.total = data.total || 0
        this.dataList = data.list || []
      }
    },
    handleCurrentChange(val) {
      // 分页
      this.getList({
        page: val.page,
        pageSize: val.limit
      })
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
    },
    searchHandler(data) {
      // 搜索事件
      this.searchData = data || {}
      this.initList()
    },
    copyLinkHandle(item, event) {
      // 复制活动链接
      clip(item.name, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  margin: 0;
  padding: 0 8px;
}
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
p {
  margin: 0;
  padding: 0;
}
.list-item {
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(197, 197, 197, 0.6);
  .top {
    display: flex;
    .title {
      flex: 0 0 70%;
      margin-right: 10px;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      .copy-link {
        display: inline-block;
        margin-left: 15px;
        >span {
          font-size: 14px;
          font-weight: normal;
          color: rgb(105, 178, 252);
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
        }
        >i {
          margin-left: 5px;
          font-size: 16px;
          color: #ffa22c;
          cursor: default;
        }
      }
    }
    .time {
      flex: 1;
      text-align: right;
      color: #333;
      font-size: 14px;
    }
  }
  .middle {
    padding: 5px 0;
    >p {
      display: inline-block;
      margin: 10px 50px 10px 0;
      color: #777;
      font-size: 14px;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    .info {
      >p {
        display: inline-block;
        margin-right: 10px;
        color: #333;
        line-height: 32px;
        font-size: 14px;
        .strong {
          color: #ffa22c;
        }
      }
    }
    .btns button {
      margin-bottom: 5px;
    }
  }
}
.empty {
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #777;
}
</style>
