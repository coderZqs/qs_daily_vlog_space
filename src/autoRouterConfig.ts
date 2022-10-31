import type { App, Component } from "vue";

interface FileType {
  [key: string]: Component;
}

const files: Record<string, FileType> = import.meta.globEager(
  "/src/example/*.vue"
);

const routes = Object.keys(files).map((c: string) => {
  console.log(c);
  const reg = /(?<=example\/).*?(?=\.)/g;
  const path = c.match(reg)?.[0];
  const component = files[c]?.default;

  return {
    path: "/" + path,
    name: path,
    component: component,
  };
});

export default routes;
