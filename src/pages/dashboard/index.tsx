import Spinner from '@/components/ui/spinner'
import { ChartAreaInteractive } from '@/pages/dashboard/chart-area-interactive'
import { SectionCards } from '@/pages/dashboard/section-cards'
import { getAllServices, getFlowStat, getServicePanel } from '@/services/service/api'
import { useQueries } from '@tanstack/react-query'

const Dashboard: React.FC = () => {
  const [panel, stat, services] = useQueries({
    queries: [
      {
        queryKey: ['service-panel'],
        queryFn: getServicePanel
      },
      {
        queryKey: ['service-stat'],
        queryFn: getFlowStat
      },
      {
        queryKey: ['service-all'],
        queryFn: getAllServices
      }
    ]
  })
  if (panel.isLoading || stat.isLoading || services.isLoading || !panel.data?.data || !stat.data?.data || !services.data?.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }
  return (
    <div className="h-full">
      <SectionCards data={panel.data?.data} services={services.data?.data} />
      <div className="px-4 lg:px-6 mt-6">
        <ChartAreaInteractive data={stat.data?.data} />
      </div>
    </div>
  )
}

export default Dashboard
