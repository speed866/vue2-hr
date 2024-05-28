import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: '/employee/detail/:id?',
    component: () => import('@/views/employee/Detail.vue'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }]
}
