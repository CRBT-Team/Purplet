export {};

function getExpensiveComputeValue(obj) {
  return Math.random();
}

const prototype = {
  get foo() {
    console.log('calculating foo');
    this.foo = getExpensiveComputeValue();
    return this.foo;
  },
};

const myObject = {
  bar: 2,
  __proto__: prototype,
};

const myObject2 = {
  bar: 3,
  __proto__: prototype,
};

console.log(myObject.foo);
console.log(myObject.foo);
console.log(myObject.foo);
console.log(myObject2.foo);
console.log(myObject2.foo);
console.log(myObject2.foo);
