export const checkFaultType = (type) => {
  let txt = "";
  switch (type) {
    case 1:
      txt = "传感器"
      break;
  
    case 2:
      txt = "云台"
      break;
  
    case 3:
      txt = "摄像头"
      break;
  
    default:
      break;
  }
  return txt;
};


/**
 * 清空token
 */
export const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenTime");
  localStorage.removeItem("userRole");
}

/**
 * 判断token过期时间
 * @returns Boolean
 */
export const tokenExpressInTime = () => {
  const date = new Date()
  const tokenTime = localStorage.getItem('tokenTime') || sessionStorage.getItem("tokenTime");
  console.log('tokenTime :>> ', tokenTime);
  // 大于0: token过期返回true 否则返回false
  return (date.getTime() - Number(tokenTime)) > 0 ? true : false
}

export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.call(this, ...args)
    }, delay);
  }
}


