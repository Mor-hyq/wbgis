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
        // {
        //   path: 'equipmentStatus',
        //   name: 'EquipmentStatus',
        //   component: () => import('@/views/Inspection/status/index'),
        //   meta: {
        //     level: '1-1-1',
        //     title: '设备状态统计',
        //     noCache: false
        //   }
        // },
        // {
        //   path: 'equipmentStatusDetail',
        //   name: 'EquipmentStatusDetail',
        //   component: () => import('@/views/Inspection/status/detail'),
        //   hidden: true,
        //   meta: {
        //     level: '1-1-1-1',
        //     title: '设备台账明细',
        //     activeMenu: '/inspect/equipmentStatus',
        //     noCache: true
        //   }
        // },
        // {
        //   path: 'equipmentAnalyse',
        //   name: 'EquipmentAnalyse',
        //   component: () => import('@/views/Inspection/equipment/analyse'),
        //   meta: {
        //     level: '1-1-2',
        //     title: '设备管理分析',
        //     noCache: false
        //   }
        // },
        // {
        //   path: 'workOrder',
        //   name: 'WorkOrder',
        //   component: () => import('@/views/Inspection/workOrder/index'),
        //   meta: {
        //     level: '1-1-3',
        //     title: '工单统计',
        //     noCache: false
        //   }
        // }
      ]
    },
    {
      path: 'maintainManage',
      name: 'MaintainManage',
      component: MainContainer,
      // alwaysShow: true,
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
          path: 'maintainRecord',
          name: 'MaintainRecord',
          component: () => import('@/views/Inspection/maintain/record'),
          hidden: true,
          meta: {
            level: '1-2-1-4',
            title: '维护记录',
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
    // {
    //   path: 'equipmentAccount',
    //   name: 'EquipmentAccount',
    //   component: () => import('@/views/Inspection/equipment/index'),
    //   meta: {
    //     level: '1-4',
    //     title: '设备台账',
    //     icon: 'svg-role',
    //     noCache: false
    //   }
    // },
    // 故障类型暂时隐藏
    // {
    //   path: 'faultType',
    //   name: 'FaultType',
    //   component: () => import('@/views/Inspection/faultType/index'),
    //   meta: {
    //     level: '1-5',
    //     title: '故障类型管理',
    //     icon: 'svg-role',
    //     noCache: false
    //   }
    // }
  ]

}

export default inspect

