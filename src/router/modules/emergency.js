import Layout from '@/layout'

const emergency = {
  path: '/emergency',
  name: 'Emergency',
  component: Layout,
  meta: {
    level: '1',
    title: '应急处置管理',
    icon: 'svg-member',
    noCache: true
  },
  children: [
    {
      path: 'supply',
      name: 'Supply',
      component: () => import('@/views/emergency/supply/index'),
      meta: {
        level: '1-1',
        title: '应急资源管理',
        icon: 'svg-role',
        noCache: false
      }
    },
    {
      path: 'supplyCreate',
      name: 'SupplyCreate',
      component: () => import('@/views/emergency/supply/create'),
      hidden: true,
      meta: {
        level: '1-1-1',
        title: '新增应急物资',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'supplyEdit',
      name: 'SupplyEdit',
      component: () => import('@/views/emergency/supply/edit'),
      hidden: true,
      meta: {
        level: '1-1-2',
        title: '修改应急物资',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'staff',
      name: 'Staff',
      component: () => import('@/views/emergency/staff/index'),
      hidden: true,
      meta: {
        level: '1-2',
        title: '应急人员管理',
        noCache: true
      }
    },
    {
      path: 'staffCreate',
      name: 'StaffCreate',
      component: () => import('@/views/emergency/staff/create'),
      hidden: true,
      meta: {
        level: '1-2-1',
        title: '新增应急人员',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'staffEdit',
      name: 'StaffEdit',
      component: () => import('@/views/emergency/staff/edit'),
      hidden: true,
      meta: {
        level: '1-2-2',
        title: '修改应急人员',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'fireTeam',
      name: 'FireTeam',
      component: () => import('@/views/emergency/fireTeam/index'),
      hidden: true,
      meta: {
        level: '1-3',
        title: '消防队伍管理',
        noCache: false
      }
    },
    {
      path: 'fireTeamCreate',
      name: 'FireTeamCreate',
      component: () => import('@/views/emergency/fireTeam/create'),
      hidden: true,
      meta: {
        level: '1-3-1',
        title: '新增消防队伍',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'fireTeamEdit',
      name: 'FireTeamEdit',
      component: () => import('@/views/emergency/fireTeam/edit'),
      hidden: true,
      meta: {
        level: '1-3-2',
        title: '修改消防队伍',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'cars',
      name: 'Cars',
      component: () => import('@/views/emergency/cars/index'),
      hidden: true,
      meta: {
        level: '1-4',
        title: '应急车辆管理',
        noCache: false
      }
    },
    {
      path: 'carsCreate',
      name: 'CarsCreate',
      component: () => import('@/views/emergency/cars/create'),
      hidden: true,
      meta: {
        level: '1-4-1',
        title: '新增应急车辆',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'carsEdit',
      name: 'CarsEdit',
      component: () => import('@/views/emergency/cars/edit'),
      hidden: true,
      meta: {
        level: '1-4-2',
        title: '修改应急车辆',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'cooperation',
      name: 'Cooperation',
      component: () => import('@/views/emergency/cooperation/index'),
      hidden: true,
      meta: {
        level: '1-5',
        title: '外协单位管理',
        icon: 'svg-role',
        noCache: false
      }
    },
    {
      path: 'cooperationCreate',
      name: 'CooperationCreate',
      component: () => import('@/views/emergency/cooperation/create'),
      hidden: true,
      meta: {
        level: '1-5-1',
        title: '新增外协单位',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'cooperationEdit',
      name: 'CooperationEdit',
      component: () => import('@/views/emergency/cooperation/edit'),
      hidden: true,
      meta: {
        level: '1-5-2',
        title: '修改外协单位',
        activeMenu: '/emergency/supply',
        noCache: true
      }
    },
    {
      path: 'plans',
      name: 'Plans',
      component: () => import('@/views/emergency/plan/index'),
      meta: {
        level: '1-6',
        title: '应急预案管理',
        icon: 'svg-role',
        noCache: false
      }
    },
    {
      path: 'plansCreate',
      name: 'PlansCreate',
      component: () => import('@/views/emergency/plan/create'),
      hidden: true,
      meta: {
        level: '1-6-1',
        title: '新增应急预案',
        activeMenu: '/emergency/plans',
        noCache: true
      }
    },
    {
      path: 'plansEdit',
      name: 'PlansEdit',
      component: () => import('@/views/emergency/plan/edit'),
      hidden: true,
      meta: {
        level: '1-6-2',
        title: '修改应急预案',
        activeMenu: '/emergency/plans',
        noCache: true
      }
    },
    {
      path: 'plansDetail',
      name: 'PlansDetail',
      component: () => import('@/views/emergency/plan/detail'),
      hidden: true,
      meta: {
        level: '1-6-3',
        title: '应急预案详情',
        activeMenu: '/emergency/plans',
        noCache: true
      }
    },
    {
      path: 'measures',
      name: 'Measures',
      component: () => import('@/views/emergency/measure/index'),
      hidden: true,
      meta: {
        level: '1-8',
        title: '处置措施管理',
        icon: 'svg-role',
        noCache: false
      }
    },
    {
      path: 'measuresCreate',
      name: 'MeasuresCreate',
      component: () => import('@/views/emergency/measure/create'),
      hidden: true,
      meta: {
        level: '1-8-1',
        title: '新增处置措施',
        activeMenu: '/emergency/plans',
        noCache: true
      }
    },
    {
      path: 'measuresEdit',
      name: 'MeasuresEdit',
      component: () => import('@/views/emergency/measure/edit'),
      hidden: true,
      meta: {
        level: '1-8-2',
        title: '修改处置措施',
        activeMenu: '/emergency/plans',
        noCache: true
      }
    },

    {
      path: 'results',
      name: 'Results',
      component: () => import('@/views/emergency/result/index'),
      meta: {
        level: '1-9',
        title: '报警记录管理',
        icon: 'svg-role',
        noCache: false
      }
    },
    {
      path: 'resultsCreate',
      name: 'ResultsCreate',
      component: () => import('@/views/emergency/result/create'),
      hidden: true,
      meta: {
        level: '1-9-1',
        title: '新增报警记录',
        activeMenu: '/emergency/results',
        noCache: true
      }
    },
    {
      path: 'resultsEdit',
      name: 'ResultsEdit',
      component: () => import('@/views/emergency/result/edit'),
      hidden: true,
      meta: {
        level: '1-9-2',
        title: '处理事件',
        activeMenu: '/emergency/results',
        noCache: true
      }
    },
    {
      path: 'resultsDetail',
      name: 'ResultsDetail',
      component: () => import('@/views/emergency/result/detail'),
      hidden: true,
      meta: {
        level: '1-9-3',
        title: '报警记录详情',
        activeMenu: '/emergency/results',
        noCache: true
      }
    },
    {
      path: 'accidentType',
      name: 'AccidentType',
      component: () => import('@/views/emergency/accidentType/index'),
      isFixed: true,
      meta: {
        level: '1-10',
        title: '事故类型管理',
        icon: 'svg-role',
        noCache: false
      }
    },
    {
      path: 'accidentLevel',
      name: 'AccidentLevel',
      component: () => import('@/views/emergency/accidentLevel/index'),
      isFixed: true,
      meta: {
        level: '1-11',
        title: '事故等级管理',
        icon: 'svg-role',
        noCache: false
      }
    }
  ]
}

export default emergency
