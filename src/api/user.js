import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export const permissionRouter = [
  {
    name: 'Example', // 对应前端路由
    meta: {
      title: '示例', // 路由显示的名称
      icon: 'link' // 路由图标名称
    },
    children: [ // 子路由
      {
        name: 'Table',
        meta: {
          title: '表格'
        }
      },
      {
        name: 'Tree',
        meta: {
          title: '树形结构',
          permission: [ // 按钮权限
            {
              title: '禁用',
              value: 'forbidden'
            }

          ],
          fields: [ // 字段权限
            {
              title: '字段权限',
              value: 'field1'
            }
          ]
        }
      }
    ]
  },
  {
    name: 'Nested',
    meta: {
      title: '菜单'
    },
    children: [
      {
        name: 'Menu1',
        meta: {
          title: '菜单1'
        },
        children: [
          {
            name: 'Menu1-1',
            meta: {
              title: '菜单1-1'
            }
          },
          {
            name: 'Menu1-2',
            meta: {
              title: '菜单1-2'
            },
            children: [
              {
                name: 'Menu1-2-1',
                meta: {
                  title: '菜单1-2-1'
                }
              },
              {
                name: 'Menu1-2-2',
                meta: {
                  title: '菜单1-2-2'
                }
              }
            ]
          }
        ]
      },
      {
        name: 'Menu2',
        meta: {
          title: '菜单2'
        },
        children: [
          {
            name: 'test4',
            meta: {
              title: '子路由上级',
              icon: 'example'
            },
            children: [
              {
                name: 'test3',
                path: 'http://www.woxiugonghui.com/web/index.php?c=user&a=login&',
                meta: {
                  title: '子路由外链',
                  icon: 'link'
                }
              }

            ]
          },
          {
            name: 'test5',
            path: 'http://www.woxiugonghui.com/web/index.php?c=user&a=login&',
            meta: {
              title: '子路由外链2',
              icon: 'link'
            }
          }
        ]
      }
    ]
  },
  {
    name: 'test1', // 外链
    path: 'https://www.baidu.com', // 外链地址 必须
    meta: {
      title: '测试外链1' // 外链显示的名称
    }
  },
  {
    name: 'test2',
    path: 'https://www.baidu.com',
    meta: {
      title: '测试外链2'
    }
  },
  {
    name: 'external-link',
    meta: {
      title: '本地路由外链'
    }
  }
]
