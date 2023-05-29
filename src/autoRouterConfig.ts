import type { App, Component } from "vue";

interface FileType {
  [key: string]: Component;
}

const files: Record<string, FileType> = import.meta.globEager(
  "/src/webgl/*.vue"
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

const threejsExampleRoutes = generateAudoImportRoute(
  files,
  /(?<=webgl\/).*?(?=\.)/g,
  "/webgl/"
);


routes = routes.concat(threejsExampleRoutes);

export default routes;
