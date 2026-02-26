import { Outlet } from 'react-router-dom'
import { Nav } from './Nav'
import { BackButton } from './BackButton'
import { BottomNav } from './BottomNav'

/**
 * Main layout: nav + outlet for nested routes. Back button and bottom nav (mobile) for easier navigation.
 */
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl pb-24 md:pb-6">
        <BackButton />
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
