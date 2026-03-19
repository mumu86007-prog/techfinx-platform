import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Investing from './pages/Investing'
import TechLinks from './pages/TechLinks'
import Articles, { ArticleDetail } from './pages/Articles'
import { ArchiveList, ArchiveDetail } from './pages/Archive'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <TechLinks /> },
      { path: 'investing', element: <Investing /> },
      { path: 'tech-links', element: <TechLinks /> },
      { path: 'articles', element: <Articles /> },
      { path: 'articles/:slug', element: <ArticleDetail /> },
      { path: 'archive', element: <ArchiveList /> },
      { path: 'archive/:date', element: <ArchiveDetail /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router
