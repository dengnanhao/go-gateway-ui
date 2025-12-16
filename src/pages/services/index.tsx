import { DataTable, type ExtendedColumnDef, type TableStateChangeParams, type DataTableRef } from '@/components/data-table'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { IconActivity, IconDotsVertical, IconPlus, IconRefresh } from '@tabler/icons-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutation } from '@tanstack/react-query'
import { getServices, deleteService } from '@/services/service/api'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import ServiceStat from './service-stat'
import { LoadTypeEnum } from '@/constant/enums'
import HttpDrawer from './http-drawer'
import TcpDrawer from './tcp-drawer'
import GrpcDrawer from './grpc-drawer'

export const schema = z.object({
  id: z.string(),
  serviceName: z.string(),
  serviceDesc: z.string(),
  loadType: z.number(),
  serviceAddr: z.string(),
  qps: z.number(),
  qpd: z.number(),
  totalNode: z.number()
})

export type ServiceData = z.infer<typeof schema>

const Services: React.FC = () => {
  const tableRef = useRef<DataTableRef>(null)
  const [service, setService] = useState<ServiceData | null>(null)
  const [tcpDrawerOpen, setTcpDrawerOpen] = useState(false)
  const [grpcDrawerOpen, setGrpcDrawerOpen] = useState(false)
  const [httpDrawerOpen, setHttpDrawerOpen] = useState(false)
  const [statDialogOpen, setStatDialogOpen] = useState(false)

  const list = useMutation({
    mutationFn: getServices
  })

  const del = useMutation({
    mutationFn: deleteService,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('服务删除成功')
        tableRef.current?.reset()
      }
    }
  })

  // 表格状态变更处理函数
  const handleTableChange = (params: TableStateChangeParams) => {
    const _params_: API.GetServicesRequest = {
      ...params.pagination,
      ...Object.fromEntries(params.filters.map((filter) => [filter.id, filter.value]))
    }
    if (params.sorting.length > 0) {
      _params_.orderStr = params.sorting[0].id
      _params_.orderType = params.sorting[0].desc ? 'desc' : 'asc'
    }
    list.mutate(_params_)
  }

  // 操作按钮
  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button
        variant="default"
        onClick={() => {
          setService(null)
          setHttpDrawerOpen(true)
        }}
      >
        <IconPlus className="h-4 w-4" />
        HTTP服务
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setService(null)
          setTcpDrawerOpen(true)
        }}
      >
        <IconPlus className="h-4 w-4" />
        TCP服务
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setService(null)
          setGrpcDrawerOpen(true)
        }}
      >
        <IconPlus className="h-4 w-4" />
        GRPC服务
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          tableRef.current?.reset()
        }}
      >
        <IconRefresh className="h-3 w-3" />
        重置
      </Button>
    </div>
  )

  const handleEdit = (service: ServiceData) => {
    setService(service)
    if (service.loadType === LoadTypeEnum.HTTP) {
      setHttpDrawerOpen(true)
    }
    if (service.loadType === LoadTypeEnum.TCP) {
      setTcpDrawerOpen(true)
    }
    if (service.loadType === LoadTypeEnum.GRPC) {
      setGrpcDrawerOpen(true)
    }
  }

  const columns: ExtendedColumnDef<z.infer<typeof schema>>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'serviceName',
      header: '服务名称',
      cell: ({ row }) => <div>{row.original.serviceName || '-'}</div>,
      enableHiding: false,
      filterConfig: {
        type: 'input',
        placeholder: '请输入服务名称'
      }
    },
    {
      accessorKey: 'serviceDesc',
      header: '服务描述',
      cell: ({ row }) => <div>{row.original.serviceDesc || '-'}</div>
    },
    {
      accessorKey: 'loadType',
      header: '服务类型',
      cell: ({ row }) => {
        if (row.original.loadType === 1) {
          return (
            <Badge variant="default" className="px-1.5">
              HTTP
            </Badge>
          )
        }
        if (row.original.loadType === 2) {
          return (
            <Badge variant="secondary" className="px-1.5">
              TCP
            </Badge>
          )
        }
        return (
          <Badge variant="outline" className="px-1.5">
            GRPC
          </Badge>
        )
      }
    },
    {
      accessorKey: 'qps',
      header: 'QPS',
      cell: ({ row }) => <div>{row.original.qps || 0}</div>,
      sortConfig: {
        enabled: false
      }
    },
    {
      accessorKey: 'qpd',
      header: '日请求量',
      cell: ({ row }) => <div>{row.original.qpd || 0}</div>,
      sortConfig: {
        enabled: false
      }
    },
    {
      accessorKey: 'totalNode',
      header: '节点数',
      cell: ({ row }) => <div>{row.original.totalNode || 0}</div>
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            title="统计"
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer"
            size="icon"
            onClick={() => {
              setService(row.original)
              setStatDialogOpen(true)
            }}
          >
            <IconActivity />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button title="更多操作" variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer" size="icon">
                <IconDotsVertical />
                <span className="sr-only">打开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>修改</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  del.mutate(row.original.id)
                }}
              >
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]

  return (
    <div>
      <DataTable<ServiceData>
        ref={tableRef}
        data={list.data?.data ?? []}
        columns={columns}
        onChange={handleTableChange}
        total={list.data?.total}
        getRowId={(row) => row.id.toString()}
        enableRowSelection={true}
        actionButtons={actionButtons}
      />

      {/* 添加/编辑HTTP服务 */}
      <HttpDrawer drawerOpen={httpDrawerOpen} setDrawerOpen={setHttpDrawerOpen} serviceId={service?.id ?? ''} cb={() => tableRef.current?.reset()} />
      {/* 添加/编辑TCP服务 */}
      <TcpDrawer drawerOpen={tcpDrawerOpen} setDrawerOpen={setTcpDrawerOpen} serviceId={service?.id ?? ''} cb={() => tableRef.current?.reset()} />
      {/* 添加/编辑GRPC服务 */}
      <GrpcDrawer drawerOpen={grpcDrawerOpen} setDrawerOpen={setGrpcDrawerOpen} serviceId={service?.id ?? ''} cb={() => tableRef.current?.reset()} />
      {/* 服务统计对话框 */}
      <ServiceStat serviceId={service?.id ?? ''} serviceName={service?.serviceName ?? ''} open={statDialogOpen} onOpenChange={setStatDialogOpen} />
    </div>
  )
}

export default Services
