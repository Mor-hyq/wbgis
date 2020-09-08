<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint()">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table medium-width" align="center" cellspacing="0" cellpadding="0">
      <thead><th :colspan="11">{{ tableName }}</th></thead>
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
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 地井阀区域 -->
          <td colspan="2">{{ list.ground_area }}</td>
          <!-- 测试内容  检查情况-->
          <td colspan="3">{{ getName(list.check) }}</td>
          <!-- 测试内容  关闭时间 -->
          <td>{{ list.close_time }}</td>
          <!-- 测试内容 -->
          <td />
          <!-- 检查人员 -->
          <td colspan="2">{{ list.check_member }}</td>
          <!-- 检查日期 -->
          <td colspan="2">{{ list.check_time }}</td>
        </tr>

        <tr>
          <td colspan="2">备注</td>
          <td class="all-col" colspan="9"><div v-html="remark" /></td>
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
          this.tableList = data.list
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
      return +type === 1 ? '✔' : (type || '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
