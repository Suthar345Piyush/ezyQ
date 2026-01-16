// resend email service code 

import {Resend} from 'resend';

// initializing resend with the api keys 

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';


if(!RESEND_API_KEY) {
   console.error('Resend api key not found!');   
};


const resend = new Resend(RESEND_API_KEY);


export class ResendEmailService {
   
     // sending otp email to user
     
     static async sendOTPEmail(email : string , otp : string) : Promise<boolean> {
         try {
            console.log(`Sending OTP to ${email}: ${otp}`);

            const {data , error} = await resend.emails.send({
               from : 'EzyQ <onboarding@resend.dev>',
               to : [email],
               subject : 'Your EzyQ Verification Code',
               html : this.getOTPEmailTemplate(otp),
            });

            if(error){
               console.error('Resend error:' , error);
               return false;
            }

            console.log('Email sent successfully:' , data?.id);
            return true;

         } catch(error) {
            console.error('Failed to send email:' , error);
            return false;           
         }
     };


  
    // email template of the otp sent 

    








}

