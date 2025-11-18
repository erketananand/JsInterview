let a="Hi";
let bHi="Hi";
console.log(a==bHi);
// true

let key =Symbol("skjghbdfjhgdjhf");
let key2=Symbol("Hi");
console.log(key ==key2)
// false

console.log(NaN == NaN)
//false

console.log('5' == 5)
//true

console.log('5' === 5)
//false

let x=5;
let y="1";
console.log(x+y);
//51
console.log(x-y);
//4

console.log(1 + 1 + "1");
//21
console.log(1+true);
//2
console.log("1"+true);
//1true