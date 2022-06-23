import { useEffect, useState } from 'react'
import { Box, ToggleButton } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import DashboardIcon from 'assets/vectors/dashboard.svg?component'
import ProposalsIcon from 'assets/vectors/proposals.svg?component'
import StakingIcon from 'assets/vectors/staking.svg?component'

import { styles } from './styles'

const MenuItems = [
  { icon: <DashboardIcon />, link: '/dashboard', text: 'Dashboard' },
  { icon: <StakingIcon />, link: '/staking', text: 'Staking' },
  { icon: <ProposalsIcon />, link: '/proposals', text: 'Proposals' }
]

const Menu = () => {
  const [selected, setSelected] = useState<number>(0)
  const { pathname } = useLocation()

  useEffect(() => {
    const selectedIndex = MenuItems.findIndex(
      (menuItem) => menuItem.link === pathname
    )
    setSelected(selectedIndex)
  }, [pathname])

  return (
    <Box sx={styles.menuContainer}>
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        {MenuItems.map((item, index) => (
          <Link to={item.link} key={item.link}>
            <ToggleButton
              sx={styles.navigationButton}
              value={index}
              key={item.link}
              selected={selected === index}
              onClick={() => setSelected(index)}
            >
              {item.icon}
            </ToggleButton>
          </Link>
        ))}
      </Box>
    </Box>
  )
}

export default Menu
