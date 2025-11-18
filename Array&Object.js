const a = [];
console.log('array length =', a.length);
//0
a[9] = 1;
console.log('array length =', a.length);
//10
a.push(2);
console.log('2 is present at index =', a.indexOf(2));
//10
console.log('a[0] =', a[0]);
//undefined
a.length = 0;
console.log('a[9] =', a[9]);
//undefined

a.name = 'ketan'
console.log('my name =', a.name);
//ketan

// write own map function
Array.prototype.myMap = function(callback) {
    const newArr = [];
    for(let i=0; i<this.length; i++){
        newArr.push(callback(this[i]));
    }
    return newArr;
}

function myMap(arr, callback) {
    let newArr=[];
    for(let i=0; i<arr.length; i++){
        newArr.push(callback(arr[i]));
    }
    return newArr;
}

