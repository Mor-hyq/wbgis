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
            <h3 class="thead">机坪地井阀测试月检查记录</h3>
            <div class="ipt">
              <span v-if="isRead">{{ tform[tpage].r_order || '无' }}</span>
              <el-input v-else v-model="tform[tpage].r_order" :size="size" placeholder="请输入表格编号" />
            </div>
          </div>
          <div class="table-container">
            <div class="left-container">
              <div class="asset-table">
                <div class="width1 border-right">地井阀区域</div>
                <div class="width3 c-flex">
                  <div class="flex1 flex10 border-bottom">测试内容</div>
                  <div class="flex1 c-flex">
                    <div class="flex1">检查情况</div>
                    <div class="flex1 border-left">关闭时间（s）</div>
                    <div class="flex1 border-left" />
                  </div>
                </div>
                <template
                  v-for="(list, idx) in tform[tpage].list"
                >
                  <div :key="idx+'ground_area'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.ground_area }}</span>
                    <el-input v-else v-model="list.ground_area" :size="size" />
                  </div>
                  <div :key="idx+'check'" class="width1 ">
                    <template v-if="isRead">
                      <span v-if="list.check == 1">✔</span>
                      <span v-else-if="list.check == 2">✖</span>
                    </template>
                    <el-select
                      v-else
                      v-model="list.check"
                      placeholder=""
                      :size="size"
                      clearable
                    >
                      <el-option :value="1" label="✔" />
                      <el-option :value="2" label="✖" />
                    </el-select>
                  </div>
                  <div :key="idx+'close_time'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.close_time }}</span>
                    <el-input v-else v-model="list.close_time" :size="size" />
                  </div>
                  <div :key="idx+'remark'" class="width1">
                    <span v-if="isRead" class="text">{{ list.remark }}</span>
                    <el-input v-else v-model="list.remark" :size="size" />
                  </div>
                </template>
                <div class="width1 height1">备注</div>
                <div class="flex1 height1 just-left align-end">
                  <span>正常打√</span>
                  <span>异常打X</span>
                  <span>异常情况填写备注栏</span>
                </div>
              </div>
              <div class="tfooter">
                <div class="titem">
                  <span class="label1">检查人：</span>
                  <span v-if="isRead">{{ tform[tpage].check_person }}</span>
                  <el-input v-else v-model="tform[tpage].check_person" :size="size" />
                </div>
                <div class="titem">
                  <span class="label1">检查时间：</span>
                  <span v-if="isRead" class="label2">{{ getStringTime(tform[tpage].check_time) }}</span>
                  <el-date-picker
                    v-else
                    v-model="tform[tpage].check_time"
                    prefix-icon="none"
                    :clearable="false"
                    :size="size"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="检查时间"
                  />
                </div>
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
export default {
  data() {
    const listQuery = { page: 0, limit: 1 }
    const lists = []
    for (let i = 1; i < 27; i++) {
      const obj = {
        ground_area: '',
        check: '',
        close_time: '',
        remark: ''
      }
      lists.push(obj)
    }
    return {
      size: 'mini',
      isRead: this.$route.query.is_r || false,
      isEdit: this.$route.query.is_e || false,
      tempform: {
        r_order: '',
        check_time: '',
        check_person: '',
        list: lists
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
        maxWidth: 1092,
        type: 'html',
        targetStyles: ['*']
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-group {
  margin-bottom: 5px;
}
.outer {
  width:801px;
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
  }
}
$border: 1px solid #000;
$width1: 200px;
$width2: 400px;
$width3: 600px;
$minHeight: 34px;
.border-left {
  border-left: $border;
}
.border-right {
  border-right: $border;
}
.border-top {
  border-top: $border;
}
.border-bottom {
  border-bottom: $border;
}
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
    // padding: 0 3px;
    min-height: $minHeight;
    border-right: $border;
    border-bottom: $border;
  }
  .c-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    >* {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: $minHeight;
    }
  }
  .width1 {
    flex: 0 0 $width1;
    width: $width1;
  }
  .width2 {
    flex: 0 0 $width2;
    width: $width2;
  }
  .width3 {
    flex: 0 0 $width3;
    width: $width3;
  }
  .height1 {
    height: 50px;
  }
  .flex1 {
    flex: 1;
  }
  .flex10 {
    flex: 0 0 100%;
  }
  .ipt-flex {
    padding: 0 3px;
  }
  .just-left {
    justify-content: flex-start;
    >span {
      margin-left: 20px;
    }
  }
  .align-end {
    align-items: flex-end;
    padding-bottom: 5px;
  }
  .self-normal {
    align-self: normal;
  }
  /deep/ {
    .el-date-editor.el-input,
    .el-input {
      width: 100%;
      .el-input__inner {
        text-align: center;
        height: 24px;
        line-height: 24px;
        padding: 0 5px;
      }
    }
    .el-radio {
      margin-right: 0;
      .el-radio__label {
        display: none;
      }
    }
    .el-checkbox {
      margin-right: 0;
      .el-checkbox__label {
        display: none;
      }
    }
    .el-select {
      width: 60px;
      padding: 0;
      .el-input__suffix {
        right: 0;
        .el-icon-arrow-up {
          display: none;
        }
      }
    }
  }
}
.tfooter {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  color: #333;
  font-size: 12px;
  .titem {
    flex: 0 0 200px;
    display: flex;
    align-items: center;
    .label1 {
      flex: 0 0 60px;
      width: 60px;
    }
    .label2 {
      flex: 0 0 140px;
      width: 140px;
    }
  }
  /deep/ {
    .el-date-editor.el-input,
    .el-input {
      width: 100%;
      .el-input__inner {
        height: 24px;
        line-height: 24px;
        padding: 0 5px;
      }
    }
  }
}
</style>
