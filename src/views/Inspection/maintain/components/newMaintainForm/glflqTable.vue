<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th>设备编号</th>
          <th>额定流速（L/M）</th>
          <th>流速（L/M）</th>
          <th>流速率</th>
          <th>压差读数（Mpa）</th>
          <th>全流量压差（Mpa）</th>
          <th>自上次读数后输油量（L）</th>
          <th>输油总数计量（L）</th>
          <th>备注</th>
          <th>检查人员</th>
          <th>检查日期</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 设备编号 -->
          <td>{{ list.asset_code }}</td>
          <!-- 额定流速 -->
          <td>{{ list.rated_flow_rate }}</td>
          <!-- 流速 -->
          <td>{{ list.flow_rate }}</td>
          <!-- 流速率 -->
          <td>{{ list.rate }}</td>
          <!-- 压差读数 -->
          <td>{{ list.pressure }}</td>
          <!-- 全流量压差 -->
          <td>{{ list.all_pressure }}</td>
          <!-- 自上次读数后输油量 -->
          <td>{{ list.up_oil }}</td>
          <!-- 输油总数计量 -->
          <td>{{ list.oil }}</td>
          <!-- 备注 -->
          <td>{{ list.remark }}</td>
          <!-- 检查人员 -->
          <td>{{ list.check_member }}</td>
          <!-- 检查日期 -->
          <td>{{ list.check_time }}</td>
        </tr>
        <tr>
          <td class="all-col" colspan="8" style="border-right:none;">检查人：{{ checkMember }}</td>
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
        // maxWidth: 1092,
        style: '@media print{@page {size:portrait;margin:0 auto;}}.print-table{border:1px solid #666;border-collapse:collapse;margin:0 auto}.print-table.medium-width th{width:120px}.print-table.small-width th{width:100px}.print-table caption{margin-bottom:10px;font-size: 16px;font-weight: bold;}.print-table th{width:80px}.print-table th,.print-table td{border:1px solid #666;padding:8px 5px}.print-table td{text-align:center}.print-table .all-col{text-align:left;padding:20px 10px}.print-table .all-col div{white-space:pre;padding-left:2em}.print-table .cus-tit{display:inline-block;width:30%}.print-table .cus-tit:last-child{width:40%;text-align:right}.print-table .cus-tit span{font-weight:normal;font-size:16px}'

      })
    },
    getName(type) {
      if (!type) {
        return ''
      }
      return +type === 1 ? '✔' : (type || '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
