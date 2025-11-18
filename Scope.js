// var, let & const
// redeclared -> var , not with let and const
// scope -> var -> function scoped, let & const -> block scoped
// Temporal Dead Zone : it is zone for let and const when you can't access it
// let and const -> you can't access a variable declared via let or const before it's declartion

var a3 = 10;
function fn() {
    var a3 = 20;
    a3++;
    console.log("1st log", a3);
    if (a3) {
        var a3 = 30;
        a3++;
        console.log("2nd log", a3);
    }
    console.log("3rd log", a3);
}
fn();
console.log("4th log", a3);
/*
1st log 21
2nd log 31
3rd log 31
4th log 10
*/

let a4 = 10;
function fn() {
    let a4 = 20;
    a4++;
    console.log("1st log", a4);
    if (a4) {
        let a4 = 30;
        a4++;
        console.log("2nd log", a4);
    }
    console.log("3rd log", a4);
}
fn();
console.log("4th log", a4);
/*
1st log 21
2nd log 31
3rd log 21
4th log 10
*/

var varName = 10; 
function b() {
    console.log(varName);
} 
function fn() { 
    var varName = 20;
    function c() {
        console.log(varName); 
    }
    b();
    c();
    console.log(varName);
    return c;
} 
var cFn = fn();
cFn()
// 10 20 20 20