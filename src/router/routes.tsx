import { Suspense,lazy } from "react"
import { createBrowserRouter, RouteObject,Outlet } from "react-router-dom"


const routesConfig = await fetch('/api/routes').then(res => res.json());
console.log(routesConfig);


// **动态导入组件**
const loadComponent = (path: string): React.LazyExoticComponent<React.ComponentType<any>> => {
  return lazy(() => import(`${path.replace("@", "..")}`));
};

// **递归转换 JSON 配置**
const convertRoutes = (routes: any[]): RouteObject[] => {
  return routes
    .map((route) => {
      const Component = route.component ? loadComponent(route.component) : null;

      return {
        path: route.path,
        element: Component ? (
          <Suspense fallback={<div>Loading...</div>}>
            <Component />
          </Suspense>
        ) : (
          <Outlet />
        ),
        children: route.children && route.children.length > 0 ? convertRoutes(route.children) : undefined
      };
    })
    .filter(Boolean) as RouteObject[]; // 确保返回 RouteObject[]
};

// **创建 Router**
const router = createBrowserRouter(convertRoutes(routesConfig));


export default router