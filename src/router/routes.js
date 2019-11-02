
import MyLayout from 'layouts/MyLayout.vue'
import MyProfile from 'layouts/MyProfile.vue'
import WalletInfo from 'pages/walletInfo.vue'
import SelectWallet from 'pages/selectWallet.vue'
import SendMoac from 'pages/sendMoac.vue'
import TokenInfo from 'pages/TokenInfo.vue'

import DappList from 'layouts/DappList.vue'

import ManageWallets from 'pages/manageWallets/manageWallets.vue'
import CreateWallet from 'pages/manageWallets/createWallet.vue'
import DeleteWallet from 'pages/manageWallets/deleteWallet.vue'
import FromPrivateKey from 'pages/manageWallets/fromPrivateKey.vue'
import FromKeystore from 'pages/manageWallets/fromKeystore.vue'
import BackupPrivateKey from 'pages/manageWallets/backupPrivateKey.vue'
import BackupKeystore from 'pages/manageWallets/backupKeystore.vue'

import Setup from 'pages/setup/setup.vue'

import QWalletHelp from 'pages/help.vue'

const routes = [
  {
    path: '/',
    component: MyLayout,
    children: [
      { path: '/', redirect: 'walletInfo' },
      { path: 'walletInfo', component: WalletInfo, name: 'walletInfo' },
      { path: 'selectWallet', component: SelectWallet, name: 'selectWallet' },
      { path: 'walletInfo/sendMoac/:id', component: SendMoac, name: 'sendMoac' },
      { path: 'walletInfo/tokenInfo/:id', component: TokenInfo, name: 'tokenInfo' },

      { path: 'dappList', component: DappList, name: 'dappList' },

      { path: 'myProfile', component: MyProfile, name: 'myProfile' },
      { path: 'manageWallets', component: ManageWallets, name: 'manageWallets' },
      { path: 'createWallet', component: CreateWallet, name: 'createWallet' },
      { path: 'deleteWallet', component: DeleteWallet, name: 'deleteWallet' },
      { path: 'fromPrivateKey', component: FromPrivateKey, name: 'fromPrivateKey' },
      { path: 'fromKeystore', component: FromKeystore, name: 'fromKeystore' },
      { path: 'backupPrivateKey', component: BackupPrivateKey, name: 'backupPrivateKey' },
      { path: 'backupKeystore', component: BackupKeystore, name: 'backupKeystore' },

      { path: 'setup', component: Setup, name: 'setup' },
      { path: 'qWalletHelp', component: QWalletHelp, name: 'qWalletHelp' }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
