/* Physical investigation board: free-positioned case cards and draggable colored string. */
(()=> {
 const board=document.getElementById('board'), tools=document.querySelector('.toolbar'), roomTools=document.querySelector('.room-tools');
 if(!board||!tools||!roomTools)return;
 const KEY='fromville-board-layout-v1';
 let state={positions:{},zoom:1,stringMode:false,from:null};
 try{state={...state,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
 board.classList.add('physical-board');
 const svgNS='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(svgNS,'svg');svg.classList.add('string-overlay');svg.setAttribute('aria-hidden','true');
 board.prepend(svg);
 const controls=document.createElement('div');controls.className='board-controls';
 controls.innerHTML='<button type="button" id="pullString">🧵 Pull a string</button><button type="button" id="zoomOut" aria-label="Zoom out">−</button><span id="zoomLabel">100%</span><button type="button" id="zoomIn" aria-label="Zoom in">＋</button><button type="button" id="fitBoard">Fit board</button><span class="board-help">Choose Pull a string, then drag from one case paper to another.</span>';
 board.parentElement.insertBefore(controls,board);
 const $=id=>document.getElementById(id);
 const colors=()=>document.getElementById('stringColor')?.value||'#e34b3f';
 function positionCards(){
  const cards=[...board.querySelectorAll('.note')];
  const w=Math.max(board.clientWidth,300);
  const cardW=Math.min(220,Math.max(140,(w-50)/2));
  const gap=24,cols=Math.max(1,Math.floor((w-26)/(cardW+gap)));
  cards.forEach((card,i)=>{
   const id=card.dataset.id;
   if(!state.positions[id]){
    const col=i%cols,row=Math.floor(i/cols);
    state.positions[id]={x:14+col*(cardW+gap),y:20+row*205};
   }
   const p=state.positions[id];
   card.style.left=p.x+'px';card.style.top=p.y+'px';card.style.width=cardW+'px';
   card.style.setProperty('--tilt',((i%5)-2)*.45+'deg');
   const meta=card.querySelector('.meta');if(meta){meta.title='Drag this label to move the paper';meta.classList.add('note-handle')}
  });
  const rows=Math.max(1,Math.ceil(cards.length/cols));
  board.style.minHeight=Math.max(560,rows*205+45)+'px';
  save();drawStrings();
 }
 function drawStrings(){
  const rect=board.getBoundingClientRect(),scale=state.zoom||1;
  svg.setAttribute('viewBox',`0 0 ${board.clientWidth} ${board.clientHeight}`);
  svg.setAttribute('width',board.clientWidth);svg.setAttribute('height',board.clientHeight);
  svg.innerHTML='';
  const notes=[...board.querySelectorAll('.note')];
  const centers=new Map(notes.map(n=>[n.dataset.id,{x:n.offsetLeft+n.offsetWidth/2,y:n.offsetTop+n.offsetHeight/2}]));
  const links=(()=>{try{return JSON.parse(localStorage.getItem('fromville-theory-room-v2')||'{}').links||[]}catch(e){return []}})();
  links.forEach(l=>{const a=centers.get(l.a),b=centers.get(l.b);if(!a||!b)return;const path=document.createElementNS(svgNS,'path');path.setAttribute('d',`M ${a.x} ${a.y} Q ${(a.x+b.x)/2+18} ${(a.y+b.y)/2-30} ${b.x} ${b.y}`);path.setAttribute('stroke',l.color||'#e34b3f');path.setAttribute('stroke-width','4');path.setAttribute('fill','none');path.setAttribute('stroke-linecap','round');path.setAttribute('filter','url(#stringShadow)');svg.append(path)});
  const defs=document.createElementNS(svgNS,'defs'),filter=document.createElementNS(svgNS,'filter');filter.id='stringShadow';const shadow=document.createElementNS(svgNS,'feDropShadow');shadow.setAttribute('dx','1');shadow.setAttribute('dy','2');shadow.setAttribute('stdDeviation','1.4');shadow.setAttribute('flood-opacity','.65');filter.append(shadow);defs.append(filter);svg.append(defs);
 }
 function setZoom(v){state.zoom=Math.max(.65,Math.min(1.6,v));board.style.zoom=state.zoom;$('zoomLabel').textContent=Math.round(state.zoom*100)+'%';save();drawStrings()}
 $('zoomIn').onclick=()=>setZoom(state.zoom+.1);$('zoomOut').onclick=()=>setZoom(state.zoom-.1);$('fitBoard').onclick=()=>setZoom(1);
 $('pullString').onclick=()=>{state.stringMode=!state.stringMode;state.from=null;board.classList.toggle('string-mode',state.stringMode);$('pullString').textContent=state.stringMode?'✕ Cancel string':'🧵 Pull a string';$('pullString').classList.toggle('primary',state.stringMode)};
 board.addEventListener('pointerdown',e=>{
  const card=e.target.closest('.note');if(!card)return;
  if(state.stringMode){state.from=card.dataset.id;card.classList.add('string-start');e.preventDefault();return}
  if(!e.target.closest('.note-handle'))return;
  const id=card.dataset.id,p=state.positions[id],start={x:e.clientX,y:e.clientY,px:p.x,py:p.y};
  card.setPointerCapture?.(e.pointerId);
  const move=ev=>{const z=state.zoom||1;p.x=Math.max(0,start.px+(ev.clientX-start.x)/z);p.y=Math.max(0,start.py+(ev.clientY-start.y)/z);card.style.left=p.x+'px';card.style.top=p.y+'px';drawStrings()};
  const up=()=>{card.removeEventListener('pointermove',move);card.removeEventListener('pointerup',up);card.removeEventListener('pointercancel',up);save()};
  card.addEventListener('pointermove',move);card.addEventListener('pointerup',up);card.addEventListener('pointercancel',up);
 });
 board.addEventListener('pointerup',e=>{
  if(!state.stringMode||!state.from)return;
  const target=e.target.closest('.note');if(!target)return;
  const to=target.dataset.id,from=state.from;
  board.querySelectorAll('.string-start').forEach(n=>n.classList.remove('string-start'));
  state.from=null;
  if(to===from)return;
  const data=(()=>{try{return JSON.parse(localStorage.getItem('fromville-theory-room-v2')||'{}')}catch(e){return {}}})();
  data.links=Array.isArray(data.links)?data.links:[];
  if(!data.links.some(l=>(l.a===from&&l.b===to)||(l.a===to&&l.b===from)))data.links.push({a:from,b:to,color:colors()});
  localStorage.setItem('fromville-theory-room-v2',JSON.stringify(data));
  $('pullString').click();drawStrings();
 });
 const observer=new MutationObserver(()=>{positionCards()});observer.observe(board,{childList:true});
 window.addEventListener('resize',drawStrings);
 const originalBoardClick=board.onclick;
 positionCards();setZoom(state.zoom);
})();
