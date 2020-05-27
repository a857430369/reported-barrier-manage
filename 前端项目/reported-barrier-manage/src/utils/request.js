import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui';
import storage from './storage'

export const isTest = true
const service = axios.create({
  // baseURL: 'http://132.110.64.159:20580/api/',
  baseURL: isTest ? 'http://127.0.0.1:8082/api/' : 'http://132.110.64.161:30001/kftd/yzmh/api/',
  timeout: 10000
})
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request interceptor 98EBFB5DBAAC770EE053470D7C841992  98EAEF948B52F1EAE053470D7C843E12  A5203B72F5F628EFE053470D7C848665
service.interceptors.request.use(
  config => {
    //config.headers['userCode'] = isTest ? '98EBFB5DBAAC770EE053470D7C841992' : storage.getSession('account').operCode
    if (isTest) {
      config.headers['userCode'] = 'A5203B72F5F628EFE053470D7C848665'
    } else {
      const token = storage.getSession('token')
      const accout = storage.getSession('account')
      if (token && accout) {
        config.headers['token'] = token
      } else {
        router.push({ path: '/404' })
      }
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.config.responseType === 'blob') {
      return response
    }
    const res = response.data;

    if (res.code && res.code == 1) {
      Message({
        message: res.err_msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      });
      return Promise.reject(new Error(res.err_msg || 'Error'));
    } else if (res.code && res.code == 10001) {
      console.error(res.err_msg)
      return Promise.reject(new Error(res.err_msg || 'Error'));
    } else {
      if (res.code && res.code !== 0 && res.code !== 1) {
        Message({
          message: res.err_msg || '服务器异常，请稍后重新刷新!',
          type: 'error',
          duration: 3 * 1000
        });
        return Promise.reject(new Error(res.err_msg || 'Error'));
      } else {
        return res;
      }
    }
  },
  error => {
    Message({
      message: '网络异常，请检查网络连接!',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
