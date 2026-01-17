// resend email service code 

import {Resend} from 'resend';

// initializing resend with the api keys 


const resend = new Resend('re_MSihDpHU_MBfE53K3UC8xybDtFeEfHJ39');


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

    private static getOTPEmailTemplate(otp : string) : string {
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width-device-width , initial-scale=1.0">
               <title>Your EzyQ Verification Code</title>
            </head>

            <body style="margin : 0; padding : 0; font-family : Arial , sans-serif; background-color : #f4f4f4;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color : #ffffff; border-radius : 8px; overflow : hidden; box-shadow : 0 2px 4px rgba(0,0,0,0.1);">


              <!-- header -->

              <tr>

                <td style="background : linear-gradient(135deg , #667eea 0% , #764ba2 100%); padding : 40px 20px; text-align : center;">

                   <h1 style="color : #ffffff; margin : 0; font-size : 28px; font-weight : bold;">EzyQ</h1>

                   <p style="color : #ffffff; margin : 10px 0 0 0; font-size : 16px;">Queue Management System</p>

                 </td>
               </tr>


               <!-- text content -->

               <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email</h2>
                      <p style="color: #666666; margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">
                        Thank you for signing up with EzyQ! To complete your registration, please use the verification code below:
                      </p>
                      
                      <!-- OTP Box -->

                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 30px 0;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px 40px; display: inline-block;">
                              <span style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                ${otp}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666666; margin: 20px 0; font-size: 14px; line-height: 1.5;">
                        This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                      </p>
                      
                      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #666666; font-size: 14px;">
                          <strong>🔒 Security Tip:</strong> Never share this code with anyone. EzyQ staff will never ask for your verification code.
                        </p>
                      </div>
                    </td>
                  </tr>



                  <!-- Footer -->

                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                        Need help? Contact us at support@ezyq.com
                      </p>
                      <p style="color: #999999; margin: 0; font-size: 12px;">
                        © 2025 EzyQ. All rights reserved.
                      </p>
                    </td>
                  </tr>

               
              </table>
            </body>

          </html> `;  
         }


        // sending welcome email after registration 

        static async sendWelcomeEmail(email : string , name : string) : Promise<boolean> {

            try {
                    const {data , error} = await resend.emails.send({
                        from : 'EzyQ <onboarding.dev>',
                        to : [email],
                        subject : 'Welcome to EzyQ',
                        html : `
                           <!DOCTYPE html>
                            <html>

                              <body style="font-family : Arial , sans-serif; padding : 20px;">
                                <h2>Welcome to EzyQ, ${name}!</h2>
                                <p>Thank you for joining EzyQ. You can now:</p>
                                
                               <ul>
                                 <li>Join queues instantly</li> 
                                 <li>Track your position in real-time</li>
                                 <li>Get notified when it's your turn</li>
                                 <li>View your queue history</li>
                               </ul>

                               <p>Get Started by exploring nearby queues in the app!</p>
                               <p>Best regards , <br>Then EzyQ Team</p>
                            
                          </body>
                        </html>`,
                    });


                    if(error) {
                       console.error('Welcome email error:' , error);
                       return false;
                    }

                    console.log('Welcome email sent:' , data?.id);
                    return true;
               
                  } catch(error) {
                     console.error('Failed to send welcome email:' , error);
                     return false;
                  }
        }
};


export default ResendEmailService;



