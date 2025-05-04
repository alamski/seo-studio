import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { AppState, Action, Analysis, CrawlData, Message } from '../types'

const initialState: AppState = {
  crawlData: [],
  analysis: null,
  messages: [],
  loading: false,
  error: null,
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | null>(null)

const appReducer = (state: AppState, action: Action): AppState => {
  console.log('Reducer action:', action)
  switch (action.type) {
    case 'SET_CRAWL_DATA':
      return {
        ...state,
        crawlData: action.payload,
      }
    case 'SET_ANALYSIS':
      return {
        ...state,
        analysis: action.payload,
      }
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('AppProvider rendering')
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 