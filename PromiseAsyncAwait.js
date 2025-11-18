var p = new Promise((resolve, reject) => {
  reject(Error('The Fails!'))
})
p.catch(error => console.log(error.message))
p.catch(error => console.log(error.message))
// The Fails! The Fails!


new Promise((resolve, reject) => {
  reject(Error('The Fails!'))
})
.catch(error => console.log(error.message))
.catch(error => console.log(error.message))
// The Fails! Promise {<fulfilled>: undefined}


var p = new Promise((resolve, reject) => {
  return Promise.reject(Error('The Fails!'))
})
p.catch(error => console.log(error.message))
p.catch(error => console.log(error.message))
// Uncaught (in promise) Error: The Fails!


var p = new Promise((resolve, reject) => {
    reject(Error('The Fails!'))
  })
  .catch(error => console.log(error))
  .then(error => console.log(error))
// The Fails! undefined  

var p = new Promise((resolve, reject) => {
    reject(Error('The Fails!'))
  })
  .catch(error => console.log(error.message))
  .catch(error => console.log(error.message))
// The Fails!


var p = new Promise((resolve, reject) => {
    reject(Error('The Fails!'))
  })
  .catch(error => console.log(error))
  .then(error => console.log(error))
  .then(error => console.log('error'))
// The Fails! undefined error


var p = new Promise((resolve, reject) => {
    reject(Error('The Fails!'))
  })
  .catch(error => console.log(error))
  .then(error => console.log(error))
  .then(error => console.log('success'))
  .catch(error => console.log('error'))
// The Fails! undefined success undefined


var p = new Promise((resolve, reject) => {
    reject(Error('The Fails!'))
  })
  .catch(error => console.log(error))
  .then(error => console.log(error))
  .then(error => console.log('success'))
  .catch(error => console.log('error'))
  .then(error => console.log('success after catch'))
// The Fails! undefined success success after catch



var p = new Promise((resolve, reject) => {
    resolve('Success!')
  })
  .then(() => {
    console.log('<Oh noes!>');
    throw Error('Oh noes!');
  })
  .catch(error => {
    console.log('<actually, that worked>');
    return "actually, that worked"
  })
  .catch(error => console.log(error.message))
p.then(console.log)
// <Oh noes!> <actually, that worked> actually, that worked


new Promise((resolve, reject) => {
    resolve('Success!')
  })
  .then(() => {
    console.log('<Oh noes!>');
    throw Error('Oh noes!');
  })
  .catch(error => {
    console.log('<actually, that worked>');
    return "actually, that worked"
  })
  .catch(error => console.log(error.message))
  .then(success => console.log(success))
// <Oh noes!> <actually, that worked> actually, that worked



Promise.resolve('Success!')
  .then(data => {
    return data.toUpperCase()
  })
  .then(data => {
    console.log(data)
  })
// SUCCESS!



Promise.resolve('Success!')
  .then(() => {
    throw Error('Oh noes!')
  })
  .catch(error => {
    return 'actually, that worked'
  })
  .then(data => {
    throw Error('The fails!')
  })
  .catch(error => console.log(error.message))
// The fails!



function addTen(number) {
  return number + 10;
}
Promise.resolve(10)  
  .then(addTen)      
  .then(addTen)      
  .then(addTen)      
  .then(console.log)
// 40


var promise = new Promise(res => res(2));
promise.then(v => {
        console.log(v);
        return v * 2;
    })
    .then(v => {
        console.log(v);
        return v * 2;
    })
    .finally(v => {
        console.log(v);
        return v * 2;
    })
    .then(v => {
        console.log(v);
    });
// 2 4 undefined 8


var promise = new Promise(res => res(2));
promise.then(v => {
        console.log(v);
        return v * 2;
    })
    .then(v => {
        console.log(v);
        return v * 2;
    })
    .finally(v => {
        console.log('finally');
        return v * 2;
    })
    .then(v => {
        console.log(v);
    }); 



HINT: https://medium.com/swlh/a-practical-guide-to-macro-tasks-micro-tasks-and-queuemicrotask-in-javascript-ca65c393699e

console.log('script start');
 
setTimeout(function () {
  console.log('setTimeout');
}, 0);
 
Promise.resolve()
  .then(function () {
    console.log('promise1');
  })
  .then(function () {
    console.log('promise2');
  });
 
console.log('script end');
// script start script end promise1 promise2 setTimeout


f = async function() {
  await Promise.reject(new Error("Whoops!"));
}
fn = async function(){
    const res = await f().catch((error) => { 
        console.log('catch', error);
        throw error;
    });
    console.log('then', res);
}
fn()
// Whoops! VM594:2 Uncaught (in promise) Error: Whoops!




f = async function() {
  await Promise.reject(new Error("Whoops!"));
}
fn = async function(){
    const res = await f().catch((error) => { 
        console.log('catch', error);
    });
    console.log('then', res);
}
fn()
// Whoops! undefined




f = async function() {
  await Promise.reject(new Error("Whoops!"));
}
fn = async function(){
    try{
    const res = await f();
    console.log('then', res);
    }catch(error){
     console.log('catch', error);
    }
    console.log('outside of try catch');
}
fn()
// Whoops! outside of try catch





async function f() {
  await Promise.reject(new Error("Whoops!"));
}
async function f2(){
    console.log('Before response');
    const res = await f().catch((error) => { 
        console.log('Before error');
        return;
        console.log('After error');
    });
    console.log('After response');
}
f2().then((res)=>{
console.log('success');
}).catch((error)=>{
console.log('error');
});
// Before response Before error After response success





async function f() {
  await Promise.reject(new Error("Whoops!"));
}
async function f2(){
    console.log('Before response');
    let e;
    const res = await f().catch((error) => { 
        console.log('Before error');
        e=100;
        return;
        console.log('After error');
    });
    console.log('After response', res, e);
    return e || res;
}
f2().then((res)=>{
console.log('success', res);
}).catch((error)=>{
console.log('error', error);
});
/*
Before response
Before error
After response undefined 100
success 100
*/