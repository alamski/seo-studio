import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Flex,
  IconButton,
  Textarea,
  useToast,
  Spinner,
  Avatar,
  Divider,
  Badge,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useClipboard,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react'
import { FiSend, FiMic, FiStopCircle, FiHelpCircle, FiChevronDown, FiUpload, FiCopy } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { sendMessage } from '../services/openaiService'
import { Message, Analysis } from '../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SUGGESTED_QUESTIONS = [
  'What are the main SEO issues on my site?',
  'How can I improve my meta descriptions?',
  'Which pages need the most attention?',
  'What are the quick wins for my SEO?',
  'How can I improve my content strategy?',
]

// Utility to summarize crawl data for GPT context
function getCrawlDataSummary(crawlData: any[], maxRows = 10) {
  if (!crawlData || crawlData.length === 0) return 'No crawl data available.'
  const columns = ['Address', 'Title 1', 'Meta Description 1', 'H1-1', 'Status Code']
  const header = columns.join(' | ')
  const rows = crawlData.slice(0, maxRows).map(row =>
    columns.map(col => row[col] || '').join(' | ')
  )
  return [header, ...rows].join('\n')
}

const Chat = () => {
  const { state, dispatch } = useApp()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const { onCopy } = useClipboard('')

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const userBgColor = useColorModeValue('blue.50', 'blue.900')
  const aiBgColor = useColorModeValue('gray.50', 'gray.700')

  const recognitionRef = useRef<any>(null)

  // Voice input setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev ? prev + ' ' + transcript : transcript)
      setIsRecording(false)
    }
    recognitionRef.current.onerror = () => {
      setIsRecording(false)
      toast({
        title: 'Voice input error',
        description: 'Could not recognize speech. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }
  }, [toast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    setInput('')
    setIsLoading(true)

    try {
      // Build system prompt with crawl data summary
      const crawlSummary = getCrawlDataSummary(state.crawlData)
      const systemMessage: Message = {
        role: 'system',
        content: `You are an SEO assistant. Here is a sample of the website crawl data (showing up to 10 rows):\n${crawlSummary}`
      }
      // Build message history for OpenAI
      const messages = [systemMessage, ...state.messages, userMessage]
      const response = await sendMessage(messages)
      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage })
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to get response from AI. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleCopyMessage = (content: string) => {
    onCopy(content)
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Voice input not supported',
        description: 'Your browser does not support speech recognition.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch" h="calc(100vh - 200px)">
        <Box>
          <Heading size="lg" mb={2}>AI Chat</Heading>
          <Text color="gray.600">Ask questions about your SEO data and get AI-powered insights.</Text>
        </Box>

        {!state.crawlData.length ? (
          <Box
            p={8}
            bg={bgColor}
            borderRadius="lg"
            border="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <Text mb={4}>Upload your Screaming Frog CSV file to start chatting with AI.</Text>
            <Button
              as="label"
              htmlFor="file-upload"
              colorScheme="blue"
              leftIcon={<FiUpload />}
            >
              Upload CSV
            </Button>
          </Box>
        ) : (
          <>
            <Box
              flex={1}
              overflowY="auto"
              p={4}
              bg={bgColor}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
            >
              {state.messages.length === 0 ? (
                <VStack spacing={4} align="stretch">
                  <Text textAlign="center" color="gray.500">
                    Start a conversation by asking a question about your SEO data
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleSuggestedQuestion(question)}
                        textAlign="left"
                        h="auto"
                        p={4}
                        whiteSpace="normal"
                      >
                        {question}
                      </Button>
                    ))}
                  </SimpleGrid>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  {state.messages.map((message, index) => (
                    <Flex
                      key={index}
                      justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <Box
                        maxW="80%"
                        bg={message.role === 'user' ? userBgColor : aiBgColor}
                        p={4}
                        borderRadius="lg"
                        position="relative"
                      >
                        <HStack spacing={2} mb={2}>
                          <Avatar
                            size="sm"
                            name={message.role === 'user' ? 'User' : 'AI Assistant'}
                            src={message.role === 'user' ? undefined : '/ai-avatar.png'}
                          />
                          <Text fontWeight="bold">
                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                          </Text>
                          {message.timestamp && (
                            <Text fontSize="xs" color="gray.500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </Text>
                          )}
                        </HStack>
                        <Box>
                          {message.role === 'assistant' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            <Text>{message.content}</Text>
                          )}
                        </Box>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiChevronDown />}
                            variant="ghost"
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                          />
                          <MenuList>
                            <MenuItem onClick={() => handleCopyMessage(message.content)}>
                              <FiCopy /> Copy Message
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    </Flex>
                  ))}
                  <div ref={messagesEndRef} />
                </VStack>
              )}
            </Box>

            <Box
              p={4}
              bg={bgColor}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
            >
              <Flex gap={2}>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  resize="none"
                  rows={1}
                  flex={1}
                />
                <IconButton
                  aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                  icon={isRecording ? <Spinner size="sm" /> : <FiMic />}
                  onClick={handleMicClick}
                  colorScheme={isRecording ? 'red' : 'gray'}
                  isLoading={isRecording}
                  variant={isRecording ? 'solid' : 'outline'}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleSend}
                  isLoading={isLoading}
                  loadingText="Sending..."
                >
                  <FiSend />
                </Button>
              </Flex>
            </Box>
          </>
        )}
      </VStack>
    </Container>
  )
}

export default Chat 