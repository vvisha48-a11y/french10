// Static server for the standalone React letter-app preview.
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT='C:/claude/10th 2/letter-app';
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
            '.jsx':'text/plain; charset=utf-8','.css':'text/css'};
http.createServer((req,res)=>{
  const p=req.url.split('?')[0];
  const f=path.join(ROOT, p==='/'?'/index.html':p);
  fs.readFile(f,(e,b)=>{
    if(e){res.writeHead(404);return res.end('not found');}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});
    res.end(b);
  });
}).listen(8123,()=>console.log('letter-app on http://localhost:8123'));
