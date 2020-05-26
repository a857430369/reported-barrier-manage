import request from '@/utils/request'
import queryStr from 'querystring'

const formHeaders = {
  'Content-type': 'application/x-www-form-urlencoded',
}

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

export function uploadFile(file, params) {
  let str = queryStr.stringify(params)
  return request({
    url: `/file/uploadFile?${str}`,
    headers: formHeaders,
    method: 'post',
    data: file
  })
}

export function downloadFile(params) {
  let str = queryStr.stringify(params)
  return request({
    url: `/file/downloadFile?${str}`,
    headers: jsonHeaders,
    method: 'post',
    responseType: 'blob'
  })
}
