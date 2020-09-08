import Layout from '@/layout'
// 二级路由容器
import MainContainer from '@/components/MainContainer'
const inspect = {
  path: '/inspect',
  name: 'Inspect',
  component: Layout,
  meta: {
    level: '1',
    title: '设备维护与维修',
    icon: 'svg-member',
    noCache: true
  },
  children: [
    {
      path: 'equipmentStatusManage',
      name: 'EquipmentStatusManage',
      component: MainContainer,
      // alwaysShow: true,
      meta: {
        level: '1-1',
        title: '设备状态统计',
        icon: 'svg-role',
        noCache: true
      },
      children: [
        {
          path: 'equipmentAnalyse',
          name: 'EquipmentAnalyse',
          component: () => import('@/views/Inspection/equipment/analyse'),
          meta: {
            level: '1-1-1',
            title: '设备管理分析',
            noCache: false
          }
        }
      ]
    },
    {
      path: 'maintainManage',
      name: 'MaintainManage',
      component: MainContainer,
      meta: {
        level: '1-2',
        title: '设备维护管理',
        icon: 'svg-role',
        noCache: true
      },
      children: [
        {
          path: 'equipmentMaintain',
          name: 'EquipmentMaintain',
          component: () => import('@/views/Inspection/maintain/index'),
          meta: {
            level: '1-2-1',
            title: '设备维护管理',
            noCache: false
          }
        },
        {
          path: 'maintainCreate',
          name: 'MaintainCreate',
          component: () => import('@/views/Inspection/maintain/create'),
          hidden: true,
          meta: {
            level: '1-2-1-1',
            title: '新增设备维护信息',
            activeMenu: '/inspect/maintainManage/equipmentMaintain',
            noCache: true
          }
        },
        {
          path: 'maintainEdit',
          name: 'MaintainEdit',
          component: () => import('@/views/Inspection/maintain/edit'),
          hidden: true,
          meta: {
            level: '1-2-1-2',
            title: '修改设备维护信息',
            activeMenu: '/inspect/maintainManage/equipmentMaintain',
            noCache: true
          }
        },
        {
          path: 'maintainDetail',
          name: 'MaintainDetail',
          component: () => import('@/views/Inspection/maintain/detail'),
          hidden: true,
          meta: {
            level: '1-2-1-3',
            title: '设备维护信息详情',
            activeMenu: '/inspect/maintainManage/equipmentMaintain',
            noCache: true
          }
        },
        {
          // path: 'maintainRegister',
          // name: 'MaintainRegister',
          path: 'maintainRecord',
          name: 'MaintainRecord',
          component: () => import('@/views/Inspection/maintain/register'),
          hidden: true,
          meta: {
            level: '1-2-1-4',
            title: '维护登记',
            activeMenu: '/inspect/maintainManage/equipmentMaintain',
            noCache: true
          }
        },
        {
          path: 'maintainRecordForm',
          name: 'MaintainRecordForm',
          component: () => import('@/views/Inspection/maintain/recordForm'),
          hidden: true,
          isFixed: true,
          meta: {
            title: '表单详情',
            activeMenu: '/inspect/maintainManage/equipmentMaintain',
            noCache: true
          }
        }
      ]
    },
    {
      path: 'repairManage',
      name: 'RepairManage',
      component: MainContainer,
      // alwaysShow: true,
      meta: {
        level: '1-3',
        title: '设备维修管理',
        icon: 'svg-role',
        noCache: true
      },
      children: [
        {
          path: 'equipmentRepair',
          name: 'EquipmentRepair',
          component: () => import('@/views/Inspection/repair/index'),
          meta: {
            level: '1-3-1',
            title: '设备维修管理',
            noCache: false
          }
        },
        {
          path: 'repairCreating',
          name: 'RepairCreating',
          component: () => import('@/views/Inspection/repair/createGoing'),
          hidden: true,
          meta: {
            level: '1-3-1-1',
            title: '新增设备维修信息',
            activeMenu: '/inspect/repairManage/equipmentRepair',
            noCache: true
          }
        },
        {
          path: 'repairCreated',
          name: 'RepairCreated',
          component: () => import('@/views/Inspection/repair/createDone'),
          hidden: true,
          meta: {
            level: '1-3-1-2',
            title: '新增设备完成维修信息',
            activeMenu: '/inspect/repairManage/equipmentRepair',
            noCache: true
          }
        },
        {
          path: 'repairEditing',
          name: 'RepairEditing',
          component: () => import('@/views/Inspection/repair/editGoing'),
          hidden: true,
          meta: {
            level: '1-3-1-3',
            title: '修改设备维修信息',
            activeMenu: '/inspect/repairManage/equipmentRepair',
            noCache: true
          }
        },
        {
          path: 'repairEdited',
          name: 'RepairEdited',
          component: () => import('@/views/Inspection/repair/editDone'),
          hidden: true,
          meta: {
            level: '1-3-1-4',
            title: '修改维修完成信息',
            activeMenu: '/inspect/repairManage/equipmentRepair',
            noCache: true
          }
        },
        {
          path: 'repairDetail',
          name: 'RepairDetail',
          component: () => import('@/views/Inspection/repair/detail'),
          hidden: true,
          meta: {
            level: '1-3-1-5',
            title: '设备维修信息',
            activeMenu: '/inspect/repairManage/equipmentRepair',
            noCache: true
          }
        }
      ]
    }
  ]

}

export default inspect

