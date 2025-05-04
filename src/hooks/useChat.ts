import { useCallback, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { sendMessageToOpenAI } from '../services/openaiService'
import { Message } from '../types'

export const useChat = () => {
  const { state, dispatch } = useApp()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [state.messages, scrollToBottom])

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      // Add user message
      const userMessage: Message = {
        role: 'user',
        content,
      }
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Get AI response
      const response = await sendMessageToOpenAI(content, state.messages)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      }
      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, state.messages])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    handleSendMessage,
    messagesEndRef,
  }
} 