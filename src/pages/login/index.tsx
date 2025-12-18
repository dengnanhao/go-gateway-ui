import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldError, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CAPTCHA_ID } from '@/constant/query'
import { getCaptchaId, login } from '@/services/login/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import md5 from 'md5'
import { setSession } from '@etils/tool'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
  captchaCode: z.string().min(1, '验证码不能为空')
})

type LoginFormData = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: [CAPTCHA_ID],
    queryFn: getCaptchaId
  })

  const submit = useMutation({
    mutationFn: login,
    onSuccess(data) {
      if (data.success) {
        setSession('token', data.data.accessToken)
        toast.success('登录成功')
        navigate('/admin/dashboard')
      }
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (formData: LoginFormData) => {
    submit.mutate({
      username: formData.username,
      password: md5(formData.password),
      captchaId: query?.data?.data?.captchaId ?? '',
      captchaCode: formData.captchaCode
    })
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn('flex flex-col gap-6')}>
          <Card>
            <CardHeader>
              <CardTitle>Go Gateway UI</CardTitle>
              <CardDescription>请输入您的用户名和密码登录您的账户</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field data-invalid={!!errors.username}>
                    <FieldLabel htmlFor="username">用户名</FieldLabel>
                    <FieldContent>
                      <Input id="username" type="text" placeholder="请输入您的用户名" {...register('username')} />
                      <FieldError errors={errors.username ? [errors.username] : []} />
                    </FieldContent>
                  </Field>
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">密码</FieldLabel>
                    <FieldContent>
                      <Input id="password" type="password" placeholder="请输入您的密码" {...register('password')} />
                      <FieldError errors={errors.password ? [errors.password] : []} />
                    </FieldContent>
                  </Field>
                  <Field data-invalid={!!errors.captchaCode}>
                    <FieldLabel htmlFor="captchaCode">验证码</FieldLabel>
                    <FieldContent>
                      <div className="flex items-center gap-2">
                        <Input id="captchaCode" type="text" placeholder="请输入验证码" {...register('captchaCode')} />
                        <img
                          onClick={() => query.refetch()}
                          src={'/api/v1/captcha/image?id=' + query.data?.data?.captchaId}
                          alt="验证码"
                          className="h-9 cursor-pointer"
                          width={100}
                        />
                      </div>
                      <FieldError errors={errors.captchaCode ? [errors.captchaCode] : []} />
                    </FieldContent>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={submit.isPending}>
                      {submit.isPending ? '登录中...' : '登录'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
