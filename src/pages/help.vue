<template>
  <q-page padding>
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong> 管理钱包</strong></q-toolbar-title>
    </q-toolbar>
    <q-separator color="grey-3" spaced />

    <div class="q-px-lg q-pb-md">

      <q-timeline color="secondary">
        <q-timeline-entry heading tag="h6" >
          <u>安全性</u>
        </q-timeline-entry>

        <q-timeline-entry
          title="私钥存放在哪里？"
          color="orange"
          icon="delete"
        >
          <div>
            <p><span class="text-red">答案是私钥不存放。</span></p>
            <p>本工具所有的操作都在浏览器端进行，包括对账户进行的交易操作，加密的签名而不是私钥直接和区块链进行交互。</p>
            <p>为了操作方便，当前钱包的keystore到用户自己的机器中，当然使用时需要密码来进行签名。</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry heading  tag="h6">
          <u>操作注意事项</u>
        </q-timeline-entry>

        <q-timeline-entry
          title="延迟性"
        >
          <div>
            注意区块链完成数据交易有一定的延迟性。而交易结果反映在区块浏览器中也有一定的延迟性。通常在提示操作完成以后，到浏览器显示交易记录也有一定的延迟。
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="保持足够的墨客"
        >
          <div>
            <p>注意转账交易是需要有足够的墨客作为汽油费用的。每一笔转账交易都需要。</p>
            <p>系统会预估所需要的墨客数量，如果不足，则会提示</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry heading  tag="h6">
          <u>功能</u>
        </q-timeline-entry>

        <q-timeline-entry
          title="钱包信息"
          avatar="statics/icons/moac-logo1.jpg"
        >
          <div>
            <p>显示墨客钱包信息，信息包括当前账户墨客数量以及资产数量。</p>
            <p>点击墨客账户，可以做墨客转账。</p>
            <p>点击代币，可以做代币转账。</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="创建新钱包"
          color="orange"
          icon="account_balance_wallet"
        >
          <div>
            <P>创建新钱包。</P>
            <p>注意：创建完新钱包，记得保存私钥或者keystore(记住密码)。</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="从私钥选择钱包"
          color="green"
          icon="vpn_key"
        >
          <div>
            <p>输入私钥，导入钱包</p>
            <p>注意：导入钱包后，记住密码</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="从keystore选择钱包"
          color="green"
          icon="lock_open"
        >
          <div>
            <p>输入keystore，导入钱包</p>
            <p>注意：导入钱包后，备份私钥</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="导出私钥"
          color="blue"
          icon="vpn_key"
        >
          <div>
            <p>输入密码，导出私钥</p>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          title="导出keystore"
          color="blue"
          icon="lock_open"
        >
          <div>
            <p>导出keystore</p>
          </div>
        </q-timeline-entry>

      </q-timeline>
    </div>
  </q-page>
</template>
<script>
export default {
  mounted () {
    this.GLOBAL.showFooter = false
  }
}
</script>
