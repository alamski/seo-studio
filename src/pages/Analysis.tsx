import React from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Progress,
  ProgressLabel,
  List,
  ListItem,
  ListIcon,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiAlertCircle, FiExternalLink, FiCheckCircle } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

const Analysis: React.FC = () => {
  const { state } = useApp()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Container maxW="container.xl" py={8}>
      <Box
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={6}
        shadow="sm"
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg">SEO Analysis</Heading>
          <Text>Upload your SEO data file to begin analysis.</Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default Analysis 