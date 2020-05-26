//导出路由
import Layout from '@/layout'
import * as customForm from './customForm'
import * as workOrder from './workOrder'
import * as notice from './notice'
import * as knowledge from './knowledge'


let obj = {
  customForm, workOrder, knowledge, notice
}

//路由加载方法
function load(component) {
  return resolve => require([`@/views/${component}`], resolve);
}

//添加路由方法
function addRoute() {
  Object.keys(obj).map(key => {
    Object.keys(obj[key]).map(keys => {
      routes.push(...obj[key][keys])
    })
  })
  routes.push({
    path: '/404',
    component: load('error-page/404'),
    hidden: true
  }, {
    path: '*',
    redirect: {
      path: '/'
    }
  })
}


//路由数组
const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
];
addRoute()
export default routes;
