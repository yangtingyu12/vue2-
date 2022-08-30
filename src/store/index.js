import Vue from 'vue'
import Vuex from 'vuex'
import { loginApi } from "@/api/user";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {} // 用户基本资料(默认从本地取)
  },
  getters: {
    //用户头像
    userPhoto(state) {
      return state.user.photo
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setRefreshToken(state, refreshToken) {
      state.refresh_token = refreshToken
      localStorage.setItem('refresh_token', refreshToken)
    },
    // ...
    setUser(state, userObj) {
      state.user = userObj
      localStorage.setItem('user', JSON.stringify(userObj))
    },
    //修改头像
    updatePhoto(state, photo) {
      state.user.photo = photo
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    updateName(state, theName) {
      state.user.name = theName
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {
    async asyncLoginAction(store, val) {
      try {
        const res = await loginApi(val)
        const { token, refresh_token } = res.data.data
        store.commit('setToken', token)
        store.commit('setRefreshToken', refresh_token)
        return Promise.resolve(res) // 返回成功的Promise对象
      } catch (err) {
        console.log("登录失败");
        return Promise.reject(err) // 返回失败的Promise对象
      }
    }
  },
  modules: {
  }
})
