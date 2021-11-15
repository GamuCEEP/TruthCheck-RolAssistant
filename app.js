//Node modules for the app to run
const http = require('http');
const fs = require('fs');


const host = '127.0.0.1';
const port = 3000;
const basepath = __dirname.replace(/\\/g, '/');//Change all \ with /

const extensionRegex = /\.(\w+)$/;//Gets the extension (a '.'followed by letters at the end of string)

const contentTypes = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "": "text/plain"
};

const server = http.createServer((req, res) => {
    if (req.url === '/') req.url = '/index.html';

    fs.readFile(basepath + req.url, (err, data) => {
        res.statusCode = 200;
        let a = contentTypes[req.url.match(extensionRegex) || ""];
        console.log(a);
        res.setHeader('Content-type', a) ;
        res.end(data);
    });
});

server.listen(port, host, () => {
    console.log(`server runing on ${host}:${port}`);
});