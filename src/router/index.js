import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout' // 这里默认打开首页(layout页下的home)
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/layout',
    name: 'Layout',
    redirect: '/layout/home', // 默认显示二级页面为home首页
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Layout/Home')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/Layout/user')
      }
    ]

  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search')

  },
  {
    path: '/search/:keywords',
    name: 'SearchResult',
    component: () => import('@/views/Search/SearchResult')
  },
  // ...
  {
    path: '/article_detail',
    component: () => import('@/views/ArticleDetail')
  },
  {
    path: '/chat',
    component: ()=>import('@/views/Chat/')
  },
  {
    path: '/user_editor',
    component: ()=>import('@/views/Layout/user/UserEdit')
  }


]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 有token, 不能去登录页
  // 无token, 需要用户"权限"的才需要去登录页
  if (store.state.token.length > 0 && to.path === '/login') {
    // 证明有token-已经登录了
    alert('您已经登录了，请先退出登录')
    next(false) // 阻止跳转原地呆着
  } else {
    next()
  }
})

export default router
