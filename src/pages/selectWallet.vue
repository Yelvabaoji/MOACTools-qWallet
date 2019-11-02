<template>
  <q-page padding>
    <div v-if="isWalletsEmpty" ><h4 style="text-align:center; color:red">请导入钱包</h4></div>
    <div v-else>
      <div class="text-grey-8">
          当前链：墨客主链
      </div>

      <div><q-separator color="grey" spaced /></div>

      <div class="q-pa-none" >
        <q-list separator>
          <q-item v-for="(wallet, index) in wallets" :key="index" clickable v-ripple v-on:click="selectWallet(index)" >
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
  },

  methods: {
    selectWallet (selection) {
      this.selectedWallet = selection
      this.$store.commit('selectWallet', selection)
    }
  }
}
</script>
