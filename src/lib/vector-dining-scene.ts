import * as THREE from 'three';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
import gsap from 'gsap';
import {tableItems} from '../data/learning';
import {tableLayout} from '../data/table-layout';
import {createSpoonGeometry} from './spoon-geometry';
import type {DiningScene,SceneOptions} from './dining-scene';

/** Perspective geometry rendered to SVG on the CPU. No canvas, WebGL or GPU permission. */
export function createVectorDiningScene(host:HTMLDivElement,options:SceneOptions):DiningScene {
  const scene=new THREE.Scene();scene.background=new THREE.Color('#281a1e');
  const camera=new THREE.PerspectiveCamera(42,1,.05,45),look=new THREE.Vector3();
  const renderer=new SVGRenderer();renderer.setQuality('high');renderer.setPrecision(2);
  // SVG has no depth buffer. Draw the room before the teaching objects; do not
  // let the centroid of a room-sized triangle paint over small tableware.
  renderer.sortElements=false;
  renderer.domElement.classList.add('vector-room');renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
  host.dataset.renderer='vector-3d';
  const materials:THREE.Material[]=[];
  const mat=(color:string)=>{const m=new THREE.MeshBasicMaterial({color,side:THREE.FrontSide});materials.push(m);return m;};
  const ivory=mat('#f7f2e8'),linen=mat('#e3d7c7'),wine=mat('#641d2c'),dark=mat('#281a1e'),metal=mat('#c7b89f');
  const line=new THREE.LineBasicMaterial({color:'#a78a5a'});materials.push(line);
  function mesh(geometry:THREE.BufferGeometry,material:THREE.Material,parent:THREE.Object3D=scene){const object=new THREE.Mesh(geometry,material);object.renderOrder=parent.userData.itemIndex===undefined?0:100+parent.userData.itemIndex;parent.add(object);return object;}
  function box(x:number,y:number,z:number,w:number,h:number,d:number,material:THREE.Material,parent:THREE.Object3D=scene){const o=mesh(new THREE.BoxGeometry(w,h,d),material,parent);if(parent===scene)o.renderOrder=-120;o.position.set(x,y,z);return o;}
  function ring(parent:THREE.Object3D,r:number,y:number,color=line){const points=Array.from({length:49},(_,i)=>new THREE.Vector3(Math.cos(i/48*Math.PI*2)*r,y,Math.sin(i/48*Math.PI*2)*r));const o=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),color);o.renderOrder=parent.userData.itemIndex===undefined?1:100.5+parent.userData.itemIndex;parent.add(o);}
  box(0,-.05,0,12,.1,12,linen).renderOrder=-300;box(0,2.2,-3.6,10,4.4,.12,wine).renderOrder=-250;box(-4.5,2.2,0,.12,4.4,8,dark).renderOrder=-251;
  for(const x of [-2.9,0,2.9]){box(x,2.4,-3.51,1.8,2.35,.04,linen).renderOrder=-200;box(x,2.4,-3.47,.035,2.35,.02,wine).renderOrder=-199;box(x,2.4,-3.46,1.8,.035,.02,wine).renderOrder=-199;}
  // Architectural context stays behind the teaching surface, in the same restrained palette.
  box(-3.1,2,-1.8,1.05,.08,.035,metal).renderOrder=-190;
  box(-3.1,1.5,-1.8,.035,1,.035,metal).renderOrder=-190;
  for(const x of [-2.6,0,2.6]){
    box(x,3.75,-.65,.025,1.25,.025,metal).renderOrder=-130;
    const shade=mesh(new THREE.ConeGeometry(.35,.24,24,1,true),metal);shade.position.set(x,3.08,-.65);shade.rotation.x=Math.PI;shade.renderOrder=-130;
  }
  for(const x of [-2.7,2.7]){
    box(x,.94,-2.45,1.15,.06,.8,ivory).renderOrder=-140;
    box(x,.48,-2.45,.07,.9,.07,dark).renderOrder=-150;
    for(const dx of [-.68,.68]){box(x+dx,.53,-2.45,.4,.06,.42,wine).renderOrder=-145;box(x+dx,.84,-2.62,.4,.6,.045,wine).renderOrder=-145;}
  }
  box(0,1,0,4.6,.12,2.6,ivory).renderOrder=-110;box(0,.93,0,4.5,.04,2.5,metal).renderOrder=-111;
  for(const x of [-1.8,1.8])for(const z of [-.9,.9])box(x,.46,z,.08,.9,.08,dark);
  for(const x of [-1.5,0,1.5])for(const z of [-1.8,1.8]){box(x,.57,z,.56,.08,.55,wine);box(x,.98,z+(z>0?.24:-.24),.56,.8,.05,wine);for(const dx of [-.22,.22])box(x+dx,.26,z,.045,.55,.045,dark);}
  const teach=new THREE.Group();teach.position.set(.45,1.065,.6);scene.add(teach);
  const targets:THREE.Group[]=[];
  function item(x:number,z:number,index:number){const g=new THREE.Group();g.position.set(x,0,z);g.userData.itemIndex=index;teach.add(g);targets[index]=g;return g;}
  function plate(g:THREE.Group,r:number){mesh(new THREE.CylinderGeometry(r,r*.93,.032,40),linen,g).position.y=.017;const top=mesh(new THREE.CircleGeometry(r*.98,40),ivory,g);top.rotation.x=-Math.PI/2;top.position.y=.035;ring(g,r*.92,.037);ring(g,r*.72,.038);}
  plate(item(0,0,0),.4);
  const napkin=item(0,0,1);napkin.rotation.y=.18;box(0,.055,0,.23,.012,.37,wine,napkin);box(0,.065,0,.25,.008,.045,metal,napkin);
  function fork(g:THREE.Group,scale=1){g.scale.setScalar(scale);box(0,.02,.12,.025,.012,.33,metal,g);box(0,.026,-.07,.077,.012,.07,metal,g);for(const x of [-.032,-.011,.011,.032])box(x,.03,-.175,.008,.012,.15,metal,g);}
  fork(item(-.65,0,2),.88);fork(item(-.5,0,3));
  const knife=item(.5,0,4);box(0,.02,.12,.033,.014,.32,metal,knife);const blade=new THREE.Shape();blade.moveTo(.015,.045);blade.lineTo(.015,.31);blade.quadraticCurveTo(-.047,.25,-.04,.045);blade.closePath();const k=mesh(new THREE.ExtrudeGeometry(blade,{depth:.009,bevelEnabled:false}),metal,knife);k.rotation.x=-Math.PI/2;k.position.y=.024;
  const spoon=item(.67,0,5);const spoonMat=new THREE.MeshLambertMaterial({color:'#c5b08a',side:THREE.FrontSide});materials.push(spoonMat);mesh(createSpoonGeometry(),spoonMat,spoon);
  plate(item(-.64,-.63,6),.2);
  const glass=item(.54,-.62,7);const clear=new THREE.MeshBasicMaterial({color:'#c5b8a0',transparent:true,opacity:.28,side:THREE.FrontSide});materials.push(clear);mesh(new THREE.CylinderGeometry(.1,.09,.29,24,1,true),clear,glass).position.y=.15;ring(glass,.1,.295);ring(glass,.09,.008);ring(glass,.096,.15);

  for(let index=8;index<tableLayout.length;index++) {
    const part=tableLayout[index],g=item(part.x,part.z,index);g.rotation.y=part.angle??0;g.scale.setScalar(part.scale);
    if(part.kind==='fork')fork(g,part.scale);
    if(part.kind==='knife') {
      box(0,.02,.12,.033,.014,.32,metal,g);
      if(index===10){box(-.006,.024,-.115,.06,.014,.22,metal,g);g.position.y=.05;}
      else {const shape=new THREE.Shape();shape.moveTo(.025,-.04);shape.lineTo(.025,-.32);shape.lineTo(-.07,-.25);shape.lineTo(-.055,-.04);shape.closePath();const fish=mesh(new THREE.ExtrudeGeometry(shape,{depth:.009,bevelEnabled:false}),metal,g);fish.rotation.x=Math.PI/2;fish.position.y=.03;}
    }
    if(part.kind==='spoon')mesh(createSpoonGeometry(),spoonMat,g);
    if(part.kind==='wine') {
      mesh(new THREE.CylinderGeometry(.075,.075,.012,24),clear,g).position.y=.007;
      mesh(new THREE.CylinderGeometry(.01,.01,.19,12),clear,g).position.y=.105;
      const bowl=mesh(new THREE.SphereGeometry(.12,20,12,0,Math.PI*2,0,Math.PI*.78),clear,g);bowl.position.y=.32;bowl.scale.y=.95;ring(g,.09,.43);
    }
    if(part.kind==='cup') {
      plate(g,.15);mesh(new THREE.CylinderGeometry(.105,.075,.12,28,1,true),linen,g).position.y=.11;
      ring(g,.105,.17);const coffee=mesh(new THREE.CircleGeometry(.098,28),dark,g);coffee.rotation.x=-Math.PI/2;coffee.position.y=.15;
      const handle=mesh(new THREE.TorusGeometry(.045,.009,8,20),ivory,g);handle.position.set(.12,.11,0);
    }
  }
  for(let index=0;index<8;index++){targets[index].position.x=tableLayout[index].x;targets[index].position.z=tableLayout[index].z;}
  const pickMaterial=new THREE.MeshBasicMaterial({visible:false});materials.push(pickMaterial);
  for(const index of [2,3,4,5,7,8,9,10,11,12,13,14,15]){const proxy=mesh(new THREE.BoxGeometry(tableLayout[index].kind==='wine'||index===7?.23:.095,tableLayout[index].kind==='wine'?.45:index===7?.3:.06,tableLayout[index].kind==='wine'||index===7?.23:.58),pickMaterial,targets[index]);proxy.position.y=tableLayout[index].kind==='wine'?.22:index===7?.15:.035;}
  scene.add(new THREE.AmbientLight('#fff4df',.5));const light=new THREE.DirectionalLight('#fff4df',.7);light.position.set(-3,5,3);scene.add(light);
  const pin=document.createElement('span');pin.className='object-pin';pin.setAttribute('aria-hidden','true');host.append(pin);
  let alive=true,visible=true,selected=-1,seated=!options.hero;let movement:gsap.core.Timeline|undefined;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  function render(){if(!alive||!visible||document.hidden)return;camera.lookAt(look);renderer.render(scene,camera);pin.hidden=selected<0;if(selected>=0){const p=new THREE.Vector3();targets[selected].getWorldPosition(p);if(selected===5)p.z-=.18;p.project(camera);pin.textContent=tableItems[selected].name;pin.dataset.object=tableItems[selected].id;pin.style.left=`${Math.max(85,Math.min(host.clientWidth-85,(p.x+1)*host.clientWidth/2))}px`;pin.style.top=`${Math.max(155,(1-p.y)*host.clientHeight/2-(selected===5?125:45))}px`;}}
  function move(position:THREE.Vector3,target:THREE.Vector3,instant=false){movement?.kill();host.dataset.camera=selected>=0?`item-${selected}`:seated?'table':'room';host.dataset.moving=String(!instant&&!media.matches);if(instant||media.matches){camera.position.copy(position);look.copy(target);render();}else movement=gsap.timeline({defaults:{duration:.9,ease:'power3.inOut'},onUpdate:render,onComplete:()=>{host.dataset.moving='false';}}).to(camera.position,{x:position.x,y:position.y,z:position.z},0).to(look,{x:target.x,y:target.y,z:target.z},0);}
  function seat(instant=false){seated=true;selected=-1;move(new THREE.Vector3(1.3,2.75,3.7),new THREE.Vector3(.35,1.2,-.25),instant);}
  function overview(instant=false){seated=false;selected=-1;move(new THREE.Vector3(3.5,3.35,6.3),new THREE.Vector3(0,1.5,-.6),instant);}
  function select(index:number,instant=false){selected=index;seated=true;scene.updateMatrixWorld(true);const p=new THREE.Vector3();targets[index].getWorldPosition(p);const small=['fork','knife','spoon'].includes(tableLayout[index].kind);move(p.clone().add(new THREE.Vector3(small?.25:.45,small?.65:1,small?.8:1.2)),p,instant);}
  const resize=new ResizeObserver(()=>{if(!host.clientWidth||!host.clientHeight)return;camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);render();});resize.observe(host);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)render();});observer.observe(host);
  const onVisibility=()=>{if(!document.hidden)render();};document.addEventListener('visibilitychange',onVisibility);
  const onMotion=()=>{if(selected>=0)select(selected,true);else if(seated)seat(true);else overview(true);};media.addEventListener('change',onMotion);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function hit(event:PointerEvent){const r=host.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);let o:THREE.Object3D|null=raycaster.intersectObjects(targets,true).find(hit=>hit.object instanceof THREE.Mesh)?.object??null;while(o&&o.userData.itemIndex===undefined)o=o.parent;return o?.userData.itemIndex??-1;}
  const hover=document.createElement('span');hover.className='object-hover-label';hover.hidden=true;hover.setAttribute('aria-hidden','true');host.append(hover);
  const onHover=(event:PointerEvent)=>{const index=hit(event);host.dataset.hovered=String(index);renderer.domElement.style.cursor=index>=0?'pointer':'default';hover.hidden=index<0;if(index>=0){hover.textContent=tableItems[index].name;const r=host.getBoundingClientRect();hover.style.left=`${Math.min(event.clientX-r.left+16,r.width-150)}px`;hover.style.top=`${event.clientY-r.top-42}px`;}};
  const onLeave=()=>{hover.hidden=true;};
  let pointerStart:{x:number;y:number}|undefined;
  const onDown=(event:PointerEvent)=>{pointerStart={x:event.clientX,y:event.clientY};};
  const onPointer=(event:PointerEvent)=>{if(!pointerStart||Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>8)return;pointerStart=undefined;const index=hit(event);if(index>=0)options.onSelect(index);};
  renderer.domElement.addEventListener('pointerdown',onDown);renderer.domElement.addEventListener('pointerup',onPointer);renderer.domElement.addEventListener('pointermove',onHover);renderer.domElement.addEventListener('pointerleave',onLeave);
  if(options.hero)overview(true);else seat(true);
  const frame=requestAnimationFrame(()=>{render();options.onReady();});
  return {seat,select,overview,dispose(){alive=false;cancelAnimationFrame(frame);movement?.kill();resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);media.removeEventListener('change',onMotion);renderer.domElement.removeEventListener('pointerdown',onDown);renderer.domElement.removeEventListener('pointerup',onPointer);renderer.domElement.removeEventListener('pointermove',onHover);renderer.domElement.removeEventListener('pointerleave',onLeave);hover.remove();const geometries=new Set<THREE.BufferGeometry>();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line)geometries.add(o.geometry);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());pin.remove();renderer.domElement.remove();}};
}
