interface Person {
  name: string;
  age: string;
}
function enhancer(target: any) {
  target.prototype.name = "金色小芝麻";
  target.prototype.age = "18";
}
@enhancer // 普通装饰器
class Person {
  constructor() {}
}
