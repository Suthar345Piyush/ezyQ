// setting up the OAUTH for the app 

// for now , this is only for android 


import * as Google from 'expo-auth-session/providers/google';
import { UserRole } from '@/src/types';
import {AuthService} from "@/src/stores/authService";
import {UserRepository} from "@/src/services/database/repositories/UserRepository";
import { useAuthStore } from '@/src/stores/authStore';
import * as WebBrowser from 'expo-web-browser';
import Constants from "expo-constants";


// completing the auth sessions  

WebBrowser.maybeCompleteAuthSession();


// google OAuth integration for android only 

const GOOGLE_CLIENT_ID_ANDROID = Constants.expoConfig?.extra?.googleAndroidClientId || '';


if (!GOOGLE_CLIENT_ID_ANDROID) {
  console.error('Google Android Client ID not found!');
  console.error('Please create .env file with GOOGLE_ANDROID_CLIENT_ID');
}


export interface GoogleAuthResult {
    success : boolean;
    user?: any;
    error?: string;
};


export class GoogleAuthService {
       

      // initializing google sign-in for android  only 

      static useGoogleAuth() {
         const [request , response , promptAsync] = Google.useAuthRequest({
            androidClientId : GOOGLE_CLIENT_ID_ANDROID,
            scopes : ['profile' , 'email'],
         });

         return {request , response , promptAsync};
      }



      // function to handle the google sign in 

      static async handleGoogleSignIn(response : any , role : UserRole) : Promise<GoogleAuthResult> {
           
          try {
              if(response?.type !== 'success'){
                 return {
                   success : false,
                   error : 'Google sign-in was cancelled or failed',
                 };
              }


              // getting user info from google  

              const {authentication} = response;

              const userInfo = await this.fetchGoogleUserInfo(authentication.accessToken);



              if(!userInfo) {
                 return {
                   success : false,
                   error : 'Failed to fetch user information from Google',
                 };
              }

              // verifying that user already exists or not  

              const existingUser = await UserRepository.getByEmail(userInfo.email);


              if(existingUser) {

                  // if user exists then do login
                  
                  if(existingUser.role !== role) {
                     return {
                       success : false,
                       error : `This email is registered as a ${existingUser.role}. Please select the correct role.`,
                     }
                  }


                  await useAuthStore.getState().setUser(existingUser);


                  console.log('User logged in via Google:', existingUser.email);

                  return {
                     success : true,
                     user : existingUser,
                  };
              } 
              
               else {
                    
                  // else it is new user get him registered 
                  
                  const registerResult = await AuthService.register(
                     userInfo.email,
                     userInfo.name,
                     role
                  );


                  if(!registerResult.success || !registerResult.user) {
                     return {
                       success : false,
                       error : registerResult.error || 'Failed to register user',
                     }
                  };


                   // updating with the google profile picture 

                   if(userInfo.picture) {
                      await UserRepository.update(registerResult.user.id , {
                         avatar_url : userInfo.picture,
                      });
                   }



                   await useAuthStore.getState().setUser(registerResult.user);

                   console.log('User registered via Google:' , registerResult.user.email);

                   return {
                     success : true,
                     user : registerResult.user,  
                   };
              }


          } catch(error) {
               console.error('Google sign-in error:' , error);

               return {
                 success : false,
                  error : error instanceof Error ? error.message : 'Google sign-in failed',
               };
          }
      }




      //fetching the user info from google  

      private static async fetchGoogleUserInfo(accessToken : string) : Promise<any> {
          
          try {
              const response = await fetch('https://www.googleapis.com/userinfo/v2/me' , {
                  headers : {
                     Authorization : `Bearer ${accessToken}`,
                  },
              });


              if(!response.ok){
                throw new Error('Failed to fetch user info');   
              }


              const userInfo = await response.json();

              return {
                 email : userInfo.email,
                 name : userInfo.name,
                 picture : userInfo.picture,
                 givenName : userInfo.given_name,
                 familyName : userInfo.family_name,
              };


          } catch(error) {
               console.error('Error fetching Google user info:' , error);
               return null;
          }
      }

      //signing - out from google , just removing from auth store , clears local sessions 

      static async signOut() : Promise<void> {
         try {
            await useAuthStore.getState().logout();
         } catch(error) {
            console.error('Google sign-out error:' , error);
         }
      }
};



export default GoogleAuthService;










