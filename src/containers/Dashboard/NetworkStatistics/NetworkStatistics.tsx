import { Box, Grid, Typography } from '@mui/material'
import numeral from 'numeral'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import Card from 'components/Card'
import Big from 'big.js'
import { useOnlineVotingPower } from '../VotingPower/hooks'
import { useDataBlocks } from './Blocks/hooks'
import { useMarket } from './Market/hooks'

import { styles } from '../styles'

const NetworkStatistics = () => {
  const { apr } = useSelector((state: RootState) => state.market)
  const { state: votingState } = useOnlineVotingPower()
  const { state: blockState } = useDataBlocks()
  useMarket()

  const votingPowerPercent =
    votingState.totalVotingPower === 0
      ? numeral(0)
      : numeral((votingState.votingPower / votingState.totalVotingPower) * 100)

  return (
    <Card sx={styles.networkStatisticsCard}>
      <Grid item xs={12} md={12} lg={12} xl={12}>
        <Box
          sx={{
            marginBottom: '30px',
            flexDirection: 'column',
            display: 'flex'
          }}
        >
          <Typography sx={styles.subheaderStyle} color="text.secondary">
            NETWORK STATISTICS
          </Typography>
        </Box>
        <Box sx={styles.networkCardStyle}>
          <Typography color="text.secondary" sx={styles.networkCardTitleStyle}>
            ANNUAL PERCENTAGE RATE
          </Typography>
          <Typography sx={styles.networkCardContentStyle}>
            {`${Big(apr).times(100).toFixed(2)}%`}
          </Typography>
          <Typography color="primary.main" sx={styles.networkCardFooterStyle}>
            APR
          </Typography>
        </Box>
        <Box sx={styles.networkCardStyle}>
          <Typography color="text.secondary" sx={styles.networkCardTitleStyle}>
            TOTAL AMOUNT STAKED
          </Typography>
          <Typography sx={styles.networkCardContentStyle}>
            {numeral(votingState.totalVotingPower).format('0,0')}
          </Typography>
          <Typography color="primary.main" sx={styles.networkCardFooterStyle}>
            CUDOS
          </Typography>
        </Box>
        <Box sx={styles.networkCardStyle}>
          <Typography color="text.secondary" sx={styles.networkCardTitleStyle}>
            ACTIVE VALIDATORS
          </Typography>
          <Typography sx={styles.networkCardContentStyle}>
            {blockState.validators.active}
          </Typography>
          <Typography color="primary.main" sx={styles.networkCardFooterStyle}>
            All validators: {blockState.validators.total}
          </Typography>
        </Box>
        <Box sx={styles.networkCardStyle}>
          <Typography color="text.secondary" sx={styles.networkCardTitleStyle}>
            ONLINE VOTING POWER
          </Typography>
          <Typography
            sx={styles.networkCardContentStyle}
          >{`${votingPowerPercent.format('0,0.00', (n) => ~~n)}%`}</Typography>
          <Typography color="primary.main" sx={styles.networkCardFooterStyle}>
            {numeral(votingState.votingPower).format('0,0')} /{' '}
            {numeral(votingState.totalVotingPower).format('0,0')}
          </Typography>
        </Box>
        <Box sx={styles.networkCardStyle}>
          <Typography color="text.secondary" sx={styles.networkCardTitleStyle}>
            LATEST BLOCK
          </Typography>
          <Typography sx={styles.networkCardContentStyle}>
            {numeral(blockState.blockHeight).format('0,0')}
          </Typography>
          <Typography color="primary.main" sx={styles.networkCardFooterStyle}>
            BLOCK
          </Typography>
        </Box>
      </Grid>
    </Card>
  )
}

export default NetworkStatistics
