<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="草稿箱" name="1">
      <list
        ref="myList1"
        :get-handle="getHandler"
        :request-params="{'type':'1'}"
      >
        <template v-slot:search>
          <el-form inline>
            <el-form-item>
              <el-input v-model="searchForm.name1" placeholder="搜索活动标题" clearable />
            </el-form-item>
            <el-button type="primary" @click="searchSubmit('1')">搜索</el-button>
          </el-form>
        </template>
        <template v-slot:buttons="{ list }">
          <el-button type="primary" plain :size="btnSize" @click="goPublishPage(list)">{{ commonLang.publish }}</el-button>
          <el-button type="primary" plain :size="btnSize" @click="goEditPage(list)">{{ commonLang.edit }}</el-button>
          <el-button type="success" plain :size="btnSize" @click="goDetailPage(list)">{{ commonLang.read }}</el-button>
          <el-button type="danger" plain :size="btnSize" @click="deleteDraftItem(list)">{{ commonLang.delete }}</el-button>
        </template>
      </list>
    </el-tab-pane>
    <el-tab-pane label="发布审核中" name="2">
      <list
        ref="myList2"
        :get-handle="getHandler"
        :request-params="{'type':'2'}"
      >
        <template v-slot:search>
          <el-form inline>
            <el-form-item>
              <el-input v-model="searchForm.name2" placeholder="搜索活动标题" clearable />
            </el-form-item>
            <el-button type="primary" @click="searchSubmit('2')">搜索</el-button>
          </el-form>
        </template>
        <template v-slot:buttons="{ list }">
          <el-button type="success" plain :size="btnSize" @click="goCandidatePage(list)">查看候选人</el-button>
          <el-button type="primary" plain :size="btnSize" @click="urgeHandle(list)">催办</el-button>
          <el-button type="success" plain :size="btnSize" @click="goDetailPage(list)">{{ commonLang.read }}</el-button>
          <el-button type="danger" plain :size="btnSize" @click="deleteDraftItem(list)">{{ commonLang.delete }}</el-button>
        </template>
      </list>
    </el-tab-pane>
    <el-tab-pane label="审核不通过" name="3">
      <list
        ref="myList3"
        :get-handle="getHandler"
        :request-params="{'type':'3'}"
      >
        <template v-slot:search>
          <el-form inline>
            <el-form-item>
              <el-input v-model="searchForm.name3" placeholder="搜索活动标题" clearable />
            </el-form-item>
            <el-button type="primary" @click="searchSubmit('3')">搜索</el-button>
          </el-form>
        </template>
        <template v-slot:buttons="{ list }">
          <el-button type="primary" plain :size="btnSize" @click="goPublishPage(list)">{{ commonLang.publish }}</el-button>
          <el-button type="primary" plain :size="btnSize" @click="goEditPage(list)">{{ commonLang.edit }}</el-button>
          <el-button type="success" plain :size="btnSize" @click="goDetailPage(list)">{{ commonLang.read }}</el-button>
          <el-button type="danger" plain :size="btnSize" @click="deleteDraftItem(list)">{{ commonLang.delete }}</el-button>
        </template>
      </list>
    </el-tab-pane>
    <el-tab-pane label="已发布" name="4">
      <list
        ref="myList4"
        :get-handle="getHandler"
        :request-params="{'type':'4'}"
        time-type="publish"
        copy-link
      >
        <template v-slot:search>
          <el-form inline>
            <el-form-item>
              <el-input v-model="searchForm.name4" placeholder="搜索活动标题" clearable />
            </el-form-item>
            <el-button type="primary" @click="searchSubmit('4')">搜索</el-button>
          </el-form>
        </template>
        <template v-slot:buttons="{ list }">
          <el-button type="success" plain :size="btnSize" @click="goCandidatePage(list)">查看候选人</el-button>
          <el-button type="success" plain :size="btnSize" @click="goDetailPage(list)">查看活动</el-button>
          <el-button type="primary" plain :size="btnSize" @click="goSetMessagePage(list)">消息设置</el-button>
          <el-button type="primary" plain :size="btnSize" @click="copyActivityHandle(list)">一键复制</el-button>
          <el-button type="danger" plain :size="btnSize" @click="underActivityHandle(list)">下架</el-button>
        </template>
      </list>
    </el-tab-pane>
    <el-tab-pane label="已下架" name="5">
      <list
        ref="myList5"
        :get-handle="getHandler"
        :request-params="{'type':'5'}"
        time-type="under"
      >
        <template v-slot:search>
          <el-form inline>
            <el-form-item>
              <el-input v-model="searchForm.name5" placeholder="搜索活动标题" clearable />
            </el-form-item>
            <el-button type="primary" @click="searchSubmit">搜索</el-button>
          </el-form>
        </template>
        <template v-slot:buttons="{ list }">
          <el-button type="success" plain :size="btnSize" @click="goDetailPage(list)">{{ commonLang.read }}</el-button>
          <el-button type="danger" plain :size="btnSize" @click="deleteDraftItem(list)">{{ commonLang.delete }}</el-button>
        </template>
      </list>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getMyActList, deleteMyAct, urgeMyAct, underMyAct } from '@/api/activity'
import List from '../components/List'
import comLang from '@/lang'

export default {
  name: 'ActivityList',
  components: {
    List
  },
  data() {
    return {
      searchForm: {
        name1: '',
        name2: '',
        name3: '',
        name4: '',
        name5: ''
      },
      btnSize: 'small',
      commonLang: comLang.common,
      getHandler: getMyActList,
      activeName: '1'
    }
  },
  activated() {
    // 更新当前页面
    if (this.$store.state.app.isUpdate) {
      this.$store.commit('app/TOGGLE_UPDATE', false)
      this.updatePage()
    }
  },
  methods: {
    searchSubmit(type) {
      // 触发组件的搜索事件 并将搜索字段传递进去
      const refName = `myList${type}`
      const searchData = {
        name: this.searchForm[`name${type}`]
      }
      this.$refs[refName].searchHandler(searchData)
    },
    goPublishPage(item) {
      // 发布按钮
    },
    goEditPage(item) {
      // 编辑按钮
      this.$router.push({
        name: 'EditActivity',
        params: {
          id: item.id
        }
      })
    },
    goDetailPage(item) {
      // 查看按钮
      this.$router.push({
        name: 'ActivityDetail',
        params: {
          id: item.id
        }
      })
    },
    async deleteActivity(id) {
      try {
        const { code } = await deleteMyAct({ id })
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.updatePage()
        }
      } catch (error) {
        console.log(error)
      }
    },
    deleteDraftItem(item) {
      // 删除按钮
      this.$confirm(`确定要删除该活动吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteActivity(item.id)
      })
    },
    goCandidatePage(item) {
      // 查看候选人按钮
    },
    async urgeHandle(item) {
      // 催办按钮
      try {
        const { code } = await urgeMyAct({ id: item.id })
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '催办成功'
          })
          this.updatePage()
          this.$refs.myList5.initList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    goSetMessagePage(item) {
      // 消息设置按钮
    },
    copyActivityHandle(item) {
      // 一键复制按钮
    },
    async underActivity(id) {
      try {
        const { code } = await underMyAct({ id })
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '下架成功'
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    underActivityHandle(item) {
      // 已发布 下架按钮
      this.$confirm(`确定要下架该活动吗？下架后手机端将不再显示`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.underActivity(item.id)
      })
    },
    updatePage() {
      // 重新获取当前页面数据
      const refName = `myList${this.activeName}`
      this.$refs[refName].initList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
