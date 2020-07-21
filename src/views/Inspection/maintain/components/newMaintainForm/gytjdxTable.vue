<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table medium-width" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th>设备名称</th>
          <th>检测项目</th>
          <th>标准值</th>
          <th>实测值</th>
          <th>数值对比（合格打✔不合格打x）</th>
          <th>处理情况</th>
          <th>备注</th>
        </tr>
        <template
          v-for="(item, ind) in tableList"
        >
          <tr :key="ind+Math.random()">
            <!-- 设备名称 -->
            <td rowspan="4">{{ item.asset_code }}</td>
            <!-- 检测项目 -->
            <td>5A7</td>
            <!-- 标准值 -->
            <td>&lt;10Ω</td>
            <!-- 实测值 -->
            <td>{{ item.A7_actual_value }}</td>
            <!-- 数值对比（合格打✔不合格打x） -->
            <td>{{ getName(item.A7_compare) }}</td>
            <!-- 处理情况 -->
            <td>{{ item.A7_deal }}</td>
            <!-- 备注 -->
            <td>{{ item.A7_remak }}</td>
          </tr>
          <tr :key="ind+Math.random()">
            <!-- 检测项目 -->
            <td>5A8</td>
            <!-- 标准值 -->
            <td>&lt;10Ω</td>
            <!-- 实测值 -->
            <td>{{ item.A8_actual_value }}</td>
            <!-- 数值对比（合格打✔不合格打x） -->
            <td>{{ getName(item.A8_compare) }}</td>
            <!-- 处理情况 -->
            <td>{{ item.A8_deal }}</td>
            <!-- 备注 -->
            <td>{{ item.A8_remak }}</td>
          </tr>
          <tr :key="ind+Math.random()">
            <!-- 检测项目 -->
            <td>5B7</td>
            <!-- 标准值 -->
            <td>&lt;10Ω</td>
            <!-- 实测值 -->
            <td>{{ item.B7_actual_value }}</td>
            <!-- 数值对比（合格打✔不合格打x） -->
            <td>{{ getName(item.B7_compare) }}</td>
            <!-- 处理情况 -->
            <td>{{ item.B7_deal }}</td>
            <!-- 备注 -->
            <td>{{ item.B7_remak }}</td>
          </tr>
          <tr :key="ind+Math.random()">
            <!-- 检测项目 -->
            <td>5B8</td>
            <!-- 标准值 -->
            <td>&lt;10Ω</td>
            <!-- 实测值 -->
            <td>{{ item.B8_actual_value }}</td>
            <!-- 数值对比（合格打✔不合格打x） -->
            <td>{{ getName(item.B8_compare) }}</td>
            <!-- 处理情况 -->
            <td>{{ item.B8_deal }}</td>
            <!-- 备注 -->
            <td>{{ item.B8_remak }}</td>
          </tr>
          <tr :key="ind+Math.random()">
            <td class="all-col" colspan="2" style="border-right:none;">检查人：{{ item.check_member }}</td>
            <td class="all-col" colspan="2" style="border:none;">天气：{{ item.weather }}</td>
            <td class="all-col" colspan="3" style="border-left:none;">检查时间：{{ item.check_time }}</td>
          </tr>
        </template>
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
      weather: ''
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
          this.tableList = data.list.map(v => {
            const form = {
              asset_code: v.asset_code,
              weather: v.weather,
              check_member: v.check_member,
              check_time: v.check_time
            }
            if (v.value) {
              const valObj = JSON.parse(v.value)
              for (const k in valObj) {
                form[k] = valObj[k]
              }
            }
            return form
          })

          // this.abnormalDeal = data.abnormal_deal
          // this.remark = data.remark
        //   this.weather = data.weather
        //   this.checkMember = data.check_member
        //   this.checkTime = data.check_time
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
    //   return +type === 1 ? '✔' : (type || '')
      // return +type === 1 ? '✔' : '✖'
      return +type === 1 ? '✔' : '✖'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
