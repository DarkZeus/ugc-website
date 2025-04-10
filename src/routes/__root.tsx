import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className='flex flex-col'>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
        </div>
        <TanStackRouterDevtools />


        <TanstackQueryLayout />
    </div>
  ),
})
