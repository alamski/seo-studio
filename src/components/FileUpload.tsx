import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Button,
  Text,
  VStack,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useApp } from '../context/AppContext'
import { parseCSV } from '../utils/csvParser'
import { analyzeData } from '../services/analysisService'

const FileUpload: React.FC = () => {
  console.log('FileUpload component rendering')
  const { state: { loading }, dispatch } = useApp()
  const toast = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0]
      if (!file) return

      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const data = await parseCSV(file)
      dispatch({ type: 'SET_CRAWL_DATA', payload: data })

      const analysis = analyzeData(data)
      dispatch({ type: 'SET_ANALYSIS', payload: analysis })

      toast({
        title: 'File uploaded successfully',
        description: `Analyzed ${data.length} URLs`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to upload file' })
      toast({
        title: 'Error uploading file',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  })

  return (
    <Box
      {...getRootProps()}
      p={10}
      border="2px dashed"
      borderColor={isDragActive ? 'blue.400' : 'gray.200'}
      borderRadius="md"
      textAlign="center"
      cursor={loading ? 'not-allowed' : 'pointer'}
      opacity={loading ? 0.7 : 1}
      _hover={loading ? {} : { borderColor: 'blue.400' }}
    >
      <input {...getInputProps()} disabled={loading} />
      <VStack spacing={4}>
        {loading ? (
          <>
            <Spinner size="xl" color="blue.500" />
            <Text fontSize="lg">Processing file...</Text>
          </>
        ) : (
          <>
            <Text fontSize="lg">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop a CSV file here, or click to select'}
            </Text>
            <Button colorScheme="blue" size="lg">
              Select File
            </Button>
          </>
        )}
      </VStack>
    </Box>
  )
}

export default FileUpload 