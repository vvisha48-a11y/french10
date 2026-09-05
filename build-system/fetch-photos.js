// One-off: resolve canonical 1100px Commons thumbnails for the curated picks and
// download them into ./photos. Server-side resize (no local image tooling here).
// Not part of build.sh.
const fs=require('fs'),https=require('https'),path=require('path'),{execFileSync}=require('child_process');
const UA='CBSE-French-Grammar-Deck/1.0 (educational classroom slide deck; contact via project repository)';
const P=path.join(__dirname,'photos');
// local id -> exact Commons file title
const PICK={
 'vrb-horloge-gare':   'Gare De Lyon Clock.jpg',
 'vrb-terrasse-cafe':  'Terrasse du café, Paris July 30, 2010.jpg',
 'ipc-projecteur':     'IMAX 15 70 mm Film Projector in Paris.jpg',
 'ipc-rue-pluie':      'P1060293 Paris Ier rue J.J. Rousseau sous la pluie rwk.JPG',
 'ipc-marathon':       'Marathon de Paris 2023- La partenza del nostro gruppo è imminente- APSBTIN.jpg',
 'sub-manifestation':  'Paris, 9 mars 2024 - Flickr - Paola Breizh.jpg',
 'neg-etal-legumes':   'Fruits et légumes sur un étal 01.jpg',
 'neg-sens-interdit':  'Panneau sens interdit sauf vélo.jpg',
 'pro-quai-gare':      "Quais gare d'Annecy.JPG",
 'pro-petit-train':    'Arles - petit train des Alpilles.jpg',
 'rel-pont-neuf':      'Pont Neuf, Paris 1er 001.JPG',
 'rel-bouquiniste':    'Paris (France) bouquiniste along the Seine river, 2012.JPG',
 'rel-village-toits':  'Saint-Emilion village toits 2015a.JPG',
 'dis-kiosque':        'Kiosque à journaux, avenue Marceau (Paris) en janvier 2020.jpg',
 'dis-cabine-tel':     'Cabine téléphonique décorée.jpg',
 'qst-salle-classe':   'Lycée français de Shanghai élèves salle de classe.jpg',
 'pos-trousseau-cles': 'A hand holds a set of keys.jpg',
 'dem-vitrine-paris':  'Collants-chaussettes-fantaisie-Vitrine-boutique-caprices-paris.jpg',
};
const WIDTH=1100;
function api(titles){return new Promise((res,rej)=>{
 const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth='+WIDTH+
   '&titles='+encodeURIComponent(titles.map(t=>'File:'+t).join('|'));
 https.get(u,{headers:{'User-Agent':UA,Accept:'application/json'}},r=>{let b='';r.on('data',c=>b+=c);
  r.on('end',()=>{if(r.statusCode!==200)return rej(new Error('HTTP '+r.statusCode));try{res(JSON.parse(b))}catch(e){rej(e)}})}).on('error',rej);});}
(async()=>{
 const ids=Object.keys(PICK), map={}, meta={};
 for(let i=0;i<ids.length;i+=8){
  const chunk=ids.slice(i,i+8);
  const d=await api(chunk.map(k=>PICK[k]));
  const pages=(d.query&&d.query.pages)||{};
  Object.values(pages).forEach(p=>{
   const ii=p.imageinfo&&p.imageinfo[0];if(!ii)return;
   const title=p.title.replace(/^File:/,'');
   const id=ids.find(k=>PICK[k].replace(/_/g,' ')===title.replace(/_/g,' '));
   if(!id)return;
   map[id]=ii.thumburl||ii.url;
   const em=ii.extmetadata||{};
   meta[id]={title,lic:(em.LicenseShortName||{}).value||'',author:((em.Artist||{}).value||'').replace(/<[^>]*>/g,'').slice(0,60),w:ii.thumbwidth||ii.width};
  });
  await new Promise(r=>setTimeout(r,800));
 }
 const missing=ids.filter(k=>!map[k]&&k!=='sub-bougies');
 if(missing.length)console.log('NO THUMB URL:',missing.join(', '));
 let ok=0;const fail=[];
 for(const id of ids){
  const dest=path.join(P,id+'.jpg');
  if(fs.existsSync(dest)&&fs.statSync(dest).size>8000){console.log('  skip %s',id);ok++;continue;}
  if(!map[id]){fail.push(id);continue;}
  try{
   const code=execFileSync('curl',['-sL','--max-time','90','--retry','4','--retry-delay','8','--retry-all-errors','-A',UA,'-w','%{http_code}','-o',dest,map[id]],{stdio:'pipe'}).toString().trim(); if(code!=='200')throw new Error('HTTP '+code);
   const n=fs.statSync(dest).size;
   if(n<8000)throw new Error('too small '+n);
   console.log('  ok   %s  %s KB  (%s)',id.padEnd(20),String(Math.round(n/1024)).padStart(4),meta[id].lic);
   ok++;
  }catch(e){console.log('  FAIL %s  %s',id,e.message);fail.push(id);try{fs.unlinkSync(dest)}catch(_){}}
  await new Promise(r=>setTimeout(r,5000));
 }
 fs.writeFileSync('photo-credits.json',JSON.stringify(meta,null,1));
 console.log('\nok %d, failed %d %s',ok,fail.length,fail.join(','));
})();
