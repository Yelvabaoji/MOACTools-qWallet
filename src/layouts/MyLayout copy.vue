<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated> -->
    <q-header>
      <q-toolbar class="bg-white text-black">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title >
          <strong> {{ title }} </strong>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>菜单选项</q-item-label>
        <q-item clickable v-ripple to="/walletInfo"
          :active="link === 'walletInfo'"
          @click="link = 'walletInfo'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-avatar size="32px"><img src="statics/icons/moac-logo1.jpg" /></q-avatar>
          </q-item-section>
          <q-item-section>钱包信息</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/selectWallet"
          :active="link === 'selectWallet'"
          @click="link = 'selectWallet'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="orange" size="32px" name="account_balance_wallet" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>选择钱包</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/createWallet"
          :active="link === 'createWallet'"
          @click="link = 'createWallet'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="orange" size="32px" name="account_balance_wallet" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>创建新钱包</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/deleteWallet"
          :active="link === 'deleteWallet'"
          @click="link = 'deleteWallet'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="orange" size="32px" name="account_balance_wallet" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>删除钱包</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/fromPrivateKey"
          :active="link === 'fromPrivateKey'"
          @click="link = 'fromPrivateKey'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="green" size="32px" name="vpn_key" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>从私钥选择钱包</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/fromKeystore"
          :active="link === 'fromKeystore'"
          @click="link = 'fromKeystore'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="green" size="32px" name="lock_open" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>从keystore选择钱包</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/backupPrivateKey"
          :active="link === 'backupPrivateKey'"
          @click="link = 'backupPrivateKey'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="blue" size="32px" name="vpn_key" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>导出私钥</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/backupKeystore"
          :active="link === 'backupKeystore'"
          @click="link = 'backupKeystore'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="blue" size="32px" name="lock" />
            <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
          </q-item-section>
          <q-item-section>导出keystore</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/qWalletHelp"
          :active="link === 'qWalletHelp'"
          @click="link = 'qWalletHelp'"
          v-on:click="selectMenu()"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="blue" size="32px" name="help" />
          </q-item-section>
          <q-item-section>帮 助</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container style="padding-top: 50px">
      <router-view />
    </q-page-container>

    <q-footer reveal class="bg-grey-1 text-blue-grey-5 shadow-2">
      <q-tabs v-model="tab" align="justify" dense
        indicator-color="transparent"
        active-color="blue"
      >
        <q-route-tab to="/walletInfo" name="wallet" icon="account_balance_wallet" label="资产" exact
        />
        <q-route-tab to="/createWallet" name="search" icon="find_in_page" label="发现" exact
        />
        <q-route-tab to="/myProfile" name="person" icon="person" label="我的" exact
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
      leftDrawerOpen: false,
      link: 'walletInfo',
      title: '钱包信息'
    }
  },
  created () {
    // 从localstorage读取钱包列表
    this.$store.commit('readWalletsFromStorage')

    this.selectMenu()
  },
  mounted () {
  },
  methods: {
    selectMenu () {
      switch (this.link) {
        case 'walletInfo':
          this.title = '钱包信息'
          break
        case 'selectWallet':
          this.title = '选择钱包'
          break
        case 'sendMoac':
          this.title = '转账'
          break
        case 'createWallet':
          this.title = '创建钱包'
          break
        case 'deleteWallet':
          this.title = '删除钱包'
          break
        case 'fromPrivateKey':
          this.title = '从私钥导入钱包'
          break
        case 'fromKeystore':
          this.title = '从Keystore导入钱包'
          break
        case 'backupPrivateKey':
          this.title = '导出私钥钱包'
          break
        case 'backupKeystore':
          this.title = '导出Keystore'
          break
        case 'qWalletHelp':
          this.title = '帮助'
          break
      }
    }
  }
}
</script>

<style lang="stylus">
.my-menu-link
  color white
  background-color grey
  // font-weight bold
</style>
