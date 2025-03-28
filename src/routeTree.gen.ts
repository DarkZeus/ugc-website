/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as FeedImport } from './routes/feed'
import { Route as IndexImport } from './routes/index'
import { Route as ProfileIndexImport } from './routes/profile/index'
import { Route as ProfileDashboardImport } from './routes/profile/dashboard'
import { Route as ProfileAddImport } from './routes/profile/add'
import { Route as DemoTanstackQueryImport } from './routes/demo.tanstack-query'

// Create/Update Routes

const FeedRoute = FeedImport.update({
  id: '/feed',
  path: '/feed',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ProfileIndexRoute = ProfileIndexImport.update({
  id: '/profile/',
  path: '/profile/',
  getParentRoute: () => rootRoute,
} as any)

const ProfileDashboardRoute = ProfileDashboardImport.update({
  id: '/profile/dashboard',
  path: '/profile/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const ProfileAddRoute = ProfileAddImport.update({
  id: '/profile/add',
  path: '/profile/add',
  getParentRoute: () => rootRoute,
} as any)

const DemoTanstackQueryRoute = DemoTanstackQueryImport.update({
  id: '/demo/tanstack-query',
  path: '/demo/tanstack-query',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/feed': {
      id: '/feed'
      path: '/feed'
      fullPath: '/feed'
      preLoaderRoute: typeof FeedImport
      parentRoute: typeof rootRoute
    }
    '/demo/tanstack-query': {
      id: '/demo/tanstack-query'
      path: '/demo/tanstack-query'
      fullPath: '/demo/tanstack-query'
      preLoaderRoute: typeof DemoTanstackQueryImport
      parentRoute: typeof rootRoute
    }
    '/profile/add': {
      id: '/profile/add'
      path: '/profile/add'
      fullPath: '/profile/add'
      preLoaderRoute: typeof ProfileAddImport
      parentRoute: typeof rootRoute
    }
    '/profile/dashboard': {
      id: '/profile/dashboard'
      path: '/profile/dashboard'
      fullPath: '/profile/dashboard'
      preLoaderRoute: typeof ProfileDashboardImport
      parentRoute: typeof rootRoute
    }
    '/profile/': {
      id: '/profile/'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/feed': typeof FeedRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
  '/profile/add': typeof ProfileAddRoute
  '/profile/dashboard': typeof ProfileDashboardRoute
  '/profile': typeof ProfileIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/feed': typeof FeedRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
  '/profile/add': typeof ProfileAddRoute
  '/profile/dashboard': typeof ProfileDashboardRoute
  '/profile': typeof ProfileIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/feed': typeof FeedRoute
  '/demo/tanstack-query': typeof DemoTanstackQueryRoute
  '/profile/add': typeof ProfileAddRoute
  '/profile/dashboard': typeof ProfileDashboardRoute
  '/profile/': typeof ProfileIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/feed'
    | '/demo/tanstack-query'
    | '/profile/add'
    | '/profile/dashboard'
    | '/profile'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/feed'
    | '/demo/tanstack-query'
    | '/profile/add'
    | '/profile/dashboard'
    | '/profile'
  id:
    | '__root__'
    | '/'
    | '/feed'
    | '/demo/tanstack-query'
    | '/profile/add'
    | '/profile/dashboard'
    | '/profile/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  FeedRoute: typeof FeedRoute
  DemoTanstackQueryRoute: typeof DemoTanstackQueryRoute
  ProfileAddRoute: typeof ProfileAddRoute
  ProfileDashboardRoute: typeof ProfileDashboardRoute
  ProfileIndexRoute: typeof ProfileIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  FeedRoute: FeedRoute,
  DemoTanstackQueryRoute: DemoTanstackQueryRoute,
  ProfileAddRoute: ProfileAddRoute,
  ProfileDashboardRoute: ProfileDashboardRoute,
  ProfileIndexRoute: ProfileIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/feed",
        "/demo/tanstack-query",
        "/profile/add",
        "/profile/dashboard",
        "/profile/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/feed": {
      "filePath": "feed.tsx"
    },
    "/demo/tanstack-query": {
      "filePath": "demo.tanstack-query.tsx"
    },
    "/profile/add": {
      "filePath": "profile/add.tsx"
    },
    "/profile/dashboard": {
      "filePath": "profile/dashboard.tsx"
    },
    "/profile/": {
      "filePath": "profile/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
