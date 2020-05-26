import axios from 'axios'
import Qs from 'qs'
import store from '@/store/module/user'

let base = false ?
'http://cp.fsecity.com/xz/9e0f2d8926b/kefu/public/' :
'http://132.110.64.158:20180/17111kf/public/'

function getQs(param) {
  let data = ''
  Object.keys(param).map(key => {
    data = data + key + '/'
    param[key] && (data = data + param[key] + '/')
  })
  return data
}

// 客服上线
export function setUpKFData(param) {
  return axios.get(
    base + 'api/user/backstageLogin/' + getQs(param)
  )
}

// 客服下线
export function setDownKFData(param) {
  return axios.get(
    base + 'api/user/backstageLogout/' + getQs(param)
  )
}

// 获取后台客服（未读信息）
export function getNoReadNew(param) {
  let data = Qs.stringify(param)
  return axios.post(
    base + 'api/user/getMsgNum/',
    data
  )
}

// 获取客服管理的url
export function getSeller(param) {
  return axios.get(
    base + 'api/user/sellerLogin/' + getQs(param)
  )
}
