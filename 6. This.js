var obj = {
    firstName: "Steve",
    sayHi: function () {
        console.log(`Hi ${this.firstName}`);
    },
    sayHello: () => {
        console.log(`Hello ${this.firstName}`);
    },
    ask: function() {
        return () => {
            console.log(`How are you, ${this.firstName}`);
        }
    }
}
obj.sayHi();
//Steve
obj.sayHello();
//undefined
obj.ask()()
//Steve

this.firstName = 'loki'
addrSayHi = obj.sayHi;
addrSayHi();
//loki
addrSayHello = obj.sayHello;
addrSayHello();
//loki
addrAsk = obj.ask;
addrAsk()();
//loki



var obj2 = {
    name: "Steve",
    sayHi: function () {
        console.log("sayHi",this.name);
        function iAmInner() {
            console.log("iAmInner",this.name);
        }
        console.log("Before calling inner");
        iAmInner();
        console.log("After calling inner", this.name);

    }
}
this.name = "loki";
obj2.sayHi();
//Steve loki Steve

