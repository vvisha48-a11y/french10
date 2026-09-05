// Minimal static server for previewing the built deck locally.
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT='C:/claude/10 th/docs';
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css'};
http.createServer((req,res)=>{
  const f=path.join(ROOT,(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));
  fs.readFile(f,(e,b)=>{
    if(e){res.writeHead(404);return res.end('not found');}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});
    res.end(b);
  });
}).listen(8099,()=>console.log('serving docs/ on http://localhost:8099'));
