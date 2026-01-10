// authentication store complete code

import {create} from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../types";
import {UserRepository} from '@/src/services/database/repositories/UserRepository';
import {AuthService} from '@/src/stores/authService';

const AUTH_STORAGE_KEY = '@ezyq_auth';
const USER_STORAGE_KEY = '@ezyq_user';

interface AuthState { 
   user : User | null;
   isAuthenticated : boolean;
   isLoading : boolean;
   authToken : string | null;

   // actions that going to happen 

   initialize : () => Promise<void>;

   login : (email : string , password : string) => Promise<{success : boolean  , error?: string}>;

   register : (email : string , name : string , role : 'user' | 'business' , phone?: string)  => Promise<{success : boolean , error?: string}>;

   logout : () => Promise<void>;

   setUser : (user : User) => Promise<void>;

   updateUser : (updates : Partial<User>) => Promise<void>;

   clearAuth : () => Promise<void>

};


export const useAuthStore = create<AuthState>((set , get) => ({
    user : null,
    isAuthenticated : false,
    isLoading : true,
    authToken : null,



    // initialing auth state from async storage  

    initialize : async () => {
        try {
            set({ isLoading : true});


            const [authToken , userJson] = await Promise.all([
                AsyncStorage.getItem(AUTH_STORAGE_KEY),
                AsyncStorage.getItem(USER_STORAGE_KEY),
            ]);


            if(authToken && userJson) {

                const user = JSON.parse(userJson) as User;


                //verifying that user still exists in DB or not  

                const dbUser = await UserRepository.getById(user.id);

                // if it exists , then fill it's props  
                
                if(dbUser) {
                   set({
                     user : dbUser,
                     authToken,
                     isAuthenticated : true,
                     isLoading : false,
                   });


                   console.log("Auth initialized - User logged in:" , dbUser.email);
                   return;
                }
            }



            // last is that if no session found then 

            set({
               user : null,
               authToken : null,
               isAuthenticated : false,
               isLoading : false,
            });

            console.log("Auth initialized - No user session");
             
        }  catch (error) {
            console.error('Auth initialization error:' , error);

            set({
               user : null,
               authToken : null,
               isAuthenticated : false,
               isLoading : false,
            });
        }
    },


    //  logging-in existing user 

    login : async (email : string , password : string) => {
         
         try {
             // checking user exists or not  

            const result =  await AuthService.login(email);

             if(!result.success || !result.user) {
                return {
                   success : false , error : result.error || 'Login failed'
                }
             };


             //generating auth token 

             const authToken = AuthService.generateAuthToken(result.user.id);


             // saving into asyncstorage , resolving all at once 
             
             await Promise.all([
               AsyncStorage.setItem(AUTH_STORAGE_KEY , authToken),
               AsyncStorage.setItem(USER_STORAGE_KEY , JSON.stringify(result.user)), 
             ]);


             // updating the state 

             set({
                user : result.user,
                authToken,
                isAuthenticated : true,
             });


             console.log('User logged in successfully:', result.user.email);

             return {success : true};
         }
           catch(error) {
             console.error('Login error:', error);

             return {
                 success : false,
                 error : error instanceof Error ? error.message : 'Login failed'
             };
           }
    },




    // registering a new user 

    register : async (email : string , name : string , role : "user" | "business" , phone?: string)  => {

            try {
                  // registering user in db 
                  
                  const result = await AuthService.register(email , name , role , phone);


                  if(!result.success || !result.user) {
                     return {
                         success : false , error : result.error || 'Registration failed'
                     }
                  };


                  //generating auth token 

                  const authToken = AuthService.generateAuthToken(result.user.id);

                  // saving all into async storage 

                  await Promise.all([
                     AsyncStorage.setItem(AUTH_STORAGE_KEY , authToken),
                     AsyncStorage.setItem(USER_STORAGE_KEY , JSON.stringify(result.user)),
                  ]);


                  // updating the state 

                  set({
                     user : result.user,
                     authToken,
                     isAuthenticated : true,
                  });


                  console.log('User registered successfully:' , result.user.email);

                  return {success : true};
                
            } catch(error) {
                 console.error('Regsitration error:', error);

                 return {
                    success : false,
                    error : error instanceof Error ? error.message : 'Registration Failed',
                 };
            }
    },


    // logging out user 

    logout : async () => {

           try {
                
               // clearing data from async storage  

                await Promise.all([
                     AsyncStorage.removeItem(AUTH_STORAGE_KEY),
                     AsyncStorage.removeItem(USER_STORAGE_KEY),
                ]);



                 // clearing the state 

                 set({
                    user : null,
                    authToken : null,
                    isAuthenticated : false,
                 });

                 console.log('User logged out successfully');

           } catch(error) {
              console.error('Logout error:', error);
           }
    },


    // setting user after OTP verification 

    setUser : async (user : User) => {

         try {

             const authToken = AuthService.generateAuthToken(user.id);

             // saving to async storage  

             await Promise.all([
                 AsyncStorage.setItem(AUTH_STORAGE_KEY , authToken),
                 AsyncStorage.setItem(USER_STORAGE_KEY , JSON.stringify(user)),
             ]);


             // updating the user state 

             set({
                user,
                authToken,
                isAuthenticated : true,
             });

             console.log('User set successfully:' , user.email);
             
         } catch(error) {
             console.error('Set user error:', error);
         }
    },


    // updating the user profile  

    updateUser : async (updates : Partial<User>) => {
          
          try {
              const { user } = get();

              if(!user) return;


              // updating in the db 

              const updatedUser = await UserRepository.update(user.id , updates);


              if(updatedUser) {
                  
                 //  if it is present then , updating the async storage  

                 await AsyncStorage.setItem(USER_STORAGE_KEY , JSON.stringify(updatedUser));


                 // updating the state as well
                 
                 set({user : updatedUser});


                 console.log('User updated successfully');
              }
          }  catch(error) {
              console.error('Update user error:' , error);
          }
    },



     // clearing all the authentication related data 

     clearAuth : async () => {

         try {

             await Promise.all([
                 AsyncStorage.removeItem(AUTH_STORAGE_KEY),
                 AsyncStorage.removeItem(USER_STORAGE_KEY),
             ]);

             set({
                 user : null,
                 isAuthenticated : false,
                 authToken : null,
             });


             console.log('Auth  data cleared');

         }  catch(error) {
             console.error('Clear auth error:' , error);
         }  
     },

}));






