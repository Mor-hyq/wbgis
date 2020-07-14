<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table small-width" align="center" cellspacing="0" cellpadding="0">
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
          <tr :key="ind">
            <!-- 设备名称 -->
            <td rowspan="4">{{ item.asset_name }}</td>
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
          <tr :key="ind">
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
          <tr :key="ind">
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
          <tr :key="ind">
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
          <tr :key="ind">
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
        maxWidth: 1092,
        style: '@media print{@page {size:landscape;margin:0;}}',
        targetStyles: ['*']
      })
    },
    getName(type) {
    //   return +type === 1 ? '✔' : (type || '')
      return +type === 1 ? '✔' : '×'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
