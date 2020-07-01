<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table medium-width" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th rowspan="2" colspan="2">地井阀区域</th>
          <th colspan="5">测试内容</th>
          <th rowspan="2" colspan="2">检查人员</th>
          <th rowspan="2" colspan="2">检查日期</th>
        </tr>
        <tr>
          <th colspan="3">检查情况</th>
          <th>关闭时间（s）</th>
          <th />
        </tr>
        <tr>
          <!-- 地井阀区域 -->
          <td colspan="2">eref2</td>
          <!-- 测试内容  检查情况-->
          <td colspan="3">dfsdf范德萨发的</td>
          <!-- 测试内容  关闭时间 -->
          <td>16</td>
          <!-- 测试内容 -->
          <td />
          <!-- 检查人员 -->
          <td colspan="2">张三</td>
          <!-- 检查日期 -->
          <td colspan="2">2020-10-12</td>
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
          <!-- <td>{{ list.check_time }}</td> -->
          <!-- 检查人 -->
          <!-- <td>{{ list.check_member }}</td> -->
        </tr>
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
      remark: '检查正常打“√”，异常情况文字说明。',
      checkMember: '',
      checkTime: ''
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
