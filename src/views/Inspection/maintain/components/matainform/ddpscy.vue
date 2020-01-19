<template>
  <div>
    <div v-if="!isRead" class="btn-group">
      <el-button type="primary" :size="$btnSize" @click="handleSave">{{ mylang.save }}</el-button>
      <el-button type="primary" :size="$btnSize" @click="addTable">{{ mylang.add }}</el-button>
      <el-button type="danger" plain :size="$btnSize" @click="deleteAll">{{ mylang.delete }}所有</el-button>
      <el-button type="danger" plain :size="$btnSize" @click="deleteItem">{{ mylang.delete }}当前页</el-button>
    </div>
    <div v-else>
      <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    </div>
    <template v-if="tform.length > 0">
      <div class="outer">
        <div id="print-table">
          <div class="number-input">
            <h3 class="thead">低点排水查油品质量检查记录</h3>
            <div class="ipt">
              <span v-if="isRead">{{ tform[tpage].r_order || '无' }}</span>
              <el-input v-else v-model="tform[tpage].r_order" :size="size" placeholder="请输入表格编号" />
            </div>
          </div>
          <div class="table-container">
            <div
              v-for="(form, index) in tform[tpage].table"
              :key="index"
              :class="classObj(index)"
            >
              <div class="asset-table">
                <div class="width1">车号</div>
                <div class="width1">
                  <span v-if="isRead" class="text">{{ form.car_order }}</span>
                  <el-input v-else v-model="form.car_order" :size="size" />
                </div>
                <div class="width1">检查日期</div>
                <div class="width1">
                  <span v-if="isRead" class="text">{{ getStringTime(form.check_time) }}</span>
                  <el-date-picker
                    v-else
                    v-model="form.check_time"
                    prefix-icon="none"
                    :clearable="false"
                    :size="size"
                    value-format="yyyy-MM-dd"
                    type="date"
                  />
                </div>
                <div class="width1">检查人</div>
                <div class="width1">
                  <span v-if="isRead" class="text">{{ form.check_person }}</span>
                  <el-input v-else v-model="form.check_person" :size="size" />
                </div>
                <div class="width1">取样编号</div>
                <div class="width1">排放数量</div>
                <div class="width1">检查结果</div>
                <div class="width2">处置方式</div>
                <template
                  v-for="(list, idx) in form.list"
                >
                  <div :key="idx+index+'order'" class="width1">
                    <span v-if="isRead" class="text">{{ list.order }}</span>
                    <el-input v-else v-model="list.order" :size="size" />
                  </div>
                  <div :key="idx+index+'num'" class="width1">
                    <span v-if="isRead" class="text">{{ list.num }}</span>
                    <el-input v-else v-model="list.num" :size="size" />
                  </div>
                  <div :key="idx+index+'check_result'" class="width1">
                    <div class="check">
                      <div v-if="isRead">
                        <div class="r-radio">
                          <span v-if="list.check_result == 1">✔</span>
                          <span>合格</span>
                        </div>
                        <div class="split" />
                        <div class="r-radio">
                          <span v-if="list.check_result === 0 || list.check_result === '0'">✔</span>
                          <span>不合格</span>
                        </div>
                      </div>
                      <el-radio-group v-else v-model="list.check_result" :size="size">
                        <el-radio :label="1">合格</el-radio>
                        <div class="split" />
                        <el-radio :label="0">不合格</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                  <div :key="idx+index+'deal'" class="width2">
                    <span v-if="isRead" class="text">{{ list.deal }}</span>
                    <el-input v-else v-model="list.deal" :size="size" />
                  </div>
                </template>
                <template>
                  <div class="flex1">合格油品去向</div>
                  <div class="flex1">
                    <div v-if="isRead">
                      <span v-if="form.oil_tank === 0 || form.oil_tank === '0'">✔</span>101
                    </div>
                    <el-radio v-else v-model="form.oil_tank" :label="0" :size="size">101</el-radio>
                  </div>
                  <div class="flex1">
                    <div v-if="isRead">
                      <span v-if="form.oil_tank == 1">✔</span>105
                    </div>
                    <el-radio v-else v-model="form.oil_tank" :label="1" :size="size">105</el-radio>
                  </div>
                </template>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>
    <pagination :total="total" :page="listQuery.page" :limit="listQuery.limit" @pagination="handleCurrentChange" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { saveMaintainTable, getMaintainTableDetail, deleteMaintainTable } from '@/api/inspection'
import print from 'print-js'
import dayjs from 'dayjs'
// import tcss from './ddpscy.css'
export default { // 低点排水查油品质量检查
  data() {
    const listQuery = { page: 0, limit: 1 }
    const lists1 = []
    for (let i = 1; i < 15; i++) {
      const obj = {
        order: '',
        num: '',
        check_result: '',
        deal: ''
      }
      if (i === 14) {
        obj.order = '油罐沉淀槽'
      }
      lists1.push(obj)
    }
    const lists2 = cloneDeep(lists1)
    return {
      size: 'mini',
      isRead: this.$route.query.is_r || false,
      isEdit: this.$route.query.is_e || false,
      tempform: {
        r_order: '',
        table: [
          {
            car_order: '',
            check_time: '',
            check_person: '',
            oil_tank: '',
            list: lists1
          },
          {
            car_order: '',
            check_time: '',
            check_person: '',
            oil_tank: '',
            list: lists2
          }
        ]
      },
      tform: [],
      total: 0,
      listQuery,
      tpage: 0,
      rid: this.$route.query.rid || '', // 维护记录id
      tid: this.$route.query.tid || '' // 维护表单id
    }
  },
  watch: {
    'listQuery.page'(val) {
      this.tpage = val - 1
    }
  },
  created() {
    if (this.isRead || this.isEdit) {
      this.getTableDetail()
    } else {
      this.addNewPage()
    }
  },
  methods: {
    getStringTime(timestamp) {
      if (typeof timestamp === 'number') {
        return dayjs(timestamp * 1000).format('YYYY-MM-DD')
      }
      return timestamp
    },
    async getTableDetail() {
      try {
        const { code, data } = await getMaintainTableDetail({
          id: this.rid
        })
        if (code === 200) {
          this.tform = data
          this.total = data.length
          // this.listQuery.page = data.length
        }
      } catch (error) {
        //
      }
    },
    addNewPage() {
      const form = cloneDeep(this.tempform)
      this.tform.push(form)
      this.total += 1
      this.listQuery.page += 1
    },
    classObj(idx) {
      return idx % 2 === 0 ? 'left-container' : 'right-container'
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
    },
    addTable() {
      this.addNewPage()
      // this.listQuery.page += 1
    },
    handleSave() {
      this.$confirm('确定要保存维护记录吗？', '保存记录', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.saveMaintainTable()
      })
    },
    async saveMaintainTable() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await saveMaintainTable({
          table_id: this.tid,
          egi_record_id: this.rid,
          data: this.tform
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          setTimeout(() => {
            this.goBack()
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    deleteItem() {
      this.$confirm('确定要删除当前表格吗？', '删除表格', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        if (this.isEdit) {
          this.deleteTable('item')
        } else {
          this.handleDelete('item')
        }
      })
    },
    deleteAll() {
      this.$confirm('确定要删除所有表格吗？', '删除表格', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        if (this.isEdit) {
          this.deleteTable('all')
        } else {
          this.handleDelete('all')
        }
      })
    },
    handleDelete(type) {
      if (type === 'item') {
        this.tform.splice(this.tpage, 1)
        if (this.listQuery.page === this.total) {
          this.listQuery.page -= 1
        }
        this.total -= 1
      } else if (type === 'all') {
        this.tform = []
        this.total = 0
        this.listQuery.page = 0
      }
    },
    async deleteTable(type) {
      let page = ''
      if (type === 'item') {
        page = this.tpage
      }
      try {
        const { code } = await deleteMaintainTable({
          id: this.rid,
          page
        })
        if (code === 200) {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功'
          // })
          this.handleDelete(type)
        }
      } catch (error) {
        //
      }
    },
    handlePrint() {
      print({
        printable: 'print-table',
        type: 'html',
        maxWidth: 1092,
        style: '@media print{@page {size:landscape}}',
        targetStyles: ['*']
      })
      // print({
      //   printable: 'print-table',
      //   type: 'html',
      //   maxWidth: 1092,
      //   scanStyles: false,
      //   // style: tcss,
      //   css: 'http://plane.leizikeji.top/table-css/ddpscy.css'
      //   // style: dcss
      //   // targetStyles: ['*']
      //   // header: '',
      //   // style: '@media print{@page {size:landscape}}'
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-group {
  margin-bottom: 5px;
}
.outer {
  width: 1092px;
  margin: auto;
}
.number-input {
  width: 100%;
  height: 60px;
  position: relative;
  margin-bottom: 5px;
  .thead {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%,0,0);
    margin: 0;
  }
  .ipt {
    position: absolute;
    right: 10px;
    bottom: 5px;
  }
}
.table-container {
  display: flex;
  width: 100%;
  margin: auto;
  .left-container {
    flex: 1;
    margin-right: 10px;
  }
  .right-container {
    flex: 1;
  }
}
$border: 1px solid #000;
$width1: 90px;
$width2: 270px;
.asset-table {
  display: flex;
  flex-wrap: wrap;
  border-top: $border;
  border-left: $border;
  color: #333;
  font-size: 12px;
  >* {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    min-height: 40px;
    border-right: $border;
    border-bottom: $border;
  }
  .width1 {
    flex: 0 0 $width1;
    width: $width1;
    overflow-x: hidden;
  }
  .width2 {
    flex: 0 0 $width2;
    width: $width2;
    overflow-x: hidden;
  }
  .flex1 {
    flex: 1;
  }
  .split {
    display: block;
    height: 0;
    width: $width1;
    margin: auto;
    border-top: $border;
  }
  /deep/ {
    .el-date-editor.el-input,
    .el-input {
      width: 100%;
      height: 26px;
      line-height: 26px;
      .el-input__inner {
        text-align: center;
        padding: 0 5px;
      }
    }
    .el-radio {
      padding: 3px 0 3px 3px;
      margin-right: 0;
    }
  }
  .r-radio {
    padding: 3px 0 3px 3px;
    margin-left: 10px;
  }
}
</style>
