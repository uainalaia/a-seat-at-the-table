import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import { tableItems } from '../data/learning';
import { tableLayout } from '../data/table-layout';
import { createSpoonGeometry } from './spoon-geometry';

export interface DiningScene {
  seat: (instant?: boolean) => void;
  select: (index: number, instant?: boolean) => void;
  overview: (instant?: boolean) => void;
  dispose: () => void;
}

export interface SceneOptions {
  hero: boolean;
  onSelect: (index: number) => void;
  onReady: () => void;
  onUnavailable: () => void;
}

// All architecture, furniture, tableware and material maps are authored here.
// No remote models, texture requests, camera controls or render loop in React state.
export function createDiningScene(host: HTMLDivElement, options: SceneOptions): DiningScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#24191a');
  scene.fog = new THREE.Fog('#24191a', 17, 35);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 55);
  // Preserve the last on-demand frame when mobile scrolling takes the canvas off-screen.
  const canvas=document.createElement('canvas');
  const context=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'default',preserveDrawingBuffer:true})
    ||canvas.getContext('webgl2',{antialias:false,alpha:false,powerPreference:'default',preserveDrawingBuffer:true});
  if(!context)throw new Error('WEBGL2_UNAVAILABLE');
  const renderer = new THREE.WebGLRenderer({canvas,context,alpha:false});
  host.dataset.renderer='webgl';
  try {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const env = pmrem.fromScene(environment, 0.04);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.65;
  environment.dispose();
  pmrem.dispose();

  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const material = (color: string, roughness = 0.7, metalness = 0) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    materials.push(m); return m;
  };
  const walnut = material('#34251f', 0.44);
  const plaster = material('#826a59', 0.94);
  const wine = material('#4e1b27', 0.87);
  const darkWine = material('#32151f', 0.75);
  const brass = material('#a78a5a', 0.3, 0.83);
  const silver = material('#d9dde1', 0.145, 1);
  const porcelain = new THREE.MeshPhysicalMaterial({color:'#ebe3d4',roughness:0.22,clearcoat:0.65,clearcoatRoughness:0.18});materials.push(porcelain);
  const linen = material('#bcac96', 0.97);
  const napkinMaterial = material('#4b1626', 0.92);
  const candleWax = material('#ead5ad', 0.7);
  const glass = new THREE.MeshPhysicalMaterial({ color: '#b5c8c2', roughness: 0.06, metalness: 0, transmission: 0.8, thickness: 0.06, ior: 1.46, transparent: true, opacity: 1 });
  materials.push(glass);
  const water = new THREE.MeshPhysicalMaterial({ color: '#8aada2', transmission: 0.78, roughness: 0.08, thickness: 0.1, transparent: true, opacity: 0.8 });
  materials.push(water);
  const glow = new THREE.MeshBasicMaterial({ color: '#ffe2a0' }); materials.push(glow);

  function texture(kind: 'wood' | 'cloth') {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = kind === 'wood' ? '#8b7769' : '#cfc7bb'; ctx.fillRect(0, 0, 256, 256);
    let seed = 8462;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 1100; i++) {
      ctx.strokeStyle = `rgba(${kind === 'wood' ? '30,19,14' : '80,66,44'},${random() * 0.15})`;
      ctx.lineWidth = kind === 'wood' ? random() * 1.5 : 0.5;
      ctx.beginPath(); const x = random() * 256, y = random() * 256;
      ctx.moveTo(x, y); ctx.lineTo(kind === 'wood' ? x + random() * 12 : x + 256, kind === 'wood' ? y + 256 : y); ctx.stroke();
      if (kind === 'cloth') { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke(); }
    }
    const t = new THREE.CanvasTexture(canvas); t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(kind === 'cloth' ? 9 : 2, kind === 'cloth' ? 12 : 3); textures.push(t); return t;
  }
  walnut.map = texture('wood'); walnut.map.colorSpace = THREE.SRGBColorSpace;
  linen.bumpMap = texture('cloth'); linen.bumpScale = 0.012;
  napkinMaterial.bumpMap = linen.bumpMap; napkinMaterial.bumpScale = 0.008;

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(1, 16, 10);
  function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = scene) {
    const object = new THREE.Mesh(geometry, mat); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  }
  function box(x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material, parent: THREE.Object3D = scene) {
    const m = mesh(boxGeometry, mat, parent); m.position.set(x, y, z); m.scale.set(w, h, d); return m;
  }
  function rounded(x:number,y:number,z:number,w:number,h:number,d:number,r:number,mat:THREE.Material,parent:THREE.Object3D=scene) {
    const m=mesh(new RoundedBoxGeometry(w,h,d,3,r),mat,parent);m.position.set(x,y,z);return m;
  }
  function cylinder(x: number, y: number, z: number, r: number, h: number, mat: THREE.Material, parent: THREE.Object3D = scene, top = r) {
    const m = mesh(new THREE.CylinderGeometry(top, r, h, 32), mat, parent); m.position.set(x, y, z); return m;
  }
  function lathe(points: [number, number][], mat: THREE.Material, parent: THREE.Object3D, segments = 64) {
    return mesh(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments), mat, parent);
  }
  function torus(r: number, tube: number, mat: THREE.Material, parent: THREE.Object3D, x = 0, y = 0, z = 0) {
    const m = mesh(new THREE.TorusGeometry(r, tube, 8, 64), mat, parent); m.rotation.x = Math.PI / 2; m.position.set(x, y, z); return m;
  }

  // A warm, intimate salon: herringbone floor, paneled walls and three tall arches.
  box(0, -0.09, 0, 14, 0.15, 18, walnut);
  const floorCanvas=document.createElement('canvas'); floorCanvas.width=floorCanvas.height=1024;
  const floorContext=floorCanvas.getContext('2d')!;
  floorContext.fillStyle='#34251e'; floorContext.fillRect(0,0,1024,1024);
  for(let row=0;row<16;row++)for(let col=-1;col<4;col++) {
    const offset=(row%3)*85; const x=col*256+offset, y=row*64;
    const shade=49+((row*13+col*17+63)%21);
    floorContext.fillStyle=`rgb(${shade+15},${shade},${shade-9})`; floorContext.fillRect(x+1,y+1,254,62);
    for(let grain=0;grain<20;grain++) {
      floorContext.strokeStyle=`rgba(15,8,5,${0.03+(grain%4)*0.013})`;
      floorContext.beginPath(); floorContext.moveTo(x,y+grain*3.1); floorContext.bezierCurveTo(x+85,y+grain*3.1+4,x+170,y+grain*3.1-3,x+256,y+grain*3.1); floorContext.stroke();
    }
  }
  const parquet=new THREE.CanvasTexture(floorCanvas); parquet.colorSpace=THREE.SRGBColorSpace; parquet.wrapS=parquet.wrapT=THREE.RepeatWrapping; parquet.repeat.set(2,3); textures.push(parquet);
  const parquetMaterial=material('#ffffff',0.58); parquetMaterial.map=parquet; parquetMaterial.bumpMap=parquet; parquetMaterial.bumpScale=0.009;
  const floor=mesh(new THREE.PlaneGeometry(14,18),parquetMaterial); floor.rotation.x=-Math.PI/2; floor.position.y=0.01;
  box(0, 2.5, -6, 13, 5, 0.3, darkWine);
  box(-6.1, 2.5, 0, 0.2, 5, 14, darkWine);
  box(6.1, 2.5, -0.5, 0.2, 5, 13, plaster);
  box(0, 5.12, -1, 13, 0.2, 15, material('#4c3b31'));
  for (const y of [0.12, 1.16, 4.75, 4.9]) {
    box(0, y, -5.8, 12, 0.035, 0.08, brass);
    box(-5.94, y, -0.5, 0.07, 0.035, 11, brass);
  }
  for (let x = -5; x <= 5; x += 1.25) {
    box(x, 0.62, -5.81, 0.025, 0.9, 0.055, walnut);
    box(x, 0.2, -5.8, 1.05, 0.025, 0.04, walnut);
  }
  for (const x of [-3.8, 0, 3.8]) {
    const arch = new THREE.Shape();
    arch.moveTo(-1.15, 0); arch.lineTo(1.15, 0); arch.lineTo(1.15, 2.15);
    arch.absarc(0, 2.15, 1.15, 0, Math.PI, false); arch.lineTo(-1.15, 0);
    const skyCanvas=document.createElement('canvas');skyCanvas.width=256;skyCanvas.height=512;
    const skyContext=skyCanvas.getContext('2d')!;
    const dusk=skyContext.createLinearGradient(0,0,0,512);dusk.addColorStop(0,'#243449');dusk.addColorStop(.6,'#6e7a83');dusk.addColorStop(1,'#b58d79');skyContext.fillStyle=dusk;skyContext.fillRect(0,0,256,512);
    for(let layer=0;layer<3;layer++) {
      skyContext.fillStyle=['#57626b','#414c56','#2d3d45'][layer];skyContext.beginPath();skyContext.moveTo(0,512);
      for(let i=0;i<=16;i++)skyContext.lineTo(i*16,390+layer*29+Math.sin(i*.65+layer*2.1)*26+Math.sin(i*1.7)*9);
      skyContext.lineTo(256,512);skyContext.closePath();skyContext.fill();
    }
    const skyTexture=new THREE.CanvasTexture(skyCanvas);skyTexture.colorSpace=THREE.SRGBColorSpace;textures.push(skyTexture);
    const skyMat = new THREE.MeshBasicMaterial({map:skyTexture,color:'#9aabae'}); materials.push(skyMat);
    const opening = mesh(new THREE.ShapeGeometry(arch), skyMat); opening.position.set(x, 1.3, -5.79); opening.castShadow = false;
    // Window mullions, thick stone surround and softly folded curtains.
    box(x, 2.8, -5.65, 0.045, 3, 0.07, brass);
    for (const y of [2.1, 3.1]) box(x, y, -5.65, 2.25, 0.04, 0.07, brass);
    const outline = new THREE.CatmullRomCurve3(Array.from({ length: 41 }, (_, i) => new THREE.Vector3(x + Math.cos(i / 40 * Math.PI) * 1.2, 3.45 + Math.sin(i / 40 * Math.PI) * 1.2, -5.58)));
    mesh(new THREE.TubeGeometry(outline, 40, 0.055, 8, false), brass);
    for (const side of [-1, 1]) {
      box(x + side * 1.22, 2.35, -5.58, 0.11, 2.15, 0.12, brass);
      for (let fold = 0; fold < 7; fold++) {
        const curtain = cylinder(x + side * (1.3 + fold * 0.065), 2.75, -5.42 + Math.sin(fold * 1.8) * 0.06, 0.075, 3.8, wine);
        curtain.scale.z = 0.8;
      }
    }
  }
  // Pool of light on the floor; rug grounds the scene rather than floating it.
  box(0, 0.025, -0.4, 5.6, 0.015, 7.3, wine);
  box(0, 0.037, -0.4, 5.38, 0.008, 7.08, material('#614147', 1));
  const rugMaterial=material('#37252e',1);rugMaterial.bumpMap=linen.bumpMap;rugMaterial.bumpScale=0.015;
  box(0, 0.044, -0.4, 5.25, 0.005, 6.95, rugMaterial);

  const table = new THREE.Group(); scene.add(table);
  box(0, 1.08, -0.6, 3.8, 0.15, 5.6, walnut, table);
  for (const x of [-1.35, 1.35]) for (const z of [-2.65, 1.45]) box(x, 0.52, z, 0.13, 1, 0.13, walnut, table);
  rounded(0, 1.162, -0.6, 3.87, 0.024, 5.67, 0.01, linen, table);
  // Cloth skirt has individual folds and a little air between them.
  for (const side of [-1, 1]) {
    const cloth = new THREE.PlaneGeometry(5.67, 0.55, 70, 5);
    const vertices = cloth.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i), y = vertices.getY(i);
      vertices.setZ(i, Math.sin(x * 25) * 0.018 * (0.7 - y));
    }
    cloth.computeVertexNormals();
    const m = mesh(cloth, linen); m.position.set(side * 1.932, 0.887, -0.6); m.rotation.y = side * Math.PI / 2;
    const end = box(0, 0.98, side > 0 ? 2.235 : -3.435, 3.87, 0.35, 0.014, linen); end.castShadow = false;
  }

  function chair(x: number, z: number, rotation: number) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotation; scene.add(g);
    for (const lx of [-0.29, 0.29]) for (const lz of [-0.26, 0.26]) {
      box(lx, 0.3, lz, 0.035, 0.6, 0.035, walnut, g); cylinder(lx, 0.08, lz, 0.025, 0.12, brass, g);
    }
    rounded(0, 0.63, 0, 0.73, 0.14, 0.67, 0.065, wine, g);
    const back = new THREE.Shape(); back.moveTo(-0.38, 0); back.lineTo(0.38, 0); back.lineTo(0.38, 0.55); back.absarc(0, 0.55, 0.38, 0, Math.PI); back.lineTo(-0.38, 0);
    const cushion = mesh(new THREE.ExtrudeGeometry(back, { depth: 0.09, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.045, bevelThickness: 0.045 }), wine, g);
    cushion.position.set(0, 0.68, 0.3);
    box(-0.36, 0.87, 0.32, 0.035, 0.6, 0.04, brass, g); box(0.36, 0.87, 0.32, 0.035, 0.6, 0.04, brass, g);
  }
  for (const z of [-2.2, -0.3, 1.4]) { chair(-2.38, z, Math.PI / 2); chair(2.38, z, -Math.PI / 2); }
  chair(0.45, 2.82, 0); chair(0, -4.05, Math.PI);

  const teach = new THREE.Group(); teach.position.set(0.45, 1.185, 1.4); scene.add(teach);
  const targets: THREE.Group[] = [];
  const targetPositions: THREE.Vector3[] = [];
  function item(x: number, z: number, index: number, parent = teach) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.itemIndex = index; parent.add(g);
    if (parent === teach) targets[index] = g;
    return g;
  }
  function plate(parent: THREE.Group, radius = 0.4) {
    const p = lathe([[0,0.018],[0.2,0.018],[0.23,0.019],[0.25,0.022],[0.27,0.03],[0.29,0.044],[0.32,0.058],[0.36,0.069],[0.39,0.073],[0.403,0.072],[0.407,0.068],[0.403,0.063],[0.39,0.06],[0.35,0.053],[0.3,0.033],[0.26,0.012],[0.23,0.008],[0.21,0.008],[0.21,0],[0.195,0],[0.19,0.008],[0,0.008]], porcelain, parent,96);
    p.scale.setScalar(radius / 0.4);
    torus(radius * 0.985, 0.0015, brass, parent, 0, 0.073 * radius / 0.4);
  }
  function fork(parent: THREE.Group, scale = 1) {
    const g=new THREE.Group();g.scale.setScalar(scale);parent.add(g);
    const handle=new THREE.Shape();handle.moveTo(-0.018,-0.255);handle.bezierCurveTo(-0.036,-0.215,-0.011,-0.04,-0.011,0.095);handle.lineTo(0.011,0.095);handle.bezierCurveTo(0.011,-0.04,0.036,-0.215,0.018,-0.255);handle.quadraticCurveTo(0,-0.28,-0.018,-0.255);
    const shaft=mesh(new THREE.ExtrudeGeometry(handle,{depth:0.006,bevelEnabled:true,bevelSize:0.003,bevelThickness:0.003,bevelSegments:3,curveSegments:20}),silver,g);shaft.rotation.x=-Math.PI/2;shaft.position.y=0.011;
    const shoulder=new THREE.Shape();shoulder.moveTo(-0.011,0.07);shoulder.bezierCurveTo(-0.012,0.1,-0.042,0.11,-0.042,0.15);shoulder.lineTo(0.042,0.15);shoulder.bezierCurveTo(0.042,0.11,0.012,0.1,0.011,0.07);shoulder.closePath();
    const head=mesh(new THREE.ExtrudeGeometry(shoulder,{depth:0.006,bevelEnabled:true,bevelSize:0.002,bevelThickness:0.002,bevelSegments:3,curveSegments:16}),silver,g);head.rotation.x=-Math.PI/2;head.position.y=0.017;
    for(const x of [-0.033,-0.011,0.011,0.033]) {
      const points=[new THREE.Vector3(x,0.02,-0.145),new THREE.Vector3(x,0.023,-0.18),new THREE.Vector3(x,0.037,-0.235),new THREE.Vector3(x,0.045,-0.29)];
      mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),16,0.0045,8,false),silver,g);
      const tip=mesh(sphereGeometry,silver,g);tip.scale.set(0.0045,0.003,0.008);tip.position.copy(points[3]);
    }
  }
  function setting(parent: THREE.Group, interactive: boolean) {
    const add = (x: number, z: number, index: number) => interactive ? item(x,z,index,parent) : (() => { const g = new THREE.Group(); g.position.set(x,0,z); parent.add(g); return g; })();
    plate(add(0, 0, 0));
    const napkin = add(0, 0, 1);
    const clothMat=napkinMaterial.clone();clothMat.side=THREE.DoubleSide;materials.push(clothMat);
    for(let layer=0;layer<3;layer++) {
      const folded=new THREE.PlaneGeometry(0.27-layer*0.035,0.4,24,36);folded.rotateX(-Math.PI/2);
      const v=folded.attributes.position;
      for(let i=0;i<v.count;i++){const x=v.getX(i),z=v.getZ(i);v.setY(i,0.081+layer*0.007+Math.sin(z*19+x*8)*0.004+Math.cos(x*38)*0.003);}
      folded.computeVertexNormals();const fabric=mesh(folded,clothMat,napkin);fabric.rotation.y=-0.14;fabric.position.x=layer*0.016;
    }
    const band=torus(0.075,0.008,brass,napkin,0,0.106,0.01);band.rotation.set(Math.PI/2,Math.PI/2,0);band.scale.y=0.25;
    fork(add(-0.65, 0, 2), 0.88); fork(add(-0.5, 0, 3));
    const knife = add(0.5, 0, 4);
    rounded(0,0.014,0.11,0.035,0.022,0.3,0.009,silver,knife);
    const bladeShape = new THREE.Shape(); bladeShape.moveTo(0.016,0.05); bladeShape.lineTo(0.016,0.33); bladeShape.quadraticCurveTo(-0.045,0.3,-0.045,0.05); bladeShape.closePath();
    const blade = mesh(new THREE.ExtrudeGeometry(bladeShape,{depth:0.005,bevelEnabled:true,bevelSize:0.002,bevelThickness:0.002,bevelSegments:2}),silver,knife); blade.rotation.x = -Math.PI / 2;
    const spoon = add(0.67,0,5);
    mesh(createSpoonGeometry(),silver,spoon);
    plate(add(-0.64,-0.63,6),0.2);
    const glassGroup = add(0.54,-0.62,7);
    lathe([[0,0],[0.09,0],[0.102,0.015],[0.102,0.28],[0.098,0.29],[0.092,0.28],[0.092,0.025],[0,0.025]],glass,glassGroup,48);
    cylinder(0,0.1,0,0.09,0.15,water,glassGroup);
    torus(0.099,0.002,glass,glassGroup,0,0.285);
    if(interactive) for(let index=8;index<tableLayout.length;index++) {
      const part=tableLayout[index],g=add(part.x,part.z,index);
      g.rotation.y=part.angle??0;g.scale.setScalar(part.scale);
      if(part.kind==='fork') fork(g);
      if(part.kind==='knife') {
        rounded(0,.014,.11,.035,.022,.3,.009,silver,g);
        if(index===10) rounded(-.007,.019,-.11,.065,.012,.23,.012,silver,g);
        else {
          const shape=new THREE.Shape();shape.moveTo(.025,-.04);shape.lineTo(.025,-.32);shape.lineTo(-.07,-.25);shape.lineTo(-.055,-.04);shape.closePath();
          const fishBlade=mesh(new THREE.ExtrudeGeometry(shape,{depth:.008,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:2}),silver,g);fishBlade.rotation.x=Math.PI/2;fishBlade.position.y=.025;
        }
        if(index===10)g.position.y=.05;
      }
      if(part.kind==='spoon') mesh(createSpoonGeometry(),silver,g);
      if(part.kind==='wine') {
        cylinder(0,.007,0,.082,.014,glass,g);cylinder(0,.1,0,.011,.18,glass,g);
        lathe([[0,.19],[.055,.2],[.105,.24],[.125,.3],[.118,.38],[.095,.43],[.09,.43],[.112,.38],[.118,.3],[.099,.245],[.05,.21],[0,.2]],glass,g,40);
        torus(.093,.002,glass,g,0,.43);
      }
      if(part.kind==='cup') {
        plate(g,.15);
        lathe([[0,.035],[.07,.035],[.09,.055],[.11,.17],[.105,.18],[.098,.17],[.08,.06],[0,.055]],porcelain,g,40);
        const handle=torus(.05,.011,porcelain,g,.12,.115);handle.rotation.x=Math.PI/2;
        cylinder(0,.145,0,.09,.002,walnut,g);
      }
    }
    if(interactive)for(let index=0;index<8;index++){targets[index].position.x=tableLayout[index].x;targets[index].position.z=tableLayout[index].z;}

  }
  setting(teach,true);
  const hitMaterial=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});materials.push(hitMaterial);
  for(const index of [2,3,4,5,7,8,9,10,11,12,13,14,15]) {
    const proxy=mesh(new THREE.BoxGeometry(tableLayout[index].kind==='wine'||index===7?.24:.12,tableLayout[index].kind==='wine'?.45:index===7?.32:.09,tableLayout[index].kind==='wine'||index===7?.24:.6),hitMaterial,targets[index]);
    proxy.position.y=tableLayout[index].kind==='wine'?.22:index===7?.16:.045;proxy.castShadow=false;proxy.receiveShadow=false;
  }
  for (const [x,z,rotation] of [[-1.22,-1.9,Math.PI/2],[-1.22,-0.25,Math.PI/2],[1.22,-1.9,-Math.PI/2],[1.22,-0.25,-Math.PI/2],[0,-2.65,Math.PI]]) {
    const g = new THREE.Group(); g.position.set(x,1.185,z); g.rotation.y = rotation; g.scale.setScalar(0.79); scene.add(g); setting(g,false);
  }
  scene.updateMatrixWorld(true);
  for (const target of targets) targetPositions.push(target.getWorldPosition(new THREE.Vector3()));

  // Candles and pendant: modeled fixtures, emissive bulbs, controlled shadow lights.
  for (const z of [-1.2, -0.25]) {
    const c = new THREE.Group(); c.position.set(0,1.19,z); scene.add(c);
    cylinder(0,0.015,0,0.105,0.03,brass,c); cylinder(0,0.18,0,0.025,0.3,brass,c);
    cylinder(0,0.35,0,0.065,0.025,brass,c); cylinder(0,0.57,0,0.035,0.42,candleWax,c);
    const flame = mesh(sphereGeometry,glow,c); flame.position.y = 0.8; flame.scale.set(0.014,0.04,0.014); flame.castShadow = false;
    const light = new THREE.PointLight('#ffb85e',1.8,2.5,2); light.position.set(0,0.85,0); c.add(light);
  }
  cylinder(0,4.35,-0.9,0.018,1.4,brass);
  const pendant = new THREE.Group(); pendant.position.set(0,3.75,-0.9); scene.add(pendant);
  torus(0.9,0.022,brass,pendant); torus(0.9,0.012,brass,pendant,0,0.23);
  for (let i=0;i<18;i++) {
    const a=i/18*Math.PI*2;
    cylinder(Math.cos(a)*0.9,0.1,Math.sin(a)*0.9,0.008,0.25,brass,pendant);
    const bulb = mesh(sphereGeometry,glow,pendant); bulb.position.set(Math.cos(a)*0.9,-0.06,Math.sin(a)*0.9); bulb.scale.setScalar(0.035); bulb.castShadow = false;
  }
  scene.add(new THREE.HemisphereLight('#d7e1e4','#382127',0.42));
  const key = new THREE.SpotLight('#ffe5b9',58,18,0.72,0.85,1.6); key.position.set(-2.3,4.15,1.8); key.target.position.set(0.45,1.18,0.6);
  key.castShadow = true; key.shadow.mapSize.set(1024,1024); key.shadow.bias = -0.0004; key.shadow.normalBias = 0.025; scene.add(key,key.target);
  const windowLight = new THREE.DirectionalLight('#a6c5dc',1.65); windowLight.position.set(-3,4,-5); scene.add(windowLight);
  const fill = new THREE.PointLight('#f3b675',9,13,2); fill.position.set(4,3,2); scene.add(fill);
  // Sideboard and large still life create a lived-in edge to the room.
  box(-4.8,0.8,-3.4,1.1,1.6,2.2,walnut); box(-4.8,1.63,-3.4,1.2,0.08,2.3,porcelain);
  const vase = new THREE.Group(); vase.position.set(-4.8,1.68,-3.4); scene.add(vase);
  lathe([[0,0],[0.15,0],[0.21,0.1],[0.23,0.35],[0.12,0.56],[0.1,0.65]],wine,vase);
  const stems = material('#6d7053');
  for(let i=0;i<9;i++) {
    const angle=i*2.4; const tip = new THREE.Vector3(Math.cos(angle)*0.35,1.15+(i%3)*0.12,Math.sin(angle)*0.25);
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0.5,0),new THREE.Vector3(0,0.95,0),tip);
    mesh(new THREE.TubeGeometry(curve,10,0.008,4,false),stems,vase);
    const flower = mesh(sphereGeometry,porcelain,vase); flower.position.copy(tip); flower.scale.set(0.11,0.065,0.09);
  }

  const pin=document.createElement('span');pin.className='object-pin';pin.setAttribute('aria-hidden','true');pin.hidden=true;host.appendChild(pin);
  const projected=new THREE.Vector3();
  const look = new THREE.Vector3();
  let alive = true, visible = true, frame = 0, selected = -1, seated = !options.hero;
  let movement: gsap.core.Timeline | undefined;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  function render() { if (alive && visible && !document.hidden) {
    camera.lookAt(look); renderer.render(scene,camera);
    pin.hidden=selected<0;
    if(selected>=0){projected.copy(targetPositions[selected]).add(new THREE.Vector3(0,0.06,selected===5?-.18:0)).project(camera);pin.textContent=tableItems[selected].name;pin.dataset.object=tableItems[selected].id;pin.style.left=`${Math.max(80,Math.min(host.clientWidth-80,(projected.x+1)*host.clientWidth/2))}px`;pin.style.top=`${Math.max(155,(1-projected.y)*host.clientHeight/2-(selected===5?125:34))}px`;}
  } }
  function move(position: THREE.Vector3, target: THREE.Vector3, instant = false) {
    movement?.kill();
    host.dataset.camera=selected>=0?`item-${selected}`:seated?'table':'room';
    host.dataset.moving=String(!media.matches&&!instant);
    if (media.matches || instant) { camera.position.copy(position); look.copy(target); render(); return; }
    movement = gsap.timeline({defaults:{duration:selected>=0?0.85:1.4,ease:'power3.inOut'},onUpdate:render,onComplete:()=>{host.dataset.moving='false';}});
    movement.to(camera.position,{x:position.x,y:position.y,z:position.z},0).to(look,{x:target.x,y:target.y,z:target.z},0);
  }
  function overview(instant = false) {
    seated = false; selected = -1;
    const mobile = host.clientWidth < 650;
    move(new THREE.Vector3(mobile?3.5:3.7,mobile?4.2:3.5,mobile?6.5:5.3),new THREE.Vector3(mobile?0.2:-0.65,1.2,mobile?0.3:0.25),instant);
  }
  function seat(instant = false) {
    seated = true; selected = -1;
    move(new THREE.Vector3(1.15,3.35,3.95),new THREE.Vector3(0.4,1.19,0.85),instant);
  }
  function select(index: number, instant = false) {
    seated = true; selected = index;
    const point = targetPositions[index];
    const forkView=['fork','knife','spoon'].includes(tableLayout[index].kind);
    move(point.clone().add(new THREE.Vector3(forkView?0.32:0.55,forkView?0.76:1.25,forkView?0.88:1.45)),point.clone().add(new THREE.Vector3(0,0.04,forkView?-0.02:0)),instant);
    // A small gold rim on the plate remains the visual anchor; objects stay on the linen.
  }
  const resize = new ResizeObserver(() => {
    if (!host.clientWidth || !host.clientHeight) return;
    camera.aspect=host.clientWidth/host.clientHeight; camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth,host.clientHeight,false);
    render();
  }); resize.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; if(visible) render(); }); observer.observe(host);
  const onVisibility = () => { if(!document.hidden) render(); };
  document.addEventListener('visibilitychange',onVisibility);
  const onMotion = () => { if(selected>=0)select(selected,true); else if(seated)seat(true); else overview(true); };
  media.addEventListener('change',onMotion);
  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
  function hit(event: PointerEvent) {
    const bounds=host.getBoundingClientRect(); pointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(targets,true);
    if(!hits.length)return -1;
    let object: THREE.Object3D | null=hits[0].object;
    while(object && object.userData.itemIndex===undefined)object=object.parent;
    return object?.userData.itemIndex ?? -1;
  }
  const hoverLabel=document.createElement('span');hoverLabel.className='object-hover-label';hoverLabel.setAttribute('aria-hidden','true');host.appendChild(hoverLabel);
  const onPointerMove=(event:PointerEvent)=>{
    const index=hit(event);host.style.cursor=index>=0?'pointer':'default';
    hoverLabel.textContent=index>=0?tableItems[index].name:'';hoverLabel.hidden=index<0;
    const bounds=host.getBoundingClientRect();hoverLabel.style.left=`${Math.min(event.clientX-bounds.left+18,bounds.width-160)}px`;hoverLabel.style.top=`${event.clientY-bounds.top-38}px`;
  };
  const onPointerLeave=()=>{hoverLabel.hidden=true;};
  const onPointerUp=(event:PointerEvent)=>{const index=hit(event); if(index>=0)options.onSelect(index);};
  renderer.domElement.addEventListener('pointermove',onPointerMove);
  renderer.domElement.addEventListener('pointerleave',onPointerLeave);
  renderer.domElement.addEventListener('pointerup',onPointerUp);
  const onLost=(event:Event)=>{event.preventDefault(); options.onUnavailable();};
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  if(options.hero)overview(true);else seat(true);
  frame=requestAnimationFrame(()=>{render(); options.onReady();});
  return {seat,select,overview,dispose(){
    alive=false; cancelAnimationFrame(frame); movement?.kill(); resize.disconnect(); observer.disconnect();
    document.removeEventListener('visibilitychange',onVisibility); media.removeEventListener('change',onMotion);
    renderer.domElement.removeEventListener('pointermove',onPointerMove); renderer.domElement.removeEventListener('pointerleave',onPointerLeave);renderer.domElement.removeEventListener('pointerup',onPointerUp); renderer.domElement.removeEventListener('webglcontextlost',onLost);hoverLabel.remove();
    const geometries=new Set<THREE.BufferGeometry>(); scene.traverse(object=>{if(object instanceof THREE.Mesh)geometries.add(object.geometry);});
    geometries.forEach(geometry=>geometry.dispose()); materials.forEach(m=>m.dispose()); textures.forEach(t=>t.dispose()); env.dispose();
    pin.remove();renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  }};
  } catch(error) {
    // A browser may permit WebGL while denying the 2D canvas used by textures.
    // Release partial GPU setup before the SVG renderer takes over this host.
    renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
    throw error;
  }
}
