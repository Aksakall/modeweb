export function createStore(initialState){
  let state=initialState; const listeners=new Set();
  return {
    getState:()=>state,
    setState:update=>{state=typeof update==='function'?update(state):{...state,...update};listeners.forEach(fn=>fn(state));return state;},
    subscribe:listener=>{listeners.add(listener);return()=>listeners.delete(listener)}
  };
}

