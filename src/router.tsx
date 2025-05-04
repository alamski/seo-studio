import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Chat from './pages/Chat'
import Settings from './pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'analysis',
        element: <Analysis />
      },
      {
        path: 'chat',
        element: <Chat />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
]) 