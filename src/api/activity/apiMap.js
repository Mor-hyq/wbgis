const Config = require('@/config')

const mode = Config.mode

const activityApiMap = {
  // 获取活动模板列表接口
  getFormList: 'admin/actTemplate?target=list',
  // 创建活动接口
  saveActivity: 'admin/act?target=save',
  // 获取活动详情接口
  getActivityDetail: 'admin/act/:id?target=actDetail',
  // 编辑活动接口
  editActivity: 'admin/act/:id?target=edit',
  // 获取我创建的活动列表
  getMyActivityList: 'admin/myAct?target=actList',
  // 删除我创建的活动
  deleteMyActivity: 'admin/myAct/:id?target=delAct',
  // 发布活动接口
  publishActivity: 'admin/myAct/:id?target=push',
  // 催办审核接口
  urgeExamine: 'admin/myAct?target=urged',
  // 下架活动接口
  underActivity: 'admin/myAct/:id?target=underAct'
}

// local模式接口添加 debug/cross
if (mode === 'local') {
  for (const k in activityApiMap) {
    if (activityApiMap[k].indexOf('?') < 0) {
      activityApiMap[k] = `${activityApiMap[k]}?debug=cross`
    } else {
      activityApiMap[k] = `${activityApiMap[k]}&debug=cross`
    }
  }
}

export default activityApiMap
