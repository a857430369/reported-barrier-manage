export function getDayStartEnd (time) {
  return {
    startTime: time.getFullYear() + '-' + ('0' + (time.getMonth() + 1)).slice(-2) + '-' + time.getDate() + ' 00:00:00',
    endTime: time.getFullYear() + '-' + ('0' + (time.getMonth() + 1)).slice(-2) + '-' + time.getDate() + ' 23:59:59',
  }
}

// 防抖
export function debounce(func, time) {
  window['timer'] == undefined && (window['timer'] = 0)
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    func()
  }, time)
}

// 节流
export function throttle() {
  
}