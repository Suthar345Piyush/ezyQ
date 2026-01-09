// auth service code to handle auth related functionality 

import {UserRepository} from "@/src/services/database/repositories/UserRepository";
import {User , UserRole} from "@/src/types/index";
import { generateId } from "@/src/utils/index";


// in memory otp storage for now  (in future redis is being used)

const otpStorage = new Map<string , {otp : string , expiresAt : number}>();


// main auth service function 

export class AuthService {

      // generating the 6 digit otp

      private static generateOTP() : string {
         return Math.floor(100000 + Math.random() * 900000).toString();
      }

      //sending otp developement setup (in future using any service like resend)

      private static async sendOTPEmail(email : string , otp : string) : Promise<boolean> {
          try {
             console.log(`Sending OTP to ${email}: ${otp}`);

              // will integrate email service with it after dev setup complete

              alert(`OTP for ${email}: ${otp}\n\n(In prod , this will be sent to email)`);

            return true;

          } catch(error){
             console.error('Error sending OTP:' , error);
             return false;
          }
      }


      //requesting otp for verification 

      static async requestOTP(email : string) : Promise<{success : boolean; error? : string}> {

           try {

                //validating email 

                if(!email || !email.includes('@')) {
                   return {success : false , error : 'Invalid email address'};
                }

                //generate OTP 

                const otp = this.generateOTP();

                // 10 min otp expires and storing it 

                const expiresAt = Date.now() + 10 * 60 * 1000;

                otpStorage.set(email.toLowerCase() , {otp , expiresAt});

                // sent otp through email 

                const sent = await this.sendOTPEmail(email , otp);

                if(!sent) {
                   return {success : false , error : 'Failed to send OTP'};
                }

                return {success : true};
           } catch(error) {
             console.error('Request OTP error:' , error);
              return {success : false , error : 'Failed to send OTP'};
           }
      }


      //verify the OTP 

      static async verifyOTP(email : string , otp : string) : Promise<{success : boolean; error? : string}> {
           
          try {

            // simplyfying the input email 
              
            const normalizedEmail = email.toLowerCase();
            const stored = otpStorage.get(normalizedEmail);



            if(!stored) {
                return {
                   success : false , error : 'OTP expired. Please request again to get new one.'
                };
            }

            //checking for otp expiration 

            if(Date.now() > stored.expiresAt){
                otpStorage.delete(normalizedEmail);

                return {
                   success : false , error : 'OTP expired. Please request again for new one.'
                }
            }

             // verifying the otp with original one  

            if(stored.otp !== otp){
               return {success : false , error : 'Wrong OTP'}
            };

            // after verification , removing it from storage 

            otpStorage.delete(normalizedEmail);


            return {success : true}

          } catch(error) {
             console.error('OTP Verification failed' , error);
             return {success : false , error : 'Failed to verify OTP'};
          }
      }

      

      // new user registration 

      static async register(email : string , name : string , role : UserRole , phone?: string) : Promise<{success : boolean , user? : User , error? : string}> {
          
         
          try {

               // simplyfying the input email 

                const  normalizedEmail = email.toLowerCase();


                // checking if user already exists in storage  

                const existingUser = await UserRepository.getByEmail(normalizedEmail);

                if(existingUser) {
                   return {success : false , error : 'User already exists with this email'};
                }


                //creating a new user 

                const newUser = await UserRepository.create({
                   id : generateId(),
                   name,
                   email : normalizedEmail,
                   phone,
                   role,
                });

                console.log('User Registered' , newUser.email);
                return {success : true , user : newUser}

          } catch(error) {

            console.error('User Registration failed' , error);
            return {success : false , error : 'Failed to register user'};
         
          }
      }



      // login the already existing user in the app 

      static async login(email : string) : Promise<{success : boolean , user?: User , error?: string}> {
           
          try {

             const normalizedEmail = email.toLowerCase();


             //finding the user 

             const user = await UserRepository.getByEmail(normalizedEmail);

             if(!user) {
                return {
                   success : false , error : 'No account found with this email'
                };
             }


             console.log('User logged in:' , user.email);

             return {success : true , user};

          } catch(error) {
             console.error('Login error:' , error);
             return {success : false , error : 'Failed to login user'};
          }
      }


      //checking the email exists or not  

      static async checkEmailExists(email : string) : Promise<boolean> {

          try {

              return await UserRepository.emailExists(email.toLowerCase());

          } catch(error) {
             console.error('Email checking failed' , error);
             return false;

          }
      }


      // generating auth token - soon will use JWT for token creation (demo implementation)

      static generateAuthToken(userId : string) : string {
          
          // jwt for actual token generation 

          const timestamp = Date.now();

          const random = Math.random().toString(36).substring(7);

          return `${userId}_${timestamp}_${random}`;

      }

      // deleting the expired otp's from storage  
      
      static clearExpiredOTP() : void {

          const now = Date.now();
 
          // clearing the email = key , data = value (clearing this key:value pair from otpstorage map)   

           for(const [email , data] of otpStorage.entries()) {
               if(now > data.expiresAt){
                  otpStorage.delete(email);
               }

           }

      }
 
}


export default AuthService;

