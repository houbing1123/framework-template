import fs from 'fs';
import path from 'path';
import { Plugin } from 'vite';

interface Route {
  path: string;
  component: string;
  children?: Route[];
}

/** 递归读取 `src/pages` 目录，生成路由数据 */
function getRoutes(dir: string, basePath = ''): Route[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let routes: Route[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const routePath = path.join(basePath, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      // 📌 递归获取子路由
      const children = getRoutes(fullPath, routePath);
      routes.push({
        path: `/${routePath}`,
        component: '', // 目录不对应组件
        children,
      });
    } else if (entry.isFile() && /\.(tsx|jsx|js)$/.test(entry.name)) {
      // 📌 生成页面路由
      let routePathWithoutExt = routePath.replace(/\.(tsx|jsx|js)$/, '');

      routes.push({
        path: `/${routePathWithoutExt.replace(/\/index$/, '')}`,
        component: `@/pages/${routePathWithoutExt}`,
      });
    }
  }
  return routes;
}

/** Vite 插件 */
export function VitePluginDynamicRoutes(): Plugin {
  let currentRoutes: Route[] = [];

  return {
    name: 'vite-plugin-dynamic-routes',
    configureServer(server) {
      const PAGES_DIR = path.resolve(process.cwd(), 'src/pages');
      console.log('📌 pages 目录:', PAGES_DIR);

      const updateRoutes = () => {
        console.log('📌 生成动态路由...');
        currentRoutes = getRoutes(PAGES_DIR);
        console.dir(currentRoutes, { depth: null });

        server.ws.send({
          type: 'custom',
          event: 'update-routes',
          data: currentRoutes,
        });
      };

      updateRoutes();

      fs.watch(PAGES_DIR, { recursive: true }, () => {
        console.log('📌 监听到 pages 目录变动，更新路由...');
        updateRoutes();
      });

      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/routes') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(currentRoutes));
          return;
        }
        next();
      });
    },
  };
}