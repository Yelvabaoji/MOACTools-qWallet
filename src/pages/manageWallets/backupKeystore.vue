<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong>导出keystore</strong></q-toolbar-title>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <div v-if="isWalletsEmpty" ><h4 style="text-align:center; color:red">请导入钱包</h4></div>
    <div v-else>
      <div class="q-my-md text-grey-8">
          当前钱包：{{address}}
      </div>
      <inputPassword :msg="'输入密码，最少9位字符'" @getPassword='getPassword'></inputPassword>

      <!-- 解锁？ -->
      <div>
          <q-btn class="full-width q-mt-md" label="选择新钱包 / 解锁" type="submit" color="primary"
          v-on:click="unlockByKeystore()" />
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import inputPassword from '../../components/inputPassword'
import keythereum from 'keythereum'

export default {
  data () {
    return {
      isWalletsEmpty: this.$store.getters.isWalletsEmpty,
      password: '',
      address: this.$store.getters.address
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
    // ****************************************************
    // ****************************************************
    unlockByKeystore () {
      if (this.password.length < 4) {
        return this.GLOBAL.alertMsg(this, '密码长度不对 !')
      }

      try {
        keythereum.recover(this.password, JSON.parse(this.$store.getters.keystore))
        this.GLOBAL.saveKeystoreToDisk(this.$store.getters.keystore)
      } catch (err) {
        this.GLOBAL.alertMsg(this, '错误，可能密码有误 !')
      }
    }
  }
}
</script>
