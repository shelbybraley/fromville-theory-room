/* Small immersive-room controls; leaves existing notes and saved decor intact. */
(()=>{
 const scene=document.querySelector('.room-scene');if(!scene)return;
 const bar=document.querySelector('.room-tools');
 const view=document.createElement('button');view.type='button';view.textContent='🧊 3D view on';view.setAttribute('aria-pressed','true');view.title='Toggle the room depth effect';
 view.addEventListener('click',()=>{const on=scene.classList.toggle('is-rotated');view.textContent=on?'🧊 3D view angled':'🧊 3D view on';view.setAttribute('aria-pressed',String(on));});bar.append(view);
 const colors=[['Scarlet','#e34b3f'],['Ocean','#4c9bd6'],['Gold','#e6b94f'],['Violet','#a77bcb'],['Mint','#65b99a'],['White','#f4e8d5']];
 const label=document.createElement('strong');label.textContent='🧵 STRING COLORS';label.style.marginLeft='6px';bar.append(label);
 colors.forEach(([name,color])=>{const b=document.createElement('button');b.type='button';b.title=name+' string';b.setAttribute('aria-label',name+' string color');b.style.cssText='width:28px;height:28px;padding:0;border-radius:50%;background:'+color+';border:2px solid #ead6b8;box-shadow:0 0 9px '+color;b.addEventListener('click',()=>{const input=document.getElementById('stringColor');if(input){input.value=color;input.dispatchEvent(new Event('input',{bubbles:true}));}});bar.append(b)});
})();
