import {
  isExtensionEnabled,
  OfflineAminoSigner,
  OfflineSigner,
  SigningStargateClient,
  StargateClient,
  SUPPORTED_WALLET
} from 'cudosjs'
import { getOfflineSigner as cosmostationSigner } from '@cosmostation/cosmos-client'
import {
  RequestAccountResponse,
  SignAminoDoc
} from '@cosmostation/extension-client/types/message'
import { cosmos, Cosmos } from '@cosmostation/extension-client'
import { connectKeplrLedger } from './KeplrLedger'
import { connectCosmostationLedger } from './CosmoStationLedger'
import { CHAIN_DETAILS } from 'utils/constants'

const colors = {
  staking: '#3d5afe',
  bank: '#52A6F8',
  governance: '#E89518',
  distribution: '#9646F9',
  crisis: '#e6194B',
  ibc: '#4b0082',
  ibcTransfer: '#6a52b3',
  slashing: '#00a152',
  authz: '#2f4f4f',
  feegrant: '#57975b',
  vesting: '#a76b6b',
  cosmwasm: '#212c6f',
  gravity: '#469990',
  cudosNft: '#ff1493',
  cudosAdmin: '#535da8',
  marketplace: '#BA0086',
  addressbook: '#FF720C'
}

export const defaultMessages = {
  // ========================
  // staking
  // ========================
  '/cosmos.staking.v1beta1.MsgDelegate': {
    typeUrl: 'cosmos.staking.v1beta1.MsgDelegate',
    color: colors.staking,
    displayName: 'Delegate'
  },
  '/cosmos.staking.v1beta1.MsgBeginRedelegate': {
    typeUrl: 'cosmos.staking.v1beta1.MsgBeginRedelegate',
    color: colors.staking,
    displayName: 'Redelegate'
  },
  '/cosmos.staking.v1beta1.MsgUndelegate': {
    typeUrl: 'cosmos.staking.v1beta1.MsgUndelegate',
    color: colors.staking,
    displayName: 'Undelegate'
  },
  '/cosmos.staking.v1beta1.MsgCreateValidator': {
    typeUrl: 'cosmos.staking.v1beta1.MsgCreateValidator',
    color: colors.staking,
    displayName: 'Create Validator'
  },
  '/cosmos.staking.v1beta1.MsgEditValidator': {
    typeUrl: 'cosmos.staking.v1beta1.MsgEditValidator',
    color: colors.staking,
    displayName: 'Edit Validator'
  },
  // ========================
  // bank
  // ========================
  '/cosmos.bank.v1beta1.MsgSend': {
    typeUrl: 'cosmos.bank.v1beta1.MsgSend',
    color: colors.bank,
    displayName: 'Send'
  },
  '/cosmos.bank.v1beta1.MsgMultiSend': {
    typeUrl: 'cosmos.bank.v1beta1.MsgMultiSend',
    color: colors.bank,
    displayName: 'Multisend'
  },
  // ========================
  // crisis
  // ========================
  '/cosmos.crisis.v1beta1.MsgVerifyInvariant': {
    typeUrl: 'cosmos.crisis.v1beta1.MsgVerifyInvariant',
    color: colors.crisis,
    displayName: 'Verify Invariant'
  },
  // ========================
  // slashing
  // ========================
  '/cosmos.slashing.v1beta1.MsgUnjail': {
    typeUrl: 'cosmos.slashing.v1beta1.MsgUnjail',
    color: colors.slashing,
    displayName: 'Unjail'
  },
  // ========================
  // distribution
  // ========================
  '/cosmos.distribution.v1beta1.MsgFundCommunityPool': {
    typeUrl: 'cosmos.distribution.v1beta1.MsgFundCommunityPool',
    color: colors.distribution,
    displayName: 'Fund Community Pool'
  },
  '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress': {
    typeUrl: 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress',
    color: colors.distribution,
    displayName: 'Set Withdraw Address'
  },
  '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward': {
    typeUrl: 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    color: colors.distribution,
    displayName: 'Withdraw Reward'
  },
  '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission': {
    typeUrl: 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission',
    color: colors.distribution,
    displayName: 'Withdraw Commission'
  },
  // ========================
  // governance
  // ========================
  '/cosmos.gov.v1beta1.MsgDeposit': {
    typeUrl: 'cosmos.gov.v1beta1.MsgDeposit',
    color: colors.governance,
    displayName: 'Deposit'
  },
  '/cosmos.gov.v1beta1.MsgVote': {
    typeUrl: 'cosmos.gov.v1beta1.MsgVote',
    color: colors.governance,
    displayName: 'Vote'
  },
  '/cosmos.gov.v1beta1.MsgSubmitProposal': {
    typeUrl: 'cosmos.gov.v1beta1.MsgSubmitProposal',
    color: colors.governance,
    displayName: 'Submit proposal'
  },
  // ========================
  // ibc client
  // ========================
  '/ibc.core.client.v1.MsgCreateClient': {
    typeUrl: 'ibc.core.client.v1.MsgCreateClient',
    color: colors.ibc,
    displayName: 'Create Client'
  },
  '/ibc.core.client.v1.MsgUpdateClient': {
    typeUrl: 'ibc.core.client.v1.MsgUpdateClient',
    color: colors.ibc,
    displayName: 'Update Client'
  },
  '/ibc.core.client.v1.MsgUpgradeClient': {
    typeUrl: 'ibc.core.client.v1.MsgUpgradeClient',
    color: colors.ibc,
    displayName: 'Upgrade Client'
  },
  '/ibc.core.client.v1.MsgSubmitMisbehaviour': {
    typeUrl: 'ibc.core.client.v1.MsgSubmitMisbehaviour',
    color: colors.ibc,
    displayName: 'Submit Misbehaviour'
  },
  '/ibc.core.client.v1.MsgHeight': {
    typeUrl: 'ibc.core.client.v1.MsgHeight',
    color: colors.ibc,
    displayName: 'Height'
  },
  // ========================
  // ibc channel
  // ========================
  '/ibc.core.channel.v1.MsgReceivePacket': {
    typeUrl: 'ibc.core.channel.v1.MsgReceivePacket',
    color: colors.ibc,
    displayName: 'Receive Packet'
  },
  '/ibc.core.channel.v1.MsgChannel': {
    typeUrl: 'ibc.core.channel.v1.MsgChannel',
    color: colors.ibc,
    displayName: 'Channel'
  },
  '/ibc.core.channel.v1.MsgCounterpartyChannel': {
    typeUrl: 'ibc.core.channel.v1.MsgCounterpartyChannel',
    color: colors.ibc,
    displayName: 'Counterparty Channel'
  },
  '/ibc.core.channel.v1.MsgPacket': {
    typeUrl: 'ibc.core.channel.v1.MsgPacket',
    color: colors.ibc,
    displayName: 'Packet'
  },
  '/ibc.core.channel.v1.MsgAcknowledgement': {
    typeUrl: 'ibc.core.channel.v1.MsgAcknowledgement',
    color: colors.ibc,
    displayName: 'Acknowledgement'
  },
  '/ibc.core.channel.v1.MsgChannelCloseConfirm': {
    typeUrl: 'ibc.core.channel.v1.MsgChannelCloseConfirm',
    color: colors.ibc,
    displayName: 'Channel Close Confirm'
  },
  '/ibc.core.channel.v1.MsgChannelCloseInit': {
    typeUrl: 'ibc.core.channel.v1.MsgChannelCloseInit',
    color: colors.ibc,
    displayName: 'Channel Close Init'
  },
  '/ibc.core.channel.v1.MsgChannelOpenAck': {
    typeUrl: 'ibc.core.channel.v1.MsgChannelOpenAck',
    color: colors.ibc,
    displayName: 'Channel Open Ack'
  },
  '/ibc.core.channel.v1.MsgChannelOpenConfirm': {
    typeUrl: 'ibc.core.channel.v1.MsgChannelOpenConfirm',
    color: colors.ibc,
    displayName: 'Channel Open Confirm'
  },
  '/ibc.core.channel.v1.MsgChannelOpenInit': {
    typeUrl: 'ibc.core.channel.v1.MsgChannelOpenInit',
    color: colors.ibc,
    displayName: 'Channel Open Init'
  },
  '/ibc.core.channel.v1.MsgChannelOpenTry': {
    typeUrl: 'ibc.core.channel.v1.MsgChannelOpenTry',
    color: colors.ibc,
    displayName: 'Channel Open Try'
  },
  '/ibc.core.channel.v1.MsgTimeout': {
    typeUrl: 'ibc.core.channel.v1.MsgTimeout',
    color: colors.ibc,
    displayName: 'Timeout'
  },
  '/ibc.core.channel.v1.MsgTimeoutOnClose': {
    typeUrl: 'ibc.core.channel.v1.MsgTimeoutOnClose',
    color: colors.ibc,
    displayName: 'Timeout On Close'
  },
  // ========================
  // ibc connection
  // ========================
  '/ibc.core.connection.v1.MsgConnectionOpenAck': {
    typeUrl: 'ibc.core.connection.v1.MsgConnectionOpenAck',
    color: colors.ibc,
    displayName: 'Connection Open Ack'
  },
  '/ibc.core.connection.v1.MsgConnectionOpenConfirm': {
    typeUrl: 'ibc.core.connection.v1.MsgConnectionOpenConfirm',
    color: colors.ibc,
    displayName: 'Connection Open Confirm'
  },
  '/ibc.core.connection.v1.MsgConnectionOpenInit': {
    typeUrl: 'ibc.core.connection.v1.MsgConnectionOpenInit',
    color: colors.ibc,
    displayName: 'Connection Open Init'
  },
  '/ibc.core.connection.v1.MsgConnectionOpenTry': {
    typeUrl: 'ibc.core.connection.v1.MsgConnectionOpenTry',
    color: colors.ibc,
    displayName: 'Connection Open Try'
  },
  '/ibc.core.connection.v1.MsgConnectionEnd': {
    typeUrl: 'ibc.core.connection.v1.MsgConnectionEnd',
    color: colors.ibc,
    displayName: 'Connection End'
  },
  '/ibc.core.connection.v1.MsgCounterpartyConnection': {
    typeUrl: 'ibc.core.connection.v1.MsgCounterpartyConnection',
    color: colors.ibc,
    displayName: 'Counterparty Connection'
  },
  '/ibc.core.connection.v1.MsgVersion': {
    typeUrl: 'ibc.core.connection.v1.MsgVersion',
    color: colors.ibc,
    displayName: 'Version'
  },
  // ========================
  // ibc transfer
  // ========================
  '/ibc.applications.transfer.v1.MsgTransfer': {
    typeUrl: 'ibc.applications.transfer.v1.MsgTransfer',
    color: colors.ibcTransfer,
    displayName: 'Transfer'
  },
  // ========================
  // authz
  // ========================
  '/cosmos.authz.v1beta1.MsgGrant': {
    typeUrl: 'cosmos.authz.v1beta1.MsgGrant',
    color: colors.authz,
    displayName: 'Grant'
  },
  '/cosmos.authz.v1beta1.MsgRevoke': {
    typeUrl: 'cosmos.authz.v1beta1.MsgRevoke',
    color: colors.authz,
    displayName: 'Revoke'
  },
  // ========================
  // feegrant
  // ========================
  '/cosmos.feegrant.v1beta1.MsgGrantAllowance': {
    typeUrl: 'cosmos.feegrant.v1beta1.MsgGrantAllowance',
    color: colors.feegrant,
    displayName: 'Grant Allowance'
  },
  '/cosmos.feegrant.v1beta1.MsgRevokeAllowance': {
    typeUrl: 'cosmos.feegrant.v1beta1.MsgRevokeAllowance',
    color: colors.feegrant,
    displayName: 'Revoke Allowance'
  },
  // ========================
  // vesting
  // ========================
  '/cosmos.vesting.v1beta1.MsgCreateVestingAccount': {
    typeUrl: 'cosmos.vesting.v1beta1.MsgCreateVestingAccount',
    color: colors.vesting,
    displayName: 'Create Vesting Account'
  },
  '/cosmos.vesting.v1beta1.MsgCreatePeriodicVestingAccount': {
    typeUrl: 'cosmos.vesting.v1beta1.MsgCreatePeriodicVestingAccount',
    color: colors.vesting,
    displayName: 'Create Periodic Vesting Account'
  },
  // ========================
  // cosmwasm
  // ========================
  '/cosmwasm.wasm.v1.MsgClearAdmin': {
    typeUrl: 'cosmwasm.wasm.v1.MsgClearAdmin',
    color: colors.cosmwasm,
    displayName: 'Clear Admin'
  },
  '/cosmwasm.wasm.v1.MsgExecuteContract': {
    typeUrl: 'cosmwasm.wasm.v1.MsgExecuteContract',
    color: colors.cosmwasm,
    displayName: 'Execute Contract'
  },
  '/cosmwasm.wasm.v1.MsgInstantiateContract': {
    typeUrl: 'cosmwasm.wasm.v1.MsgInstantiateContract',
    color: colors.cosmwasm,
    displayName: 'Instantiate Contract'
  },
  '/cosmwasm.wasm.v1.MsgMigrateContract': {
    typeUrl: 'cosmwasm.wasm.v1.MsgMigrateContract',
    color: colors.cosmwasm,
    displayName: 'Migrate Contract'
  },
  '/cosmwasm.wasm.v1.MsgStoreCode': {
    typeUrl: 'cosmwasm.wasm.v1.MsgStoreCode',
    color: colors.cosmwasm,
    displayName: 'Store Code'
  },
  '/cosmwasm.wasm.v1.MsgUpdateAdmin': {
    typeUrl: 'cosmwasm.wasm.v1.MsgUpdateAdmin',
    color: colors.cosmwasm,
    displayName: 'Update Admin'
  },
  // ========================
  // cudos nft
  // ========================
  '/cudosnode.cudosnode.nft.MsgApproveAllNft': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgApproveAllNft',
    color: colors.cudosNft,
    displayName: 'Approve All NFT'
  },
  '/cudosnode.cudosnode.nft.MsgApproveNft': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgApproveNft',
    color: colors.cudosNft,
    displayName: 'Approve NFT'
  },
  '/cudosnode.cudosnode.nft.MsgBurnNFT': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgBurnNFT',
    color: colors.cudosNft,
    displayName: 'Burn NFT'
  },
  '/cudosnode.cudosnode.nft.MsgEditNFT': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgEditNFT',
    color: colors.cudosNft,
    displayName: 'Edit NFT'
  },
  '/cudosnode.cudosnode.nft.MsgIssueDenom': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgIssueDenom',
    color: colors.cudosNft,
    displayName: 'Issue Denom'
  },
  '/cudosnode.cudosnode.nft.MsgMintNFT': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgMintNFT',
    color: colors.cudosNft,
    displayName: 'Mint NFT'
  },
  '/cudosnode.cudosnode.nft.MsgRevokeNft': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgRevokeNft',
    color: colors.cudosNft,
    displayName: 'Revoke NFT'
  },
  '/cudosnode.cudosnode.nft.MsgTransferNft': {
    typeUrl: 'cudosnode.cudosnode.nft.MsgTransferNft',
    color: colors.cudosNft,
    displayName: 'Transfer NFT'
  },
  // ========================
  // cudos admin
  // ========================
  '/cudosnode.cudosnode.pocbasecosmos.MsgAdminSpendCommunityPool': {
    typeUrl: 'cudosnode.cudosnode.pocbasecosmos.MsgAdminSpendCommunityPool',
    color: colors.cudosAdmin,
    displayName: 'Spend Community Pool'
  },
  // ========================
  // gravity
  // ========================
  '/gravity.v1.MsgBatchSendToEthClaim': {
    typeUrl: 'gravity.v1.MsgBatchSendToEthClaim',
    color: colors.gravity,
    displayName: 'Send to ETH claim'
  },
  '/gravity.v1.MsgConfirmBatch': {
    typeUrl: 'gravity.v1.MsgConfirmBatch',
    color: colors.gravity,
    displayName: 'Confirm Batch'
  },
  '/gravity.v1.MsgRequestBatch': {
    typeUrl: 'gravity.v1.MsgRequestBatch',
    color: colors.gravity,
    displayName: 'Request Batch'
  },
  '/gravity.v1.MsgSendToCosmosClaim': {
    typeUrl: 'gravity.v1.MsgSendToCosmosClaim',
    color: colors.gravity,
    displayName: 'Send to Cosmos claim'
  },
  '/gravity.v1.MsgSendToEth': {
    typeUrl: 'gravity.v1.MsgSendToEth',
    color: colors.gravity,
    displayName: 'Send to ETH'
  },
  '/gravity.v1.MsgSetMinFeeTransferToEth': {
    typeUrl: 'gravity.v1.MsgSetMinFeeTransferToEth',
    color: colors.gravity,
    displayName: 'Set min fee'
  },
  '/gravity.v1.MsgValsetConfirm': {
    typeUrl: 'gravity.v1.MsgValsetConfirm',
    color: colors.gravity,
    displayName: 'Valset Confirm'
  },
  '/gravity.v1.MsgValsetUpdatedClaim': {
    typeUrl: 'gravity.v1.MsgValsetUpdatedClaim',
    color: colors.gravity,
    displayName: 'Valset Updated Claim'
  },
  // ========================
  // marketplace
  // ========================
  '/cudoventures.cudosnode.marketplace.MsgRemoveAdmin': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgRemoveAdmin',
    color: colors.marketplace,
    displayName: 'Remove Marketplace Admin'
  },
  '/cudoventures.cudosnode.marketplace.MsgBuyNft': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgBuyNft',
    color: colors.marketplace,
    displayName: 'Buy NFT'
  },
  '/cudoventures.cudosnode.marketplace.MsgUpdateRoyalties': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgUpdateRoyalties',
    color: colors.marketplace,
    displayName: 'Update NFT Royalties'
  },
  '/cudoventures.cudosnode.marketplace.MsgUpdatePrice': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgUpdatePrice',
    color: colors.marketplace,
    displayName: 'Update NFT Price'
  },
  '/cudoventures.cudosnode.marketplace.MsgRemoveNft': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgRemoveNft',
    color: colors.marketplace,
    displayName: 'Remove NFT from Sale'
  },
  '/cudoventures.cudosnode.marketplace.MsgPublishNft': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgPublishNft',
    color: colors.marketplace,
    displayName: 'Publish NFT for Sale'
  },
  '/cudoventures.cudosnode.marketplace.MsgMintNft': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgMintNft',
    color: colors.marketplace,
    displayName: 'Mint NFT'
  },
  '/cudoventures.cudosnode.marketplace.MsgAddAdmin': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgAddAdmin',
    color: colors.marketplace,
    displayName: 'Add Marketplace Admin'
  },
  '/cudoventures.cudosnode.marketplace.MsgUnverifyCollection': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgUnverifyCollection',
    color: colors.marketplace,
    displayName: 'Unverify NFT Collection'
  },
  '/cudoventures.cudosnode.marketplace.MsgVerifyCollection': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgVerifyCollection',
    color: colors.marketplace,
    displayName: 'Verify NFT Collection'
  },
  '/cudoventures.cudosnode.marketplace.MsgPublishCollection': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgPublishCollection',
    color: colors.marketplace,
    displayName: 'Publish NFT Collection'
  },
  '/cudoventures.cudosnode.marketplace.MsgCreateCollection': {
    typeUrl: 'cudoventures.cudosnode.marketplace.MsgCreateCollection',
    color: colors.marketplace,
    displayName: 'Create NFT Collection'
  },
  // ========================
  // addressbook
  // ========================
  '/cudoventures.cudosnode.addressbook.MsgDeleteAddress': {
    typeUrl: 'cudoventures.cudosnode.addressbook.MsgDeleteAddress',
    color: colors.addressbook,
    displayName: 'Delete address'
  },
  '/cudoventures.cudosnode.addressbook.MsgUpdateAddress': {
    typeUrl: 'cudoventures.cudosnode.addressbook.MsgUpdateAddress',
    color: colors.addressbook,
    displayName: 'Update address'
  },
  '/cudoventures.cudosnode.addressbook.MsgCreateAddress': {
    typeUrl: 'cudoventures.cudosnode.addressbook.MsgCreateAddress',
    color: colors.addressbook,
    displayName: 'Create address'
  },
}

export const unknownMessage = {
  typeUrl: 'unknown',
  color: 'gray',
  displayName: 'Unknown'
}

export const switchLedgerType = async (walletName: SUPPORTED_WALLET) => {

  const isInstalled = isExtensionEnabled(walletName)

  if (walletName === SUPPORTED_WALLET.Keplr && isInstalled) {
    return connectKeplrLedger()
  }

  if (walletName === SUPPORTED_WALLET.Cosmostation && isInstalled) {
    return connectCosmostationLedger()
  }

  throw new Error("Invalid ledger")
}

export const getLedgerSigner = async (
  connector: Cosmos,
  accountInfo: RequestAccountResponse
) => {
  const chainName = CHAIN_DETAILS.CHAIN_NAME
  const signer: OfflineAminoSigner = {
    getAccounts: async () => {
      return [
        {
          address: accountInfo.address,
          pubkey: accountInfo.publicKey,
          algo: 'secp256k1'
        }
      ]
    },
    signAmino: async (_, signDoc) => {
      const response = await connector.signAmino(
        chainName,
        signDoc as unknown as SignAminoDoc
      )

      return {
        signed: response.signed_doc,
        signature: {
          pub_key: response.pub_key,
          signature: response.signature
        }
      }
    }
  }
  return signer
}

const switchSigningClient = async (
  walletName: SUPPORTED_WALLET
): Promise<OfflineSigner | undefined> => {
  let client
  switch (walletName) {
    case SUPPORTED_WALLET.Keplr:
      client = await window.getOfflineSignerAuto(
        CHAIN_DETAILS.CHAIN_ID
      )
      return client
    case SUPPORTED_WALLET.Cosmostation: {
      const connector = await cosmos()

      const connectedAccount = await connector.requestAccount(
        CHAIN_DETAILS.CHAIN_NAME
      )

      if (connectedAccount.isLedger) {
        client = await getLedgerSigner(connector, connectedAccount)
        return client
      }

      client = await cosmostationSigner(CHAIN_DETAILS.CHAIN_ID)

      return client
    }
    default:
      return undefined
  }
}

export const signingClient = async (walletName: SUPPORTED_WALLET) => {
  const offlineSigner = await switchSigningClient(walletName)

  if (isExtensionEnabled(walletName)) {
    window.keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true
      }
    }
  }

  if (!offlineSigner) {
    throw new Error('Invalid signing client')
  }

  return SigningStargateClient.connectWithSigner(
    CHAIN_DETAILS.RPC_ADDRESS,
    offlineSigner
  )
}

export const getQueryClient = async (): Promise<StargateClient> => {

  try {
    const client = await StargateClient.connect(CHAIN_DETAILS.RPC_ADDRESS)
    return client

  } catch (error) {
    console.error(error.message)
    throw new Error('Failed to get query client')
  }

}
