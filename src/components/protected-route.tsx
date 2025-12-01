/**
 * 受保护的路由组件
 * 用于包装需要认证才能访问的路由
 */
import { useGuard } from "@/hooks/use-guard";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 使用路由守卫 hook
  useGuard();

  return <>{children}</>;
}
