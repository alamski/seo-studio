import { useState, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'

interface Settings {
  openaiApiKey: string
  darkMode: boolean
  exportFormat: 'csv' | 'json' | 'excel'
  maxExportRows: number
  autoSave: boolean
  notifications: boolean
  defaultView: 'dashboard' | 'analysis' | 'chat'
}

const defaultSettings: Settings = {
  openaiApiKey: '',
  darkMode: false,
  exportFormat: 'csv',
  maxExportRows: 1000,
  autoSave: true,
  notifications: true,
  defaultView: 'dashboard'
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings')
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings
  })
  const toast = useToast()

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('settings', JSON.stringify(updated))
      return updated
    })
    toast({
      title: 'Settings Updated',
      description: 'Your settings have been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }, [toast])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
    localStorage.setItem('settings', JSON.stringify(defaultSettings))
    toast({
      title: 'Settings Reset',
      description: 'Your settings have been reset to default values.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }, [toast])

  return {
    settings,
    updateSettings,
    resetSettings
  }
} 