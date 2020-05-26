import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

const formHeaders = {
  'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

// 工作台
// 查询数量
export function getRecordNum() {
  return request({
    url: '/record/getRecordNum',
    headers: {
      'Content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    method: 'get'
  })
}

// 得到通知信息
export function getSystemNotices() {
  return request({
    url: '/notice/getSystemNotices',
    headers: jsonHeaders,
    method: 'get'
  })
}

// 得到资源
export function getDownloadFiles() {
  return request({
    url: '/file/getDownloadFiles',
    headers: jsonHeaders,
    method: 'get'
  })
}

// 得到知识库信息
export function getNoticesKnowledge() {
  return request({
    url: '/notice/getNoticesKnowledge',
    headers: jsonHeaders,
    method: 'get'
  })
}

function getUrlParam(params) {
  let paramStr = ''
  for (let key in params) {
    if (paramStr == '') {
      paramStr = (key + '=' + params[key])
    } else {
      paramStr = (paramStr + '&' + key + '=' + params[key])
    }
  }
  return paramStr
}

// 得到资源
export function getByDate(params) {
  return request({
    url: '/record/getByDate',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 查看用户信息
export function getUser() {
  return request({
    url: '/user/getUser',
    headers: jsonHeaders,
    method: 'get'
  })
}

// 修改用户状态
export function updateState(params) {
  return request({
    url: '/user/updateState',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}


// /user/updateState
export function getButAuthorityList (params) {
  return request({
    url: '/button/selectButtonAuthInfo',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}