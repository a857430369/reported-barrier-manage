
// 固话加手机
function checkPhone(phone) {
  // return (/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))
  return /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(phone)
}

// 手机
function checkMovePhone(phone) {
  return /^(1[3584]\d{9})$/.test(phone)
}

// 重置对象
function reset(obj) {
  Object.keys(obj).map(key => {
    if (typeof obj[key] == 'string') {
      obj[key] = ''
    } else if (Array.isArray(obj[key])) {
      obj[key] = []
    } else if (typeof obj[key] == 'number') {
      obj[key] = null
    }
  })
}