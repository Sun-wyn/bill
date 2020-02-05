import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 左侧菜单设置
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [{
  //     path: 'dashboard',
  //     name: 'Dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: { title: 'Dashboard', icon: 'dashboard' }
  //   }]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/authorizationRecordQuery',
    name: '票据授权',
    meta: { title: '票据授权', icon: 'dashboard' },
    alwaysShow: true,
    children: [
      {
        path: 'authorizationRecordQuery',
        name: '授权记录查询',
        component: () => import('@/views/authorizationRecordQuery/index'),
        meta: { title: '授权记录查询', icon: 'table' }
      }
    ]
  },
  {
    path: '/medicalExpensesReimbursement',
    component: Layout,
    redirect: '/medicalExpensesReimbursement/billInformationQuery',
    name: '医疗费用报销',
    meta: { title: '医疗费用报销', icon: 'example' },
    children: [
      {
        path: 'billInformationQuery',
        name: '票据信息查询',
        component: () => import('@/views/billInformationQuery/index'),
        meta: { title: '票据信息查询', icon: 'table' }
      },
      {
        path: 'billReimbursementRegistration',
        name: '票据报销登记',
        component: () => import('@/views/billReimbursementRegistration/index'),
        meta: { title: '票据报销登记', icon: 'table' }
      },
      {
        path: 'billReimbursementStatistics',
        name: '票据报销统计',
        component: () => import('@/views/billReimbursementStatistics/index'),
        meta: { title: '票据报销统计', icon: 'table' }
      }
    ]
  },
  {
    path: '/historicalVisitInformation',
    component: Layout,
    redirect: '/historicalVisitInformation/visitInformationQuery',
    name: '历史就诊信息',
    meta: { title: '历史就诊信息', icon: 'form' },
    alwaysShow: true,
    children: [
      {
        path: 'visitInformationQuery',
        name: '就诊信息查询',
        component: () => import('@/views/visitInformationQuery/index'),
        meta: { title: '就诊信息查询', icon: 'table' }
      }
    ]
  },
  {
    path: '/billArchives',
    component: Layout,
    redirect: '/billArchives/billInformationQuery',
    name: '票据档案',
    meta: { title: '票据档案', icon: 'nested' },
    children: [
      {
        path: 'electronicBillQuery',
        name: '电子票据查询',
        component: () => import('@/views/electronicBillQuery/index'),
        meta: { title: '电子票据查询', icon: 'table' }
      },
      {
        path: 'electronicBillStatistics',
        name: '电子票据统计',
        component: () => import('@/views/electronicBillStatistics/index'),
        meta: { title: '电子票据统计', icon: 'table' }
      }
    ]
  },
  {
    path: '/systemManagement',
    component: Layout,
    redirect: '/systemManagement/userManagement',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'user' },
    children: [
      {
        path: 'userManagement',
        name: '用户管理',
        component: () => import('@/views/userManagement/index'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: 'roleManagement',
        name: '角色管理',
        component: () => import('@/views/roleManagement/index'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: 'licenseManagement',
        name: '授权管理',
        component: () => import('@/views/licenseManagement/index'),
        meta: { title: '授权管理', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
