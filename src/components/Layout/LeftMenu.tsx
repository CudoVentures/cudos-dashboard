import { useState } from 'react'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'

import DashboardIcon from '../../assets/vectors/dashboard.svg'
import ProposalsIcon from '../../assets/vectors/proposals.svg'
import SettingsIcon from '../../assets/vectors/settings.svg'
import StakingIcon from '../../assets/vectors/staking.svg'
import { StyledBox, StyledToggleButton } from './styles'

const MenuItems = [
  { icon: DashboardIcon, link: '/' },
  { icon: StakingIcon, link: '/staking' },
  { icon: ProposalsIcon, link: '/proposals' },
  { icon: SettingsIcon, link: '/settings' }
]

const Menu = () => {
  const [selected, setSelected] = useState<number>(0)

  return (
    <StyledBox>
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        {MenuItems.map((item, index) => (
          <Link to={item.link} key={item.link}>
            <StyledToggleButton
              value={index}
              key={item.link}
              selected={selected === index}
              onClick={() => setSelected(index)}
            >
              <img src={item.icon} alt="icon" />
            </StyledToggleButton>
          </Link>
        ))}
      </Box>
    </StyledBox>
  )
}

export default Menu
