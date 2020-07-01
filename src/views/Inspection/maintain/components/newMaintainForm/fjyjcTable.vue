<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th>阀门编号(JF)</th>
          <th>阀室/阀门</th>
          <th>渗漏</th>
          <th>积水/油</th>
          <th>洁净</th>
          <th>井盖</th>
          <th>检查日期</th>
          <th>检查人</th>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 编号 -->
          <td>{{ list.asset_code }}</td>
          <!-- 阀室/阀门 -->
          <td>{{ getName(list.valve) }}</td>
          <!-- 渗漏 -->
          <td>{{ getName(list.leakage) }}</td>
          <!-- 积水/油 -->
          <td>{{ getName(list.stag_water) }}</td>
          <!-- 洁净 -->
          <td>{{ getName(list.clean) }}</td>
          <!-- 井盖 -->
          <td>{{ getName(list.cover) }}</td>
          <!-- 检查日期 -->
          <td>{{ list.check_time }}</td>
          <!-- 检查人 -->
          <td>{{ list.mid }}</td>
        </tr>
        <tr>
          <td class="all-col" colspan="8">异常处理：{{ abnormalDeal }}</td>
        </tr>
        <tr>
          <td class="all-col" colspan="8">备注：{{ remark }}</td>
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
      remark: '检查正常打“√”，异常情况文字说明。'
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
      // print({
      //   printable: 'print-table',
      //   type: 'html',
      //   maxWidth: 1092,
      //   scanStyles: false,
      //   // style: tcss,
      //   css: 'http://plane.leizikeji.top/table-css/ddpscy.css'
      //   // style: dcss
      //   // targetStyles: ['*']
      //   // header: '',
      //   // style: '@media print{@page {size:landscape}}'
      // })
    },
    getName(type) {
      return +type === 1 ? '√' : type
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
