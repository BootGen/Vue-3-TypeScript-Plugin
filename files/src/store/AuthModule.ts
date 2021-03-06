
import { ActionContext } from 'vuex';
import { AuthenticationData } from '@/models/AuthenticationData'
import { LoginResponse } from '@/models/LoginResponse'
import { ProfileResponse } from '@/models/ProfileResponse'
import { User } from '@/models/User'
import { State } from '.';
import api from '@/api'

export interface AuthState {
  jwt: string;
  user: User | null;
}
type Context = ActionContext<AuthState, State>;

export default {
  state: {
    jwt: '',
    user: null
  },
  mutations: {
    setJwt: function(state: AuthState, jwt: string) {
      state.jwt = jwt
      try {
        if (jwt) {
          localStorage.setItem('jwt', jwt);
        } else {
          localStorage.removeItem('jwt');
        }
      } catch {
        console.log('Local storage is not available.')
      }
    },
    setUser: function(state: AuthState, user: User) {
      state.user = user
    },
    logout: function(state: AuthState) {
      state.user = null;
      localStorage.removeItem('jwt');
    }
  },
  actions: {
    init: async function(context: Context) {
      const jwt = localStorage.getItem('jwt')
      if (jwt) {
        context.commit('setJwt', jwt);
        await context.dispatch('profile');
      }
    },
    login: async function (context: Context, data: AuthenticationData): Promise<LoginResponse> {
      const response = await api.login(data);
      context.commit('setJwt', response.jwt);
      await context.dispatch('profile');
      return response;
    },
    profile: async function (context: Context): Promise<User> {
      const user = await api.profile(context.state.jwt);
      context.commit('setUser', user);
      return user;
    },
    updateProfile: async function (context: Context, user: User): Promise<ProfileResponse> {
      const response  = await api.updateProfile(user, context.state.jwt);
      if (response.success)
        context.commit('setUser', user);
      return response;
    }
  },
}