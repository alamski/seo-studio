import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { processCrawlData, generateAnalysis } from '../services/analysisService'

export const useFileUpload = () => {
  const { dispatch } = useApp()

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const crawlData = await processCrawlData(file)
      const analysis = generateAnalysis(crawlData)

      dispatch({ type: 'SET_CRAWL_DATA', payload: crawlData })
      dispatch({ type: 'SET_ANALYSIS', payload: analysis })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to process file',
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch])

  return { handleFileUpload }
} 