<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong>从私钥导入钱包</strong></q-toolbar-title>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <q-input class='q-mt-md q-mb-none' filled v-model="walletName"
      label="钱包名" counter lazy-rules
      :rules="[ val => val.length > 0 || '钱包名不能为空']"
    />
    <!-- 选择私钥解锁 -->
    <q-input class='q-mt-xs q-mb-none' filled v-model="privateKey"
      label="输入66位0x开头的私钥"
      counter maxlength="66"
      lazy-rules
      :type="isPwd ? 'password' : 'text'"
      :rules="[ val => val.length == 66 || '长度不对.']"
    >
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <inputPassword :msg="'输入密码，最少9位字符'" @getPassword='getPassword'></inputPassword>
    <inputPassword :msg="'确认密码，最少9位字符'" @getPassword='getPasswordAgain'></inputPassword>

    <!-- 解锁？ -->
    <div>
        <q-btn class="full-width q-mt-md" label="导入新钱包" type="submit" color="primary"
        v-on:click="unlockByPrivateKey()" />
    </div>
    <div v-if="address != ''" class='q-mt-md q-mb-none'>
      <q-input class='q-mt-md q-mb-none' v-model="address"
        label="钱包地址"
        readonly borderless filled  />
    </div>

    <div v-if="address != ''" class='q-mt-md q-mb-none'>
      <q-btn class="full-width q-mt-md" label="保存 Keystore 文件" type="submit" color="primary"
        v-on:click="saveKeystoreToFile()"
      />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
// import EthCrypto from 'eth-crypto'
// import keythereum from 'keythereum'
import ethWallet from 'ethereumjs-wallet'
import inputPassword from '../../components/inputPassword'

export default {
  data () {
    return {
      walletName: '',
      privateKey: '',
      address: '',
      password: '',
      passwordAgain: '',
      isPwd: true,
      keystore: ''
    }
  },
  mounted () {
    this.GLOBAL.showFooter = false
  },
  components: {
    'inputPassword': inputPassword
  },
  methods: {
    getPassword (password) {
      this.password = password
    },
    getPasswordAgain (password) {
      this.passwordAgain = password
    },
    // ****************************************************
    unlockByPrivateKey () {
      if (this.walletName.length === 0) {
        return this.GLOBAL.alertMsg(this, '钱包名不能为空 !')
      }
      if (this.privateKey.length !== 66) {
        return this.GLOBAL.alertMsg(this, '私钥长度不对 !')
      }
      if (this.password.length < 4) {
        return this.GLOBAL.alertMsg(this, '密码长度不对 !')
      }
      if (this.password !== this.passwordAgain) {
        return this.GLOBAL.alertMsg(this, '两次输入的密码不相同 !')
      }

      var rawKey = this.GLOBAL.rawPrivateKey(this.privateKey)
      var wallet = ethWallet.fromPrivateKey(Buffer.from(rawKey, 'hex'))

      // 说明：这里VUE的运算有点吃力，如果是后端用nodejs运算就可以，
      // 所以这里把C从262144减少到2144，以提高速度，但是会减弱保密性。
      var options = { kdf: 'pbkdf2', c: 2144 }
      this.keystore = wallet.toV3(this.password, options)

      this.address = '0x' + wallet.getAddress().toString('hex')
      this.$store.commit('addWallet', {
        name: this.walletName,
        keystore: JSON.stringify(this.keystore),
        address: this.address,
        privateKey: this.privateKey,
        balance: 0, // 新创建的默认余额为0
        assetList: [],
        password: ''
      })
      this.$q.dialog({ title: '信息', message: '导入完成。\n请记住密码' })
    },

    // ****************************************************
    saveKeystoreToFile () {
      this.GLOBAL.saveKeystoreToFile(JSON.stringify(this.keystore))
    }
  }
}
</script>
