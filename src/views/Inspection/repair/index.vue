<template>
  <div>
    <TopLabel v-if="!isComponent" :label="$route.meta.title" />
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @handlePageChange="handleChange"
    >
      <template v-if="!isComponent" slot="search">
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="pipe_id" :label="mylang.pipeName">
            <el-select
              v-model="searchForm.pipe_id"
              clearable
              filterable
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="state" :label="mylang.repaireState">
            <el-select v-model="searchForm.state" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="start_time"
            label="报修时间"
          >
            <el-date-picker
              v-model="searchForm.start_time"
              type="daterange"
              range-separator="-"
              start-placeholder="报修时间"
              end-placeholder="报修时间"
              value-format="yyyy-MM-dd"
              style="width:250px;"
            />
          </el-form-item>
          <el-form-item prop="equipment_id" label="设备类型">
            <el-select
              v-model="searchForm.equipment_id"
              clearable
              :size="$btnSize"
              placeholder="全部"
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="overhaul_mid" label="检修人员">
            <el-input v-model="searchForm.overhaul_mid" :placeholder="`请输入检修人员`" clearable />
          </el-form-item>
          <!-- <el-form-item prop="title" :label="mylang.repairTitle">
            <el-input v-model="searchForm.title" :placeholder="`请输入${mylang.repairTitle}`" clearable />
          </el-form-item> -->
          <!-- <el-form-item prop="field_value_id_2" :label="mylang.equipmentType">
            <el-input v-model="searchForm.field_value_id_2" :placeholder="`请输入${mylang.equipmentType}`" clearable />
          </el-form-item> -->
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isComponent" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goDonePage(false)">{{ mylang.finishRepaire }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
        <el-button type="primary" :size="$btnSize" plain @click="handleExport">{{ mylang.export }}</el-button>
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
          v-if="!isComponent"
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          prop="id"
          :label="mylang.number"
        />
        <el-table-column
          align="center"
          prop="name"

          :label="mylang.pipeName"
        />
        <el-table-column
          align="center"
          prop="equipment_name"

          :label="mylang.equipmentType"
        />
        <el-table-column
          align="center"
          prop="fault"

          label="故障现象及判断"
        />
        <el-table-column
          align="center"
          prop="start_time"

          label="报修时间"
        />
        <!-- <el-table-column
          align="center"
          prop="useoverhaul_mid"

          :label="mylang.orderMember"
        /> -->
        <el-table-column
          align="center"
          prop="asset_num"
          :label="mylang.repairNumber"
        />
        <el-table-column
          align="center"
          prop="overhaul_mid"
          label="检修人员"
        />
        <el-table-column
          align="center"
          prop="state"
          :label="mylang.orderState"
        >
          <template slot-scope="scope">
            <span class="order-state" :class="{ done: +scope.row.state === 1}">{{ getSateName(scope.row) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!isComponent"
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
            <!-- <el-button
              :size="$btnSize"
              type="primary"
              @click="goEditPage(scope.row)"
            >{{ mylang.modify }}</el-button> -->
            <!-- <el-button
              v-if="+scope.row.state == 0"
              type="primary"
              :size="$btnSize"
              @click="goDonePage(scope.row)"
            >{{ mylang.finishRepaire }}</el-button> -->
            <!-- <el-button
              :size="$btnSize"
              type="danger"
              plain
              style="margin-top:5px;"
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
  getAssetServiceList,
  deleteAssetService,
  getAssetTypeState } from '@/api/inspection'
import deleteCache from '@/mixins/deleteCache'
import config from '@/config'

export default {
  name: 'EquipmentRepair',
  mixins: [deleteCache],
  props: {
    isComponent: {
      type: Boolean,
      default: false
    },
    isAnalyse: { // 是否设备管理分析
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        pipe_id: '',
        // title: '',
        // field_value_id_2: '',
        equipment_id: '',
        state: '',
        start_time: '',
        overhaul_mid: ''
      },
      pipeOptions: [],
      stateOptions: [{
        id: 0,
        label: this.mylang.repairing
      }, {
        id: 1,
        label: this.mylang.repaired
      }],
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: [],
      eTypeOptions: []
    }
  },
  created() {
    if (!this.isComponent) {
      if (this.$route.query.do === '1') {
        this.getPipeOptions(false)
        // 如果是从工单跳转过来 且携带查询参数
        this.searchForm.pipe_id = this.$route.query.pipe_id
        // this.searchForm.field_value_id_2 = this.$route.query.name
        this.$nextTick(() => {
          this.handleSearch()
        })
      } else {
        // 从首页跳转来且携带了设备名称的查询参数
        // if (this.$route.query.s_name) {
        // this.searchForm.field_value_id_2 = this.$route.query.s_name
        // }
        // 获取路由管道信息后 需要设置默认值
        this.getPipeOptions(true)
        // this.initTableData()
      }
      this.$_deleteOtherView()
    } else {
      if (!this.isAnalyse) {
        this.getPipeOptions(true)
      }
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      // title = '',
      start_time = '',
      // field_value_id_2 = '',
      equipment_id = '',
      pipe_id = '',
      state = '',
      overhaul_mid = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({
        page, paginate, pipe_id,
        // title,
        start_time,
        state,
        overhaul_mid,
        // field_value_id_2,
        equipment_id })
    },
    async getList({
      // title = '',
      start_time = '',
      // field_value_id_2 = '',
      equipment_id = '',
      overhaul_mid = '',
      pipe_id = '',
      state = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      const time = Array.isArray(start_time) ? start_time.join() : start_time
      try {
        const { code, data } = await getAssetServiceList({
          page, paginate,
          // title,
          start_time: time,
          pipe_id, state,
          // field_value_id_2,
          equipment_id,
          overhaul_mid
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
        // title: search.title,
        start_time: search.start_time,
        // field_value_id_2: search.field_value_id_2,
        equipment_id: search.equipment_id,
        overhaul_mid: search.overhaul_mid,
        pipe_id: search.pipe_id,
        state: search.state
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        // title: data.search.title,
        start_time: data.search.start_time,
        // field_value_id_2: data.search.field_value_id_2,
        equipment_id: data.search.equipment_id,
        overhaul_mid: data.search.overhaul_mid,
        pipe_id: data.search.pipe_id,
        state: data.state
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      if (+row.state) {
        // 维修完成
        this.$router.push({
          name: 'RepairDetail',
          query: {
            id: row.id,
            type: '1'
          }
        })
      } else {
        // 维修中
        this.$router.push({
          name: 'RepairDetail',
          query: {
            id: row.id
          }
        })
      }
    },
    goCreatePage() {
      this.$router.push({
        name: 'RepairCreating'
      })
    },
    goDonePage(row) {
      if (row) {
        this.$router.push({
          name: 'RepairCreated',
          query: {
            id: row.id
          }
        })
      } else {
        if (this.chooseDelArr.length === 0) {
          this.$message({
            type: 'warning',
            message: '未选择任何需要维修的选项'
          })
        } else if (this.chooseDelArr.length > 1) {
          this.$message({
            type: 'warning',
            message: '完成维修项只能选择一个'
          })
        } else {
          this.$router.push({
            name: 'RepairCreated',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    goEditPage(row) {
      if (row) {
        if (+row.state) {
          this.$router.push({
            name: 'RepairEdited',
            query: {
              id: row.id
            }
          })
        } else {
          this.$router.push({
            name: 'RepairEditing',
            query: {
              id: row.id
            }
          })
        }
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
          const state = +this.chooseDelArr[0].state
          if (state) {
            this.$router.push({
              name: 'RepairEdited',
              query: {
                id: this.chooseDelArr[0].id
              }
            })
          } else {
            this.$router.push({
              name: 'RepairEditing',
              query: {
                id: this.chooseDelArr[0].id
              }
            })
          }
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.repaireInfo + '，确认吗？', '删除' + this.mylang.repaireInfo, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ delete_ids: row.id })
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
      this.$confirm('即将删除您选中的' + this.mylang.repaireInfo + '，确认吗？', '删除' + this.mylang.repaireInfo, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.chooseDelArr.map(v => v.id).join(',')
        this.deleteData({ delete_ids: ids })
      })
    },
    async deleteData({ delete_ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await deleteAssetService({ delete_ids })
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
            // title: this.realSearch.title,
            start_time: this.realSearch.start_time,
            // field_value_id_2: this.realSearch.field_value_id_2,
            equipment_id: this.realSearch.equipment_id,
            overhaul_mid: this.realSearch.overhaul_mid,
            pipe_id: this.realSearch.pipe_id,
            state: this.realSearch.state
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    handleExport() {
      if (this.tableData.length < 1) {
        return
      }
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/assetService?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          if (Array.isArray(this.realSearch[k])) {
            requestUrl += `&${k}=${this.realSearch[k].join()}`
          } else {
            requestUrl += `&${k}=${this.realSearch[k]}`
          }
        }
      }
      // if (this.realSearch.field_value_id_2) {
      //   requestUrl += '&field_id_2=2'
      // }
      window.location.href = requestUrl
      // window.open(requestUrl)
    },
    getPipeOptions(isCb) {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
          if (this.pipeOptions.length > 0) {
            if (isCb) {
              this.searchForm.pipe_id = this.pipeOptions[0].id
              // 从首页跳转来且携带了设备名称的查询参数
              if (this.$route.query.s_name) {
                this.getEquipmentOptions(this.pipeOptions[0].id, this.$route.query.s_name)
                // this.searchForm.field_value_id_2 = this.$route.query.s_name
              } else {
                this.getEquipmentOptions(this.pipeOptions[0].id)
                this.handleSearch()
              }
            }
          }
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
        try {
          if (this.pipeOptions.length > 0) {
            if (isCb) {
              this.searchForm.pipe_id = this.pipeOptions[0].id
              // this.getEquipmentOptions(this.pipeOptions[0].id)
              // 从首页跳转来且携带了设备名称的查询参数
              if (this.$route.query.s_name) {
                this.getEquipmentOptions(this.pipeOptions[0].id, this.$route.query.s_name)
                // this.searchForm.field_value_id_2 = this.$route.query.s_name
              } else {
                this.getEquipmentOptions(this.pipeOptions[0].id)
                this.$nextTick(() => {
                  this.handleSearch()
                })
              }
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    // getPipeOptions() {
    //   if (this.$store.state.form.belongPipe.length < 1) {
    //     this.$store.dispatch('form/setBelongPipe').then(() => {
    //       const pipeOptions = this.$store.state.form.belongPipe
    //       this.getEquipmentOptions(pipeOptions[0].id)
    //     })
    //   } else {
    //     const pipeOptions = this.$store.state.form.belongPipe
    //     this.getEquipmentOptions(pipeOptions[0].id)
    //   }
    // },
    async getEquipmentOptions(id, name) {
      try {
        const { code, data } = await getAssetTypeState({
          id
        })
        if (code === 200) {
          this.eTypeOptions = data || []
          if (name) {
            const asset = data.filter(v => v.name === name)
            if (asset.length > 0) {
              this.searchForm.equipment_id = asset[0].id
            }
            this.handleSearch()
          }
        }
      } catch (error) {
        //
      }
    },
    getSateName(row) {
      let name = ''
      switch (+row.state) {
        case 0:
          name = this.mylang.repairing
          break
        case 1:
          name = this.mylang.repaired
          break
        default:
          name = this.mylang.repairing
      }
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.order-state {
  color: #F56C6C;
  &.done {
    color: #67C23A;
  }
}
</style>
