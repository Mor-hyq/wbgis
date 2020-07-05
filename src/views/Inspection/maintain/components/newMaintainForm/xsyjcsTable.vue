<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table medium-width " align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tr>
        <th colspan="11" style="text-align:left;font-size:0;">
          <div class="cus-tit">
            <span class="tit">测量仪表名称：</span>
            <span class="cont" />
          </div>
          <div class="cus-tit" style="text-align:center;">
            <span class="tit">型号：</span>
            <span class="cont">jfeirfji</span>
          </div>
          <div class="cus-tit">
            <span class="tit">检验有效期：</span>
            <span class="cont">2020-10-10</span>
          </div>
        </th>
      </tr>
      <tbody>
        <tr>
          <td>阳极编号</td>
          <td
            v-for="i in 10"
            :key="i"
            style="width:60px;"
          >{{ i }}</td>
        </tr>
        <tr>
          <td>管道保护电位</td>
          <td
            v-for="i in 10"
            :key="i"
          >{{ i }}</td>
        </tr>
        <tr>
          <td>备注</td>
          <td class="all-col" colspan="10"><div v-html="remark" /></td>
        </tr>
        <tr>
          <td class="all-col" colspan="6" style="border-right:none;">测量人：{{ checkMember }}</td>
          <td class="all-col" colspan="4" style="border-left:none;">检查时间：{{ checkTime }}</td>
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
    // this.getDetail()
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
