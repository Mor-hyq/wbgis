import Layout from '@/layout'

const gis = {
  path: '/gis',
  name: 'Gis',
  component: Layout,
  meta: {
    level: '1',
    title: '机坪管线GIS',
    icon: 'svg-member',
    noCache: true
  },
  children: [
    {
      path: 'gisIndex',
      name: 'GisIndex',
      component: () => import('@/views/Gis/index'),
      meta: {
        level: '1-1',
        title: '机坪管线GIS',
        noCache: true
      }
    }
  ]

}

export default gis

