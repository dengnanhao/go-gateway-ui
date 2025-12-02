import * as React from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  PaginationState,
  Header,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 扩展 ColumnDef 类型，添加过滤器和排序配置
export type ExtendedColumnDef<TData> = ColumnDef<TData> & {
  filterConfig?: {
    type: "input" | "select";
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
  };
  sortConfig?: {
    enabled: boolean;
  };
};

// 表格状态变更回调参数
export interface TableStateChangeParams {
  pagination: TablePagination;
  filters: ColumnFiltersState;
  sorting: SortingState;
}

// DataTable 组件暴露的方法
export interface DataTableRef {
  reset: () => void;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ExtendedColumnDef<TData>[];
  // 初始分页配置
  initialPagination?: TablePagination;
  // 初始过滤状态
  initialFilters?: ColumnFiltersState;
  // 初始排序状态
  initialSorting?: SortingState;
  // 状态变更统一回调（分页、过滤、排序）
  onChange?: (params: TableStateChangeParams) => void;
  // 获取行ID的函数
  getRowId?: (row: TData) => string;
  // 是否启用行选择
  enableRowSelection?: boolean;
  // 空数据提示文本
  emptyText?: string;
  // 自定义类名
  className?: string;
  // 操作按钮组（右上角）
  actionButtons?: React.ReactNode;
  // 服务端分页总数（如果提供，则启用服务端分页）
  total?: number;
}

function NormalRow<TData>({ row }: { row: Row<TData> }) {
  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// 表头排序图标组件
function SortIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  const canSort = header.column.getCanSort();
  const sorted = header.column.getIsSorted();

  if (!canSort) return null;

  return (
    <span className="ml-2 inline-flex items-center">
      {sorted === "asc" ? (
        <IconArrowUp className="h-4 w-4" />
      ) : sorted === "desc" ? (
        <IconArrowDown className="h-4 w-4" />
      ) : (
        <IconArrowsSort className="h-4 w-4 text-muted-foreground opacity-50" />
      )}
    </span>
  );
}

// 表头组件，支持排序
function SortableHeader<TData>({ header }: { header: Header<TData, unknown> }) {
  const columnDef = header.column.columnDef as ExtendedColumnDef<TData>;
  // 只有明确配置了 sortConfig.enabled === true 的列才显示排序图标
  const canSort =
    header.column.getCanSort() && columnDef.sortConfig?.enabled === true;

  if (!canSort) {
    return (
      <div className="flex items-center">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          header.column.toggleSorting();
        }}
        className="ml-2 hover:opacity-70 transition-opacity"
        aria-label="排序"
        title="点击排序"
      >
        <SortIcon header={header} />
      </button>
    </div>
  );
}

function DataTableInner<TData>(
  {
    data,
    columns,
    initialPagination = { current: 1, pageSize: 10 },
    initialFilters = [],
    initialSorting = [],
    onChange,
    getRowId,
    enableRowSelection = true,
    emptyText = "暂无数据",
    className,
    actionButtons,
    total,
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<DataTableRef>
) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialFilters);
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [pagination, setPagination] = React.useState<TablePagination>(() => ({
    ...initialPagination,
    current: initialPagination?.current ?? 1,
    pageSize: initialPagination?.pageSize ?? 10,
  }));

  const isServerSidePagination = total !== undefined;

  // 重置表格到默认状态
  const resetTable = React.useCallback(() => {
    // 清空筛选条件
    setColumnFilters([]);
    // 清空排序
    setSorting([]);
    // 重置分页到第一页
    setPagination({
      current: initialPagination?.current ?? 1,
      pageSize: initialPagination?.pageSize ?? 10,
    });
  }, [initialPagination]);

  // 通过 ref 暴露重置方法
  React.useImperativeHandle(ref, () => ({
    reset: resetTable,
  }));

  // 使用 useEffect 监听状态变化并调用 onChange
  React.useEffect(() => {
    if (onChange) {
      onChange({
        pagination: pagination,
        filters: columnFilters,
        sorting: sorting,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, columnFilters, sorting]);

  // 处理过滤变更
  const handleFiltersChange = React.useCallback(
    (
      updater:
        | ColumnFiltersState
        | ((old: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      setColumnFilters((prevFilters) => {
        const newFilters =
          typeof updater === "function" ? updater(prevFilters) : updater;
        // 过滤变更时重置到第一页
        setPagination((prev) => ({ ...prev, current: 1 }));
        return newFilters;
      });
    },
    []
  );

  // 处理排序变更
  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting((prevSorting) => {
        const newSorting =
          typeof updater === "function" ? updater(prevSorting) : updater;
        // 排序变更时重置到第一页
        setPagination((prev) => ({ ...prev, current: 1 }));
        return newSorting;
      });
    },
    []
  );

  // 分页变更处理
  const handlePaginationChange = React.useCallback(
    (
      updater: TablePagination | ((old: TablePagination) => TablePagination)
    ) => {
      setPagination((prevPagination) => {
        const newPagination =
          typeof updater === "function" ? updater(prevPagination) : updater;

        // 确保 current 和 pageSize 是有效数字
        return {
          ...newPagination,
          current:
            Number.isFinite(newPagination.current) && newPagination.current > 0
              ? newPagination.current
              : 1,
          pageSize:
            Number.isFinite(newPagination.pageSize) &&
            newPagination.pageSize > 0
              ? newPagination.pageSize
              : 10,
        };
      });
    },
    []
  );

  // 将 1-based 的 current 转换为 0-based 的 pageIndex
  // 确保 current 是有效数字
  const safeCurrent =
    Number.isFinite(pagination.current) && pagination.current > 0
      ? pagination.current
      : 1;
  const pageIndex = Math.max(0, safeCurrent - 1);

  // 计算总页数
  const pageCount = isServerSidePagination
    ? Math.ceil((total ?? 0) / (pagination.pageSize || 10))
    : undefined;

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData>[],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: pageIndex,
        pageSize: pagination.pageSize || 10,
      },
    },
    getRowId,
    enableRowSelection,
    manualPagination: isServerSidePagination,
    pageCount: pageCount,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    // @ts-expect-error 暂不处理
    onPaginationChange: (paginationState: PaginationState) => {
      // 验证 pageIndex 和 pageSize 是有效数字
      const pageIndex = Number.isFinite(paginationState.pageIndex)
        ? paginationState.pageIndex
        : 0;
      const pageSize = Number.isFinite(paginationState.pageSize)
        ? paginationState.pageSize
        : 10;

      // 将 0-based 的 pageIndex 转换为 1-based 的 current
      handlePaginationChange({
        current: Math.max(1, pageIndex + 1),
        pageSize: Math.max(1, pageSize),
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: isServerSidePagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const totalRows = isServerSidePagination
    ? total ?? 0
    : table.getFilteredRowModel().rows.length;

  // 获取可过滤的列
  const filterableColumns = React.useMemo(() => {
    return columns.filter((col) => {
      const extendedCol = col as ExtendedColumnDef<TData>;
      return (
        extendedCol.filterConfig &&
        "accessorKey" in extendedCol &&
        extendedCol.accessorKey
      );
    });
  }, [columns]);

  // 渲染过滤器
  const renderFilters = () => {
    if (filterableColumns.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {filterableColumns.map((col) => {
          const extendedCol = col as ExtendedColumnDef<TData>;
          const filterConfig = extendedCol.filterConfig!;
          const accessorKey =
            "accessorKey" in extendedCol
              ? (extendedCol.accessorKey as string)
              : "";
          const filterValue =
            (columnFilters.find((f) => f.id === accessorKey)
              ?.value as string) ?? "";
          const headerText =
            "header" in extendedCol && typeof extendedCol.header === "string"
              ? extendedCol.header
              : "筛选";

          if (filterConfig.type === "input") {
            return (
              <div key={accessorKey} className="flex items-center gap-2">
                <Label
                  htmlFor={`filter-${accessorKey}`}
                  className="text-sm whitespace-nowrap"
                >
                  {headerText}
                </Label>
                <Input
                  id={`filter-${accessorKey}`}
                  placeholder={filterConfig.placeholder || "请输入"}
                  value={filterValue}
                  onChange={(e) => {
                    const newFilters = columnFilters.filter(
                      (f) => f.id !== accessorKey
                    );
                    if (e.target.value) {
                      newFilters.push({
                        id: accessorKey,
                        value: e.target.value,
                      });
                    }
                    handleFiltersChange(newFilters);
                  }}
                  className="w-48"
                />
              </div>
            );
          }

          if (filterConfig.type === "select" && filterConfig.options) {
            return (
              <div key={accessorKey} className="flex items-center gap-2">
                <Label
                  htmlFor={`filter-${accessorKey}`}
                  className="text-sm whitespace-nowrap"
                >
                  {headerText}
                </Label>
                <Select
                  value={filterValue}
                  onValueChange={(value) => {
                    const newFilters = columnFilters.filter(
                      (f) => f.id !== accessorKey
                    );
                    if (value) {
                      newFilters.push({ id: accessorKey, value });
                    }
                    handleFiltersChange(newFilters);
                  }}
                >
                  <SelectTrigger id={`filter-${accessorKey}`} className="w-48">
                    <SelectValue
                      placeholder={filterConfig.placeholder || "请选择"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部</SelectItem>
                    {filterConfig.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  const tableContent = (
    <Table>
      <TableHeader className="bg-muted sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  <SortableHeader header={header} />
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="**:data-[slot=table-cell]:first:w-8">
        {table.getRowModel().rows?.length ? (
          table
            .getRowModel()
            .rows.map((row) => <NormalRow key={row.id} row={row} />)
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              {emptyText}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className={className ?? "px-6"}>
      {/* 查询条件和操作按钮区域 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">{renderFilters()}</div>
        {actionButtons && (
          <div className="flex items-center gap-2">{actionButtons}</div>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border">{tableContent}</div>
      <div className="flex items-center justify-between px-4 mt-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {enableRowSelection && (
            <>
              已选择{table.getFilteredSelectedRowModel().rows.length} 条，共{" "}
              {totalRows} 条。
            </>
          )}
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              每页显示
            </Label>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                handlePaginationChange({
                  ...pagination,
                  pageSize: Number(value),
                  current: 1, // 切换页面大小时重置到第一页
                });
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            第{" "}
            {Number.isFinite(pagination.current) && pagination.current > 0
              ? pagination.current
              : 1}{" "}
            页，共 {table.getPageCount() || 1} 页
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() =>
                handlePaginationChange({ ...pagination, current: 1 })
              }
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => {
                const newPageIndex = Math.max(0, pageIndex - 1);
                handlePaginationChange({
                  ...pagination,
                  current: newPageIndex + 1,
                });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => {
                const maxPageIndex = (table.getPageCount() || 1) - 1;
                const newPageIndex = Math.min(maxPageIndex, pageIndex + 1);
                handlePaginationChange({
                  ...pagination,
                  current: newPageIndex + 1,
                });
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => {
                const totalPages = table.getPageCount() || 1;
                handlePaginationChange({
                  ...pagination,
                  current: totalPages,
                });
              }}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as <TData>(
  props: DataTableProps<TData> & { ref?: React.ForwardedRef<DataTableRef> }
) => React.ReactElement;
