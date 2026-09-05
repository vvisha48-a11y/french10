const fs=require('fs');
const html=fs.readFileSync('C:/claude/10 th/master-grammar-app.html','utf8');
// engine-extract.js is derived from e-engine.html. Regenerate it if it is missing or
// stale: when it vanished, this gate crashed on startup instead of reporting, so the
// harness looked green while running two checks short.
if (!fs.existsSync('engine-extract.js') ||
    fs.statSync('engine-extract.js').mtimeMs < fs.statSync('e-engine.html').mtimeMs){
  require('child_process').execFileSync(process.execPath, ['gen-engine-extract.js'], { cwd: __dirname });
}
const js=fs.readFileSync('engine-extract.js','utf8');
const markup=html.slice(0,html.lastIndexOf('<script>'));
const problems=[];

// --- collect every class token actually present in markup (escaping-proof) ---
const present=new Set();
(markup.match(/class="([^"]*)"/g)||[]).forEach(a=>{
  a.slice(7,-1).split(/\s+/).forEach(t=>{ if(t) present.add(t); });
});
const needed=['conjlab','cj-fams','cj-tenses','cj-verblist','cj-head','cj-allgrid','cj-search','cj-count',
 'drill','drill-setup','drill-play','drill-done','drill-q','drill-input','drill-feedback',
 'drill-idx','drill-score','drill-tot','drill-time','drill-final','drill-start','drill-restart',
 'drill-submit','drill-timer-cb','hint-btn','hint-box','clue','tl-hero','tl-node','pick-class-btn'];
needed.forEach(c=>{ if(!present.has(c)) problems.push('missing class in markup: .'+c); });

// --- dataset integrity ---
const m=js.match(/const CONJ = (\{[\s\S]*?\n\};)/);
if(!m){ problems.push('CONJ dataset not found'); }
else{
  let CONJ; try{ CONJ=eval('('+m[1].replace(/;$/,'')+')'); }catch(e){ problems.push('CONJ eval failed: '+e.message); }
  if(CONJ){
    const tenses=['present','imparfait','pc','futur','cond','subj'];
    const keys=Object.keys(CONJ);
    keys.forEach(k=>{
      const v=CONJ[k];
      if(!v.inf||!v.en||!v.group||!v.fam) problems.push(k+': missing metadata');
      tenses.forEach(t=>{
        if(!Array.isArray(v[t])){ problems.push(k+'.'+t+': missing'); return; }
        if(v[t].length!==6) problems.push(k+'.'+t+': '+v[t].length+' forms, expected 6');
        v[t].forEach((f,i)=>{ if(!f||!f.trim()) problems.push(k+'.'+t+'['+i+']: empty'); });
      });
      // French rule: futur and conditionnel share the SAME stem
      if(v.futur&&v.cond){
        const a=v.futur[0].replace(/ai$/,''), b=v.cond[0].replace(/ais$/,'');
        if(a!==b) problems.push(k+': futur stem "'+a+'" != cond stem "'+b+'"');
      }
      // conditionnel takes imparfait endings; futur takes avoir endings
      const cEnd=['ais','ais','ait','ions','iez','aient'];
      const fEnd=['ai','as','a','ons','ez','ont'];
      if(v.cond)  v.cond.forEach((f,i)=>{ if(!f.endsWith(cEnd[i])) problems.push(k+'.cond['+i+'] "'+f+'" should end -'+cEnd[i]); });
      if(v.futur) v.futur.forEach((f,i)=>{ if(!f.endsWith(fEnd[i])) problems.push(k+'.futur['+i+'] "'+f+'" should end -'+fEnd[i]); });
      // imparfait always takes the same endings, for every verb without exception
      if(v.imparfait) v.imparfait.forEach((f,i)=>{ if(!f.endsWith(cEnd[i])) problems.push(k+'.imparfait['+i+'] "'+f+'" should end -'+cEnd[i]); });
    });
    console.log('verbs in dataset :', keys.length);
    console.log('families         :', [...new Set(keys.map(k=>CONJ[k].fam))].join(', '));
    console.log('groups           :', [...new Set(keys.map(k=>CONJ[k].group))].sort().join(', '));
  }
}

// --- drill sanity ---
const dm=js.match(/const DRILL = (\[[\s\S]*?\n\];)/);
if(dm){
  let D; try{ D=eval('('+dm[1].replace(/;$/,'')+')'); }catch(e){ problems.push('DRILL eval failed'); }
  if(D){
    D.forEach((d,i)=>{
      if(!d.q||!d.a) problems.push('DRILL['+i+'] incomplete');
      if(d.q&&d.q.indexOf('_____')<0) problems.push('DRILL['+i+'] has no blank');
      if(d.q&&d.q.indexOf('class="clue"')<0) problems.push('DRILL['+i+'] has no clue word');
    });
    console.log('drill questions  :', D.length);
  }
}
console.log('');
console.log(problems.length? 'PROBLEMS:\n  '+problems.join('\n  ') : 'PROBLEMS: none');
process.exit(problems.length?1:0);
