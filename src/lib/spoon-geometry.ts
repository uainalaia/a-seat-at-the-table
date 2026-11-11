import {BufferGeometry,Float32BufferAttribute} from 'three';

/** One closed surface from bowl tip to handle tip: no intersecting bowl/shaft parts. */
export function createSpoonGeometry() {
  const rows:{z:number;width:number;center:number;rim:number}[]=[];
  for(let i=0;i<=24;i++){
    const z=-.285+i*.2/24,t=(z+.18)/.105;
    rows.push({z,width:Math.max(.0001,.068*Math.sqrt(Math.max(0,1-t*t))),center:.041-.028*(1-t*t),rim:.041});
  }
  rows.push(...[
    {z:-.073,width:.014,center:.039,rim:.038},{z:-.055,width:.01,center:.038,rim:.036},
    {z:-.025,width:.01,center:.036,rim:.034},{z:.025,width:.011,center:.034,rim:.032},
    {z:.08,width:.014,center:.033,rim:.031},{z:.16,width:.018,center:.031,rim:.029},
    {z:.23,width:.02,center:.03,rim:.028},{z:.26,width:.018,center:.03,rim:.028},
    {z:.278,width:.011,center:.03,rim:.028},{z:.285,width:.0001,center:.029,rim:.028},
  ]);
  const positions:number[]=[],indices:number[]=[],across=20,stride=across+1,surface=rows.length*stride;
  for(let side=0;side<2;side++)for(const row of rows)for(let j=0;j<=across;j++){
    const u=j/across*2-1;
    positions.push(u*row.width,row.center+(row.rim-row.center)*u*u-(side?.0035:0),row.z);
  }
  for(let side=0;side<2;side++)for(let i=0;i<rows.length-1;i++)for(let j=0;j<across;j++){
    const a=side*surface+i*stride+j,b=a+stride;
    if(side===0)indices.push(a,b,a+1,b,b+1,a+1);else indices.push(a,a+1,b,b,a+1,b+1);
  }
  // Seal both long edges and both rounded tips.
  for(let i=0;i<rows.length-1;i++)for(const j of [0,across]){
    const a=i*stride+j,b=a+stride;
    indices.push(a,a+surface,b,b,a+surface,b+surface);
  }
  for(const i of [0,rows.length-1])for(let j=0;j<across;j++){
    const a=i*stride+j;indices.push(a,a+1,a+surface,a+1,a+1+surface,a+surface);
  }
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  return geometry;
}
