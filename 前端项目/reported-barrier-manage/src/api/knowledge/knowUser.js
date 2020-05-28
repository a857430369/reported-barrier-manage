import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
/**
 * 查询所有知识库分类---树形
 */
export function findAllTable(params) {
  return request({
    url: 'knowledge/findAllKnowledge',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
import querystring from 'querystring'
/**
 * 查询所有知识库分类---树形
 */
export function findAll(params) {
  return request({
    url: 'knowledge/findAllKnowledgeTree',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 首页获取知识库 
 */
export function findKnowledgeByNoticeName(params) {
  return request({
    url: 'notice/findKnowledgeByNoticeName?knowledgeCode='+params.knowledgeCode+'&noticeName='+params.noticeName+'&pageNumber=1&pageSize=20',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
 * 根据code查询知识库分类信息
 */
export function findByCode(params) {
  return request({
    url: 'knowledge/findKnowledgeByCode?knowledgeCode='+params,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
// 获取类数据
export function getDalei(code) {
  return request ({
    url: 'knowledge/findByPatherCode?patherCode='+code,
    method: 'POST',
    headers: jsonHeaders
  })
} 

// 获取知识库文章
export function findKnowledgeByUser(code) {
  return request ({
    url: '/notice/findKnowledgeByUser?knowledgeCode='+code,
    method: 'POST',
    headers: jsonHeaders
  })
} 
/**
 * 新增分类
 */
export function saveInfo(params) {
  return request({
    url: 'knowledge/saveInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 删除分类
 */
export function delInfo(params) {
  return request({
    url: 'knowledge/delInfo?knowledgeCode='+params,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 删除分类
 */
export function editInfo(params) {
  return request({
    url: 'knowledge/editInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}


