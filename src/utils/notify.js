import { getWarinig } from '@/api/common'
import { Notification } from 'element-ui'
import router from '@/router'
import store from '@/store'
const getWarinigFunc = async function() {
  try {
    const { code, data } = await getWarinig()

    if (code === 200) {
      store.commit('app/SET_WARNING_NUM', data.length || 0)
      data.forEach((v, i) => {
        let title = ''
        let message = ''
        let onClick = null
        let customClass = ''
        if (+v.type === 1) {
          title = '设备维护提醒'
          message = `<p><span class="underline">${v.name}设备设施，待维护，请及时登记！</span>详情...</p>`
          customClass = 'custom-warning-notify'
          onClick = function() {
            router.push({
              name: 'EquipmentMaintain'
            })
          }
        } else if (+v.type === 2) {
          title = '报警提醒'
          customClass = 'custom-error-notify'
          message = `<p><span class="underline">${v.fault_state}出现${v.accident_type}，请及时处理！</span>详情...</p>`
          onClick = function() {
            router.push({
              name: 'Results'
            })
          }
        }
        setTimeout(() => {
          Notification({
            title: title,
            message,
            type: '',
            duration: 0,
            position: 'bottom-right',
            customClass,
            dangerouslyUseHTMLString: true,
            onClick
          })
        }, 300)
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export default getWarinigFunc
