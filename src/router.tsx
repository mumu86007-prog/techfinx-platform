import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Investing from './pages/Investing'
import TechLinks from './pages/TechLinks'
import Articles from './pages/Articles'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Investing /> },
      { path: 'investing', element: <Investing /> },
      { path: 'tech-links', element: <TechLinks /> },
      { path: 'articles', element: <Articles /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router

