<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong>转账</strong></q-toolbar-title>
      <q-btn v-if="id!=999" flat round dense icon="info" :to="'/walletInfo/tokenInfo/'+id"></q-btn>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <div v-if="id==999" class="q-my-md text-grey-8">
        地址：<span style="font-size: 12px">{{address}}</span>
        <p>余额：{{String(balance.toString()).replace(/^(-?)(\d+)((\.\d+)?)$/,
          function (s, s1, s2, s3) {return s1 + s2.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') + s3})
        }} (moac)</p>
    </div>
    <div v-else class="q-my-md text-grey-8">
        代币：{{assetList[id].symbol}}
        <p>余额：{{String(assetList[id].balance.toString()).replace(/^(-?)(\d+)((\.\d+)?)$/,
          function (s, s1, s2, s3) {return s1 + s2.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') + s3})
        }} (moac)</p>
    </div>

    <q-separator color="grey-3"  />
    <div class='q-mt-md q-mb-none text-grey-8'>目标地址</div>
    <q-input class='mt-none q-mb-none' filled v-model="toAddress"
      label="输入42位0x开头的钱包地址"
      clearable clear-icon="close"
      counter maxlength="42" lazy-rules
      :rules="[ val => val != null && val.length == 42 || '长度不对']"
    >
    </q-input>

    <q-input class='q-mt-xs q-mb-md' filled v-model.number="amount"
      label="输入转账金额"
      clearable clear-icon="close"
      type="number" step="0.000000001" lazy-rules
    >
    </q-input>

    <inputPassword :msg="'钱包密码，最少9位字符'" @getPassword='getPassword'></inputPassword>

    <q-btn class="fit q-my-md" label="提交转账" type="submit" color="primary"
      v-on:click="doTransition()" />

    <!-- 转账提交后 -->
    <div v-if="txStatus != ''">
      <p v-bind:class="[txStatus=='完成' ? 'text-green-9' : 'text-grey-8']">
        <strong>交易状态：{{txStatus}}  </strong>
        <q-circular-progress v-if="txStatus =='交易进行中...'"
          indeterminate
          size="32px"
          :thickness="1"
          color="grey-8"
          track-color="lime"
          class="q-ma-md"
        />
        <!-- <q-icon name="autorenew" class="text-primary" style="font-size: 2.0em;" v-on:click="onReflush()" /> -->
      </p>
      <p class="text-grey-8" style="word-break:break-word;">txHash：{{txHash}}</p>
    </div>

  </q-page>
</template>

<style>
</style>

<script>
import keythereum from 'keythereum'
import inputPassword from '../components/inputPassword'

export default {
  data () {
    return {
      id: this.$route.params.id, // 将 URL 中传递过来的 id 值，挂载到 data上
      address: this.$store.getters.address,
      balance: this.$store.getters.balance,
      amount: 0,
      password: '',

      toAddress: '',
      toBalance: 0,

      txStatus: '',
      txHash: '',

      assetList: this.$store.getters.assetList

    }
  },
  created () {
    this.GLOBAL.showFooter = false
  },
  components: {
    'inputPassword': inputPassword
  },
  methods: {
    // ****************************************************
    getPassword (password) {
      this.password = password
    },

    doTransition () {
      // 检查地址是否正确
      if (!this.GLOBAL.isAddressGood(this, this.toAddress)) return
      if (this.address === this.toAddress) {
        return this.GLOBAL.alertMsg(this, '转出地址和当前地址相同')
      }
      if (this.password === '' || this.password.length < 4) {
        return this.GLOBAL.alertMsg(this, '密码长度不对')
      }

      if (!this.GLOBAL.isChain3Ready(this.GLOBAL.chain3, this)) return
      if (this.id === '999') {
        this.sendMoac()
      } else {
        this.sendErc20Token()
      }
    },
    newTxLog (txHash, txStatus) {
      return {
        txHash: txHash,
        txStatus: txStatus
      }
    },
    sendMoac () {
      // 查询最新的账户余额，余额可能会有变化但是不更新store里的内容了，太麻烦了。
      this.balance = this.GLOBAL.getMoacBalance(this.GLOBAL.chain3, this.address).toFixed(2)
      // this.$store.commit('updateWallet', { balance: this.balance })

      if (this.balance <= this.amount + 0.0025) {
        return this.GLOBAL.alertMsg(this, '账户里没有足够的墨客')
      }
      var chain3 = this.GLOBAL.chain3
      var that = this

      try {
        var pKeyBuffer = keythereum.recover(this.password, JSON.parse(this.$store.getters.keystore))
        this.privateKey = pKeyBuffer.toString('hex')

        this.$q.dialog({ title: '确定',
          message: '你确定要进行转账吗？',
          cancel: '取消',
          ok: '确定',
          persistent: false
        }).onOk(() => {
          // 准备签名
          var rawTx = {
            'from': that.address,
            'to': that.toAddress,
            'nonce': chain3.intToHex(chain3.mc.getTransactionCount(that.address)),
            'gasPrice': chain3.intToHex(25000000000),
            'gasLimit': chain3.intToHex(100000),
            'value': chain3.intToHex(chain3.toSha(that.amount, 'mc')),
            'chainId': chain3.version.network
          }
          var signedTx = chain3.signTransaction(rawTx, that.privateKey)
          chain3.mc.sendRawTransaction(signedTx, function (error, txHash) {
            if (error) {
              console.log(error)
              that.txHash = '错误：' + error
              that.txStatus = '错误' + error
              return this.GLOBAL.alertMsg(that, '转账错误\n.' + error)
            }
            console.log('txHash', txHash)
            that.txHash = txHash
            that.txStatus = '交易进行中...'

            // 等待打包完成交易
            var filter = chain3.mc.filter('latest')
            filter.watch(function (err, result) {
              if (err) {
                that.txStatus = '错误' + err
                return this.GLOBAL.alertMsg(that, '交易错误\n.' + error)
              }
              var receipt = chain3.mc.getTransactionReceipt(txHash)
              if (receipt && receipt.blockNumber != null) {
                console.log(receipt)

                filter.stopWatching()
                that.txStatus = '完成'

                // 查询最新的账户余额，并且更新
                that.balance = that.GLOBAL.getMoacBalance(that.GLOBAL.chain3, that.address).toFixed(2)
                that.$store.commit('updateWallet', { balance: that.balance })

                process.exit(0)
              }
            })
          })
        })
      } catch (err) {
        return this.GLOBAL.alertMsg(this, '错误，可能密码有误 !')
      }
    },
    newToken (token) {
      return {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        icon: token.icon,
        description: token.description,
        letter: token.symbol.charAt(0),
        totalSupply: token.totalSupply,
        decimals: token.decimals,
        balance: token.balance
      }
    },
    async sendErc20Token () {
      // 查询最新的账户余额
      this.balance = this.GLOBAL.getMoacBalance(this.GLOBAL.chain3, this.address).toFixed(2)
      if (this.balance <= 0.0025) {
        return this.GLOBAL.alertMsg(this, '账户里没有足够的墨客')
      }

      var chain3 = this.GLOBAL.chain3
      var that = this

      // 不能涉及到原来store里面的内容的修改，所以，生成一个选定token的拷贝，
      var token = this.newToken(this.assetList[this.id])

      // 获取ERC20代币的余额. 余额可能会有变化，但是就不更新store里的内容了，太麻烦了
      var bal = await this.GLOBAL.getTokenBalance(chain3, token.address, this.address, token.decimals)
      token.balance = bal.toFixed(2)

      if (token.balance <= this.amount) {
        return this.GLOBAL.alertMsg(this, '账户里没有足够的ERC20代币')
      }

      try {
        var pKeyBuffer = keythereum.recover(this.password, JSON.parse(this.$store.getters.keystore))
        this.privateKey = pKeyBuffer.toString('hex')

        this.$q.dialog({ title: '确定',
          message: '你确定要进行转账吗？',
          cancel: '取消',
          ok: '确定',
          persistent: false
        }).onOk(() => {
          // 准备签名
          var contract = that.GLOBAL.getContract(chain3, token.address)
          var data = contract.transfer.getData(that.toAddress, that.amount * (10 ** token.decimals))

          var rawTx = {
            'from': that.address,
            'to': token.address,
            'nonce': chain3.intToHex(chain3.mc.getTransactionCount(that.address)),
            'gasPrice': chain3.intToHex(25000000000),
            'gasLimit': chain3.intToHex(100000),
            'value': 0,
            'data': data,
            'chainId': chain3.version.network
          }
          var signedTx = chain3.signTransaction(rawTx, that.privateKey)
          chain3.mc.sendRawTransaction(signedTx, function (error, txHash) {
            // that.$q.loading.hide()
            that.txStatus = '等待...'
            if (error) {
              console.log(error)
              that.txHash = '错误：' + error
              that.txStatus = '错误：' + error
              return this.GLOBAL.alertMsg(that, '转账错误\n.' + error)
            }
            console.log('txHash', txHash)
            that.txHash = txHash
            that.txStatus = '交易进行中...'

            // 等待打包完成交易
            var filter = chain3.mc.filter('latest')
            filter.watch(function (err, result) {
              if (err) {
                that.txStatus = '错误' + err
                return this.GLOBAL.alertMsg(that, '交易错误\n.' + error)
              }
              var receipt = chain3.mc.getTransactionReceipt(txHash)
              if (receipt && receipt.blockNumber != null) {
                console.log(receipt)

                filter.stopWatching()
                that.txStatus = '完成'

                // 查询最新的账户余额，并且更新
                that.balance = that.GLOBAL.getMoacBalance(chain3, that.address).toFixed(2)
                token.balance -= that.amount
                // 更新钱包存储信息 - 钱包balance & 当前资产的balance
                that.$store.commit('updateWalletAndAssetBalance', { balance: that.balance, assetId: that.id, token: token })

                process.exit(0)
              }
            })
          })
        })
      } catch (err) {
        return this.GLOBAL.alertMsg(this, '错误，可能密码有误 !')
      }
    },

    // ****************************************************
    // ****************************************************
    onReflush () {
      if (this.txStatus !== '交易进行中...') return

      var that = this

      this.$q.loading.show({
        message: '刷新。。。'
      })
      this.GLOBAL.chain3.mc.getTransaction(that.txHash, function (err, result) {
        if (!err) {
          if (result.blockNumber != null) {
            that.txStatus = '完成'
          } else {
          }
        } else {
          that.status = '错误'
        }
        that.$q.loading.hide()
      })
    }
  }
}
</script>
