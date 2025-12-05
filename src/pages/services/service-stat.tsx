import { getServiceStat } from '@/services/service/api'
import { useMutation } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useEffect } from 'react'

type ServiceStatProps = {
  serviceId: string
  serviceName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const chartConfig = {
  today: {
    label: '今天',
    color: 'var(--chart-1)'
  },
  yesterday: {
    label: '昨天',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig

const ServiceStat: React.FC<ServiceStatProps> = ({ serviceId, serviceName, open, onOpenChange }) => {
  const stat = useMutation({
    mutationFn: () => getServiceStat(serviceId)
  })

  useEffect(() => {
    if (open && serviceId) {
      stat.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, serviceId])

  // 将 API 返回的数组转换为图表数据格式
  const chartData = stat.data?.data
    ? (() => {
        const today = stat.data.data.today || []
        const yesterday = stat.data.data.yesterday || []
        const maxLength = Math.max(today.length, yesterday.length)

        return Array.from({ length: maxLength }, (_, index) => ({
          hour: `${index}:00`,
          today: today[index] ?? 0,
          yesterday: yesterday[index] ?? 0
        }))
      })()
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>服务流量统计{serviceName ? ` - ${serviceName}` : ''}</DialogTitle>
          <DialogDescription>查看服务今天与昨天的流量对比</DialogDescription>
        </DialogHeader>
        <div className="mt-4 overflow-hidden">
          {stat.isPending ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          ) : stat.isError ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-destructive">加载失败，请稍后重试</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-muted-foreground">暂无数据</div>
            </div>
          ) : (
            <div className="w-full">
              <ChartContainer config={chartConfig} className="h-[300px] w-[462px]">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.toLocaleString()} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Line type="monotone" dataKey="today" stroke="var(--color-today)" strokeWidth={2} dot={false} connectNulls={true} activeDot={{ r: 4 }} />
                  <Line
                    type="monotone"
                    dataKey="yesterday"
                    stroke="var(--color-yesterday)"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={true}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceStat
