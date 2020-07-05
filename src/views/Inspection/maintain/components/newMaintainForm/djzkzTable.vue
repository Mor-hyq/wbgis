<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th rowspan="2">序号</th>
          <th rowspan="2">地井区域</th>
          <th colspan="6">检查内容</th>
          <th rowspan="2" colspan="3">处理过程</th>
          <th rowspan="2" colspan="2">备注</th>
          <th rowspan="2">检查人员</th>
          <th rowspan="2">检查日期</th>

        </tr>
        <tr>
          <th>渗漏</th>
          <th>清洁</th>
          <th>先导阀</th>
          <th>内衬</th>
          <th>井盖</th>
          <th>系链</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 序号 -->
          <td>{{ index + 1 }}</td>
          <!-- 地井区域-->
          <td>{{ list.high_area }}</td>
          <!-- 检查内容  渗漏-->
          <td>{{ getName(list.leakage) }}</td>
          <!-- 检查内容  清洁-->
          <td>{{ getName(list.clean) }}</td>
          <!-- 检查内容 先导阀-->
          <td>{{ getName(list.pilot_valve) }}</td>
          <!-- 检查内容 内衬-->
          <td>{{ getName(list.line) }}</td>
          <!-- 检查内容 井盖-->
          <td>{{ getName(list.cover) }}</td>
          <!-- 检查内容 系链-->
          <td>{{ getName(list.tether) }}</td>
          <!-- 处理过程 -->
          <td colspan="3">{{ list.deal }}</td>
          <!-- 备注 -->
          <td colspan="2">{{ list.remark }}</td>
          <td>{{ list.check_member }}</td>
          <td>{{ list.check_time }}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td class="all-col" colspan="14"><div v-html="remark" /></td>
        </tr>
        <tr>
          <td class="all-col" colspan="9" style="border-left:none;">检查时间：{{ checkTime }}</td>
          <td class="all-col" colspan="6" style="border-right:none;">检查人员：{{ checkMember }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  getEquipmentMatainDetail
} from '@/api/inspection'
import print from 'print-js'

export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    peid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      tableName: '',
      tableList: [],
      remark: '',
      checkMember: '',
      checkTime: ''
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      try {
        const { code, data } = await getEquipmentMatainDetail({
          id: this.id,
          period: this.peid
        })
        if (code === 200) {
          this.tableName = data.title
          this.tableList = data.list
          // this.abnormalDeal = data.abnormal_deal
          this.remark = data.remark
          this.checkMember = data.check_member
          this.checkTime = data.check_time
        }
      } catch (error) {
        console.log(error)
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
    },
    getName(type) {
      // return +type === 1 ? '✔' : (type || '')
      return +type === 1 ? '✔' : '×'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
