<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round ><q-icon name="menu" />
        <q-menu self="top left">
          <q-list separator>
            <q-item v-for="(wallet, index) in wallets" :key="index" desne clickable v-ripple v-close-popup
              v-on:click="selectWallet(index)" >
              <q-item-section v-if="index == selectedWallet" avatar>
                <q-icon color="green" size="24px" name="check" />
              </q-item-section>
              <q-item-section v-else avatar />

              <q-item-section>
                <q-item-label> {{wallet.name}} </q-item-label>
                <q-item-label caption style="font-size: 12px; word-break:break-word;"> {{wallet.address}} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-toolbar-title><strong> 钱包信息</strong></q-toolbar-title>
    </q-toolbar>

    <div >
      <q-separator color="grey-3" />
      <div v-if="isWalletsEmpty" ><h4 style="text-align:center; color:red">请导入钱包</h4></div>
      <div v-else class='q-my-md' >
        <div class="text-grey-8">
            名称：<span>{{name}}</span>
            <br>
            地址：<span style="font-size: 12px; word-break:break-word;">{{address}}</span>
        </div>
        <div>
          <q-btn class="q-my-md" label="刷新余额" type="submit" unelevated color="grey-7" text-color="white"
            v-on:click="getAccountBalance()"/>
        </div>

        <q-separator color="grey-3" spaced />

        <div class="q-mt-sm" >
          <q-list separator>
            <!-- 显示墨客余额 -->
            <q-item clickable v-ripple to="/walletInfo/sendMoac/999">
              <q-item-section avatar>
                <q-avatar><img src="statics/icons/token-icons/moac-logo1.jpg" /></q-avatar>
              </q-item-section>
              <q-item-section >Moac</q-item-section>
              <q-item-section side>{{balance}}</q-item-section>
            </q-item>
            <!-- 显示其他币余额 -->

            <q-item v-for="(asset, index) in assetList" :key="index" clickable v-ripple :to="'/walletInfo/sendMoac/'+index" >
              <q-item-section v-if="asset.icon" avatar>
                <q-avatar > <img :src="asset.icon" /> </q-avatar>
              </q-item-section>
              <q-item-section v-else avatar>
                <q-avatar color="primary" text-color="white">
                  {{asset.letter}}
                </q-avatar>
              </q-item-section>
              <q-item-section >{{asset.symbol}}</q-item-section>
              <q-item-section side>{{asset.balance}}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import moacERC20ABI from './moacERC20ABI.js'
import TokenList from './tokenList.js'

export default {
  data () {
    return {
      isWalletsEmpty: this.$store.getters.isWalletsEmpty,
      name: this.$store.getters.name,
      address: this.$store.getters.address,
      balance: this.$store.getters.balance,
      assetList: this.$store.getters.assetList,

      selectedWallet: this.$store.getters.currentWallet,
      wallets: this.$store.getters.wallets
    }
  },
  created () {
    this.GLOBAL.showFooter = true
  },

  methods: {
    initWalletInfo () {
    },
    selectWallet (selection) {
      this.selectedWallet = selection
      this.$store.commit('selectWallet', selection)

      this.isWalletsEmpty = this.$store.getters.isWalletsEmpty
      this.name = this.$store.getters.name
      this.address = this.$store.getters.address
      this.balance = this.$store.getters.balance
      this.assetList = this.$store.getters.assetList
    },
    getAccountBalance () {
      if (!this.GLOBAL.isChain3Ready(this.GLOBAL.chain3, this)) return
      if (this.address === null || this.address === '') return

      this.$q.loading.show({
        message: '正在查询，请等待。。。'
      })
      var tokenList = TokenList.testnetTokens
      var address = this.address
      var chain3 = this.GLOBAL.chain3
      var that = this

      // 查询最新的账户余额，并且更新
      this.balance = this.GLOBAL.getMoacBalance(this.GLOBAL.chain3, this.address).toFixed(2)
      this.$store.commit('updateWallet', { balance: this.balance })

      this.assetList = []
      iterator(0)
      function iterator (i) {
        if (i === tokenList.length) {
          console.log('finished')
          that.$q.loading.hide()

          //  更新钱包信息
          that.$store.commit('updateWallet', { balance: that.balance, assetList: that.assetList })
          return
        }
        var contract = chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(tokenList[i].address)
        if (contract) {
          contract.balanceOf.call(address, (err, balBig) => {
            if (!err) {
              var balance = balBig.dividedBy(10 ** tokenList[i].decimals).toFixed(2)
              if (balance > 0) {
                that.assetList.push({
                  address: tokenList[i].address,
                  name: tokenList[i].name,
                  symbol: tokenList[i].symbol,
                  icon: tokenList[i].icon,
                  description: tokenList[i].description,
                  letter: tokenList[i].symbol.charAt(0),
                  totalSupply: tokenList[i].totalSupply,
                  decimals: tokenList[i].decimals,
                  balance: balance
                })
              }
            }
            iterator(i + 1)
          })
        }
      }
    }
  }
}
</script>
