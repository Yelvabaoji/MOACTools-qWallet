export function wallets (state) {
  return state.wallets
}
export function wallet (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet]
}
export function name (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].name
}
export function keystore (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].keystore
}
export function address (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].address
}
export function balance (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].balance
}
export function txLog (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].txLog
}
export function assetList (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].assetList
}
export function password (state) {
  if (state.wallets.length === 0) return null
  return state.wallets[state.currentWallet].password
}
export function isWalletsEmpty (state) {
  return !state.wallets.length > 0
}
export function currentWallet (state) {
  if (state.wallets.length === 0) return null
  return state.currentWallet
}
