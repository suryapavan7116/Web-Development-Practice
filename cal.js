let display = document.getElementById("display");

function append(value){
display.value += value;
}

function clearDisplay(){
display.value = "";
}

function deleteLast(){
display.value = display.value.slice(0,-1);
}

function calculate(){

let expression = display.value;

let lastChar = expression.slice(-1);

if(["+","-","*","/","%","."].includes(lastChar)){
display.value = "Invalid";
return;
}

try{
display.value = eval(expression);
}
catch{
display.value = "Error";
}

}