<template>
  <q-page padding>
    <q-header reveal>
      <q-toolbar class="bg-white text-black">
        <q-btn flat dense round icon="arrow_back" @click="goBack"></q-btn>
        <q-toolbar-title ><strong> 代币信息 </strong></q-toolbar-title>
      </q-toolbar>
    </q-header>
    <div class="text-grey-8">
        <p style="word-break:break-word;">合约地址：{{assetList[id].address}}</p>
        <p>名称：{{assetList[id].name}}</p>
        <p>描述：{{assetList[id].description}}</p>
        <p>符号：{{assetList[id].symbol}}</p>
        <p>总量：{{assetList[id].totalSupply}}</p>
        <p>小数点位数：{{assetList[id].decimals}}</p>
    </div>

  </q-page>
</template>

<style>
</style>

<script>

export default {
  data () {
    return {
      id: this.$route.params.id, // 将 URL 中传递过来的 id 值，挂载到 data上
      assetList: this.$store.getters.assetList
    }
  },
  methods: {
    goBack () {
      // 点击后退
      console.log(this.assetList[this.id])
      this.$router.go(-1) // -1 代表后退
    }
  }
}
</script>
