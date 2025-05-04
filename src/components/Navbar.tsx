import { Box, Flex, Link, Button, useColorMode, IconButton, Text } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { FiSun, FiMoon } from 'react-icons/fi'

const Navbar = () => {
  console.log('Navbar component rendering')
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()

  return (
    <Box as="nav" bg="white" _dark={{ bg: 'gray.800' }} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={8}>
          <Text fontSize="xl" fontWeight="bold">SEO Studio</Text>
          <Flex gap={4}>
            <Link
              as={RouterLink}
              to="/"
              color={location.pathname === '/' ? 'blue.500' : 'gray.600'}
              _dark={{ color: location.pathname === '/' ? 'blue.300' : 'gray.300' }}
              fontWeight="medium"
            >
              Dashboard
            </Link>
            <Link
              as={RouterLink}
              to="/chat"
              color={location.pathname === '/chat' ? 'blue.500' : 'gray.600'}
              _dark={{ color: location.pathname === '/chat' ? 'blue.300' : 'gray.300' }}
              fontWeight="medium"
            >
              Chat
            </Link>
            <Link
              as={RouterLink}
              to="/settings"
              color={location.pathname === '/settings' ? 'blue.500' : 'gray.600'}
              _dark={{ color: location.pathname === '/settings' ? 'blue.300' : 'gray.300' }}
              fontWeight="medium"
            >
              Settings
            </Link>
          </Flex>
        </Flex>
        <Flex alignItems="center" gap={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 