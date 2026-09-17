import { createBrowserRouter } from 'react-router-dom'
import App from './components/App'
import { DashboardPage } from './pages/DashboardPage'
import { VillagerListPage } from './pages/VillagerListPage'
import { VillagerInteractPage } from './pages/VillagerInteractPage'
import { Wardrobe } from './components/Wardrobe'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'villagers', element: <VillagerListPage /> },
      { path: 'villagers/:id/interact', element: <VillagerInteractPage /> },
      { path: 'wardrobe', element: <Wardrobe /> },
    ],
  },
])