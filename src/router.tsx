import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Accounts from './pages/Accounts'
import Hot from './pages/Hot'
import DeepDive from './pages/DeepDive'
import Resources from './pages/Resources'
import About from './pages/About'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'hot', element: <Hot /> },
      { path: 'deep-dive', element: <DeepDive /> },
      { path: 'resources', element: <Resources /> },
      { path: 'about', element: <About /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router

