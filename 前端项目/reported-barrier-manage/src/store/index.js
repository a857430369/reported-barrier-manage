import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production';

import demo from './module/demo';
import user from './module/user'
import breadcrumb from './module/Breadcrumb'

export default new Vuex.Store({
  strict: debug,
  state: {
    tip: '欢迎使用Vuex'
  },
  getters: {
    tip: state => state.tip,
  },
  mutations: {
    SET_TIP(state, data) {
      state.tip = data;
    }
  },
  actions: {

  },
  modules: {
    demo,
    user,
    breadcrumb
  }
})
