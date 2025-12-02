import {
  DataTable,
  type ExtendedColumnDef,
  type TableStateChangeParams,
  type DataTableRef,
} from "@/components/data-table";
import z from "zod";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconPlus, IconRefresh } from "@tabler/icons-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { getServices } from "@/services/service/api";
import { useRef } from "react";

export const schema = z.object({
  id: z.string(),
  serviceName: z.string(),
  serviceDesc: z.string(),
  loadType: z.number(),
  serviceAddr: z.string(),
  qps: z.number(),
  qpd: z.number(),
  totalNode: z.number(),
});

type ServiceData = z.infer<typeof schema>;

const Services: React.FC = () => {
  const tableRef = useRef<DataTableRef>(null);
  const list = useMutation({
    mutationFn: getServices,
  });

  // 表格状态变更处理函数
  const handleTableChange = (params: TableStateChangeParams) => {
    const _params_: API.GetServicesRequest = {
      ...params.pagination,
      ...params.filters.map((filter) => ({
        [filter.id]: filter.value,
      })),
    };
    if (params.sorting.length > 0) {
      _params_.orderStr = params.sorting[0].id;
      _params_.orderType = params.sorting[0].desc ? "desc" : "asc";
    }
    list.mutate(_params_);
  };
  const columns: ExtendedColumnDef<z.infer<typeof schema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "serviceName",
      header: "服务名称",
      cell: ({ row }) => <div>{row.original.serviceName || "-"}</div>,
      enableHiding: false,
      filterConfig: {
        type: "input",
        placeholder: "请输入服务名称",
      },
    },
    {
      accessorKey: "serviceDesc",
      header: "服务描述",
      cell: ({ row }) => <div>{row.original.serviceDesc || "-"}</div>,
    },
    {
      accessorKey: "loadType",
      header: "类型",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.loadType}
        </Badge>
      ),
    },
    {
      accessorKey: "serviceAddr",
      header: "服务地址",
      cell: ({ row }) => <div>{row.original.serviceAddr || "-"}</div>,
    },
    {
      accessorKey: "qps",
      header: "QPS",
      cell: ({ row }) => <div>{row.original.qps || 0}</div>,
      sortConfig: {
        enabled: true,
      },
    },
    {
      accessorKey: "qpd",
      header: "日请求量",
      cell: ({ row }) => <div>{row.original.qpd || 0}</div>,
      sortConfig: {
        enabled: true,
      },
    },
    {
      accessorKey: "totalNode",
      header: "节点数",
      cell: ({ row }) => <div>{row.original.totalNode || 0}</div>,
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">打开菜单</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>修改</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // 操作按钮
  const actionButtons = (
    <>
      <Button
        variant="default"
        onClick={() => {
          // 添加服务逻辑
          console.log("添加服务");
        }}
      >
        <IconPlus className="h-4 w-4" />
        添加服务
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          // 重置表格状态（清空筛选、排序，重置分页）
          tableRef.current?.reset();
        }}
      >
        <IconRefresh className="h-4 w-4" />
        重置
      </Button>
    </>
  );

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
    </div>
  );
};

export default Services;
