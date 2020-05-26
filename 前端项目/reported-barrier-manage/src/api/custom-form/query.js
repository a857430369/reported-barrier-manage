import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

//queryForm
// 确认表单
export function confirmNeedPlanAcc(params) {
  return request({
    url: '/planAcc/confirmNeedPlanAcc',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 填写审核
export function updateNeedPlanAcc(params) {
  return request({
    url: '/planAcc/updateNeedPlanAcc',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 根据表单formCode查询字段填写的内容
export function listNeedValueByFormCode(params) {
  return request({
    url: '/value/listNeedValueByFormCode',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// power权限
/*  权限  */
export function insertAuthorize(params) {
  return request({
    url: '/authorize/insertAuthorize',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
export function updateAuthorize(params) {
  return request({
    url: '/authorize/updateAuthorize',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

