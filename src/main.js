import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import '@/styles/index.less'
import hljs from 'highlight.js' // hljs对象
import 'highlight.js/styles/default.css' // 代码高亮的样式
 
// 加载 Vant 核心组件库
import Vant from 'vant'
// 加载 Vant 全局样式
import 'vant/lib/index.css'

//全局自定义指令
import diretivesObj from '@/utils/directives'
//注册分割线组件, 在main.js
import { Divider } from 'vant'
Vue.use(Divider)

Vue.use(diretivesObj)

Vue.config.productionTip = false
Vue.use(Vant);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
