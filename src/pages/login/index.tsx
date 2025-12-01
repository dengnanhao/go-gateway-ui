import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Login: React.FC = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Go Gateway UI</CardTitle>
              <CardDescription>
                请输入您的用户名和密码登录您的账户
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="username">用户名</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="请输入您的用户名"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">密码</FieldLabel>
                    </div>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="captcha">验证码</FieldLabel>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input id="captcha" type="text" required />
                      <img
                        src="/captcha.png"
                        alt="验证码"
                        width={100}
                        height={30}
                      />
                    </div>
                  </Field>
                  <Field>
                    <Button type="submit">登录</Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
