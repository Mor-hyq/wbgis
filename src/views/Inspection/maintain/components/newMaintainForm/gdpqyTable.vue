<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint()">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
      <!-- <caption>{{ tableName }}</caption> -->
      <thead><th :colspan="11">{{ tableName }}</th></thead>
      <tbody>
        <tr>
          <th rowspan="2">机坪高点排气区域</th>
          <th colspan="3">目视</th>
          <th colspan="2">化学测水器</th>
          <th rowspan="2">处理过程</th>
          <th colspan="2">目视结论</th>
          <th rowspan="2">检查人员</th>
          <th rowspan="2">检查日期</th>
        </tr>
        <tr>
          <th>清澈透明</th>
          <th>少量水分杂质</th>
          <th>大量水份杂质</th>
          <th>不变色</th>
          <th>变色</th>
          <th>合格</th>
          <th>不合格</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 机坪高点排气区域 -->
          <td>{{ list.high_area }}</td>
          <!-- 目视  清澈透明-->
          <td>{{ getName(list.visual_1) }}</td>
          <!-- 目视  少量水分杂质-->
          <td>{{ getName(list.visual_2) }}</td>
          <!-- 目视  大量水份杂质-->
          <td>{{ getName(list.visual_3) }}</td>
          <!-- 化学测水器 不变色-->
          <td>{{ getName(list.water_detector_1) }}</td>
          <!-- 化学测水器 变色-->
          <td>{{ getName(list.water_detector_2) }}</td>
          <!-- 处理过程 -->
          <td>{{ list.deal }}</td>
          <!-- 目视结论 合格-->
          <td>{{ getName(list.deal_visual_1) }}</td>
          <!-- 目视结论 不合格-->
          <td>{{ getName(list.deal_visual_2) }}</td>
          <!-- 检查人员 -->
          <td>{{ list.check_member }}</td>
          <!-- 检查日期 -->
          <td>{{ list.check_time }}</td>
        </tr>
        <!-- <tr>
          <td class="all-col" colspan="9">异常处理：<div v-html="abnormalDeal" /></td>
        </tr> -->
        <tr>
          <td class="all-col" colspan="11">备注：<div v-html="remark" /></td>
        </tr>
        <tr>
          <td class="all-col" colspan="6" style="border-right:none;">检查人员：{{ checkMember }}</td>
          <td class="all-col" colspan="5" style="border-left:none;">检查时间：{{ checkTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  getEquipmentMatainDetail
} from '@/api/inspection'
import mixPrint from './mixPrint'

export default {
  mixins: [mixPrint],
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
      // abnormalDeal: '',
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
          this.tableList = data.list.map(v => {
            return {
              ...v,
              ['visual_' + v.visual]: v.visual,
              ['water_detector_' + v.water_detector]: v.water_detector,
              ['deal_visual_' + v.deal_visual]: v.deal_visual
            }
          })
          // this.abnormalDeal = data.abnormal_deal
          this.remark = data.remark
          this.checkMember = data.check_member
          this.checkTime = data.check_time
        }
      } catch (error) {
        console.log(error)
      }
    },
    getName(type) {
      if (!type) {
        return ''
      }
      return +type ? '✔' : ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
