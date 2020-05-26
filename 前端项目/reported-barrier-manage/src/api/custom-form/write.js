import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

// 新增模板字段
export function insertPlanAcc(params) {
  return request({
    timeout: 15000,
    url: '/planAcc/insertPlanAcc',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 查询附件
export function fileInfo(params) {
  return request({
    url: '/file/fileInfo',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}