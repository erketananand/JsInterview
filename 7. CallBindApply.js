obj = {
    a:10,
    b:20,
    name: "Steve",
    sayHi: function () {
        console.log(this.name);;
    }, 
    print: function(args1,args2){
        console.log(args1 + args2);
    }
}
const ironMan={
    name:"Tony"
}

const boundFn=obj.sayHi.bind({name:"Tony"})
boundFn();
//Tony
obj.sayHi.call({name:'loki'});
//loki
obj.print.apply(obj,[1,2]);
//3
