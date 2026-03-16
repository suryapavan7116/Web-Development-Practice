let fileHandle;

async function saveAs(){

const options = {
types: [{
description: "Text Files",
accept: { "text/plain": [".txt"] }
}]
};

fileHandle = await window.showSaveFilePicker(options);

const writable = await fileHandle.createWritable();

const content = document.getElementById("editor").value;

await writable.write(content);

await writable.close();

}

async function save(){

if(!fileHandle){
saveAs();
return;
}

const writable = await fileHandle.createWritable();

const content = document.getElementById("editor").value;

await writable.write(content);

await writable.close();

}

function saveFile(){
save();
}

function changeFont(){

let font = document.getElementById("fontSelector").value;

document.getElementById("editor").style.fontFamily = font;

}

function toggleBold(){

let editor = document.getElementById("editor");

if(editor.style.fontWeight === "bold"){
editor.style.fontWeight = "normal";
}else{
editor.style.fontWeight = "bold";
}

}