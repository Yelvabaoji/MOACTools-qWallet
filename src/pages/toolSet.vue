<template>
  <q-page padding>
    <div v-if="isWalletsEmpty" ><h4 style="text-align:center; color:red">请导入钱包</h4></div>
    <div v-else>
      <div class="text-grey-8">
          当前钱包：{{address}}
          <p>墨客余额：{{String(balance.toString()).replace(/^(-?)(\d+)((\.\d+)?)$/,
            function (s, s1, s2, s3) {return s1 + s2.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') + s3})
          }} (moac)</p>
      </div>
      <div>
        <q-btn class="q-mt-none" label="刷新余额" type="submit" unelevated color="grey-7" text-color="white"
          v-on:click="getMoacBalance()"/>
      </div>

      <div><q-separator color="grey" spaced /></div>

      <div>
        <q-btn class="full-width q-mt-md" label="查询我发的币" type="submit" color="primary"
          v-on:click="getIssuedTokenList()"/>
      </div>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      dense
      :pagination.sync="pagination"
      no-data-label="没有数据"
      rows-per-page-label="每页行数："
      :rows-per-page-options="[25,50,100,0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="num" :props="props"> {{ props.row.name }} </q-td>
          <q-td key="desc" :props="props"> {{ props.row.desc }} </q-td>
          <q-td key="symbol" :props="props"> {{ props.row.symbol }} </q-td>
          <q-td key="decimals" :props="props"> {{ props.row.decimals }} </q-td>
          <q-td key="quantity" :props="props"> {{ props.row.quantity }} </q-td>
          <q-td key="time" :props="props"> {{ props.row.time }} </q-td>
          <q-td key="addr" :props="props"> {{ props.row.addr }} </q-td>
        </q-tr>
      </template>
    </q-table>

    </div>
  </q-page>
</template>

<style>
</style>

<script>
import moacERC20ABI from './moacERC20ABI.js'
import tokenList from './tokenList.js'

export default {
  data () {
    return {
      isWalletsEmpty: this.$store.getters.isWalletsEmpty,
      address: this.$store.getters.address,
      balance: this.$store.getters.balance,
      totalTokens: 0,
      pagination: {
        sortBy: 'name',
        descending: false,
        // page: 2,
        rowsPerPage: 25
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        { name: 'num', align: 'left', label: '编号', field: row => row.name, sortable: true },
        { name: 'desc', align: 'left', label: '名字', field: 'desc', sortable: true },
        { name: 'symbol', align: 'left', label: '符号', field: 'symbol', sortable: true },
        { name: 'decimals', align: 'left', label: '精确度', field: 'decimals', sortable: true },
        { name: 'quantity', align: 'left', label: '数量', field: 'quantity', sortable: true },
        { name: 'time', align: 'left', label: '时间', field: 'time', sortable: true },
        { name: 'addr', align: 'left', label: '合约地址', field: 'addr', sortable: true }
      ],
      data: []
    }
  },
  mounted () {
  },

  methods: {
    getMoacBalance () {
      if (!this.GLOBAL.isChain3Ready(this.GLOBAL.chain3, this)) return

      if (this.address === null || this.address === '') return

      // 查询最新的账户余额，并且更新
      this.balance = this.GLOBAL.getMoacBalance(this.GLOBAL.chain3, this.address).toFixed(2)
      this.$store.commit('updateWallet', { balance: this.balance })
    },
    // ****************************************************
    // ****************************************************
    getIssuedTokenList () {
      if (!this.GLOBAL.isChain3Ready(this.GLOBAL.chain3, this)) return
      if (this.address === null || this.address === '') return

      this.$q.loading.show({
        message: '正在查询，请等待。。。'
      })
      var address = this.address
      var chain3 = this.GLOBAL.chain3
      var len = tokenList.length
      var that = this
      // var that = this

      iterator(0)
      function iterator (i) {
        if (i === len) {
          console.log('finished')
          that.$q.loading.hide()
          return
        }
        var contract = chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(tokenList[i].addr)
        if (contract) {
          contract.balanceOf.call(address, (err, balBig) => {
            if (!err) {
              var balance = balBig.dividedBy(10 ** tokenList[i].decimals).toFixed(2)

              console.log(balBig)
              console.log(balance)
            }
            iterator(i + 1)
          })
        }
      }
    },
    getIssuedTokenList0 () {
      if (!this.GLOBAL.isChain3Ready(this.GLOBAL.chain3, this)) return
      if (this.address === null || this.address === '') return

      this.$q.loading.show({
        message: '正在查询，请等待。。。'
      })

      var address = this.address
      var chain3 = this.GLOBAL.chain3
      var that = this

      var filter = chain3.mc.filter(
        {
          fromBlock: 1,
          toBlock: 'latest',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // 这是ERC20的 第一个参数
            null, // 这是token amount
            '0x' + chain3.padLeft(address.substring(2, address.length).toString('hex'), 64) // 这是地址
          ]
        }
      )
      filter.get(function (error, result) {
        if (!error) {
          // console.log(result)
          that.data = []
          that.totalTokens = result.length
          for (var i = 0; i < result.length; i++) {
            // console.log(result[i])
            var timestamp = chain3.mc.getBlock(result[i].blockNumber).timestamp
            var unixTimestamp = new Date(timestamp * 1000)
            var blockTime = unixTimestamp.toLocaleString()
            // console.log(commonTime)

            var token = that.GLOBAL.getTokenInfo(chain3, result[i].address)

            that.data.push({
              name: i,
              desc: token.name,
              symbol: token.symbol,
              decimals: token.decimals,
              quantity: token.totalSupply,
              time: blockTime,
              addr: result[i].address
            })
          }
        }
        that.$q.loading.hide()
      })
    }
  }
}
</script>
