import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import lang from './lang'

import '@/icons' // icon
import '@/permission' // permission control
import 'babel-polyfill'

import routePermission from '@/directive/routePermission'
import operationPermission from '@/directive/operationPermission'
import fieldPermission from '@/directive/fieldPermission'
Vue.directive('routePermission', routePermission) // 路由跳转页面权限
Vue.directive('operationPermission', operationPermission) // 操作按钮权限
Vue.directive('fieldPermission', fieldPermission) // 字段权限
// 注册全局组件
// 分页组件
import pagination from '@/components/Pagination'
Vue.component('Pagination', pagination)
// 页面名称组件
import TopLabel from '@/components/TopLabel'
Vue.component('TopLabel', TopLabel)
// 返回上一页组件
import GoBack from '@/components/GoBack'
Vue.component('GoBack', GoBack)
// 自定义的表格组件
import MyTable from '@/components/MyTable'
Vue.component('MyTable', MyTable)
// 返回上一页的公共方法
Vue.prototype.goBack = function() {
  router.back()
}
// 全局公共语言包
Vue.prototype.mylang = lang
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
if (window.innerWidth < 1500) {
  Vue.prototype.$btnSize = 'mini'
} else if (window.innerWidth < 2000) {
  Vue.prototype.$btnSize = 'small'
} else if (window.innerWidth < 2500) {
  Vue.prototype.$btnSize = 'medium'
} else {
  Vue.prototype.$btnSize = ''
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
