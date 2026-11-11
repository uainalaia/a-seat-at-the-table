/** Original, schematic silhouettes; hidden where the adjacent name supplies the label. */
export default function TableObjectIcon({id}:{id:string}) {
  return <svg className="table-object-icon" viewBox="0 0 120 120" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {(id==='plate'||id==='bread')&&<><circle cx="60" cy="60" r={id==='bread'?35:46} fill="currentColor" fillOpacity=".07"/><circle cx="60" cy="60" r={id==='bread'?29:39}/><circle cx="60" cy="60" r={id==='bread'?23:30} strokeOpacity=".45"/></>}
    {id==='napkin'&&<g transform="rotate(12 60 60)"><path d="M35 15h50v90H35z" fill="currentColor" fillOpacity=".1"/><path d="m35 15 50 90M35 76h50M35 15l50 61"/><path d="M32 58h56v15H32z" fill="currentColor" fillOpacity=".2"/></g>}
    {id.includes('fork')&&<g transform={id==='salad-fork'?'translate(8 8) scale(.86)':undefined}><path d="M48 14v27q0 12 10 13l-3 48q0 7 5 7t5-7l-3-48q10-1 10-13V14M56 14v29M64 14v29"/><path d="M48 44h24" strokeOpacity=".4"/></g>}
    {(id==='knife'||id.includes('knife'))&&<><path d="M65 12C49 24 47 45 48 65h13l-4 37q-1 7 5 7t5-7V12Z" fill="currentColor" fillOpacity=".12"/><path d="M61 65h6"/></>}
    {(id==='spoon'||id.includes('spoon'))&&<><path d="M77 33c0-14-8-23-17-23s-17 9-17 23c0 13 7 21 15 22l-3 47q0 7 5 7t5-7l-3-47c8-1 15-9 15-22Z" fill="currentColor" fillOpacity=".12"/><path d="M49 32c0-10 5-16 11-16" strokeOpacity=".55"/></>}
    {id.includes('wine')&&<><path d="M40 14h40q9 43-20 46-29-3-20-46Z" fill="currentColor" fillOpacity=".08"/><path d="M60 60v38m-18 6h36M43 35h34"/></>}
    {id==='cup'&&<><ellipse cx="56" cy="94" rx="38" ry="9"/><path d="M28 35h56l-6 48q-22 12-44 0Z" fill="currentColor" fillOpacity=".08"/><path d="M84 42q30-1 5 29h-8"/><ellipse cx="56" cy="35" rx="28" ry="7"/></>}
    {id==='water' &&<><path d="M37 22h46l-4 74q-19 10-38 0Z" fill="currentColor" fillOpacity=".08"/><ellipse cx="60" cy="22" rx="23" ry="7"/><path d="M39 61q21 9 42 0M48 35l2 49" strokeOpacity=".55"/></>}
  </svg>;
}
