import { useEffect } from 'react'
import * as R from 'ramda'
import numeral from 'numeral'
import Big from 'big.js'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { ValidatorType, updateValidators } from 'store/validator'
import { getValidatorCondition } from 'utils/get_validator_condition'
import { formatToken } from 'utils/format_token'
import { useValidatorsQuery, ValidatorsQuery } from 'graphql/types'
import { StakingParams, SlashingParams } from 'models'

export default () => {
  const dispatch = useDispatch()

  const sortKey = useSelector((state: RootState) => state.validator.sortKey)
  const filter = useSelector((state: RootState) => state.validator.filter)
  const sortDirection = useSelector(
    (state: RootState) => state.validator.sortDirection
  )
  const items = useSelector((state: RootState) => state.validator.items)
  const tab = useSelector((state: RootState) => state.validator.tab)
  const address = useSelector((state: RootState) => state.profile.address)

  const stakedValidators = useSelector(
    (state: RootState) => state.profile.stakedValidators
  ).map((validator) => validator.address)
  const stakedBalance = useSelector((state: RootState) =>
    Number(state.profile.stakedBalance)
  )

  const handleSetState = (stateChange: any) => {
    dispatch(updateValidators({ ...stateChange }))
  }

  const formatValidators = (data: ValidatorsQuery) => {
    const stakingParams = StakingParams.fromJson(
      R.pathOr({}, ['stakingParams', 0, 'params'], data)
    )
    const slashingParams = SlashingParams.fromJson(
      R.pathOr({}, ['slashingParams', 0, 'params'], data)
    )
    const votingPowerOverall =
      numeral(
        formatToken(
          R.pathOr(0, ['stakingPool', 0, 'bondedTokens'], data),
          stakingParams.bondDenom
        ).value
      ).value() || 0

    const { signedBlockWindow } = slashingParams

    let formattedItems: ValidatorType[] = data.validator
      .filter((x) => x.validatorInfo)
      .map((x) => {
        const votingPower = R.pathOr(
          0,
          ['validatorVotingPowers', 0, 'votingPower'],
          x
        )
        const votingPowerPercent =
          numeral((votingPower / votingPowerOverall) * 100).value() || 0
        const totalDelegations = x.validatorInfo?.delegations.reduce((a, b) => {
          return (
            a + (numeral(R.pathOr(0, ['amount', 'amount'], b)).value() || 0)
          )
        }, 0)

        const [selfDelegation] = x.validatorInfo?.delegations.filter((y) => {
          return y.delegatorAddress === x.validatorInfo?.selfDelegateAddress
        }) || [0]
        const self = numeral(
          R.pathOr(0, ['amount', 'amount'], selfDelegation)
        ).value()
        const selfPercent = ((self || 0) / (totalDelegations || 1)) * 100

        const missedBlockCounter = R.pathOr(
          0,
          ['validatorSigningInfos', 0, 'missedBlocksCounter'],
          x
        )
        const condition = getValidatorCondition(
          signedBlockWindow,
          missedBlockCounter
        )
        const myDelegation = x.validatorInfo?.delegations.find(
          (delegation) => delegation.delegatorAddress === address
        )

        return {
          validator: x.validatorInfo?.operatorAddress || '',
          votingPower,
          votingPowerPercent,
          commission:
            R.pathOr(0, ['validatorCommissions', 0, 'commission'], x) * 100,
          self,
          selfPercent,
          condition,
          status: R.pathOr(0, ['validatorStatuses', 0, 'status'], x),
          jailed: R.pathOr(false, ['validatorStatuses', 0, 'jailed'], x),
          tombstoned: R.pathOr(
            false,
            ['validatorSigningInfos', 0, 'tombstoned'],
            x
          ),
          delegators: x.validatorInfo?.delegations.length || 0,
          avatarUrl: R.pathOr('', ['validatorDescription', 0, 'avatarUrl'], x),
          moniker: R.pathOr('', ['validatorDescription', 0, 'moniker'], x),
          myDelegation: myDelegation
            ? Number(myDelegation?.amount.amount)
            : undefined
        }
      })

    // get the top 34% validators
    formattedItems = formattedItems.sort((a, b) => {
      return a.votingPower > b.votingPower ? -1 : 1
    })

    // add key to indicate they are part of top 34%
    let cumulativeVotingPower = Big(0)
    let reached = false
    formattedItems.forEach((x) => {
      if (x.status === 3) {
        const totalVp = cumulativeVotingPower.add(x.votingPowerPercent || 0)
        if (totalVp.lte(34) && !reached) {
          x.topVotingPower = true
        }

        if (totalVp.gt(34) && !reached) {
          x.topVotingPower = true
          reached = true
        }

        cumulativeVotingPower = totalVp
      }
    })

    return {
      votingPowerOverall,
      items: formattedItems
    }
  }

  const handleSort = (key: string) => {
    if (key === sortKey) {
      dispatch(
        updateValidators({
          sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
        })
      )
    } else {
      dispatch(
        updateValidators({
          sortKey: key,
          sortDirection: 'desc' // new key so we start the sort by asc
        })
      )
    }
  }

  const sortItems = (items: ValidatorType[]) => {
    let sorted: ValidatorType[] = R.clone(items)

    if (tab === 0) {
      sorted = sorted.filter((x) => x.status === 3)
    }

    if (tab === 1) {
      sorted = sorted.filter((x) => x.status !== 3)
    }

    if (tab === 2) {
      sorted = sorted.filter((x) => stakedValidators.includes(x.validator))
    }

    if (sortKey && sortDirection) {
      sorted.sort((a, b) => {
        let compareA = R.pathOr<number | string>(0, [sortKey], a)
        let compareB = R.pathOr<number | string>(0, [sortKey], b)

        if (typeof compareA === 'string' && typeof compareB === 'string') {
          compareA = compareA.toLowerCase()
          compareB = compareB.toLowerCase()
        }

        if (compareA < compareB) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (compareA > compareB) {
          return sortDirection === 'asc' ? 1 : -1
        }

        return 0
      })
    }

    if (filter) {
      sorted = sorted.filter(
        (x) => x.moniker.toUpperCase().indexOf(filter) > -1
      )
    }

    return sorted
  }

  const handleSearch = (input: string) => {
    const filter = input.toUpperCase()

    handleSetState({ filter })
  }

  // ==========================
  // Fetch Data
  // ==========================
  const validatorsQuery = useValidatorsQuery({
    onCompleted: (data) => {
      handleSetState({
        loading: false,
        ...formatValidators(data)
      })
    }
  })

  useEffect(() => {
    const fetchValidators = async () => {
      await validatorsQuery.fetchMore({}).then(({ data }) => {
        handleSetState({
          delegations: {
            loading: false,
            ...formatValidators(data)
          }
        })
      })
    }

    // fetching with a timeout to give time for the delegations to update
    setTimeout(async () => {
      await fetchValidators()
    }, 5000)
  }, [address, stakedBalance])

  useEffect(() => {
    return handleSearch('')
  }, [])

  return {
    state: {
      sortDirection,
      sortKey,
      items,
      filter
    },
    handleSort,
    sortItems,
    handleSearch
  }
}
