import axios from 'axios'
import qs from 'qs'
const G = window.g
// var gaodeRestKey = 'a518e7a27f2e92697dd88f06206c6d4f'
var yrAxios = axios.create({
  baseURL: G.baseUrl,
  timeout: 3000
})
yrAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
yrAxios.defaults.withCredentials = true
var ctAxios = axios.create({
  baseURL: G.ctBaseURL,
  timeout: 3000
})
// POST传参序列化
yrAxios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  console.log('错误的传参')
  return Promise.reject(error)
})

// 返回状态判断
yrAxios.interceptors.response.use((res) => {
  if (!res.data.success) {
    return Promise.reject(res)
  }
  return res
}, (error) => {
  console.log('网络异常')
  return Promise.reject(error)
})
ctAxios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  console.log('错误的传参')
  return Promise.reject(error)
})
export function postFetch (url, params) {
  return new Promise((resolve, reject) => {
    yrAxios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
        .catch((error) => {
          reject(error)
        })
  })
}
export function ctGet (url, params) {
  return new Promise((resolve, reject) => {
    ctAxios.post(url, params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
//  根据经纬度计算2点之间的距离
const EARTH_RADIUS = 6378137.0  //  单位M
const PI = Math.PI
function getRad (d) {
  return d * PI / 180.0
}
function getDistance (lat1, lng1, lat2, lng2) {
  var f = getRad((lat1 + lat2) / 2)
  var g = getRad((lat1 - lat2) / 2)
  var l = getRad((lng1 - lng2) / 2)
  var sg = Math.sin(g)
  var sl = Math.sin(l)
  var sf = Math.sin(f)
  var s, c, w, r, d, h1, h2
  var a = EARTH_RADIUS
  var fl = 1 / 298.257
  sg = sg * sg
  sl = sl * sl
  sf = sf * sf
  s = sg * (1 - sl) + (1 - sf) * sl
  c = (1 - sg) * (1 - sl) + sf * sl
  w = Math.atan(Math.sqrt(s / c))
  r = Math.sqrt(s * c) / w
  d = 2 * w * a
  h1 = (3 * r - 1) / 2 / c
  h2 = (3 * r + 1) / 2 / s
  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}
export default {
  gaodeRestKey: G.gaodeRestKey,
  ip: G.ip,
  geo: G.geo,
  fileUrl: G.fileUrl,
  dtUrl: G.dtUrl,
  baseUrl: G.baseUrl,
  proUrl: G.proUrl,
  imgUrl: G.imgUrl,
  weatherImg: G.weatherImg,
  appid: G.appid,
  getDistance,
  GetCity (type, params) {
    return ctGet(`${type}`, params)
  },
  GetWeather (params) {
    return ctGet('weather/weatherInfo', params)
  },
  GetCityInfo (params) {
    return postFetch('getCityByCode.do', params)
  },
  GetScenicList (params) {
    return postFetch('spotlist.do', params)
  },
  GetCityLists (params) {
    return postFetch('areas.do', params)
  },
  GetScnDetail (params) {
    return postFetch('scenic/detail.do', params)
  },
  GetScnDataByType (params) {
    return postFetch('scenic/pois.do', params)
  },
  GetPoiDetail (params) {
    return postFetch('scenic/poiDetail.do', params)
  },
  GetProduct (params) {
    return postFetch('scenic/baseinfo.do', params)
  },
  PayOrder (params) {
    return postFetch('order/submit.do', params)
  },
  GetPayStatus (params) {
    return postFetch('order/payStatus.do', params)
  },
  GetOrder (params) {
    return postFetch('order/getOrder.do', params)
  },
  GetAccessToken (params) {
    return postFetch('codeActive.do', params)
  },
  Feedback (params) {
    return postFetch('feedback/report.do', params)
  },
  GetSpotByCode (params) {
    return postFetch('spotByCode.do', params)
  },
  GetBooknotice () {
    return postFetch('booknotice.do')
  },
  GetDiscount (params) {
    return postFetch('order/discount.do', params)
  },
  GetLine (params) {
    return postFetch('tourroute/list.do', params)
  },
  GetLineDt (params) {
    return postFetch('tourroute/detail.do', params)
  },
  GetRoutePath (params) {
    return postFetch(`${G.pathRoute}getRoutePath.do`, params)
  },
  GetTGlist (params) {
    return postFetch('travelGuide/list.do', params)
  },
  GetTGdetail (params) {
    return postFetch('travelGuide/detail.do', params)
  },
  //  获得浏览器版本信息
  getVersion () {
    let u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('iPhone') > -1 || u.indexOf('iPad') > -1) {
      if (u.indexOf('MicroMessenger') > -1) {
        return 'wx'
      }
      return 'mobile'
    } else {
      return 'web'
    }
  },
  // 获取微信浏览器网络状态
  getNetType () {
    let u = navigator.userAgent
    if (u.indexOf('NetType/WIFI') > -1) {
      return 'WIFI'
    } else {
      return null
    }
  },
  //  获取定位信息
  getPosition (successFun, errorFun) {
    let u = navigator.geolocation
    if (u) {
      u.getCurrentPosition((position) => {
        //  获取
        let coords = position.coords
        successFun(coords)
      }, (err) => {
        errorFun(err)
      }, {})
    }
  },
  GetWeatherImg (weather) {
    var img = 'a0.png'
    switch (weather) {
      case '晴':
        img = 'a0.png'
        break
      case '多云':
        img = 'a1.png'
        break
      case '阴':
        img = 'a2.png'
        break
      case '阵雨':
        img = 'a3.png'
        break
      case '雷阵雨':
        img = 'a4.png'
        break
      case '雷阵雨并伴有冰雹':
        img = 'a5.png'
        break
      case '雨夹雪':
        img = 'a6.png'
        break
      case '小雨':
        img = 'a7.png'
        break
      case '中雨':
        img = 'a8.png'
        break
      case '大雨':
        img = 'a9.png'
        break
      case '暴雨':
        img = 'a10.png'
        break
      case '大暴雨':
        img = 'a11.png'
        break
      case '特大暴雨':
        img = 'a12.png'
        break
      case '阵雪':
        img = 'a13.png'
        break
      case '小雪':
        img = 'a14.png'
        break
      case '中雪':
        img = 'a15.png'
        break
      case '大雪':
        img = 'a16.png'
        break
      case '暴雪':
        img = 'a17.png'
        break
      case '雾':
        img = 'a18.png'
        break
      case '冻雨':
        img = 'a19.png'
        break
      case '沙尘暴':
        img = 'a20.png'
        break
      case '小雨-中雨':
        img = 'a21.png'
        break
      case '中雨-大雨':
        img = 'a22.png'
        break
      case '大雨-暴雨':
        img = 'a23.png'
        break
      case '暴雨-大暴雨':
        img = 'a24.png'
        break
      case '中大暴雨-特大暴雨':
        img = 'a25.png'
        break
      case '小雪-中雪':
        img = 'a26.png'
        break
      case '中雪-大雪':
        img = 'a27.png'
        break
      case '大雪-暴雪':
        img = 'a28.png'
        break
      case '浮尘':
        img = 'a29.png'
        break
      case '扬沙':
        img = 'a30.png'
        break
      case '强沙尘暴':
        img = 'a31.png'
        break
      case '飑':
        img = 'a32.png'
        break
      case '龙卷风':
        img = 'a33.png'
        break
      case '弱高吹雪':
        img = 'a34.png'
        break
      case '轻雾':
        img = 'a35.png'
        break
      case '霾':
        img = 'a53.png'
        break
    }
    return img
  }
}
