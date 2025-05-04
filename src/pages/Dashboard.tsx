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
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FiBarChart2, FiMessageSquare, FiSettings } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { Link as RouterLink } from 'react-router-dom'
import FileUpload from '../components/FileUpload'

const Dashboard = () => {
  const { state } = useApp()

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Dashboard</Heading>
          <Text>Welcome to SEO Studio. Upload your Screaming Frog export to begin analysis.</Text>
        </Box>

        <FileUpload />

        {state.crawlData.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Crawl Summary</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Stat>
                  <StatLabel>Total URLs</StatLabel>
                  <StatNumber>{state.crawlData.length}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Status Codes</StatLabel>
                  <StatNumber>
                    {Object.entries(state.crawlData.reduce((acc: Record<string, number>, row: any) => {
                      const code = row['Status Code'] || 'unknown'
                      acc[code] = (acc[code] || 0) + 1
                      return acc
                    }, {})).map(([code, count]) => (
                      <Badge key={code} colorScheme={code.startsWith('2') ? 'green' : code.startsWith('3') ? 'blue' : code.startsWith('4') ? 'orange' : 'red'} mr={2}>
                        {code}: {count}
                      </Badge>
                    ))}
                  </StatNumber>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card as={RouterLink} to="/analysis" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Icon as={FiBarChart2} boxSize={8} color="blue.500" />
                <Box>
                  <Heading size="md">Analysis</Heading>
                  <Text>View detailed SEO analysis of your website</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card as={RouterLink} to="/chat" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Icon as={FiMessageSquare} boxSize={8} color="green.500" />
                <Box>
                  <Heading size="md">Chat</Heading>
                  <Text>Get AI-powered insights about your SEO</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          <Card as={RouterLink} to="/settings" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <VStack align="start" spacing={4}>
                <Icon as={FiSettings} boxSize={8} color="purple.500" />
                <Box>
                  <Heading size="md">Settings</Heading>
                  <Text>Configure your SEO Studio preferences</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  )
}

export default Dashboard 