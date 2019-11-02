export function readWalletsFromStorage (state) {
  // 从本地storage读保存的钱包数据，里面没有私钥，只有keystore和address
  // 读取以后也不把keystore转换成私钥，需要密码才能转。
  var qWallets = JSON.parse(localStorage.getItem('qWallets'))
  if (qWallets !== null) {
    // 这里不能直接赋值
    // state = qWallets
    state.wallets = qWallets.wallets
    state.currentWallet = qWallets.currentWallet
    state.password = qWallets.password
  }
}

export function selectWallet (state, selection) {
  // 选择一个新钱包
  state.currentWallet = selection

  localStorage.setItem('qWallets', JSON.stringify(state))
}

export function updateWallet (state, wallet) {
  // 更新当前钱包信息, wallet这里是一个对象，对象里有不同的传入值

  // 更新当前钱包信息, 这是要写入storage的
  var i = state.currentWallet

  if (wallet.name) state.wallets[i].name = wallet.name
  if (wallet.keystore) state.wallets[i].keystore = wallet.keystore
  if (wallet.address) state.wallets[i].address = wallet.address
  if (wallet.balance) state.wallets[i].balance = wallet.balance
  if (wallet.assetList) state.wallets[i].assetList = wallet.assetList

  // 和keystore相匹配的password
  if (wallet.password) state.password = wallet.password

  // 保存 keystore, address到localStorage里面，私钥不保存
  localStorage.setItem('qWallets', JSON.stringify(state))
}

export function updateWalletAndAssetBalance (state, wallet) {
  // 更新当前钱包信息assetlist中的某一个token的信息
  // wallet: {balance, assetId, token}
  var i = state.currentWallet

  // 更新第id个token
  state.wallets[i].assetList[wallet.assetId] = wallet.token

  // 保存 keystore, address到localStorage里面，私钥不保存
  localStorage.setItem('qWallets', JSON.stringify(state.wallets))
}

export function addWallet (state, wallet) {
  var find = false // 假设没有在wallets中
  state.wallets.some(wlt => {
    if (wlt.address === wallet.address) {
      find = true
      return true
    }
  })
  if (!find) {
    state.wallets.push(wallet)
    state.currentWallet = state.wallets.length - 1

    // 保存到localStorage里面
    localStorage.setItem('qWallets', JSON.stringify(state))
  }
}

export function deleteWallet (state, selection) {
  state.wallets.splice(selection, 1)

  if (state.currentWallet > selection) {
    state.currentWallet--
  } else if (state.currentWallet === selection) {
    if (state.wallets.length > 0) {
      state.currentWallet = state.wallets.length - 1
    }
  } else {
    // 不变
  }

  // 保存到localStorage里面
  localStorage.setItem('qWallets', JSON.stringify(state))
}
