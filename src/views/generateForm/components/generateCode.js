function findRemoteFunc(list, funcList, tokenFuncList, blankList) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === 'grid') {
      list[i].columns.forEach(item => {
        findRemoteFunc(item.list, funcList, tokenFuncList, blankList)
      })
    } else if (list[i].type === 'tabs') {
      list[i].tab_list.forEach(item => {
        findRemoteFunc(item.list, funcList, tokenFuncList, blankList)
      })
    } else {
      if (list[i].type === 'blank') {
        if (list[i].model) {
          blankList.push({
            name: list[i].model,
            label: list[i].name
          })
        }
      } else if (list[i].type === 'imgupload') {
        if (list[i].options.tokenFunc) {
          tokenFuncList.push({
            func: list[i].options.tokenFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      } else {
        if (list[i].options.remote && list[i].options.remoteFunc) {
          funcList.push({
            func: list[i].options.remoteFunc,
            label: list[i].name,
            model: list[i].model
          })
        }
      }
    }
  }
}

export default function(data) {
  const funcList = []

  const tokenFuncList = []

  const blankList = []

  findRemoteFunc(JSON.parse(data).list, funcList, tokenFuncList, blankList)

  let funcTemplate = ''

  let blankTemplate = ''

  for (let i = 0; i < funcList.length; i++) {
    funcTemplate += `
            ${funcList[i].func} (resolve) {
              // ${funcList[i].label} ${funcList[i].model}
              // 获取到远端数据后执行回调函数
              // resolve(data)
            },
    `
  }

  for (let i = 0; i < tokenFuncList.length; i++) {
    funcTemplate += `
            ${tokenFuncList[i].func} (resolve) {
              // ${tokenFuncList[i].label} ${tokenFuncList[i].model}
              // 获取到token数据后执行回调函数
              // resolve(token)
            },
    `
  }

  for (let i = 0; i < blankList.length; i++) {
    blankTemplate += `
        <template slot="${blankList[i].name}" slot-scope="scope">
          <!-- ${blankList[i].label} -->
          <!-- 通过 v-model="scope.model.${blankList[i].name}" 绑定数据 -->
        </template>
    `
  }

  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <link rel="stylesheet" href="https://unpkg.com/form-making/dist/FormMaking.css">
  </head>
  <body>
    <div id="app">
      <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        ${blankTemplate}
      </fm-generate-form>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <script src="https://unpkg.com/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script src="https://unpkg.com/form-making/dist/FormMaking.umd.js"></script>
    <script>
      new Vue({
        el: '#app',
        data: {
          jsonData: ${data},
          editData: {},
          remoteFuncs: {
            ${funcTemplate}
          }
        },
        methods: {
          handleSubmit () {
            this.$refs.generateForm.getData().then(data => {
              // 数据校验成功
              // data 为获取的表单数据
            }).catch(e => {
              // 数据校验失败
            })
          }
        }
      })
    </script>
  </body>
  </html>`
}
