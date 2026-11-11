import {useEffect,useState} from 'react';

// Static HTML stays readable while event handlers load. Enable actions only
// after React has attached them, so a fast first click cannot disappear.
export function useHydrated() {
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>setHydrated(true),[]);
  return hydrated;
}
