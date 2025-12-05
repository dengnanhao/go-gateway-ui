import { IconAdjustments, IconActivityHeartbeat } from '@tabler/icons-react'
import type { Icon } from '@tabler/icons-react'

export const navMainItems: NavItem[] = [
  {
    title: '流量统计',
    url: '/admin/dashboard',
    icon: IconActivityHeartbeat
  },
  {
    title: '服务配置',
    url: '/admin/services',
    icon: IconAdjustments
  }
]

export interface NavItem {
  title: string
  url: string
  icon?: Icon
  children?: NavItem[]
}
