import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView , TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YStack , XStack , Text , Button , Input , Circle, inputSizeVariant } from "tamagui";
import { AuthStackScreenProps } from "@/src/types/navigation.types";

type Props = AuthStackScreenProps<'OTPVerification'>;


export default function OTPVerificationScreen({navigation , route} : Props) {
    
     const {email , role , isNewUser} = route.params;

     const isUser = role === 'user';


     const [otp , setOtp] = useState(['' , '' , '' , '' , '' , '']);
     const [loading , setLoading] = useState(false);
     const [resendTimer , setResendTimer] = useState(60);
     const [canResend , setCanResend]  = useState(false);


     const inputRefs = useRef<(TextInput | null[])>([]);

     // timer to resend the otp 

     useEffect(() => {
        if(resendTimer > 0) {
           const timer = setTimeout(() => setResendTimer(resendTimer - 1) , 1000);
           return () => clearTimeout(timer);
        } else {
          setCanResend(true);
        }
     } , [resendTimer]);



     const handleOtpChange = (value : string , index : number) => {
        if(isNaN(Number(value))) return;


        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);


        //auto focus on the next input  

        if(value && index < 5) {
           inputRefs.current[index + 1]?.focus();
        }
     };


     //key press change function 

     const handleKeyPress = (e : any , index : number) => {
        if(e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
           inputRefs.current[index - 1]?.focus();
        }
     };


     const handleVerify = async () => {
        const otpCode = otp.join('');

        if(otpCode.length !== 6) {
          alert('Please enter complete OTP');
          return;
        }


        setLoading(true);

        setTimeout(() => {
           setLoading(false);

           // will navigate user/business to their respective boards , id they are legit - TODO

           alert('OTP Verified Successfully!');
        } , 1500);
     };


   //  resending  the otp function to do again


     const handleResendOtp = () => {

         if(!canResend) return;

         setOtp(['' , '' , '' , '' , '' , '']);
         setResendTimer(60);
         setCanResend(false);
         inputRefs.current[0]?.focus();
         

         alert('OTP sent successfully');

     };


     return (

        <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}}>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* header  */}
             <XStack px="$6" py="$4" ai="center">
               <Button unstyled onPress={() => navigation.goBack()} pressStyle={{opacity : 0.7}}>

                  <Ionicons name='arrow-back' size={24} color='#1f2987'/>

               </Button>
             </XStack>


             <YStack px="$6" pt="$4" pb="$8" ai="center">

               {/* icon */}

               <YStack mb="$8">

                  <Circle size={120} bg={isUser ? '$blue2' : '$green2'} shadowColor="$shadowColor" shadowRadius={20} shadowOpacity={0.1}> 

                  <YStack bg={isUser ? '$blue10' : '$green10'} p="$6" br="$12">
                     <Ionicons name="mail-open-outline" size={56} color="white"/>
                  </YStack>
               </Circle>
            </YStack>

            {/* title section  */}

            <YStack mb="$8" ai="center">

                <Text fontSize="$10" fontWeight="800" color="$gray12" mb="$2" ta="center">
                   Verify your Email
                </Text>
               
               <Text fontSize="$4" color="$gray11" fontWeight="500" ta="center" px="$4">
                   We've sent you a 6-digit code on
               </Text>

               <Text fontSize="$4" color={isUser ? '$blue10' : '$green10'} fontWeight="700" mt="$2">
                  {email}
               </Text>
            </YStack>


           {/* otp input place */}

           <YStack mb="$6" w="100%">

             <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$4" ta="center">
               Enter the OTP Code
             </Text>

             <XStack jc="space-between" gap="$2">

               {otp.map((digit , index) => (
                   <Input 
                     key={index}
                     ref={(ref) => (inputRefs.current[index] = ref as any)}
                     value={digit}
                     onChangeText={(value) => handleOtpChange(digit , index)}
                     onKeyPress={(e) => handleKeyPress(e , index)}
                     maxLength={1}
                     keyboardType="number-pad"
                     textAlign="center"
                     size="$8"
                     fontWeight="bold"
                     w={50}
                     h={60}
                     br="$4"
                     bg="$gray2"
                     bw={2}
                     bc={digit ? (isUser ? '$blue8' : '$green8') : '$gray5'}
                     color="$gray12"
                     focusStyle={{
                         bc : isUser ? '$blue10' : '$green10',
                         bg : 'white'
                     }}
                   />
               ))}
             </XStack>
           </YStack>


           {/* otp resend styling part    */}
 
          <XStack ai="center" gap="$2" mb="$8">
            <Text fontSize="$3" color="$gray11">
               Didn't receive code?
            </Text>

            {canResend ? (
                <Button unstyled onPress={handleResendOtp} pressStyle={{opacity : 0.7}}>
                  <Text fontSize="$3" color={isUser ? '$blue10' : '$green10'} fontWeight="bold">
                     Resend OTP
                  </Text>
               
                </Button>
            ) : (
                <Text fontSize="$3" color="$gray10" fontWeight="600">
                  Resend in {resendTimer}s
                </Text>
            )}

          </XStack>


           {/* verify button  */}

           <YStack w="100%">

            <Button size="$6" br="$4" bg={isUser ? '$blue10' : '$green10'} onPress={handleVerify} pressStyle={{scale : 0.98}} disabled={loading || otp.join('').length !== 6} opacity={otp.join('').length !== 6 ? 0.5 : 1}> 

            {
               loading ? (
                   <Text color="white" fontSize="$5" fontWeight="bold">
                       Verifying...
                   </Text>
               ) : (
                   <XStack ai="center" gap="$3">
                     <Text fontSize="$5" color="white" fontWeight="bold">
                        Verify & Continue
                     </Text>
                     <Ionicons name="checkmark-circle" size={24} color="white"/>
                   </XStack>
               )
            }
              </Button>
           </YStack>


           {/* information text part of the page  */}

         <YStack mt="$8" bg="$gray12" p="$4" br="$4" w="100%">
                <XStack gap="$3">
                  <Ionicons name="information-circle" size={20} color="#6b7280"/>
                  <YStack f={1}>
                     <Text>
                        {isNewUser ? 'Please verify your email to complete registration' : 'Enter the OTP sent to your email to login securely'}
                     </Text>

                  </YStack>

               </XStack>
          </YStack>

         
         

            


             </YStack>

          </ScrollView>

        </SafeAreaView>

     )
















}