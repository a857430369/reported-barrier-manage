import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

// 字段 filed

// 编辑模板字段
export function updateModelFiled(params) {
  return request({
    url: '/modelFiled/updateModelFiled',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//根据模板code查询模板字段
export function getFiledByModelId(params) {
  return request({
    url: '/modelFiled/listModelFiled',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 节点人员 plan
export function checkUser(params) {
  return request({
    url: '/tree/checkUser',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 检查节点是否重复
export function checkNodeName(params) {
  return request({
    url: '/tree/checkNodeName',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

//根据模板code获取流程对象
export function getPlan(params) {
  return request({
    url: '/plan/getPlan',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//添加流程
export function insertPlan(params) {
  return request({
    url: '/plan/insertPlan',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//根据流程code获取节点集合
export function listNeedTree(params) {
  return request({
    url: '/tree/listNeedTree',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//添加节点
export function insertNeedTree(params) {
  return request({
    url: '/tree/insertNeedTree',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 获取父code节点集合
export function getNeedTree(params) {
  return request({
    url: '/tree/getNeedTree',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

//更新流程
export function updatePlan(params) {
  return request({
    url: '/plan/updatePlan',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//更新节点
export function updateNeedTree(params) {
  return request({
    url: '/tree/updateNeedTree',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 删除节点
export function deleteNeedTree(params) {
  return request({
    url: '/tree/deleteNeedTree',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}


// 验证 verify
/*  查询是否授权  */
export function checkAuthorize(params) {
  return request({
    url: '/authorize/checkAuthorize',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
/*  查看所有的历史记录  */
export function listNeedHistory(params) {
  return request({
    url: 'needHistory/listNeedHistory',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
/*  意见的接口修改  */
export function updateCommonLanguage(params) {
  return request({
    url: '/language/updateCommonLanguage',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
/*  意见的接口列表  */
export function listCommonLanguage(params) {
  return request({
    url: '/language/listCommonLanguage',
    headers: jsonHeaders,
    method: 'post',
    data: params
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

// 文件
/* 导出节点模板 */
export function exportTrees(params) {
  return request({
    url: `/tree/exportTrees?${getUrlParam(params)}`,
    headers: jsonHeaders,
    method: 'get',
    responseType: 'blob'
  })
}

/* 导出节点数据 */
export function exportTreesData(params) {
  return request({
    url: `/tree/exportTreesData?${getUrlParam(params)}`,
    headers: jsonHeaders,
    method: 'get',
    responseType: 'blob'
  })
}

/* 导入数据 */
export function importTrees(params, modelCdde) {
  return request.post(`/tree/importTrees?modelCode=${modelCdde}`, params, {
    responseType: 'blob'
  })
}
