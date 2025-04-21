import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'umi'
import TopNav from './TopNav'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => {
        console.warn(
          `请求错误, React Query正在重发请求, 已经重发了(${count})次`,
          error,
        )
        return count < 3
      },
    },
  },
})
export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center">
        <TopNav></TopNav>
        <div className="mt-mtn w-5/6">
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  )
}
