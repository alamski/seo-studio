import { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { useApp } from '../context'
import { CrawlData, Analysis } from '../types'
import { analyzeCrawlData, validateCrawlData } from '../utils'

export const useAnalysis = () => {
  const { state, dispatch } = useApp()
  const toast = useToast()

  const analyze = useCallback(async (data: CrawlData[]) => {
    try {
      const errors = validateCrawlData(data)
      if (errors.length > 0) {
        toast({
          title: 'Validation Error',
          description: errors[0],
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        return
      }

      dispatch({ type: 'SET_LOADING', payload: true })
      const analysis = analyzeCrawlData(data)
      dispatch({ type: 'SET_ANALYSIS', payload: analysis })
      toast({
        title: 'Analysis Complete',
        description: 'Your SEO data has been analyzed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error during analysis:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze data'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, toast])

  return { analyze }
}

export { useChat } from './useChat'
export { useSettings } from './useSettings'
export { useExport } from './useExport'
export { useAIAnalysis } from './useAIAnalysis' 