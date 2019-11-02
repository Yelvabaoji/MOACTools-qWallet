
import secp256k1 from 'secp256k1'
import keccak from 'keccak'
import moacERC20ABI from '../pages/moacERC20ABI.js'
import EWallet from 'ethereumjs-wallet'

var chain3
var showFooter = true

function eWallet () {
  return EWallet
}

function rawPrivateKey (privateKey) {
  // 去除私钥的0x
  var pKey = privateKey
  if (pKey.substr(0, 2) === '0x') {
    pKey = pKey.substr(2, pKey.length)
  }
  return pKey
}

function getWalletAddress (privateKey) {
  // 去除私钥的0x
  var pKey = privateKey
  if (pKey.substr(0, 2) === '0x') {
    pKey = pKey.substr(2, pKey.length)
  }
  // 从私钥产生公钥
  var publicKey = secp256k1.publicKeyCreate(Buffer.from(pKey, 'hex'), false).slice(1)
  var addrBuffer = keccak('keccak256').update(publicKey).digest().slice(-20)
  var address = '0x' + addrBuffer.toString('hex')
  return address
}

function getMoacBalance (chain3, address) {
  // get moac balance in the wallet, convert to moac.
  var balBig = chain3.BigNumber(chain3.mc.getBalance(address).toString(10))
  var balance = balBig.dividedBy(10 ** 18)
  return balance
}

function getTokenInfo (chain3, erc20Address) {
  var token = {
    name: '',
    symb: '',
    decimals: 0,
    totalSupply: 0
  }
  var contract = chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(erc20Address)
  if (contract) {
    var totalSupplyBig = chain3.BigNumber(JSON.stringify(contract.totalSupply()).replace(/"/g, ''))
    var name = JSON.stringify(contract.name()).replace(/"/g, '')
    var decimals = parseInt(JSON.stringify(contract.decimals()).replace(/"/g, ''))
    var symb = JSON.stringify(contract.symbol()).replace(/"/g, '')
    var totalSupply = decimals === 0 ? totalSupplyBig : totalSupplyBig.dividedBy(10 ** decimals)
    // console.log('name:', name, 'SYM:', symb, 'decimals:', decimals, 'total:', totalSupply.toString())
    token.name = name
    token.symb = symb
    token.decimals = decimals
    token.totalSupply = totalSupply
  }
  return token
}

async function getTokenBalance (chain3, erc20Address, address, decimals) {
  var contract = chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(erc20Address)
  if (contract) {
    var balBig = await contract.balanceOf.call(address)
    var balance = balBig.dividedBy(10 ** decimals)
    return balance
  }
  return 0
}

function getContract (chain3, erc20Address) {
  return chain3.mc.contract(moacERC20ABI.moacERC20ABI).at(erc20Address)
}
function isChain3Ready (chain3, that) {
  if (!chain3.isConnected()) {
    that.$q.dialog({ title: '<span class="text-red">警告</span>', message: 'Chain3没有连接', html: true })
    return false
  }
  return true
}

function isAddressGood (that, address) {
  if (address === null) return false
  if (address.length !== 42) {
    that.$q.dialog({ title: '<span class="text-red">警告</span>', message: '钱包地址长度不对', html: true })
    return false
  }
  return true
}

function alertMsg (that, msg) {
  that.$q.dialog({ title: '<span class="text-red">警告</span>', message: msg, html: true })
  return true
}

function saveKeystoreToFile (keystore) {
  // 定义文件内容，类型必须为Blob 否则createObjectURL会报错
  var content = new Blob([keystore])

  // 生成url对象
  var urlObject = window.URL || window.webkitURL || window
  var url = urlObject.createObjectURL(content)
  // 生成<a></a>DOM元素
  let el = document.createElement('a')
  // 链接赋值
  el.href = url
  el.download = 'keystore文件导出.txt'
  // 必须点击否则不会下载
  el.click()
  // 移除链接释放资源
  urlObject.revokeObjectURL(url)
}

export default {
  chain3,
  showFooter,
  eWallet,
  rawPrivateKey,
  getWalletAddress,
  getMoacBalance,
  getTokenInfo,
  getTokenBalance,
  getContract,
  isChain3Ready,
  isAddressGood,
  alertMsg,
  saveKeystoreToFile
}
