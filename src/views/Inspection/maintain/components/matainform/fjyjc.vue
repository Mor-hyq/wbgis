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
            <h3 class="thead">航空加油站阀井月检查记录</h3>
            <div class="ipt">
              <span v-if="isRead">{{ tform[tpage].r_order || '无' }}</span>
              <el-input v-else v-model="tform[tpage].r_order" :size="size" placeholder="请输入表格编号" />
            </div>
          </div>
          <div class="table-container">
            <div class="left-container">
              <div class="asset-table">
                <div class="width0">阀门编号(JF)</div>
                <div class="width1">阀室/阀门</div>
                <div class="width1">渗漏</div>
                <div class="width1">积水/油</div>
                <div class="width1">洁净</div>
                <div class="width1">井盖</div>
                <div class="width2">检查日期</div>
                <div class="width1">检查人</div>
                <template
                  v-for="(list, idx) in tform[tpage].list"
                >
                  <div :key="idx+'serial_num'" class="width0 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.serial_num }}</span>
                    <el-input v-else v-model="list.serial_num" :size="size" />
                  </div>
                  <div :key="idx+'valve'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.valve }}</span>
                    <el-input v-else v-model="list.valve" :size="size" />
                  </div>
                  <div :key="idx+'leak'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.leak }}</span>
                    <el-input v-else v-model="list.leak" :size="size" />
                  </div>
                  <div :key="idx+'stag_water'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.stag_water }}</span>
                    <el-input v-else v-model="list.stag_water" :size="size" />
                  </div>
                  <div :key="idx+'clean'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.clean }}</span>
                    <el-input v-else v-model="list.clean" :size="size" />
                  </div>
                  <div :key="idx+'hole'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.hole }}</span>
                    <el-input v-else v-model="list.hole" :size="size" />
                  </div>
                  <div :key="idx+'check_time'" class="width2 ipt-flex">
                    <span v-if="isRead" class="text">{{ getStringTime(list.check_time) }}</span>
                    <el-date-picker
                      v-else
                      v-model="list.check_time"
                      prefix-icon="none"
                      :clearable="false"
                      :size="size"
                      value-format="yyyy-MM-dd"
                      type="date"
                    />
                  </div>
                  <div :key="idx+'check_person'" class="width1 ipt-flex">
                    <span v-if="isRead" class="text">{{ list.check_person }}</span>
                    <el-input v-else v-model="list.check_person" :size="size" />
                  </div>
                </template>
                <div class="width0 height1">异常处理</div>
                <div class="flex1 height1 ipt-flex">
                  <span v-if="isRead" class="text">{{ tform[tpage].abnormal_deal }}</span>
                  <el-input v-else v-model="tform[tpage].abnormal_deal" type="textarea" :size="size" />
                </div>
              </div>
              <div class="tfooter">
                <span>备注：</span>
                <div>
                  <p>检查正常打“0”，异常情况文字说明。</p>
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
    for (let i = 1; i < 28; i++) {
      const obj = {
        serial_num: '',
        valve: '',
        leak: '',
        stag_water: '',
        clean: '',
        hole: '',
        check_time: '',
        check_person: ''
      }
      lists.push(obj)
    }
    return {
      size: 'mini',
      isRead: this.$route.query.is_r || false,
      isEdit: this.$route.query.is_e || false,
      tempform: {
        r_order: '',
        abnormal_deal: '',
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
  width: 801px;
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
$width0: 80px;
$width1: 100px;
$width2: 120px;
$width3: 200x;
$minHeight: 24px;
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
  .width0 {
    flex: 0 0 $width0;
    width: $width0;
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
        height: 18px;
        line-height: 18px;
        padding: 0 5px;
      }
    }
    .el-textarea__inner {
      resize: none;
    }
  }
}
.tfooter {
  display: flex;
  margin-top: 5px;
  color: #333;
  font-size: 12px;
  p {
    margin: 0;
  }
}
</style>
