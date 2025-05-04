import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Navbar />
      <Box as="main" p={4}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default App 