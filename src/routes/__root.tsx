import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className='flex flex-col min-h-screen'>
      <Header />

        <main className="flex-1 pt-20">
            <Outlet />
            <TanStackRouterDevtools />

        </main>

      <TanstackQueryLayout />
    </div>
  ),
})
