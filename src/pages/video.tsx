import { useParams } from 'umi'
export default function video() {
  const param = useParams()
  return <div>video：{param.id}</div>
}
