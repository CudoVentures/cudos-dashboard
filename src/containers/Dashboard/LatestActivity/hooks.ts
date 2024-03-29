/* eslint-disable import/prefer-default-export */
import { useState } from 'react'
import {
  useTransactionsListenerSubscription,
  TransactionsListenerSubscription
} from 'graphql/types'
import { TransactionsState } from './types'

export const useTransactions = () => {
  const [state, setState] = useState<TransactionsState>({
    items: []
  })

  const formatTransactions = (data: TransactionsListenerSubscription) => {
    return data.transactions.map(
      (x: {
        height: number
        hash: string
        success: boolean
        block: { timestamp: string }
        messages: string | any[]
      }) => {
        return {
          height: x.height,
          hash: x.hash,
          success: x.success,
          timestamp: x.block.timestamp,
          messages: x.messages.length
        }
      }
    )
  }

  // ================================
  // txs subscription
  // ================================
  useTransactionsListenerSubscription({
    onSubscriptionData: (data: any) => {
      setState({
        items: formatTransactions(data.subscriptionData.data)
      })
    }
  })

  return {
    state
  }
}
