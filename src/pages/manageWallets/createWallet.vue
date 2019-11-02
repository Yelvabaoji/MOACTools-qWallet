<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong>创建新钱包</strong></q-toolbar-title>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <q-input class='q-mt-md q-mb-none' filled v-model="walletName"
      label="钱包名" counter lazy-rules
      :rules="[ val => val.length > 0 || '钱包名不能为空']"
    />
    <inputPassword :msg="'输入密码，最少9位字符'" @getPassword='getPassword'></inputPassword>
    <inputPassword :msg="'确定密码，最少9位字符'" @getPassword='getPasswordAgain'></inputPassword>
    <div>
      <q-btn class="full-width q-mt-md" label="创建新钱包" type="submit" color="primary"
          v-on:click="createWallet()" />
    </div>

    <!-- 显示钱包地址、显示私钥 -->
    <div v-if="address != ''" class='q-mt-md q-mb-none'>
        <q-input class='q-mt-md q-mb-none' v-model="address"
          label="钱包地址"
          readonly borderless filled  />
        <showPrivateKey :privateKey="privateKey"> </showPrivateKey>
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
import inputPassword from '../../components/inputPassword'
import ethWallet from 'ethereumjs-wallet'
import showPrivateKey from '../../components/showPrivateKey'

export default {
  data () {
    return {
      walletName: '',
      password: '',
      passwordAgain: '',
      isPwd: true,
      privateKey: '',
      address: '',
      keystore: ''
    }
  },
  components: {
    'inputPassword': inputPassword,
    'showPrivateKey': showPrivateKey
  },
  mounted () {
    this.GLOBAL.showFooter = false
    // if (window.Worker) {
    //   console.log('333333333333333')
    //   this.myWorker = new Worker('statics/worker.js')
    //   console.log(this.myWorker)
    // } else {
    //   alert('不支持')
    // }
  },
  methods: {
    getPassword (password) {
      this.password = password
    },
    getPasswordAgain (password) {
      this.passwordAgain = password
    },
    // ****************************************************
    createWallet () {
      if (this.walletName.length === 0) {
        return this.GLOBAL.alertMsg(this, '钱包名不能为空 !')
      }
      if (this.password.length < 4) {
        return this.GLOBAL.alertMsg(this, '密码长度不对 !')
      }
      if (this.password !== this.passwordAgain) {
        return this.GLOBAL.alertMsg(this, '两次输入的密码不相同 !')
      }

      var wallet = ethWallet.generate()
      this.privateKey = '0x' + wallet.getPrivateKey().toString('hex')
      this.address = '0x' + wallet.getAddress().toString('hex')

      // 说明：这里VUE的运算有点吃力，如果是后端用nodejs运算就可以，
      // 所以这里把C从262144减少到2144，以提高速度，但是会减弱保密性。
      var options = { kdf: 'pbkdf2', c: 2144 }
      this.keystore = wallet.toV3(this.password, options)
      console.log(this.keystore)

      this.$store.commit('addWallet', {
        name: this.walletName,
        keystore: JSON.stringify(this.keystore),
        address: this.address,
        privateKey: this.privateKey,
        balance: 0, // 新创建的默认余额为0
        assetList: [],
        password: ''
      })
      this.$q.dialog({ title: '信息', message: '钱包创建完成。\n请妥善保存私钥' })
    },

    // ****************************************************
    saveKeystoreToFile () {
      this.GLOBAL.saveKeystoreToFile(JSON.stringify(this.keystore))
    }
  }
}
</script>
