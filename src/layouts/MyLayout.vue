<template>
  <q-layout view="lHh Lpr lFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-show="GLOBAL.showFooter" reveal class="bg-grey-1 text-blue-grey-5 shadow-2">
      <q-tabs v-model="tab" align="justify" dense
        indicator-color="transparent"
        active-color="blue"
      >
        <q-route-tab to="/walletInfo"
            name="wallet" icon="account_balance_wallet" label="资产" exact
        />
        <q-route-tab to="/dappList"
            name="search" icon="find_in_page" label="发现" exact
        />
        <q-route-tab to="/myProfile"
            name="person" icon="person" label="我的" exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',
  data () {
    return {
      tab: 'wallet',
      link: 'walletInfo'
    }
  },
  created () {
    // 从localstorage读取钱包列表
    this.$store.commit('readWalletsFromStorage')
  }
}
</script>

<style lang="stylus">
</style>
