/**********************************************************************Variable Hoisting*******************************************************************************************/

// a1 undefined
console.log("a1",a1);
var a1;
a1=10;
console.log("a1",a1);
// a1 10

// temporal deadzone
console.log("a2",a2);
let a2;
a2=10;
console.log("a2",a2);
// a2 10


var x = 10;
function test()
{
    if (x > 20) {
        var x = 50;
    }
    console.log(x);
}
test();
// undefined

var username = ['Sam', 'Adarsh', 'Rohit', 'Rajat'];
for(var i in username){
  console.log(username[i]);
}
console.log(i);
//3

/**********************************************************************Function Hoisting*******************************************************************************************/

function real() { 
    console.log("I am real. Always run me"); 
}
function real() { 
    console.log(" No I am real one ");
}
real();
function real() { 
    console.log("You both are wasted");
}
// You both are wasted

getName();
var getName = () => {
    console.log('My name is Ketan!')
}
// Uncaught ReferenceError: getName is not defined

getFullName();
function getFullName() {
    console.log('My full name is Ketan Anand!')
}
// My full name is Ketan Anand!

getName();
// My name is Ketan!
