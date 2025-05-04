import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import theme from './theme'
import { AppProvider } from './context/AppContext'

console.log('Starting application...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Failed to find the root element')
  throw new Error('Failed to find the root element')
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </ChakraProvider>
    </React.StrictMode>
  )
  console.log('Application rendered successfully')
} catch (error) {
  console.error('Error rendering application:', error)
} 