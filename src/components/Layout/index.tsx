import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'
import LeftMenu from './LeftMenu'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      position="relative"
      sx={{
        paddingLeft: '2rem'
      }}
    >
      <Header />
      <Box display="flex" gap={4.5} flexGrow={1} sx={{ overflow: 'auto' }}>
        <LeftMenu />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column'
          }}
          flexGrow={1}
          flex={1}
          overflow="auto"
        >
          {children}
          <Footer />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
