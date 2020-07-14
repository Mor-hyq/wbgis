<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table small-width" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th>设备名称</th>
          <th>开启时间（s）</th>
          <th>关闭时间（s）</th>
          <th>流量（L）</th>
          <th>流速（L/min）</th>
          <th>使用情况</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 设备名称 -->
          <td>{{ list.asset_name }}</td>
          <!-- 开启时间（s） -->
          <td>{{ list.open_time }}</td>
          <!-- 关闭时间（s） -->
          <td>{{ list.close_time }}</td>
          <!-- 流量（L） -->
          <td>{{ list.flow }}</td>
          <!-- 流速（L/min） -->
          <td>{{ list.flow_rate }}</td>
          <!-- 使用情况 -->
          <td>{{ list.usage }}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td class="all-col" colspan="5"><div v-html="remark" /></td>
        </tr>
        <tr>
          <td class="all-col" colspan="3" style="border-right:none;">检查人：{{ checkMember }}</td>
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
      checkTime: '',
      // abnormalDeal: '',
      remark: ''
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
