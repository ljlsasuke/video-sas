import { useSearchParams } from 'umi'
export default function search() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''
  const tag = searchParams.get('tag') ?? ''
  return <div>search</div>
}
