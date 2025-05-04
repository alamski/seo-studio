import { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { CrawlData, Analysis } from '../types'
import { exportToCSV, exportToJSON, exportToExcel, exportAnalysis } from '../utils'

export const useExport = () => {
  const toast = useToast()

  const exportData = useCallback((data: CrawlData[], format: 'csv' | 'json' | 'excel') => {
    try {
      let content: string | Blob
      let filename: string
      const timestamp = new Date().toISOString().split('T')[0]

      switch (format) {
        case 'csv':
          content = exportToCSV(data)
          filename = `crawl-data-${timestamp}.csv`
          break
        case 'json':
          content = exportToJSON(data)
          filename = `crawl-data-${timestamp}.json`
          break
        case 'excel':
          content = exportToExcel(data)
          filename = `crawl-data-${timestamp}.xlsx`
          break
        default:
          throw new Error('Invalid export format')
      }

      const link = document.createElement('a')
      if (content instanceof Blob) {
        link.href = URL.createObjectURL(content)
      } else {
        const blob = new Blob([content], { type: 'text/plain' })
        link.href = URL.createObjectURL(blob)
      }
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export Complete',
        description: `Data has been exported as ${format.toUpperCase()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error exporting data:', error)
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [toast])

  const exportAnalysisReport = useCallback((analysis: Analysis) => {
    try {
      const content = exportAnalysis(analysis)
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `seo-analysis-${timestamp}.txt`

      const blob = new Blob([content], { type: 'text/plain' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export Complete',
        description: 'Analysis report has been exported',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error exporting analysis:', error)
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export analysis',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [toast])

  return {
    exportData,
    exportAnalysisReport
  }
} 