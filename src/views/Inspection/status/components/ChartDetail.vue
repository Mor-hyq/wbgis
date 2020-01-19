<template>
  <div>
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :style="{'padding-top': '15px'}"
      @handlePageChange="handleChange"
    >
      <template slot="search">
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="name" :label="mylang.equipmentName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.equipmentName}`" clearable />
          </el-form-item>
          <el-form-item prop="number" :label="mylang.equipmentNumber">
            <el-input v-model="searchForm.number" :placeholder="`请输入${mylang.equipmentNumber}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        class="tableBox"
        tooltip-effect="dark"
      >
        <el-table-column
          align="center"
          prop="number"
          :label="mylang.equipmentNumber"
        />
        <el-table-column
          align="center"
          prop="name"
          :label="mylang.equipmentName"
        />
        <el-table-column
          align="center"
          prop="status"
          :label="mylang.status"
        />
        <el-table-column
          align="center"
          prop="lng"
          :label="`${mylang.lng}(°)`"
        />
        <el-table-column
          align="center"
          prop="lat"
          :label="`${mylang.lat}(°)`"
        />
        <el-table-column
          :label="mylang.actions"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
export default {
  name: 'EquipmentStatusDetail',
  data() {
    return {
      searchForm: {
        number: '',
        name: ''
      },
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      tableData: [
        {
          id: 123,
          number: 123,
          name: '设备名称12',
          status: 1,
          lng: 1323.133,
          lat: 34.43
        },
        {
          id: 12,
          number: 12,
          name: '设备名称23',
          status: 1,
          lng: 1313.133233,
          lat: 24.43
        }
      ]
    }
  },
  methods: {
    initTableData() {

    },
    async getList() {

    },
    handleSearch() {
      // 搜索
      const search = this.$refs.mytable.handleSearch()
      this.realSearch = search
      this.initTableData({
        name: search.name,
        number: search.number
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        pageSize: data.page.limit,
        name: data.search.name,
        number: data.search.number
      })
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'EquipmentStatusDetail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
