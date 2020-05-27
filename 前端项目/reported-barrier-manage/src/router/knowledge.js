//路由加载方法
function load(component) {
  return resolve => require([`@/views/${component}`], resolve);
}

//路由数组
const routes = [
  {
    path: '/knowlegdeEdit',
    component: () => import('@/views/knowledge/knowEdit')
  },
];

export default routes;
