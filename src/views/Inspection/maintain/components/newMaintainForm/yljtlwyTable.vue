<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table small-width" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th rowspan="2">设备名称</th>
          <th colspan="4">加油接头位置</th>
          <th rowspan="2">处理情况</th>
          <th rowspan="2">备注</th>
        </tr>
        <tr>
          <th>平台（前）</th>
          <th>平台（后）</th>
          <th>前绞盘</th>
          <th>后绞盘</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 设备名称 -->
          <td>{{ list.asset_name }}</td>
          <!-- 平台（前） -->
          <td>{{ list.front_platform }}</td>
          <!-- 平台（后） -->
          <td>{{ list.rear_platform }}</td>
          <!-- 前绞盘 -->
          <td>{{ list.front_winch }}</td>
          <!-- 后绞盘 -->
          <td>{{ list.rear_winch }}</td>
          <!-- 处理情况 -->
          <td>{{ list.deal }}</td>
          <!-- 备注 -->
          <td>{{ list.remark }}</td>
        </tr>
        <tr>
          <td class="all-col" colspan="4" style="border-right:none;">检查人：{{ checkMember }}</td>
          <td class="all-col" colspan="3" style="border-left:none;">检查时间：{{ checkTime }}</td>
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
      checkMember: '',
      checkTime: ''
      // abnormalDeal: '',
      // remark: ''
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
          // this.remark = data.remark
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
        style: '@media print{@page {size:landscape;margin:0;}}',
        targetStyles: ['*']
      })
    },
    getName(type) {
      return +type === 1 ? '✔' : (type || '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
