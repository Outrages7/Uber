const http = require('http');
const app = require('./app');
const Port = process.env.Port || 4000;

const server = http.createServer(app);

server.listen(Port,()=>{
    console.log(`Server is running on ${Port}`);
})