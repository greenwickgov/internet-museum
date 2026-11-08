const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const WIKI="https://en.wikipedia.org/w/api.php";
const store={get(k,d){try{return JSON.parse(localStorage.getItem("im2-"+k))??d}catch{return d}},set(k,v){try{localStorage.setItem("im2-"+k,JSON.stringify(v))}catch{}}};
let saved=store.get("saved",[]),gcfg=store.get("google",{}),thumbs={},cache=new Map();
const toList=items=>items.map(x=>({year:x[0],title:x[1],label:x[2],desc:x[3],look:x[4]}));
const canSpeak="speechSynthesis" in window;let tour=false,seen=store.get("seen",[]);
const seenIn=h=>h.items.filter(i=>seen.includes(i[1])).length;
const hue=t=>[...t].reduce((a,c)=>a+c.charCodeAt(0),0)%360;
const wk=async(p,sig)=>{const u=new URL(WIKI);Object.entries({action:"query",format:"json",origin:"*",redirects:1,...p}).forEach(([k,v])=>u.searchParams.set(k,v));const r=await fetch(u,{signal:sig});if(!r.ok)throw new Error("Wikipedia returned "+r.status);const j=await r.json();if(j.error)throw new Error(j.error.info||"Wikipedia API error");return j};
let discovered=store.get("found",[]),lastItems=[],resultsQ="";
async function wsearch(q,sig){
  try{
    const d=await wk({generator:"search",gsrsearch:q,gsrlimit:12,prop:"pageimages|extracts",piprop:"thumbnail",pithumbsize:400,exintro:1,explaintext:1,exchars:160,exlimit:"max"},sig);
    return Object.values(d.query?.pages||{}).sort((a,b)=>a.index-b.index).map(p=>({title:p.title,extract:p.extract||"",thumb:p.thumbnail?.source||""}));
  }catch(e){
    if(e.name==="AbortError")throw e;
    const r=await fetch("https://en.wikipedia.org/w/rest.php/v1/search/page?limit=12&q="+encodeURIComponent(q),{signal:sig});
    if(!r.ok)throw new Error("Wikipedia returned "+r.status);
    const d=await r.json();
    return (d.pages||[]).map(p=>({title:p.title,extract:p.description||String(p.excerpt||"").replace(/<[^>]+>/g,""),thumb:p.thumbnail?.url?"https:"+p.thumbnail.url:""}));
  }
}
function addFound(items){
  const m=new Map();[...items,...discovered.map(s=>[s.year||"",s.title,s.label,s.desc||"",s.look||""])].forEach(x=>{if(!m.has(x[1]))m.set(x[1],x)});
  discovered=[...m.values()].slice(0,300).map(x=>({year:x[0],title:x[1],label:x[2],desc:x[3],look:x[4]}));store.set("found",discovered);
}
function generate(){if(!lastItems.length)return;resultsQ=lastQ;addFound(lastItems);panel.classList.remove("on");show("results")}
const gurl=(q,x="")=>"https://www.google.com/search?"+x+"q="+encodeURIComponent(q);

/* Lobby */
function lobby(){
  $("#halls").innerHTML=HALLS.map(h=>`<button class="door" style="--h:${h.h}" data-hall="${h.id}"><div class="era">${esc(h.era)}</div><h2>${esc(h.name)}</h2><p>${esc(h.blurb)}</p><span class="n">${seenIn(h)} of ${h.items.length} visited</span></button>`).join("")+(discovered.length?`<button class="door" style="--h:45" data-hall="found"><div class="era">Found by you</div><h2>Discovered</h2><p>Exhibits generated from your searches.</p><span class="n">${discovered.length} exhibits</span></button>`:"");
  $("#cnt").textContent=saved.length;
  $("#total").textContent=HALLS.reduce((n,h)=>n+h.items.length,0);
}
function show(id){
  const L=$("#lobby"),H=$("#hall");
  if(!id){lobby();L.style.display="";H.classList.remove("on");history.replaceState(null,"","#");scrollTo(0,0);return}
  const hall=id==="results"?{id,name:`“${resultsQ}”`,era:"Generated from your search",h:45,blurb:"Every Wikipedia match became an exhibit. Walk the gallery, or find it all again in Discovered.",items:lastItems}:id==="found"?{id,name:"Discovered",era:"Found by you",h:45,blurb:"Everything your searches have turned up.",items:discovered.map(s=>[s.year||"",s.title,s.label||s.title,s.desc||"",s.look||""])}:id==="mine"?{id,name:"My collection",era:"Saved by you",h:45,blurb:saved.length?"Everything you’ve kept, in one room.":"Nothing here yet. Save an exhibit from its placard.",items:saved.map(s=>[s.year||"",s.title,s.label||s.title,s.desc||"",s.look||""])}:HALLS.find(x=>x.id===id);
  if(!hall)return;
  L.style.display="none";H.classList.add("on");history.replaceState(null,"","#"+id);scrollTo(0,0);
  H.innerHTML=`<button class="back" id="bk">← Back to the lobby</button><div class="hallhead"><div style="color:var(--brass)">${esc(hall.era)}</div><h2>${esc(hall.name)}</h2><p>${esc(hall.blurb)}</p>${hall.items.some(i=>i[3])?`<button class="btn" id="tour">Start the guided tour</button>`:""}</div>
  <div class="wall" tabindex="0" aria-label="${esc(hall.name)} exhibits">${hall.items.map((it,i)=>`<button class="piece" data-i="${i}" style="--h:${hue(it[1])}"><div class="frame"><div class="art" data-t="${esc(it[1])}">${esc(it[2])}</div></div><div class="plaque"><b>${esc(it[1].replace(/ \(.*\)/,""))}</b><br>${esc(it[0])}</div></button>`).join("")}</div>
  <div class="floor-hint">Scroll sideways to walk the hall. Select a frame to read its placard.</div>`;
  H.hall=hall;
  const paint=()=>H.querySelectorAll(".art").forEach(a=>{const s=thumbs[a.dataset.t];if(s){a.style.backgroundImage=`url("${s}")`;a.classList.add("has")}});
  paint();
  const titles=hall.items.map(i=>i[1]).filter(t=>!thumbs[t]);
  for(let n=0;n<titles.length;n+=50){const ch=titles.slice(n,n+50);
    wk({prop:"pageimages",piprop:"thumbnail",pithumbsize:500,titles:ch.join("|")}).then(d=>{
      const q=d.query||{},pg=Object.values(q.pages||{}),nm=Object.fromEntries((q.normalized||[]).map(x=>[x.from,x.to])),rd=Object.fromEntries((q.redirects||[]).map(x=>[x.from,x.to]));
      ch.forEach(t=>{let k=nm[t]||t;k=rd[k]||k;const p=pg.find(p=>p.title===k);if(p?.thumbnail)thumbs[t]=p.thumbnail.source});
      paint();
    }).catch(()=>{});
  }
}

/* Placard */
let cur={list:[],i:0};
async function openCard(list,i){
  cur={list,i};const it=list[i];const dlg=$("#dlg");
  const title=it.title;
  dlg.innerHTML=`<div class="card" style="--h:${hue(title)}"><div class="pic" id="pic">${esc(it.label||title)}</div><div class="txt">
  <h3>${esc(title.replace(/ \(.*\)/,""))}</h3><div class="meta">${it.year?esc(it.year)+" · ":""}Exhibit ${i+1} of ${list.length}</div>
  ${it.desc?`<p class="curator">${esc(it.desc)}</p>`:""}${it.look?`<p class="look"><b>Look closer.</b> ${esc(it.look)}</p>`:""}
  <div class="extract" id="ext">Loading from Wikipedia…</div>
  <div class="acts"><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g,"_"))}" target="_blank" rel="noopener">Wikipedia</a><a href="${gurl(title)}" target="_blank" rel="noopener">Google</a><a href="${gurl(title,"tbm=nws&")}" target="_blank" rel="noopener">Google News</a><a href="https://scholar.google.com/scholar?q=${encodeURIComponent(title)}" target="_blank" rel="noopener">Scholar</a>${canSpeak&&it.desc?`<button id="ls">Listen</button>`:""}<button class="save" id="sv" aria-pressed="${saved.some(s=>s.title===title)}">Save</button></div>
  <div class="nav"><button class="btn ghost" id="pv" ${i<1?"disabled":""}>Previous</button><button class="btn ghost" id="cl">Close</button><button class="btn ghost" id="nx" ${i>=list.length-1?"disabled":""}>Next</button></div>
  <div class="src">Text from Wikipedia, CC BY-SA 4.0. Museum notes are original.</div></div></div>`;
  if(!dlg.open)dlg.showModal();
  if(canSpeak)speechSynthesis.cancel();
  if(!seen.includes(title)){seen.push(title);store.set("seen",seen)}
  if(tour&&it.desc)speak(it);
  try{
    let d=cache.get(title);
    if(!d){const r=await wk({prop:"extracts|pageimages",exintro:1,explaintext:1,exchars:1400,piprop:"thumbnail",pithumbsize:700,titles:title});d=Object.values(r.query.pages)[0];cache.set(title,d)}
    if(cur.list[cur.i]!==it)return;
    $("#ext").textContent=d.extract||"No summary available. Use the links below to read more.";
    if(d.thumbnail){const p=$("#pic");p.style.backgroundImage=`url("${d.thumbnail.source}")`;p.style.color="transparent"}
  }catch(e){if(cur.list[cur.i]===it)$("#ext").innerHTML=`Couldn’t reach Wikipedia (${esc(e.message)}). <button class="btn ghost" id="rt">Retry</button>`}
}

function speak(it){
  if(!canSpeak)return;speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(`${it.title.replace(/ \(.*\)/,"")}. ${it.year||""}. ${it.desc||""} ${it.look||""}`);
  u.onend=()=>{if(tour&&cur.list[cur.i]===it){if(cur.i<cur.list.length-1)openCard(cur.list,cur.i+1);else tour=false}};
  speechSynthesis.speak(u);
}

/* Search */
let tab="wiki",ac,tm,lastQ="";
const panel=$("#panel");
function tabsHtml(){return `<div class="tabs" role="tablist"><button role="tab" data-tab="wiki" aria-selected="${tab==="wiki"}">Wikipedia</button><button role="tab" data-tab="google" aria-selected="${tab==="google"}">Google</button></div>`}
async function search(){
  const q=$("#q").value.trim();lastQ=q;
  if(q.length<2){panel.classList.remove("on");return}
  panel.classList.add("on");
  ac?.abort();ac=new AbortController();
  if(tab==="wiki"){
    panel.innerHTML=tabsHtml()+`<div class="msg">Searching Wikipedia…</div>`;
    try{
      const rs=await wsearch(q,ac.signal);
      rs.forEach(r=>{if(r.thumb)thumbs[r.title]=r.thumb});
      lastItems=rs.map(r=>["",r.title,r.title,"",`Found by searching “${q}”.`]);
      window._rs=toList(lastItems);
      panel.innerHTML=tabsHtml()+(rs.length?`<div class="genbar"><button class="btn" id="gen">Build an exhibition from these ${rs.length} results</button></div>`+rs.map((p,i)=>`<button class="res" data-r="${i}">${p.thumb?`<img src="${esc(p.thumb)}" alt="">`:`<div class="ph"></div>`}<span><b>${esc(p.title)}</b><small>${esc(p.extract)}</small></span></button>`).join(""):`<div class="msg">No Wikipedia matches for “${esc(q)}”. Try different words or the Google tab.</div>`);
    }catch(e){if(e.name!=="AbortError"){lastItems=[];panel.innerHTML=tabsHtml()+`<div class="msg">Couldn’t reach Wikipedia (${esc(e.message)}). ${location.protocol==="file:"?"This page was opened from a file; serve it over http(s) instead, for example with python3 -m http.server. ":"Check your connection. "}<button class="btn ghost" id="rs">Retry</button></div>`}}
  }else{
    const chips=`<div class="chips"><a class="chip" target="_blank" rel="noopener" href="${gurl(q)}">Google</a><a class="chip" target="_blank" rel="noopener" href="${gurl(q+" site:wikipedia.org")}">Google + Wikipedia</a><a class="chip" target="_blank" rel="noopener" href="${gurl(q,"tbm=nws&")}">News</a><a class="chip" target="_blank" rel="noopener" href="${gurl(q,"tbm=isch&")}">Images</a><a class="chip" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q=${encodeURIComponent(q)}">Scholar</a></div>`;
    const form=`<form class="gform" id="gf"><p>${gcfg.key?"Google results are on.":"Show Google results here by adding a free Programmable Search Engine key and ID. They stay in this browser."}</p><input name="key" placeholder="API key" value="${esc(gcfg.key||"")}" autocomplete="off"><input name="cx" placeholder="Search engine ID (cx)" value="${esc(gcfg.cx||"")}" autocomplete="off"><button class="btn">Save and search</button></form>`;
    if(!gcfg.key||!gcfg.cx){panel.innerHTML=tabsHtml()+chips+form;return}
    panel.innerHTML=tabsHtml()+chips+`<div class="msg">Searching Google…</div>`;
    try{
      const r=await fetch(`https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(gcfg.key)}&cx=${encodeURIComponent(gcfg.cx)}&num=8&q=${encodeURIComponent(q)}`,{signal:ac.signal});
      const d=await r.json();if(d.error)throw new Error(d.error.message);
      panel.innerHTML=tabsHtml()+chips+((d.items||[]).map(x=>`<a class="res" target="_blank" rel="noopener" href="${esc(x.link)}" style="text-decoration:none;color:inherit"><div class="ph"></div><span><b>${esc(x.title)}</b><small>${esc(x.displayLink)} · ${esc(x.snippet||"")}</small></span></a>`).join("")||`<div class="msg">No Google results.</div>`)+form;
    }catch(e){if(e.name!=="AbortError")panel.innerHTML=tabsHtml()+chips+`<div class="msg">Google search failed: ${esc(e.message)}. Check the key and engine ID.</div>`+form}
  }
}

/* Events */
document.addEventListener("click",e=>{
  const t=e.target.closest("button,.res");
  if(!e.target.closest(".search"))panel.classList.remove("on");
  if(!t)return;
  if(t.dataset.hall)show(t.dataset.hall);
  else if(t.id==="home"||t.id==="bk")show();
  else if(t.id==="enter")show(HALLS[0].id);
  else if(t.id==="mine")show("mine");
  else if(t.id==="tour"){tour=true;openCard(toList($("#hall").hall.items),0)}
  else if(t.id==="rnd"){const h=HALLS[Math.random()*HALLS.length|0];openCard(toList(h.items),Math.random()*h.items.length|0)}
  else if(t.id==="ls"){if(speechSynthesis.speaking){tour=false;speechSynthesis.cancel();t.textContent="Listen"}else{speak(cur.list[cur.i]);t.textContent="Stop"}}
  else if(t.dataset.i!==undefined){const h=$("#hall").hall;openCard(toList(h.items),+t.dataset.i)}
  else if(t.dataset.tab){tab=t.dataset.tab;search()}
  else if(t.id==="gen")generate();
  else if(t.id==="rs")search();
  else if(t.dataset.r!==undefined){addFound([lastItems[+t.dataset.r]]);openCard(window._rs,+t.dataset.r)}
  else if(t.id==="pv")openCard(cur.list,cur.i-1);
  else if(t.id==="nx")openCard(cur.list,cur.i+1);
  else if(t.id==="cl")$("#dlg").close();
  else if(t.id==="rt")openCard(cur.list,cur.i);
  else if(t.id==="sv"){const it=cur.list[cur.i];const has=saved.some(s=>s.title===it.title);saved=has?saved.filter(s=>s.title!==it.title):[...saved,{title:it.title,year:it.year,label:it.label,desc:it.desc,look:it.look}];store.set("saved",saved);t.setAttribute("aria-pressed",!has);$("#cnt").textContent=saved.length}
});
document.addEventListener("submit",e=>{if(e.target.id==="gf"){e.preventDefault();const f=new FormData(e.target);gcfg={key:f.get("key").trim(),cx:f.get("cx").trim()};store.set("google",gcfg);search()}});
$("#q").addEventListener("input",()=>{clearTimeout(tm);tm=setTimeout(search,300)});
$("#q").addEventListener("keydown",e=>{if(e.key==="Enter"&&tab==="wiki"){e.preventDefault();clearTimeout(tm);if($("#q").value.trim()===lastQ&&lastItems.length)generate();else search().then(generate)}});
$("#q").addEventListener("focus",()=>{if($("#q").value.trim().length>1)panel.classList.add("on")});
$("#dlg").addEventListener("close",()=>{tour=false;if(canSpeak)speechSynthesis.cancel()});
$("#dlg").addEventListener("click",e=>{if(e.target===$("#dlg"))$("#dlg").close()});
document.addEventListener("keydown",e=>{
  const typing=/INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if(e.key==="/"&&!typing){e.preventDefault();$("#q").focus()}
  if(e.key==="Escape")panel.classList.remove("on");
  if($("#dlg").open&&!typing){if(e.key==="ArrowRight"&&cur.i<cur.list.length-1)openCard(cur.list,cur.i+1);if(e.key==="ArrowLeft"&&cur.i>0)openCard(cur.list,cur.i-1)}
});
lobby();
const hh=location.hash.slice(1);if(hh)show(hh);
