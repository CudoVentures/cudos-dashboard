import { Box, Button, Tooltip, Typography, Divider } from '@mui/material'
import { ArrowUpwardRounded as ArrowUpwardRoundedIcon } from '@mui/icons-material'
import LinkIcon from 'assets/vectors/link-icon.svg?component'
import Card from 'components/Card'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { RootState } from 'store'
import { formatAddress, formatDateTime } from 'utils/projectUtils'
import { proposalStatus } from 'containers/Proposals/proposalStatus'
import { proposalType } from 'containers/Proposals/proposalType'
import { ModalStatus } from 'store/modal'
import useVotingModal from '../../../components/VotingModal/hooks'
import useDepositModal from '../../../components/DepositModal/hooks'
import { CHAIN_DETAILS } from 'utils/constants'
import { COLORS_DARK_THEME } from 'theme/colors'
import Markdown from 'components/Markdown'
import { styles } from '../../../styles'
import { Fragment } from 'react'

interface Change {
  key: string;
  value: string;
  subspace: string;
}

const ProposalInformation = () => {
  const { overview } = useSelector((state: RootState) => state.proposalDetails)
  const { handleModal: handleVotingModal } = useVotingModal()
  const { handleModal: handleDepositModal } = useDepositModal()

  const handleExplorer = (address: string) => {
    window.open(
      `${CHAIN_DETAILS.EXPLORER_URL}/accounts/${address}`,
      '_blank'
    )
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute' }}>
          <Typography color="text.secondary" sx={styles.cardEnumeration}>
            {`#${overview.id}`}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography sx={styles.cardTitle}>{overview.title}</Typography>
          </Box>
          {overview.status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? (
            <Box sx={{ position: 'relevant' }}>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleVotingModal({
                      open: true,
                      status: ModalStatus.IN_PROGRESS,
                      id: overview.id,
                      title: overview.title,
                      fee: new BigNumber(0)
                    })
                  }
                  sx={styles.cardActionButton}
                >
                  Vote Now
                </Button>
              </Box>
              <Box sx={{ position: 'absolute', marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={
                    <ArrowUpwardRoundedIcon
                      fontSize="small"
                      sx={{ transform: 'rotate3d(0, 0, 1, 0.125turn)' }}
                    />
                  }
                  onClick={() =>
                    handleDepositModal({
                      open: true,
                      status: ModalStatus.IN_PROGRESS,
                      id: overview.id,
                      title: overview.title,
                      amount: '',
                      fee: new BigNumber(0)
                    })
                  }
                  sx={styles.cardActionButton}
                >
                  Deposit
                </Button>
              </Box>
            </Box>
          ) : null}
          {overview.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD' ? (
            <Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={
                  <ArrowUpwardRoundedIcon
                    fontSize="small"
                    sx={{ transform: 'rotate3d(0, 0, 1, 0.125turn)' }}
                  />
                }
                onClick={() =>
                  handleDepositModal({
                    open: true,
                    status: ModalStatus.IN_PROGRESS,
                    id: overview.id,
                    title: overview.title,
                    amount: '',
                    fee: new BigNumber(0)
                  })
                }
                sx={styles.cardActionButton}
              >
                Deposit
              </Button>
            </Box>
          ) : null}
        </Box>
        <Markdown text={overview.description} />
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              marginLeft: '50px',
              marginTop: '50px',
              width: '85%'
            }}
          >
            <Box sx={{ flex: '0 1 15%' }}>
              <Typography
                sx={{
                  fontSize: '14px'
                }}
              >
                Proposal Type
              </Typography>
              <Box>
                <Typography color="text.secondary" sx={styles.proposerAddress}>
                  {overview?.content['@type'].length
                    ? proposalType(overview?.content['@type'])
                    : null}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: '0 1 25%' }}>
              <Typography
                sx={{
                  fontSize: '14px'
                }}
              >
                Proposer
              </Typography>
              <Box>
                <Typography color="primary.main" sx={styles.proposerAddress}>
                  {formatAddress(overview.proposer, 18)}
                  <Tooltip
                    onClick={() => handleExplorer(overview.proposer)}
                    title="Go to Explorer"
                  >
                    <Box>
                      <LinkIcon
                        style={{
                          marginLeft: '10px',
                          cursor: 'pointer',
                          color: COLORS_DARK_THEME.PRIMARY_BLUE
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: '14px'
                }}
              >
                Status
              </Typography>
              <Box>{proposalStatus(overview.status)}</Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', margin: '20px 0px 10px 50px' }}>
          <Typography fontSize={14} sx={{ gridColumn: 1, gridRow: 1 }}>
            Changes
          </Typography>
          <Typography variant='subtitle2' color={'text.secondary'} sx={{ gridColumn: 2, gridRow: 2 }} >
            Subspace
          </Typography>
          <Typography variant='subtitle2' color={'text.secondary'} sx={{ gridColumn: 3, gridRow: 2 }} >
            Key
          </Typography>
          <Typography variant='subtitle2' color={'text.secondary'} sx={{ gridColumn: 4, gridRow: 2 }} >
            Value
          </Typography>
          {overview.content.changes?.map((item: Change, idx: number) => {
            return (
              <Fragment>
                <Typography variant='subtitle2' sx={{ gridColumn: 2, gridRow: idx + 3 }} >
                  {item.subspace}
                </Typography>
                <Typography variant='subtitle2' sx={{ gridColumn: 3, gridRow: idx + 3 }} >
                  {item.key}
                </Typography>
                <Typography variant='subtitle2' sx={{ gridColumn: 4, gridRow: idx + 3 }} >
                  {item.value}
                </Typography>
              </Fragment>
            )
          })}
        </Box>
        <Divider
          sx={{
            width: '92%',
            marginLeft: '50px',
            marginTop: '30px',
            borderBottomWidth: 2
          }}
        />
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              marginLeft: '50px',
              marginTop: '30px',
              width: '100%'
            }}
          >
            <Box sx={{ flex: '0 0 15%' }}>
              <Typography
                sx={{
                  fontSize: '14px'
                }}
              >
                Submit Time
              </Typography>
              <Typography color="text.secondary" sx={styles.timeStyle}>
                {formatDateTime(overview.submitTime)}
              </Typography>
            </Box>
            <Box sx={{ flex: '0 0 55%' }}>
              <Typography
                sx={{
                  fontSize: '14px'
                }}
              >
                Deposit End Time
              </Typography>
              <Typography color="text.secondary" sx={styles.timeStyle}>
                {formatDateTime(overview.depositEndTime)}
              </Typography>
            </Box>
            {overview.status === 'PROPOSAL_STATUS_VOTING_PERIOD' ? (
              <>
                <Box sx={{ flex: '0 1 20%' }}>
                  <Typography
                    sx={{
                      fontSize: '14px'
                    }}
                  >
                    Voting Start Time
                  </Typography>
                  <Typography color="text.secondary" sx={styles.timeStyle}>
                    {formatDateTime(overview.votingStartTime)}
                  </Typography>
                </Box>
                <Box sx={{ flex: '0 1 20%' }}>
                  <Typography
                    sx={{
                      fontSize: '14px'
                    }}
                  >
                    Voting End Time
                  </Typography>
                  <Typography color="text.secondary" sx={styles.timeStyle}>
                    {formatDateTime(overview.votingEndTime)}
                  </Typography>
                </Box>
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default ProposalInformation
