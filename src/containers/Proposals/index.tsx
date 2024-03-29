import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Fade,
  Grid
} from '@mui/material'
import Card from 'components/Card'
import CrossIcon from 'assets/vectors/cross-blue.svg'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import NoData from 'components/NoData'
import { ModalStatus } from 'store/modal'
import VotingModal from './components/VotingModal'
import ProposalModal from './components/ProposalModal'
import DepositModal from './components/DepositModal'
import useModal from './components/ProposalModal/hooks'
import {
  useProposals,
  useProposalsSearch,
  useProposalsSubscription
} from './hooks'
import Proposal from './Proposal'
import SearchProposals from './components/SearchProposals/SearchProposals'

import { styles } from './styles'

const Proposals = () => {
  const { loadNextPage } = useProposals()
  useProposalsSearch()
  useProposalsSubscription()

  const { handleModal } = useModal()

  const proposalState = useSelector((state: RootState) => state.proposals)
  const { proposalData } = useSelector(
    (state: RootState) => state.modal.proposal
  )

  const displayTotal =
    proposalState.searchField !== ''
      ? proposalState.searchResultsTotal
      : proposalState.rawDataTotal

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
    if (
      Math.ceil(scrollTop + clientHeight) + 50 >= scrollHeight &&
      proposalState.hasNextPage &&
      !proposalState.searchField
    ) {
      await loadNextPage()
    }
  }

  return (
    <Fade in timeout={500}>
      <Box paddingRight='2rem' display="flex" flexDirection="column" gap={2} height="100%">
        <Box sx={styles.stickyHeader}>
          <Typography sx={styles.headerStyle}>Proposals</Typography>
          <Typography
            sx={styles.subheaderStyle}
            variant="subtitle1"
            color="text.secondary"
          >
            Here you can see the existing proposals’ statuses or create new one
          </Typography>
        </Box>
        <Grid justifyContent="center" container>
          <Grid xl={7} item>
            <Card onScroll={handleScroll} sx={styles.tableContainer}>
              <Box sx={styles.tableHeader}>
                <Typography
                  color="text.secondary"
                  sx={{ ...styles.subheaderStyle, marginTop: '5px' }}
                >
                  PROPOSALS
                </Typography>
                <Chip
                  label={displayTotal}
                  color="primary"
                  sx={styles.chipStyle}
                />
                <Box>
                  <SearchProposals />
                </Box>
                <Box sx={styles.createProposalBtnContainer}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      handleModal({
                        open: true,
                        status: ModalStatus.IN_PROGRESS,
                        fee: new BigNumber(0),
                        proposalData: { ...proposalData }
                      })
                    }
                    sx={styles.crateProposalBtn}
                  >
                    <img
                      style={{ marginRight: '10px' }}
                      src={CrossIcon}
                      alt="Cross"
                    />
                    Create Proposal
                  </Button>
                </Box>
              </Box>
              <Box>
                {!proposalState.items.length ? (
                  <Box sx={styles.circularProgress}>
                    {proposalState.loading ? (
                      <CircularProgress size={60} />
                    ) : (
                      <NoData />
                    )}
                  </Box>
                ) : (
                  <Proposal />
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
        <ProposalModal />
        <VotingModal />
        <DepositModal />
      </Box>
    </Fade>
  )
}

export default Proposals
