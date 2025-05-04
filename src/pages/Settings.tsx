import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  useToast,
  Divider,
  Select,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { FiEye, FiEyeOff, FiSave, FiRefreshCw } from 'react-icons/fi'
import { useApp } from '../context/AppContext'

interface Settings {
  openaiApiKey: string
  darkMode: boolean
  exportFormat: 'csv' | 'json' | 'excel'
  maxExportRows: number
  autoSave: boolean
  notifications: boolean
  defaultView: 'dashboard' | 'analysis' | 'chat'
}

const Settings: React.FC = () => {
  const { state: { loading }, dispatch } = useApp()
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    openaiApiKey: localStorage.getItem('openaiApiKey') || '',
    darkMode: localStorage.getItem('darkMode') === 'true',
    exportFormat: (localStorage.getItem('exportFormat') as Settings['exportFormat']) || 'csv',
    maxExportRows: parseInt(localStorage.getItem('maxExportRows') || '1000'),
    autoSave: localStorage.getItem('autoSave') === 'true',
    notifications: localStorage.getItem('notifications') === 'true',
    defaultView: (localStorage.getItem('defaultView') as Settings['defaultView']) || 'dashboard'
  })
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleSave = () => {
    try {
      // Save settings to localStorage
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, value.toString())
      })

      // Update theme if dark mode changed
      if (settings.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleReset = () => {
    setSettings({
      openaiApiKey: '',
      darkMode: false,
      exportFormat: 'csv',
      maxExportRows: 1000,
      autoSave: true,
      notifications: true,
      defaultView: 'dashboard'
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <Heading size="lg">Settings</Heading>
            <HStack>
              <Button
                leftIcon={<FiRefreshCw />}
                onClick={handleReset}
                variant="outline"
              >
                Reset to Default
              </Button>
              <Button
                leftIcon={<FiSave />}
                colorScheme="blue"
                onClick={handleSave}
                isLoading={loading}
              >
                Save Changes
              </Button>
            </HStack>
          </HStack>
        </Box>

        <Stack spacing={8}>
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">API Configuration</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>OpenAI API Key</FormLabel>
                  <HStack>
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.openaiApiKey}
                      onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                      placeholder="Enter your OpenAI API key"
                    />
                    <IconButton
                      aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                      icon={showApiKey ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowApiKey(!showApiKey)}
                    />
                  </HStack>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Appearance</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Dark Mode</FormLabel>
                  <Switch
                    isChecked={settings.darkMode}
                    onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Default View</FormLabel>
                  <Select
                    value={settings.defaultView}
                    onChange={(e) => setSettings({ ...settings, defaultView: e.target.value as Settings['defaultView'] })}
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="analysis">Analysis</option>
                    <option value="chat">Chat</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Export Settings</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Default Export Format</FormLabel>
                  <Select
                    value={settings.exportFormat}
                    onChange={(e) => setSettings({ ...settings, exportFormat: e.target.value as Settings['exportFormat'] })}
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="excel">Excel</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Maximum Export Rows</FormLabel>
                  <NumberInput
                    value={settings.maxExportRows}
                    onChange={(_, value) => setSettings({ ...settings, maxExportRows: value })}
                    min={100}
                    max={10000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Preferences</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Auto-save Analysis</FormLabel>
                  <Switch
                    isChecked={settings.autoSave}
                    onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Enable Notifications</FormLabel>
                  <Switch
                    isChecked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </Stack>
      </VStack>
    </Container>
  )
}

export default Settings 