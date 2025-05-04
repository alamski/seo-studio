import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FiUpload, FiBarChart2, FiMessageSquare, FiSettings } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { Link as RouterLink } from 'react-router-dom'

const Dashboard = () => {
  const { state, dispatch } = useApp()
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const text = await file.text()
      const rows = text.split('\n')
      const headers = rows[0].split(';')
      const data = rows.slice(1).map(row => {
        const values = row.split(';')
        return headers.reduce((obj: any, header, index) => {
          obj[header] = values[index]
          return obj
        }, {})
      }).filter(row => Object.keys(row).length > 1)

      dispatch({ type: 'SET_CRAWL_DATA', payload: data })
      toast({
        title: 'File Uploaded',
        description: 'Your Screaming Frog data has been uploaded successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error during file upload:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Welcome to SEO Studio</Heading>
          <Text color="gray.600">Upload your Screaming Frog CSV file to begin analyzing your website's SEO performance.</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card as={RouterLink} to="/analysis" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <VStack align="center" spacing={4}>
                <Icon as={FiBarChart2} boxSize={8} color="blue.500" />
                <Text fontWeight="bold">SEO Analysis</Text>
                <Text textAlign="center" fontSize="sm" color="gray.600">
                  View detailed SEO metrics and issues
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card as={RouterLink} to="/chat" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <VStack align="center" spacing={4}>
                <Icon as={FiMessageSquare} boxSize={8} color="green.500" />
                <Text fontWeight="bold">AI Chat</Text>
                <Text textAlign="center" fontSize="sm" color="gray.600">
                  Get AI-powered insights about your SEO data
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card as={RouterLink} to="/settings" _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }} transition="all 0.2s">
            <CardBody>
              <VStack align="center" spacing={4}>
                <Icon as={FiSettings} boxSize={8} color="purple.500" />
                <Text fontWeight="bold">Settings</Text>
                <Text textAlign="center" fontSize="sm" color="gray.600">
                  Configure your API keys and preferences
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">Upload Screaming Frog CSV</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <Button
                as="label"
                htmlFor="file-upload"
                colorScheme="blue"
                leftIcon={<FiUpload />}
                isLoading={loading}
                loadingText="Uploading..."
                size="lg"
                w="full"
                maxW="md"
              >
                Choose File
              </Button>
              <Text fontSize="sm" color="gray.600">
                Upload your Screaming Frog CSV export to begin analysis
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {state.error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <Box textAlign="center" py={8}>
            <Spinner size="xl" />
            <Text mt={4}>Processing your file...</Text>
          </Box>
        )}

        {state.crawlData.length > 0 && (
          <Card>
            <CardHeader>
              <Heading size="md">Recent Upload</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
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
      </VStack>
    </Container>
  )
}

export default Dashboard 