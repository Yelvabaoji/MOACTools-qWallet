<template>
  <q-page class="q-pa-md">
    <q-toolbar-title style="text-align:center">
      <strong> 我的 </strong>
    </q-toolbar-title>

    <q-separator color="grey-3" spaced />

    <q-list separator>
      <q-item clickable v-ripple to="/manageWallets">
        <q-item-section avatar>
          <q-icon color="orange" size="32px" name="account_balance_wallet" />
          <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
        </q-item-section>
        <q-item-section>管理钱包</q-item-section>
        <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/setup">
        <q-item-section avatar>
          <q-icon color="orange" size="32px" name="account_balance_wallet" />
          <!-- <q-avatar size="32px"><img src="statics/icons/mvp-logo.png" /></q-avatar> -->
        </q-item-section>
        <q-item-section>设置</q-item-section>
        <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/qWalletHelp">
        <q-item-section avatar>
          <q-icon color="blue" size="32px" name="help" />
        </q-item-section>
        <q-item-section>帮 助</q-item-section>
        <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  mounted () {
    this.GLOBAL.showFooter = true
  }
}
</script>

<style lang="stylus">
</style>
