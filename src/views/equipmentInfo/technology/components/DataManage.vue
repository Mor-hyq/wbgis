<template>
  <div>
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @handlePageChange="handleChange"
    >
      <template slot="search">
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="title" :label="mylang.fileTitle">
            <el-input v-model="searchForm.title" :placeholder="`请输入${mylang.fileTitle}`" clearable />
          </el-form-item>
          <!-- <el-form-item prop="file_type_id" :label="mylang.dataType">
            <el-select v-model="searchForm.file_type_id" clearable>
              <el-option
                v-for="option in typeOptions"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item prop="remark" :label="mylang.fileDescription">
            <el-input v-model="searchForm.remark" :placeholder="`请输入${mylang.fileDescription}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          prop="id"
          :label="mylang.fileOrder"
        />
        <el-table-column
          align="center"
          prop="title"
          show-overflow-tooltip
          :label="mylang.fileTitle"
        >
          <template slot-scope="scope">
            {{ scope.row.title+'.'+scope.row.file.type }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_time"
          :label="mylang.createTime"
        />
        <el-table-column
          align="center"
          prop="remark"
          :label="`${mylang.remark}`"
        />
        <el-table-column
          align="center"
          prop="file_type_name"
          show-overflow-tooltip
          :label="mylang.fileType"
        />
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.read }}</el-button>
            <el-button
              :size="$btnSize"
              type="primary"
              @click="handleDownload(scope.row)"
            >{{ mylang.downLoad }}</el-button>
            <!-- <el-button
              :size="$btnSize"
              type="primary"
              @click="goEditPage(scope.row)"
            >{{ mylang.modify }}</el-button> -->
            <!-- <el-button
              :size="$btnSize"
              type="danger"
              plain
              @click="handleDeleteItem(scope.row)"
            >{{ mylang.delete }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import {
  getFileList, deleteFile
  // getFileTypeSelect
} from '@/api/equipmentInfo'
import commonApi from '@/api/common/apiMap'
import deleteCache from '@/mixins/deleteCache'
import config from '@/config'

export default {
  name: 'DataManage',
  mixins: [deleteCache],
  props: {
    typeId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      searchForm: {
        title: '',
        remark: '',
        file_type_id: ''
      },
      // typeOptions: [],
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: []
    }
  },
  watch: {
    typeId(val) {
      this.searchForm.file_type_id = val
      this.handleSearch()
    }
  },
  created() {
    // this.getTypeOptions()
    this.initTableData()
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      remark = '',
      title = '',
      file_type_id = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, remark, title, file_type_id })
    },
    async getList({
      remark = '',
      title = '',
      file_type_id = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getFileList({
          page, paginate, remark, title, file_type_id
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          this.tableData = data.data || []
        }
      } catch (error) {
        this.tableLoading = false
      }
    },
    handleSearch() {
      // 搜索
      const search = this.$refs.mytable.handleSearch()
      this.realSearch = search
      this.initTableData({
        remark: search.remark,
        title: search.title,
        file_type_id: search.file_type_id
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        remark: data.search.remark,
        title: data.search.title,
        file_type_id: data.file_type_id
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goCreatePage() {
      this.$router.push({
        name: 'TechnologyInfoCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'TechnologyInfoEdit',
          query: {
            id: row.id
          }
        })
      } else {
        if (this.chooseDelArr.length === 0) {
          this.$message({
            type: 'warning',
            message: '未选择任何需要修改的选项'
          })
        } else if (this.chooseDelArr.length > 1) {
          this.$message({
            type: 'warning',
            message: '修改项只能选择一个'
          })
        } else {
          this.$router.push({
            name: 'TechnologyInfoEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.fileData + '，确认吗？', '删除' + this.mylang.fileData, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ ids: row.id })
      })
    },
    handleDelete() {
      if (this.chooseDelArr.length === 0) {
        this.$message({
          type: 'warning',
          message: '未选择任何需要删除的选项'
        })
        return false
      }
      this.$confirm('即将删除您选中的' + this.mylang.fileData + '，确认吗？', '删除' + this.mylang.fileData, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.chooseDelArr.map(v => v.id).join(',')
        this.deleteData({ ids: ids })
      })
    },
    async deleteData({ ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await deleteFile({ ids })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 重新获取当前页面数据
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            remark: this.realSearch.remark,
            title: this.realSearch.title,
            file_type_id: this.realSearch.file_type_id
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    goDetailPage(row) {
      // this.$router.push({
      //   name: 'TechnologyInfoDetail',
      //   query: {
      //     id: row.id
      //   }
      // })
      const url = this.returnDownUrl(row, 'preview')
      if (row.file.type === 'pdf') {
        // window.location.href = url
        window.open(url)
      } else if ((/png|gif|jpe?g/).test(row.file.type)) {
        // window.location.href = url
        window.open(url)
      } else {
        const src = 'https://view.officeapps.live.com/op/view.aspx?src=' + url
        // window.location.href = src
        window.open(src)
      }
    },
    handleDownload(row) {
      const url = this.returnDownUrl(row, 'down')
      window.location.href = url
      // window.open(url)
    },
    returnDownUrl(row, type) {
      const mode = config.mode
      const httpApi = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      let url = ''
      if (type === 'down') {
        url = httpApi + commonApi.downFile + '?sha1=' + row.file.sha1
      } else if (type === 'preview') {
        url = httpApi + row.file.path
      }
      return url
    }
    // async getTypeOptions() {
    //   const { code, data } = await getFileTypeSelect()
    //   if (code === 200) {
    //     this.typeOptions = data
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
