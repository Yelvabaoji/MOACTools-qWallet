export default {
  // 1，（默认使用这种场景）
  //    - 当前只存在keystore，转账时，需要输入密码，以解锁keystore
  // 2，
  //    - 当前存在privateKey，转账时，不需要输入密码

  /* wallets的结构
    wallets: [
      {
        name: wallet name
        keystore: wallet keystore
        address: wallet address
        balance: wallet balance
        txLog: [
          {
            txHash: txHash
            txStatus: txStatus
          }
        ]
        assetList: [
          {
            address: token.address,
            name: token.name,
            symbol: token.symbol,
            icon: token.icon,
            description: token.description,
            letter: token.symbol.charAt(0),
            totalSupply: token.totalSupply,
            decimals: token.decimals,
            balance: token.balance
            txLog: [
              txHash: txHash
              txStatus: txStatus
            ]
          }
        ]
      },
      {

      }
    ]
  */
  // wallets里面存放的是n个钱包，包括keystore和address和钱包名
  // wallets: [{ name: '', keystore: '', address: '', balance: '', txLog: [], assetList: [] }],
  wallets: [],

  // 当前钱包的编号，暂时只有一个钱包，那就是第0个钱包
  currentWallet: 0,

  // 当前钱包的密码 - 转账时，一般来说，需要输入
  password: '' // 没想好做什么用

}
