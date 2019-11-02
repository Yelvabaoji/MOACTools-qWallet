<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong>删除钱包</strong></q-toolbar-title>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <div v-if="isWalletsEmpty" ><h4 style="text-align:center; color:red">请导入钱包</h4></div>
    <div v-else>
      <div class="text-grey-8">
          当前链：墨客主链
      </div>

      <q-separator color="grey-3" spaced />

      <div class="q-pa-none" >
        <q-list separator>
          <q-item v-for="(wallet, index) in wallets" :key="index" clickable v-ripple v-on:click="deleteWallet(index)" >
            <q-item-section v-if="index == selectedWallet" avatar>
              <q-icon color="green" size="24px" name="check" />
            </q-item-section>
            <q-item-section v-else avatar />
            <q-item-section>
              <q-item-label> {{wallet.name}} </q-item-label>
              <q-item-label caption> {{wallet.address}} </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>

export default {
  data () {
    return {
      isWalletsEmpty: this.$store.getters.isWalletsEmpty,
      selectedWallet: this.$store.getters.currentWallet,
      wallets: this.$store.getters.wallets
    }
  },
  mounted () {
    this.GLOBAL.showFooter = false
  },

  methods: {
    deleteWallet (selection) {
      try {
        var name = this.wallets[selection].name
        this.$q.dialog({ title: '确定',
          message: '你确定要删除钱包：' + name + ' 吗？',
          cancel: '取消',
          ok: '确定',
          persistent: false
        }).onOk(() => {
          this.$store.commit('deleteWallet', selection)
          this.isWalletsEmpty = this.$store.getters.isWalletsEmpty
          this.selectedWallet = this.$store.getters.currentWallet
          this.wallets = this.$store.getters.wallets
        })
      } catch (err) {
        return this.GLOBAL.alertMsg(this, '错误，删除出现错误 !')
      }
    }
  }
}
</script>
