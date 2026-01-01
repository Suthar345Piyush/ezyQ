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
              isLoading : false,
            });
         }
         
         catch(error) {
           console.error('Login error:' , error);
           throw error;
         }
    },


     // logout code 

     logout : async () => {
         try {

           await SecureStore.deleteItemAsync(TOKEN_KEY);
           await SecureStore.deleteItemAsync(USER_KEY);


           set({
              user : null,
              isAuthenticated : false,
              isLoading : false
           });

         } catch(error) {
           console.error('Logout error:' , error);
           throw error;
         }
     },


     //updating the user data 
     updateUser : (updates) => {

        const currentUser = get().user;

        if(!currentUser) return;

        const updatedUser = {...currentUser , ...updates};

        //saving to secure store 

        SecureStore.setItemAsync(USER_KEY , JSON.stringify(updatedUser)).catch(console.error);


        //update state 

        set({user : updatedUser});

     },


     //initializing auth (restoring session on app start)

     initialize : async () => {

        try {
           set({isLoading : true});

           const token = await SecureStore.getItemAsync(TOKEN_KEY);

           const userStr = await SecureStore.getItemAsync(USER_KEY);

           if(token && userStr) {
             
             const user = JSON.parse(userStr) as User;

             set({
               user,
               isAuthenticated : true,
               isLoading : false,
             });
           } else {
              set({
                 user : null,
                 isAuthenticated : false,
                 isLoading : false,
              });
           }
        }  catch(error) {

           console.error('Auth initialization error:' , error);
           
           set({
             user : null,
             isAuthenticated : false,
             isLoading : false,
           });
        }
     }
}));


//function to get auth token 
``
export const getAuthToken = async () : Promise<string | null>  => {
   try {
     return await SecureStore.getItemAsync(TOKEN_KEY);
   } catch(error) {
     console.error('Get token error:' , error);

     return null;
   }
}










