import { createStore } from './createStore.js';
import { authService } from '../services/authService.js';
const base=createStore({user:null,loading:false,error:null});
export const authStore={...base,
  async login(payload){base.setState({loading:true,error:null});try{const result=await authService.login(payload);base.setState({user:result.user,loading:false});return result}catch(error){base.setState({error:error.message,loading:false});throw error}},
  async register(payload){base.setState({loading:true,error:null});try{const result=await authService.register(payload);base.setState({user:result.user,loading:false});return result}catch(error){base.setState({error:error.message,loading:false});throw error}},
  async logout(){await authService.logout();base.setState({user:null})},
  async hydrate(){try{const user=await authService.getMe();base.setState({user});return user}catch{return null}}
};

