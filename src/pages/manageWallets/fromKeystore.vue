<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong>从keystore导入钱包</strong></q-toolbar-title>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <!-- 选择keystore解锁 -->
    <input class='q-mt-md q-mb-none' type="file" id="file" ref="file" v-on:change="readKeystore()" />

    <q-input class='q-mt-md q-mb-none' filled v-model="walletName"
      label="钱包名" counter lazy-rules
      :rules="[ val => val.length > 0 || '钱包名不能为空']"
    />

    <inputPassword :msg="'输入密码，最少9位字符'" @getPassword='getPassword'></inputPassword>

    <!-- 解锁？ -->
    <div>
        <q-btn class="full-width q-mt-md" label="选择新钱包 / 解锁" type="submit" color="primary"
        v-on:click="unlockByKeystore()" />
    </div>

    <!-- 显示钱包地址、显示私钥 -->
    <div v-if="address != ''" class='q-mt-md q-mb-none'>
      <q-input class='q-mt-md q-mb-none' v-model="address"
        label="当前钱包地址"
        readonly borderless filled
      />
      <showPrivateKey :privateKey="privateKey"> </showPrivateKey>
    </div>

  </q-page>
</template>

<style>
</style>

<script>
import keythereum from 'keythereum'
import inputPassword from '../../components/inputPassword'
import showPrivateKey from '../../components/showPrivateKey'

export default {
  data () {
    return {
      walletName: '',
      password: '',
      isPwd: true,
      privateKey: '',
      address: '',
      keystore: null
    }
  },
  mounted () {
    this.GLOBAL.showFooter = false
  },
  components: {
    'inputPassword': inputPassword,
    'showPrivateKey': showPrivateKey
  },
  methods: {
    getPassword (password) {
      this.password = password
    },
    // ****************************************************
    unlockByKeystore () {
      if (this.walletName.length === 0) {
        return this.GLOBAL.alertMsg(this, '钱包名不能为空 !')
      }
      if (this.password.length < 4) {
        return this.GLOBAL.alertMsg(this, '密码长度不对 !')
      }

      try {
        var pKeyBuffer = keythereum.recover(this.password, JSON.parse(this.keystore))
        // console.log(typeof (pKeyBuffer), pKeyBuffer)
        this.privateKey = '0x' + pKeyBuffer.toString('hex')
        this.address = this.GLOBAL.getWalletAddress(this.privateKey)
        console.log(this.keystore)
        this.$store.commit('addWallet', {
          name: this.walletName,
          keystore: this.keystore,
          address: this.address,
          privateKey: this.privateKey,
          balance: 0, // 新创建的默认余额为0
          assetList: [],
          password: ''
        })
      } catch (err) {
        return this.GLOBAL.alertMsg(this, '密码有误，或者keystore文件不对 !')
      }
    },

    readKeystore () {
      var that = this

      var f = this.$refs.file.files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        const bstr = e.target.result
        that.keystore = bstr
      }
      reader.readAsBinaryString(f)
    }

  }
}
</script>
