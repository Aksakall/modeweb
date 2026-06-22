import { createStore } from './createStore.js';
import { favoriteService } from '../services/favoriteService.js';
const base=createStore({ids:[],loading:false,error:null});
export const favoriteStore={...base,
  async load(){base.setState({loading:true});try{const ids=await favoriteService.get();base.setState({ids,loading:false});return ids}catch(error){base.setState({error:error.message,loading:false});return[]}},
  async toggle(productId){const active=base.getState().ids.includes(productId);const ids=active?await favoriteService.remove(productId):await favoriteService.add(productId);base.setState({ids});return!active}
};

