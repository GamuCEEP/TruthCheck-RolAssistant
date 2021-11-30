
const fs = require("fs");
const path = require("path");


function createDirectory(name){
    fs.mkdir(name,{recursive: true},(err) =>{
        throw "Directory could not be created";
    });
}
function createFile(){

}
function deleteFile(){

}
function writeLine(){

}
function deleteLine(){

}
function modifyLine(){

}


