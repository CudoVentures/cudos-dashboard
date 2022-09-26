import axios from 'axios'
import BigNumber from 'bignumber.js'
import { formatBigNum } from 'utils/projectUtils'
import { AccountUnbondingBalanceDocument } from '../graphql/account_actions'

export const getUnbondingBalance = async (
  address: string,
  signal?: AbortSignal
) => {
  const defaultReturnValue = new BigNumber(0)
  let balance: BigNumber

  try {
    const { data } = await axios.post(
      import.meta.env.VITE_GRAPHQL_URL?.toString(),
      {
        variables: { address },
        query: AccountUnbondingBalanceDocument
      },
      {
        signal
      }
    )

    balance = data.data.unbondingBalance.coins[0].amount

    return {
      unbondingBalance: formatBigNum(balance)
    }
  } catch (error) {
    return { unbondingBalance: defaultReturnValue }
  }
}