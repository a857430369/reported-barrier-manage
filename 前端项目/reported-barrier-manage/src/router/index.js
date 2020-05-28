import Vue from 'vue';
import Router from 'vue-router'
import routes from './routes';
import store from '@/store'
Vue.use(Router)

//路由配置
const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 }
    }
  }
});

export const whiteList = ['/workDesk/allPool', '/workDesk/pendingPool', '/workDesk/parameter', '/workDesk/classify', '/workDesk/employeesList', '/workDesk/workorderList', '/workDesk/cf-deployManage',
  '/workDesk/noticeSee', '/workDesk/download', '/workDesk/noticeShow', '/workDesk/upload', '/workDesk/knowlegdeUser', '/workDesk/knowManage', '/workDesk/knowledgeShow', '/workDesk/annoucementShow'
]
//悬浮球配置
// let fm = new FloatModule({
//   animation: 'spring-in',
//   position: 'left-bottom',
//   btn_config: [
//     {
//       icon: 'fa fa-share-alt',
//     },
//     {
//       icon: 'fa fa-home',
//       title: '返回工作台',
//       click: toPath,
//     },
//   ],
// });

// function toPath() {
//   router.push({
//     path: '/workDesk',
//   })
// }

//导航前置守卫
router.beforeEach((to, from, next) => {
  //修改面包屑的显示状态
  const path = to.path
  const type = to.query.type
  if (type && whiteList.includes(path)) {
    //设置为true
    store.commit('setFlag', true)
  } else {
    //设置为false
    store.commit('setFlag', false)
  }
  next();
});

//导航后置守卫
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

export default router;
