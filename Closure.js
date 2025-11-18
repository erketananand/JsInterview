function createCounter(init, delta) {

    function count() {
        init = init + delta
        return init
    }
    return count
}

let c1 = createCounter(10, 5)
let c2 = createCounter(5, 2)
console.log(c1()) 
console.log(c1()) 

console.log(c2())
console.log(c2())

// 15 20 7 9


function outer() {
    let arrFn = [];
    
    for (var i = 0;i < 3; i++) {
        arrFn.push(function fn() {
            console.log(i);
        })
    }
    return arrFn;
}
let arrFn = outer();
arrFn[0]();
arrFn[1]();
arrFn[2]();
// Output : 3,3,3


function outer() {
    let arrFn = [];
    
    for (let i = 0; i < 3; i++) {
        arrFn.push(function fn() {
            console.log(i);
        })
    }
    return arrFn;
}
let arrFun = outer();
arrFun[0]();
arrFun[1]();
arrFun[2]();

// 0,1,2