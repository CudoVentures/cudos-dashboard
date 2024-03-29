import { useEffect, useState } from 'react'
import {
  Typography,
  Box,
  InputAdornment,
  Button,
  Stack,
} from '@mui/material'
import {
  AccountBalanceWalletRounded as AccountBalanceWalletRoundedIcon,
  ArrowCircleRightRounded as ArrowCircleRightRoundedIcon
} from '@mui/icons-material'
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import {
  coin,
  DEFAULT_GAS_MULTIPLIER,
  GasPrice,
  MsgDelegateEncodeObject
} from 'cudosjs'
import {
  ModalStatus,
  DelegationModalProps,
  initialDelegationModalState
} from 'store/modal'
import { calculateFee, delegate } from 'ledgers/transactions'
import getMiddleEllipsis from 'utils/get_middle_ellipsis'
import AvatarName from 'components/AvatarName'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { RootState } from 'store'
import CosmosNetworkConfig from 'ledgers/CosmosNetworkConfig'
import { formatNumber, formatToken } from 'utils/format_token'
import _ from 'lodash'
import { signingClient } from 'ledgers/utils'
import { updateUser } from 'store/profile'
import { getStakedBalance, getWalletBalance } from 'utils/projectUtils'
import { fetchDelegations } from 'api/getAccountDelegations'
import { CHAIN_DETAILS } from 'utils/constants'
import { customInputProps } from './helpers'
import {
  ModalContainer,
  StyledTextField,
  SummaryContainer,
  CancelRoundedIcon,
} from '../styles'

const gasPrice = GasPrice.fromString(
  `${CHAIN_DETAILS.GAS_PRICE}${CosmosNetworkConfig.CURRENCY_DENOM}`
)

type DelegationProps = {
  modalProps: DelegationModalProps
  handleModal: (modalProps: Partial<DelegationModalProps>) => void
}

const Delegation: React.FC<DelegationProps> = ({ modalProps, handleModal }) => {
  const [balance, setBalance] = useState<string>('')
  const [delegationAmount, setDelegationAmount] = useState<string>('')
  const { validator, amount, fee } = modalProps

  const { address, connectedLedger } = useSelector(
    ({ profile }: RootState) => profile
  )
  const dispatch = useDispatch()

  useEffect(() => {
    let isMounted = true
    const loadBalance = async () => {
      const client = await signingClient(connectedLedger!)

      const walletBalance = await client.getBalance(
        address,
        CosmosNetworkConfig.CURRENCY_DENOM
      )
      if (isMounted) {
        setBalance(
          new BigNumber(walletBalance.amount)
            .dividedBy(CosmosNetworkConfig.CURRENCY_1_CUDO)
            .toString(10)
        )
      }
    }

    loadBalance()
    return () => {
      isMounted = false
    }
  }, [address])

  const getEstimatedFee = async (amount: string) => {
    const msg = MsgDelegate.fromPartial({
      delegatorAddress: address,
      validatorAddress: validator?.address,
      amount: coin(
        new BigNumber(amount || 0)
          .multipliedBy(CosmosNetworkConfig.CURRENCY_1_CUDO)
          .toString(10),
        CosmosNetworkConfig.CURRENCY_DENOM
      )
    })

    const msgAny: MsgDelegateEncodeObject = {
      typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
      value: msg
    }

    const client = await signingClient(connectedLedger!)

    const gasUsed = await client.simulate(address, [msgAny], 'memo')

    const gasLimit = Math.round(gasUsed * DEFAULT_GAS_MULTIPLIER)

    const calculatedFee = calculateFee(gasLimit, gasPrice).amount[0]

    return calculatedFee
  }

  const handleAmount = async (amount: string) => {
    handleModal({ amount })
    let fee = ''

    if (Number(amount) > 0) {
      const estimatedFee = await getEstimatedFee(amount)

      fee = formatToken(
        estimatedFee.amount,
        CosmosNetworkConfig.CURRENCY_DENOM
      ).value
    }

    handleModal({
      fee,
      amount
    })
  }

  const delayInput = _.debounce((value) => handleAmount(value), 500)

  const handleMaxAmount = async () => {
    let fee = ''

    if (Number(balance) > 0) {
      const estimatedFee = await getEstimatedFee(balance)

      fee = formatToken(
        estimatedFee.amount,
        CosmosNetworkConfig.CURRENCY_DENOM
      ).value
    }

    const amount = (Number(balance) - Math.ceil(Number(fee) * 4)).toString() // multiplying by 4 because of Keplr

    setDelegationAmount(amount)
    handleModal({
      fee,
      amount
    })
  }

  const handleSubmit = async (): Promise<void> => {
    handleModal({ status: ModalStatus.LOADING })

    try {
      const delegationResult = await delegate(
        address,
        validator?.address || '',
        amount || '',
        '',
        connectedLedger!
      )

      handleModal({
        status: ModalStatus.SUCCESS,
        gasUsed: delegationResult.gasUsed,
        txHash: delegationResult.transactionHash
      })

      const walletBalance = await getWalletBalance(address)
      const { delegationsArray } = await fetchDelegations(
        address
      )
      const stakedAmountBalance = await getStakedBalance(
        address
      )

      dispatch(
        updateUser({
          balance: walletBalance,
          delegations: delegationsArray,
          stakedBalance: new BigNumber(stakedAmountBalance)
        })
      )
    } catch (e) {
      handleModal({
        status: ModalStatus.FAILURE,
        failureMessage: {
          title: 'Delegation Failed!',
          subtitle:
            e.message === 'Request rejected'
              ? 'Request rejected by the user'
              : 'Seems like something went wrong with executing the transaction. Try again or check your wallet balance.'
        }
      })
    }
  }

  const handleClose = () => {
    handleModal({
      ...initialDelegationModalState
    })
  }

  useEffect(() => {
    delayInput(delegationAmount)

    return () => delayInput.cancel()
  }, [delegationAmount])

  return (
    validator && (
      <>
        <ModalContainer>
          <Typography variant="h5" fontWeight={900} textAlign="center">
            Delegate CUDOS
          </Typography>
          <CancelRoundedIcon onClick={handleClose} />
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={6}
              >
                <Typography variant="body2" fontWeight={700}>
                  Connected account address
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Network
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {CHAIN_DETAILS.CHAIN_NAME}
                  </Typography>
                </Box>
              </Box>
              <StyledTextField
                variant="standard"
                margin="dense"
                fullWidth
                disabled
                value={address}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '12px'
                  },
                  inputProps: {
                    style: {
                      padding: 0
                    }
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceWalletRoundedIcon
                        sx={({ palette }) => ({
                          color: palette.primary.main
                        })}
                      />
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Validator
              </Typography>
              <StyledTextField
                variant="standard"
                margin="dense"
                fullWidth
                disabled
                value={getMiddleEllipsis(validator?.address, {
                  beginning: 12,
                  ending: 4
                })}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '12px'
                  },
                  inputProps: {
                    style: {
                      padding: 0
                    }
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <AvatarName
                        name={validator?.name}
                        imageUrl={validator?.imageUrl}
                        address={validator?.address}
                      />
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </Box>
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={6}
              >
                <Typography variant="body2" fontWeight={700}>
                  Amount
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
                  >
                    Balance
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {formatNumber(balance.toString(), 2)} CUDOS
                  </Typography>
                </Box>
              </Box>
              <StyledTextField
                variant="standard"
                type="number"
                fullWidth
                onPaste={(e) => e.preventDefault()}
                InputProps={
                  customInputProps(
                    delegationAmount,
                    setDelegationAmount,
                    handleMaxAmount
                  )
                }
                sx={(theme) => ({
                  background: theme.custom.backgrounds.light
                })}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={() => ({
              width: '50%'
            })}
            onClick={() => handleSubmit()}
            disabled={
              Number(amount) > Number(balance) ||
              !amount ||
              Number(amount) <= 0 ||
              fee.length <= 0
            }
          >
            Submit
          </Button>
        </ModalContainer>
        <SummaryContainer show={!!amount}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            letterSpacing={1}
            sx={{ alignSelf: 'center', display: 'flex' }}
          >
            Transaction summary
          </Typography>
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography color="text.secondary" variant="body2">
                From
              </Typography>
              <Typography variant="body2">
                {getMiddleEllipsis(address, {
                  beginning: 12,
                  ending: 4
                })}
              </Typography>
            </Box>
            <ArrowCircleRightRoundedIcon
              sx={(theme) => ({
                color: theme.palette.primary.main,
                border: 'none'
              })}
            />
            <Box>
              <Typography color="text.secondary" variant="body2">
                To
              </Typography>
              <Typography variant="body2">
                {getMiddleEllipsis(validator?.address, {
                  beginning: 12,
                  ending: 4
                })}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={4} alignSelf="flex-start">
            <Box>
              <Typography color="text.secondary" variant="body2">
                Amount
              </Typography>
              <Typography variant="body2">{amount} CUDOS</Typography>
            </Box>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography color="text.secondary" variant="body2">
                  Estimated Transaction fee
                </Typography>
              </Stack>
              <Typography variant="body2">{fee} CUDOS</Typography>
            </Box>
          </Box>
        </SummaryContainer>
      </>
    )
  )
}

export default Delegation
