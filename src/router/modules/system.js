import Layout from '@/layout'
// 二级路由容器
import MainContainer from '@/components/MainContainer'

const system = {
  path: '/system',
  name: 'System',
  component: Layout,
  meta: {
    level: '1',
    title: '系统管理',
    icon: 'score-manage',
    noCache: true
  },
  children: [
    {
      path: 'pipeManage',
      name: 'PipeManage',
      component: MainContainer,
      meta: {
        level: '1-1',
        title: '管线信息管理',
        icon: 'svg-base-configuration',
        noCache: true
      },
      children: [
        {
          path: 'tunnelInfo',
          name: 'TunnelInfo',
          component: () => import('@/views/equipmentInfo/tunnelInfo/index'),
          meta: {
            level: '1-1-1',
            title: '管道信息管理',
            noCache: false
          }
        },
        {
          path: 'tunnelInfoCreate',
          name: 'TunnelInfoCreate',
          component: () => import('@/views/equipmentInfo/tunnelInfo/create'),
          hidden: true,
          meta: {
            level: '1-1-1-1',
            title: '新增管道信息',
            activeMenu: '/system/pipeManage/tunnelInfo',
            noCache: true
          }
        },
        {
          path: 'tunnelInfoEdit',
          name: 'TunnelInfoEdit',
          component: () => import('@/views/equipmentInfo/tunnelInfo/edit'),
          hidden: true,
          meta: {
            level: '1-1-1-2',
            title: '修改管道信息',
            activeMenu: '/system/pipeManage/tunnelInfo',
            noCache: true
          }
        },
        {
          path: 'tunnelInfoDetail',
          name: 'TunnelInfoDetail',
          component: () => import('@/views/equipmentInfo/tunnelInfo/detail'),
          hidden: true,
          meta: {
            level: '1-1-1-3',
            title: '管道信息详情',
            activeMenu: '/system/pipeManage/tunnelInfo',
            noCache: true
          }
        },
        {
          path: 'setAsset',
          name: 'SetAsset',
          component: () => import('@/views/equipmentInfo/tunnelInfo/assetDetail'),
          hidden: true,
          meta: {
            level: '1-1-1-4',
            title: '管道设备',
            activeMenu: '/system/pipeManage/tunnelInfo',
            noCache: true
          }
        },
        {
          path: 'tunnelRouter',
          name: 'TunnelRouter',
          component: () => import('@/views/equipmentInfo/tunnelRouter/index'),
          meta: {
            level: '1-1-2',
            title: '管道路由管理',
            noCache: false
          }
        },
        {
          path: 'tunnelRouterCreate',
          name: 'TunnelRouterCreate',
          component: () => import('@/views/equipmentInfo/tunnelRouter/create'),
          hidden: true,
          meta: {
            level: '1-1-2-1',
            title: '新增管道路由',
            activeMenu: '/system/pipeManage/tunnelRouter',
            noCache: true
          }
        },
        {
          path: 'tunnelRouterEdit',
          name: 'TunnelRouterEdit',
          component: () => import('@/views/equipmentInfo/tunnelRouter/edit'),
          hidden: true,
          meta: {
            level: '1-1-2-2',
            title: '修改管道路由',
            activeMenu: '/system/pipeManage/tunnelRouter',
            noCache: true
          }
        },
        {
          path: 'tunnelRouterDetail',
          name: 'TunnelRouterDetail',
          component: () => import('@/views/equipmentInfo/tunnelRouter/detail'),
          hidden: true,
          meta: {
            level: '1-1-2-3',
            title: '管道路由详情',
            activeMenu: '/system/pipeManage/tunnelRouter',
            noCache: true
          }
        },
        {
          path: 'tunnelRiskRouter',
          name: 'TunnelRiskRouter',
          component: () => import('@/views/equipmentInfo/risk/index'),
          isFixed: true,
          meta: {
            level: '1-1-3',
            title: '风险信息设置',
            noCache: false
          }
        }
      ]
    },
    {
      path: 'companyManage',
      name: 'CompanyManage',
      component: MainContainer,
      meta: {
        level: '1-2',
        title: '单位信息管理',
        icon: 'health_city_manage',
        noCache: true
      },
      children: [
        {
          path: 'company',
          name: 'Company',
          component: () => import('@/views/system/company/index'),
          meta: {
            level: '1-2-1',
            title: '单位管理',
            noCache: true
          }
        },
        {
          path: 'department',
          name: 'Department',
          component: () => import('@/views/system/department/index'),
          meta: {
            level: '1-2-2',
            title: '部门管理',
            noCache: true
          }
        }
      ]
    },
    {
      path: 'authorityManage',
      name: 'RoleAuthorityManage',
      component: MainContainer,
      meta: {
        level: '1-3',
        title: '角色权限管理',
        icon: 'svg-role',
        noCache: true
      },
      children: [
        {
          path: 'role',
          name: 'Role',
          component: () => import('@/views/system/role/index'),
          meta: {
            level: '1-3-1',
            title: '角色管理',
            noCache: false
          }
        },
        {
          path: 'roleDetail',
          name: 'RoleDetail',
          component: () => import('@/views/system/role/detail'),
          hidden: true,
          meta: {
            level: '1-3-1-1',
            title: '角色详情',
            activeMenu: '/system/role',
            noCache: true
          }
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/system/user/index'),
          meta: {
            level: '1-3-2',
            title: '用户管理',
            noCache: false
          }
        },
        {
          path: 'userDetail',
          name: 'UserDetail',
          component: () => import('@/views/system/user/detail'),
          hidden: true,
          meta: {
            level: '1-3-2-1',
            title: '用户详情',
            activeMenu: '/system/user',
            noCache: false
          }
        }
      ]
    },
    {
      path: 'log',
      name: 'LogManage',
      component: MainContainer,
      // alwaysShow: true,
      meta: {
        level: '1-4',
        title: '操作日志管理',
        icon: 'health_search',
        noCache: true
      },
      children: [
        {
          path: 'index',
          name: 'Log',
          component: () => import('@/views/system/logsys/index'),
          meta: {
            level: '1-4-1',
            title: '操作日志',
            noCache: false
          }
        }
      ]
    }
  ]
}

export default system
