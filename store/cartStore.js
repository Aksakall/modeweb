import { createStore } from './createStore.js';
import { cartService } from '../services/cartService.js';

const base=createStore({items:[],loading:false,error:null});
export const cartStore={
  ...base,
  async load(){base.setState({loading:true,error:null});try{const items=await cartService.get();base.setState({items,loading:false});return items}catch(error){base.setState({error:error.message,loading:false});throw error}},
  async add(item){const items=await cartService.add(item);base.setState({items});return items},
  async update(id,quantity){const items=await cartService.update(id,{quantity});base.setState({items});return items},
  async remove(id){const items=await cartService.remove(id);base.setState({items});return items},
  async clear(){await cartService.clear();base.setState({items:[]})},
  totals(){const items=base.getState().items;const subtotal=items.reduce((sum,item)=>sum+item.unitPrice*item.quantity,0);const cargoPrice=subtotal===0||subtotal>=1500?0:95;return{subtotal,cargoPrice,total:subtotal+cargoPrice}}
};

