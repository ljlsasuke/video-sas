import TopNav from '@/components/TopNav'
import { Outlet } from 'umi'
export default function Layout() {
  return (
    <div className="flex flex-col items-center">
      <TopNav></TopNav>
      <div className="mt-mtn w-5/6">
        <Outlet />
      </div>
    </div>
  )
}
