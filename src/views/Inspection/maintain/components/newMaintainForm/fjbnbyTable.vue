<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th>阀门编号(JF)</th>
          <th>阀井水位</th>
          <th>腐蚀情况</th>
          <th>密封情况</th>
          <th>润滑情况</th>
          <th>螺栓紧固情况</th>
          <th>检查日期</th>
          <th>检查人</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 编号 -->
          <td>{{ list.asset_code }}</td>
          <!-- 阀井水位 -->
          <td>{{ getName(list.valve_level) }}</td>
          <!-- 腐蚀情况 -->
          <td>{{ getName(list.corrosion) }}</td>
          <!-- 密封情况 -->
          <td>{{ getName(list.seal) }}</td>
          <!-- 润滑情况 -->
          <td>{{ getName(list.smooth) }}</td>
          <!-- 螺栓紧固情况 -->
          <td>{{ getName(list.bolt) }}</td>
          <!-- 检查日期 -->
          <td>{{ list.check_time }}</td>
          <!-- 检查人 -->
          <td>{{ list.check_member }}</td>
        </tr>
        <tr>
          <td class="all-col" colspan="8">异常处理：<div v-html="abnormalDeal" /></td>
        </tr>
        <tr>
          <td class="all-col" colspan="8">备注：<div v-html="remark" /></td>
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
      abnormalDeal: '',
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
          this.abnormalDeal = data.abnormal_deal
          this.remark = data.remark
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
