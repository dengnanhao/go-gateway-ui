import { IconTrendingDown, IconTrendingUp, IconChartPie, IconChartDots2 } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadTypeEnum } from '@/constant/enums'

type SectionCardsProps = {
  data: API.GetServicePanelResponse
  services: API.ServiceInfo[]
}

export function SectionCards({ data, services }: SectionCardsProps) {
  const { serviceNum, todayRequestNum, yesterdayRequestNum, currentQPS } = data
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总服务数</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{serviceNum || 0}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            不同类型服务占比 <IconChartPie className="size-4" />
          </div>
          <div className="text-muted-foreground gap-2 flex items-center">
            <Badge variant="outline">http {services.filter((service) => service.loadType === LoadTypeEnum.HTTP).length}</Badge>
            <Badge variant="outline">tcp {services.filter((service) => service.loadType === LoadTypeEnum.TCP).length}</Badge>
            <Badge variant="outline">grpc {services.filter((service) => service.loadType === LoadTypeEnum.GRPC).length}</Badge>
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>当日请求量</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{todayRequestNum || 0}</CardTitle>
          <CardAction>
            {yesterdayRequestNum > todayRequestNum && (
              <Badge variant="outline">
                <IconTrendingDown />-{(((yesterdayRequestNum - todayRequestNum) / yesterdayRequestNum) * 100).toFixed(2)}%
              </Badge>
            )}
            {yesterdayRequestNum < todayRequestNum && (
              <Badge variant="outline">
                <IconTrendingUp />+{(((todayRequestNum - yesterdayRequestNum) / yesterdayRequestNum) * 100).toFixed(2)}%
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            流量{yesterdayRequestNum > todayRequestNum ? '下降' : '上升'}{' '}
            {((Math.abs(yesterdayRequestNum - todayRequestNum) / yesterdayRequestNum) * 100).toFixed(2)}%{' '}
            {yesterdayRequestNum > todayRequestNum ? <IconTrendingDown className={'size-4'} /> : <IconTrendingUp className={'size-4'} />}
          </div>
          <div className="text-muted-foreground">
            今日请求量较昨日{yesterdayRequestNum > todayRequestNum ? '下降' : '上升'}{' '}
            {((Math.abs(yesterdayRequestNum - todayRequestNum) / yesterdayRequestNum) * 100).toFixed(2)}%
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>昨日请求量</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{yesterdayRequestNum.toLocaleString() || '0'}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            昨日总请求数 <IconChartDots2 className="size-4" />
          </div>
          <div className="text-muted-foreground">平均 QPS: {yesterdayRequestNum > 0 ? (yesterdayRequestNum / 86400).toFixed(2) : '0.00'}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>当前QPS</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{currentQPS || 0}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            实时每秒查询数 <IconChartDots2 className="size-4" />
          </div>
          <div className="text-muted-foreground">昨日平均 QPS: {yesterdayRequestNum > 0 ? (yesterdayRequestNum / 86400).toFixed(2) : '0.00'}</div>
        </CardFooter>
      </Card>
    </div>
  )
}
