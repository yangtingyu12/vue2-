// 请求封装库
import axios from "axios"
import store from "@/store/"
import router from '@/router'
import { refreshTokenAPI } from '@/api'
const repuest = axios.create({
  baseURL: "http://toutiao.itheima.net" // 基础路径
})

// 添加响应拦截器
repuest.interceptors.response.use(function (response) { // 当状态码为2xx/3xx开头的进这里
  // 对响应数据做点什么
  console.log('响应成功', response)
  return response
}, async function (error) { // 响应状态码4xx/5xx进这里
  // 对响应错误做点什么
  console.dir(error)
  if (error.response.status === 401) { // 身份过期
    // token续签方式1:  去登录页重新登录, token无用, 清掉-确保路由守卫if进不去

    // store.commit('setToken', '')
    // router.push({ path: `/login?path=${router.currentRoute.fullPath}` })

    // token续签方式2: refreshToken(用户无感知)
    // store.commit('setToken', '')

    const res = await refreshTokenAPI()
    if (res.data.data.token) {
      //方式二续签
      store.commit('setToken', res.data.data.token)
      // 再调用一次未完成的请求啊(用户无感知)
      // error.config 就是上一次axios请求的配置对象
      // console.dir(error.config)
      // 把新的token赋予到下一次axios请求的请求头中
      error.config.headers.Authorization = 'Bearer ' + res.data.data.token
      // return到await的地方
      return ajax(error.config)
    }
    // console.log('@',res.data.data.token);


  }else if(error.response.data.message==='refresh_token失效'){
    //方式一续签
    alert('登录已过期，请重新登录')
    store.commit('setToken', '')
    router.push({ path: `/login?path=${router.currentRoute.fullPath}` })
  }
   else {
    return Promise.reject(error)
  }
})

// 添加请求拦截器
repuest.interceptors.request.use(function (config) {
  console.log('发送请求成功', config);
  // 在发送请求之前做些什么, 如果vuex里有token携带在请求头中
  if (store.state.token.length > 0 && config.headers.Authorization === undefined) {
    // 发起请求之前, 把token携带在请求头上(表明自己身份)
    config.headers.Authorization = 'Bearer ' + store.state.token

  }
  return config
}, function (error) {
  // 对请求错误做些什么 
  return Promise.reject(error)
})


export default repuest