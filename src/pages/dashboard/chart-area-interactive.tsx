import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'

const chartConfig = {
  today: {
    label: '今天',
    theme: {
      light: 'oklch(0.75 0.15 85)', // 黄色 - 浅色主题
      dark: 'oklch(0.7 0.15 85)' // 黄色 - 深色主题
    }
  },
  yesterday: {
    label: '昨天',
    theme: {
      light: 'oklch(0.556 0 0)', // 中灰色 - 浅色主题
      dark: 'oklch(0.708 0 0)' // 中灰色 - 深色主题
    }
  }
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  data: API.GetServiceStatResponse
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}

function transformData(data: API.GetServiceStatResponse) {
  const { today, yesterday } = data

  // 获取最大长度，确保时间轴完整
  const maxLength = Math.max(today.length, yesterday.length)

  return Array.from({ length: maxLength }, (_, index) => {
    const hour = index
    return {
      time: formatHour(hour),
      hour,
      today: today[index] ?? 0,
      yesterday: yesterday[index] ?? 0
    }
  })
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const chartData = useMemo(() => transformData(data), [data])

  // 计算最大值，用于优化 Y 轴显示
  const maxValue = useMemo(() => {
    const allValues = [...(data.today || []), ...(data.yesterday || [])]
    const max = Math.max(...allValues, 0)
    // 向上取整到最近的 10 的倍数，留出一些空间
    return max > 0 ? Math.ceil(max / 10) * 10 : 10
  }, [data])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>流量统计</CardTitle>
        <CardDescription>最近2日流量统计对比</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillToday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-today)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-today)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillYesterday" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-yesterday)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-yesterday)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(value) => value} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, maxValue]}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}k`
                }
                return value.toString()
              }}
            />
            <ChartTooltip
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    // value 是 time 字段的值，如 "00:00"
                    return typeof value === 'string' ? value : formatHour(Number(value) || 0)
                  }}
                  formatter={(value, name) => {
                    const numValue = typeof value === 'number' ? value : 0
                    return [numValue.toLocaleString(), chartConfig[name as keyof typeof chartConfig]?.label || name]
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="today" type="monotone" fill="url(#fillToday)" fillOpacity={0.6} stroke="var(--color-today)" strokeWidth={2} />
            <Area dataKey="yesterday" type="monotone" fill="url(#fillYesterday)" fillOpacity={0.6} stroke="var(--color-yesterday)" strokeWidth={2} />
            <ChartLegend content={<ChartLegendContent nameKey="dataKey" />} verticalAlign="top" wrapperStyle={{ paddingTop: '8px' }} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
