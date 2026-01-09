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

            



          } catch(error) {
             
          }

          
      }




      






}