//路由加载方法
function load(component) {
  return resolve => require([`@/views/${component}`], resolve);
}

let router = [
  {
    path: '/cf-test',
    component: () => import('@/views/work-desk/test')
  }, {
    path: '/workdesk',
    component: () => import('@/views/work-desk/index')
  }, {
    path: '/cf-classify',
    component: () => import('@/views/custom-form/classify/index')
  }, {
    path: '/cf-test',
    component: () => import('@/views/custom-form/components/itemComp')
  }, {
    path: '/cf-write',
    component: () => import('@/views/custom-form/write-form/write')
  }, {
    path: '/cf-plan',
    component: () => import('@/views/custom-form/deploy-form/plan'),
  }, {
    path: '/cf-deploy',
    component: () => import('@/views/custom-form/deploy-form/deploy'),
  }, {
    path: '/cf-formManage',
    component: () => import('@/views/custom-form/manage/queryManage'),
  }, {
    path: '/cf-index',
    component: () => import('@/views/custom-form/manage/index'),
  }
]

export {
  router
}