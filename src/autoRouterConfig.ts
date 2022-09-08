import type { App, Component } from "vue";

interface FileType {
  [key: string]: Component;
}

const files: Record<string, FileType> = import.meta.globEager(
  "/src/example/*.vue"
);

let routes = Object.keys(files).map((c: string) => {
  console.log(c);
  let reg = /(?<=example\/).*?(?=\.)/g;
  let path = c.match(reg)?.[0];
  const component = files[c]?.default;

  return {
    path: "/" + path,
    name: path,
    component: component,
  };
});

console.log(routes);

export default routes;
