import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import StickyBox from 'react-sticky-box'

import DashboardIcon from '../../assets/vectors/dashboard.svg'
import ProposalsIcon from '../../assets/vectors/proposals.svg'
import SettingsIcon from '../../assets/vectors/settings.svg'
import StakingIcon from '../../assets/vectors/staking.svg'
import { NavigationButton, styles } from './styles'

const MenuItems = [
  { icon: DashboardIcon, link: '/dashboard' },
  { icon: StakingIcon, link: '/staking' },
  { icon: ProposalsIcon, link: '/proposals' },
  { icon: SettingsIcon, link: '/settings' }
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
    <StickyBox style={styles.menuContainer}>
      <Box display="flex" alignItems="center" flexDirection="column" gap={2}>
        {MenuItems.map((item, index) => (
          <Link to={item.link} key={item.link}>
            <NavigationButton
              value={index}
              key={item.link}
              selected={selected === index}
              onClick={() => setSelected(index)}
            >
              <img src={item.icon} alt="icon" />
            </NavigationButton>
          </Link>
        ))}
      </Box>
    </StickyBox>
  )
}

export default Menu
