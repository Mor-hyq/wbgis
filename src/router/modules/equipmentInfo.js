import Layout from '@/layout'
// 二级路由容器
import MainContainer from '@/components/MainContainer'
const equipmentInfo = {
  path: '/equipmentInfo',
  name: 'EquipmentInfo',
  component: Layout,
  meta: {
    level: '1',
    title: '设备信息管理',
    icon: 'svg-food-manage',
    noCache: true
  },
  children: [
    {
      path: 'accountManage',
      name: 'EquipmentAccountManage',
      component: MainContainer,
      // alwaysShow: true,
      meta: {
        level: '1-1',
        title: '设备台账管理',
        icon: 'svg-statistic',
        noCache: true
      },
      children: [
        // {
        //   path: 'equipmentAccount',
        //   name: 'EquipmentAccount',
        //   component: () => import('@/views/Inspection/equipment/index'),
        //   meta: {
        //     level: '1-1-1',
        //     title: '设备台账',
        //     noCache: false
        //   }
        // },
        {
          path: 'assetIndex',
          name: 'AssetIndex',
          component: () => import('@/views/equipmentInfo/asset/index'),
          meta: {
            level: '1-1-1',
            title: '设备台账信息',
            noCache: false
          }
        },
        {
          path: 'assetCreate',
          name: 'AssetCreate',
          component: () => import('@/views/equipmentInfo/asset/create'),
          hidden: true,
          meta: {
            level: '1-1-1-1',
            title: '新增设备台账信息',
            activeMenu: '/equipmentInfo/accountManage/assetIndex',
            noCache: true
          }
        },
        {
          path: 'assetEdit',
          name: 'AssetEdit',
          component: () => import('@/views/equipmentInfo/asset/edit'),
          hidden: true,
          meta: {
            level: '1-1-1-2',
            title: '修改设备台账信息',
            activeMenu: '/equipmentInfo/accountManage/assetIndex',
            noCache: true
          }
        },
        {
          path: 'assetDetail',
          name: 'AssetDetail',
          component: () => import('@/views/equipmentInfo/asset/detail'),
          hidden: true,
          meta: {
            level: '1-1-1-3',
            title: '设备台账详情',
            activeMenu: '/equipmentInfo/accountManage/assetIndex',
            noCache: true
          }
        },
        {
          path: 'assetType',
          name: 'AssetType',
          component: () => import('@/views/equipmentInfo/asset/baseInfo/typeInfo'),
          hidden: true,
          meta: {
            level: '1-1-1-4',
            title: '设备类型',
            activeMenu: '/equipmentInfo/accountManage/assetIndex',
            noCache: true
          }
        }
      ]
    },
    {
      path: 'technologyManage',
      name: 'TechnologyManage',
      component: MainContainer,
      // alwaysShow: true,
      meta: {
        level: '1-2',
        title: '技术资料管理',
        icon: 'score_use_record',
        noCache: true
      },
      children: [
        {
          path: 'technologyInfo',
          name: 'TechnologyInfo',
          component: () => import('@/views/equipmentInfo/technology/index'),
          meta: {
            level: '1-2-1',
            title: '技术资料管理',
            noCache: false
          }
        },
        {
          path: 'technologyInfoCreate',
          name: 'TechnologyInfoCreate',
          component: () => import('@/views/equipmentInfo/technology/create'),
          hidden: true,
          meta: {
            level: '1-2-1-1',
            title: '新增技术资料',
            activeMenu: '/equipmentInfo/technologyManage/technologyInfo',
            noCache: true
          }
        },
        {
          path: 'technologyInfoEdit',
          name: 'TechnologyInfoEdit',
          component: () => import('@/views/equipmentInfo/technology/edit'),
          hidden: true,
          meta: {
            level: '1-2-1-2',
            title: '修改技术资料',
            activeMenu: '/equipmentInfo/technologyManage/technologyInfo',
            noCache: true
          }
        },
        {
          path: 'technologyInfoDetail',
          name: 'TechnologyInfoDetail',
          component: () => import('@/views/equipmentInfo/technology/detail'),
          hidden: true,
          meta: {
            level: '1-2-1-3',
            title: '技术资料详情',
            activeMenu: '/equipmentInfo/technologyManage/technologyInfo',
            noCache: true
          }
        }
      ]
    }
  ]
}

export default equipmentInfo
