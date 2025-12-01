/**
 * 路由守卫
 */
import { getSession } from "@etils/tool";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

export const useGuard = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const prevPathnameRef = useRef(pathname);

  const [leavePath, setLeavePath] = useState("");

  useEffect(() => {
    const token = getSession("token");

    // 路由前置守卫：检查是否需要认证
    if (pathname !== "/login" && !token) {
      navigate("/login", { replace: true });
      return;
    }

    // 如果已登录，访问登录页则重定向到首页
    if (pathname === "/login" && token) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    // 路由后置守卫：记录离开的路径
    return () => {
      if (prevPathnameRef.current !== pathname) {
        setLeavePath(prevPathnameRef.current);
        prevPathnameRef.current = pathname;
      }
    };
  }, [pathname, navigate]);

  return {
    pathname,
    leavePath,
  };
};
