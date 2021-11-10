//Node modules for the app to run
const http = require('http');
const fs = require('fs');
const mime = require('mime');


const host = '127.0.0.1';
const port = 3000;
const basepath = __dirname.replace(/\\/g,'/',);



const server = http.createServer((req,res) =>{
    if(req.url === '/') req.url = '/index.html';
    
    fs.readFile(basepath + req.url, (err, data) => {
        res.statusCode = 200;
        
        res.setHeader('Content-type',mime.getType(req.url));
        res.end(data);
    });
});

server.listen(port, host, () =>{
    console.log(`server runing on ${host}:${port}`);
});