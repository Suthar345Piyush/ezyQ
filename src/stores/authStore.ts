// auth store code 

import {create} from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';


interface AuthState {
   user : User | null;
   isAuthenticated : boolean;
   isLoading : boolean;

   // some actions 

   setUser : (user : User | null) => void;
   login : (user : User , token:string) => Promise<void>;
   logout : () => Promise<void>;
   updateUser : (updates : Partial<User>) => void;
   initialize: () => Promise<void>;
}


const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';


export const useAuthStore = create<AuthState>(( set , get) => ({
     user : null,
     isAuthenticated : false,
     isLoading : true,


     
    setUser : (user) => set({
      user,
      isAuthenticated : !!user
    }),
  
  // login code 
  
    login : async(user , token) => {

         try{

              //saving token securely 

              await SecureStore.setItemAsync(TOKEN_KEY , token);

            // saving user data 

            await SecureStore.setItemAsync(USER_KEY , JSON.stringify(user));

            set({
              user,
              isAuthenticated : true,
              isLoading : false;
            });
         }
         
         catch(error) {
           console.error('Login error:' , error);
           throw error;
         }
    },


     // logout code 


     

}))








