let arr = [{a:1}, {a:2}]
let obj = arr[0];
obj.a = 11;
let {a} = arr[1];
a=22;
console.log(obj, arr);
//{a:11} [{a:11}, {a:2}]

const list = [{a:1}, {a:2}];
console.log(list);
function fnc(list){
    list = [{a:1}, {a:2},{a:3},{a:4}];
}
fnc(list);
console.log(list);
function fn(list){
    list.push({a:3});
}
fn(list);
console.log(list);
// [{a:11}, {a:2}] [{a:1},{a:2}] [{a:1},{a:2},{a:3}]
