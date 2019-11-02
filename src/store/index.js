import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 每次刚进入网站，肯定会调用main.js，刚调用时，从localstorage读取 wallet 如果没有，则赋值一个空数组
// var wallets = JSON.parse(localStorage.getItem('wallets') || '[]');

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
import state from './module-wallets/state'
import * as getters from './module-wallets/getters'
import * as mutations from './module-wallets/mutations'
import * as actions from './module-wallets/actions'

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    namespaced: false,
    getters,
    mutations,
    actions,
    state,
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
