import type { App, Component } from "vue";

interface FileType {
  [key: string]: Component;
}

const files: Record<string, FileType> = import.meta.globEager(
  "/src/webgl/*.vue"
);

const threeFiles: Record<string, FileType> = import.meta.globEager(
  "/src/example/*/*.vue"
);

type routesType = {
  path?: string;
  name?: string;
  component?: Component;
};

let routes: routesType[] = [];

/**
 *
 * @param files 文件
 * @param regExp
 * @param routerPrefix 路由前缀
 */

const generateAudoImportRoute = (
  files: Record<string, FileType>,
  regExp: RegExp,
  routerPrefix: string
) => {
  const routes: routesType[] = Object.keys(files).map((c: string) => {
    const path = c.match(regExp)?.[0];

    console.log(path);
    const component = files[c]?.default;

    return {
      path: routerPrefix + path,
      name: path,
      component: component
    };
  });

  return routes;
};

const webglRoutes = generateAudoImportRoute(
  files,
  /(?<=webgl\/).*?(?=\.)/g,
  "/webgl/"
);

const threeRoutes = generateAudoImportRoute(
  threeFiles,
  /(?<=example\/).*?(?=\.)/g,
  "/example/"
);

console.log(threeRoutes);

routes = routes.concat(webglRoutes);
routes = routes.concat(threeRoutes);

export default routes;
