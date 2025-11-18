function print({c,b,a}){
    console.log(a,b,c);
}
print({d:0,a:10, b:20, c:30,e:40})
// 10 20 30

function print({c:a,b:c,a:b}){
    console.log(a,b,c);
}
print({d:0,a:10, b:20, c:30,e:40})
// 30 10 20

function print({c:a,b:c,a:b, ...o}){
    console.log(a,b,c,o);
}
print({d:5, a:10, f:15, b:20, g:25, c:30, e:35})
// 30 10 20 {d: 5, f: 15, g: 25, e: 35}