import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixins from './minxins';
import api from './api'
import storage from './utils/storage'
import 'css/base/base.less';
import 'element-ui/lib/theme-chalk/index.css';
//自定义element-ui主题样式
// import 'css/base/element_theme.scss';
import ElementUI from 'element-ui';
//引用Jquery
import $ from 'jquery';
import echarts from 'echarts'
//引入公共样式
import 'css/global.css'


Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
Vue.mixin(mixins);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$storage = storage

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
