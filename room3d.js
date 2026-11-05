/* Fromville room controls: 3D room shell, orbit view, fairy lights and six string colors. */
(()=> {
 const scene=document.querySelector('.room-scene');
 const wall=document.querySelector('.room-wall');
 const floor=document.querySelector('.room-floor');
 const bar=document.querySelector('.room-tools');
 if(!scene||!wall||!floor||!bar)return;
 const prefsKey='fromville-room3d-v1';
 const palette=[['Scarlet','#e34b3f'],['Ocean','#4c9bd6'],['Gold','#e6b94f'],['Violet','#a77bcb'],['Mint','#65b99a'],['Warm white','#f4e8d5']];
 let saved={lightColor:'#ffd88c',lights:!document.getElementById('fairyLights')?.classList.contains('off'),yaw:0,pitch:0};
 try{saved={...saved,...JSON.parse(localStorage.getItem(prefsKey)||'{}')}}catch(e){}
 const persist=()=>{try{localStorage.setItem(prefsKey,JSON.stringify(saved))}catch(e){}};
 const world=document.createElement('div');world.className='room3d-world';
 scene.insertBefore(world,wall);world.append(wall,floor);
 const left=document.createElement('div');left.className='room3d-side left';left.setAttribute('aria-hidden','true');
 const right=document.createElement('div');right.className='room3d-side right';right.setAttribute('aria-hidden','true');
 const ceiling=document.createElement('div');ceiling.className='room3d-ceiling';ceiling.setAttribute('aria-hidden','true');
 world.insertBefore(left,wall);world.insertBefore(right,wall);world.insertBefore(ceiling,wall);
 const syncWall=()=>world.style.setProperty('--wall',getComputedStyle(wall).getPropertyValue('--wall').trim()||'#49372d');
 syncWall();new MutationObserver(syncWall).observe(wall,{attributes:true,attributeFilter:['style']});
 const garland=document.createElement('div');garland.className='room3d-garland';garland.setAttribute('aria-label','Decorative string lights');
 for(let i=0;i<15;i++){const bulb=document.createElement('span');bulb.style.setProperty('--bulb-x',(i/14*100)+'%');bulb.style.setProperty('--bulb-y',(10+Math.sin(i/14*Math.PI)*35)+'px');garland.append(bulb)}
 wall.append(garland);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='room3d-view';toggle.textContent='🧊 3D room on';toggle.setAttribute('aria-pressed','true');toggle.title='Toggle the 3D room';
 const angle=document.createElement('button');angle.type='button';angle.textContent='↻ Change angle';angle.title='Rotate the room view';
 const reset=document.createElement('button');reset.type='button';reset.textContent='⌂ Reset view';reset.title='Reset room perspective';
 bar.append(toggle,angle,reset);
 const colorLabel=document.createElement('strong');colorLabel.textContent='🧵 STRING COLORS';colorLabel.style.marginLeft='6px';bar.append(colorLabel);
 const colorButtons=[];
 palette.forEach(([name,color])=>{const b=document.createElement('button');b.type='button';b.className='light-color';b.title=name+' string and fairy-light color';b.setAttribute('aria-label',name+' string and fairy-light color');b.style.background=color;b.addEventListener('click',()=>{saved.lightColor=color;const input=document.getElementById('stringColor');if(input){input.value=color;input.dispatchEvent(new Event('input',{bubbles:true}))}paintLights();persist()});bar.append(b);colorButtons.push([b,color])});
 const hint=document.createElement('span');hint.className='room3d-hint';hint.textContent='Drag empty room space to look around';bar.append(hint);
 function paintLights(){garland.style.setProperty('--bulb-color',saved.lightColor);garland.classList.toggle('is-off',saved.lights===false);colorButtons.forEach(([b,c])=>b.setAttribute('aria-pressed',String(c===saved.lightColor)))}
 function setView(){world.style.setProperty('--room-yaw',saved.yaw+'deg');world.style.setProperty('--room-pitch',saved.pitch+'deg')}
 toggle.addEventListener('click',()=>{const flat=scene.classList.toggle('is-flat');toggle.textContent=flat?'🧊 3D room off':'🧊 3D room on';toggle.setAttribute('aria-pressed',String(!flat))});
 angle.addEventListener('click',()=>{saved.yaw=saved.yaw===0?-7:saved.yaw===-7?7:0;saved.pitch=saved.yaw===0?0:1;setView();persist()});
 reset.addEventListener('click',()=>{saved.yaw=0;saved.pitch=0;scene.classList.remove('is-flat');toggle.textContent='🧊 3D room on';toggle.setAttribute('aria-pressed','true');setView();persist()});
 const lightToggle=document.getElementById('lightsToggle');
 if(lightToggle){const original=lightToggle.onclick;lightToggle.addEventListener('click',()=>{saved.lights=!saved.lights;paintLights();persist()})}
 let drag=null;
 scene.addEventListener('pointerdown',e=>{if(e.target.closest('.room-decoration,.note,button,input,textarea,select'))return;drag={x:e.clientX,y:e.clientY,yaw:saved.yaw,pitch:saved.pitch};scene.setPointerCapture?.(e.pointerId)});
 scene.addEventListener('pointermove',e=>{if(!drag)return;saved.yaw=Math.max(-13,Math.min(13,drag.yaw+(e.clientX-drag.x)*.12));saved.pitch=Math.max(-5,Math.min(5,drag.pitch-(e.clientY-drag.y)*.07));setView()});
 const endDrag=()=>{if(drag){drag=null;persist()}};
 scene.addEventListener('pointerup',endDrag);scene.addEventListener('pointercancel',endDrag);
 const layer=document.getElementById('decorLayer');
 function decorateModels(){if(!layer)return;layer.querySelectorAll('.room-decoration').forEach(el=>{if(el.querySelector('.room3d-object'))return;const emoji=el.firstChild;if(!emoji||emoji.nodeType!==Node.TEXT_NODE)return;const value=emoji.textContent.trim();const types={'🛋️':'sofa','🪑':'chair','📚':'books','🗄️':'cabinet','🪴':'plant','🧶':'rug'};const obj=document.createElement('span');obj.className='room3d-object';obj.dataset.model=types[value]||'decor';obj.textContent=value;el.insertBefore(obj,emoji);emoji.remove()})}
 if(layer){decorateModels();new MutationObserver(decorateModels).observe(layer,{childList:true,subtree:true})}
 paintLights();setView();
})();
