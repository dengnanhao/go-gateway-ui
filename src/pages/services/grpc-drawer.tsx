import { createGrpcService, getServiceInfo, updateGrpcService } from '@/services/service/api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useAsyncEffect } from 'ahooks'
import { zodResolver } from '@hookform/resolvers/zod'

// 添加服务的表单 schema
const createServiceSchema = z.object({
  serviceName: z.string().min(1, '服务名称不能为空'),
  serviceDesc: z.string().min(1, '服务描述不能为空'),
  port: z.number('端口必须是数字').int('端口必须是整数').positive('端口必须是正数').min(1, '端口最小值为1').max(65535, '端口最大值为65535').default(8001),
  headerTransfor: z.string().optional(),
  openAuth: z.number().default(0),
  blackList: z.string().optional(),
  whiteList: z.string().optional(),
  clientIpFlowLimit: z.number().default(0),
  serviceFlowLimit: z.number().default(0),
  roundType: z.number().default(0),
  ipList: z.string().min(1, 'IP列表不能为空'),
  weightList: z.string().min(1, '权重列表不能为空')
})

type CreateServiceFormData = z.infer<typeof createServiceSchema>

type Props = {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  serviceId?: string
  cb?: () => void
}

const HttpDrawer: React.FC<Props> = ({ drawerOpen, setDrawerOpen, serviceId, cb }) => {
  const form = useForm<CreateServiceFormData>({
    // @ts-expect-error zodResolver 类型推断问题
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      port: 8001,
      openAuth: 0,
      clientIpFlowLimit: 0,
      serviceFlowLimit: 0,
      roundType: 0
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = form

  const create = useMutation({
    mutationFn: createGrpcService,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('服务创建成功')
        setDrawerOpen(false)
        reset()
        cb?.()
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '服务创建失败'
      toast.error(errorMessage)
    }
  })
  const update = useMutation({
    mutationFn: updateGrpcService,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('服务更新成功')
        setDrawerOpen(false)
        reset()
        cb?.()
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : '服务更新失败'
      toast.error(errorMessage)
    }
  })

  // 提交服务表单
  const onSubmit = (formData: CreateServiceFormData) => {
    if (serviceId) {
      update.mutate({ ...formData, id: serviceId })
    } else {
      create.mutate(formData)
    }
  }

  useAsyncEffect(async () => {
    if (serviceId && drawerOpen) {
      const { data, success } = await getServiceInfo(serviceId)
      if (success) {
        setDrawerOpen(true)
        reset({
          serviceName: data.serviceName,
          serviceDesc: data.serviceDesc,
          port: data.grpcRule.port,
          headerTransfor: data.grpcRule.headerTransfor,
          openAuth: data.accessControl.openAuth,
          blackList: data.accessControl.blackList,
          whiteList: data.accessControl.whiteList,
          clientIpFlowLimit: data.accessControl.clientIpFlowLimit,
          serviceFlowLimit: data.accessControl.serviceFlowLimit,
          roundType: data.loadBalance.roundType,
          ipList: data.loadBalance.ipList,
          weightList: data.loadBalance.weightList
        })
      }
    } else {
      reset({
        serviceName: ''
      })
    }
  }, [serviceId, drawerOpen])

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
      <DrawerContent className="overflow-y-auto h-screen overflow-x-hidden">
        <DrawerHeader>
          <DrawerTitle>{serviceId ? '编辑GRPC服务' : '添加GRPC服务'}</DrawerTitle>
          <DrawerDescription>填写GRPC服务信息以{serviceId ? '更新GRPC服务信息' : '创建新的GRPC服务'}</DrawerDescription>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(
            // @ts-expect-error react-hook-form 类型推断问题
            onSubmit
          )}
        >
          <div className="px-4 pb-4">
            <FieldGroup>
              {/* 服务名称 */}
              <Field data-invalid={!!errors.serviceName}>
                <FieldLabel htmlFor="serviceName">
                  服务名称 <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input id="serviceName" placeholder="请输入服务名称" {...register('serviceName')} />
                  <FieldError errors={errors.serviceName ? [errors.serviceName] : []} />
                </FieldContent>
              </Field>

              {/* 服务描述 */}
              <Field data-invalid={!!errors.serviceDesc}>
                <FieldLabel htmlFor="serviceDesc">
                  服务描述 <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input id="serviceDesc" placeholder="请输入服务描述" {...register('serviceDesc')} />
                  <FieldError errors={errors.serviceDesc ? [errors.serviceDesc] : []} />
                </FieldContent>
              </Field>
              <Field data-invalid={!!errors.port}>
                <FieldLabel htmlFor="port">
                  端口 <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    id="port"
                    placeholder="请输入端口"
                    {...register('port', {
                      valueAsNumber: true
                    })}
                  />
                  <FieldError errors={errors.port ? [errors.port] : []} />
                </FieldContent>
              </Field>

              {/* Header转换  */}
              <Field>
                <FieldLabel htmlFor="headerTransfor">Header转换</FieldLabel>
                <FieldContent>
                  <Input id="headerTransfor" placeholder="add/del/edit headerName headerValue" {...register('headerTransfor')} />
                  <p className="text-xs text-muted-foreground mt-1">支持 add(增加)/del(删除)/edit(修改) 格式：add headerName headerValue</p>
                </FieldContent>
              </Field>
              {/* 是否开启权限 */}
              <Field>
                <FieldLabel htmlFor="openAuth">是否开启权限</FieldLabel>
                <FieldContent>
                  <Switch
                    id="openAuth"
                    checked={watch('openAuth') === 1}
                    onCheckedChange={(checked) => {
                      setValue('openAuth', checked ? 1 : 0)
                    }}
                  />
                </FieldContent>
              </Field>

              {/* 黑名单IP */}
              <Field>
                <FieldLabel htmlFor="blackList">黑名单IP</FieldLabel>
                <FieldContent>
                  <Textarea id="blackList" placeholder="请输入黑名单IP，多个IP换行分隔" {...register('blackList')} rows={3} />
                </FieldContent>
              </Field>

              {/* 白名单IP */}
              <Field>
                <FieldLabel htmlFor="whiteList">白名单IP</FieldLabel>
                <FieldContent>
                  <Textarea id="whiteList" placeholder="请输入白名单IP，多个IP换行分隔" {...register('whiteList')} rows={3} />
                </FieldContent>
              </Field>

              {/* 客户端IP限流 */}
              <Field>
                <FieldLabel htmlFor="clientIpFlowLimit">客户端IP限流</FieldLabel>
                <FieldContent>
                  <Input
                    id="clientIpFlowLimit"
                    type="number"
                    placeholder="0表示无限制"
                    {...register('clientIpFlowLimit', {
                      valueAsNumber: true
                    })}
                  />
                </FieldContent>
              </Field>

              {/* 服务端限流 */}
              <Field>
                <FieldLabel htmlFor="serviceFlowLimit">服务端限流</FieldLabel>
                <FieldContent>
                  <Input
                    id="serviceFlowLimit"
                    type="number"
                    placeholder="0表示无限制"
                    {...register('serviceFlowLimit', {
                      valueAsNumber: true
                    })}
                  />
                </FieldContent>
              </Field>

              {/* 轮询方式 */}
              <Field>
                <FieldLabel htmlFor="roundType">轮询方式</FieldLabel>
                <FieldContent>
                  <Select
                    value={String(watch('roundType') ?? 0)}
                    onValueChange={(value) => {
                      setValue('roundType', Number(value))
                    }}
                  >
                    <SelectTrigger id="roundType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">random</SelectItem>
                      <SelectItem value="1">round-robin</SelectItem>
                      <SelectItem value="2">weight_round-robin</SelectItem>
                      <SelectItem value="3">ip_hash</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              {/* IP列表 */}
              <Field data-invalid={!!errors.ipList}>
                <FieldLabel htmlFor="ipList">
                  IP列表 <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Textarea id="ipList" placeholder="格式：127.0.0.1:80，多条换行" {...register('ipList')} rows={4} />
                  <FieldError errors={errors.ipList ? [errors.ipList] : []} />
                </FieldContent>
              </Field>

              {/* 权重列表 */}
              <Field data-invalid={!!errors.weightList}>
                <FieldLabel htmlFor="weightList">
                  权重列表 <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldContent>
                  <Textarea id="weightList" placeholder="格式：50，多条换行" {...register('weightList')} rows={4} />
                  <FieldError errors={errors.weightList ? [errors.weightList] : []} />
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>
          <DrawerFooter className="flex flex-row justify-end items-center gap-2">
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {create.isPending || update.isPending ? (serviceId ? '更新中...' : '创建中...') : serviceId ? '更新服务' : '创建服务'}
            </Button>
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  reset()
                }}
              >
                取消
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
export default HttpDrawer
