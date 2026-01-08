
// login screen for  both user and business

import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView , KeyboardAvoidingView , Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YStack , XStack , Text , Button , Input , Separator } from "tamagui";
import { AuthStackScreenProps } from "@/src/types/navigation.types";


type Props = AuthStackScreenProps<'Login'>;

export default function LoginScreen({navigation , route} : Props) {
     const {role} = route.params;

     const isUser = role === 'user';

     const [email , setEmail] = useState('');
     const [password , setPassword] = useState('');
     const [showPassword , setShowPassword] = useState(false);
     const [loading , setLoading] = useState(false);


    // user/business login handling  
      
     const handleLogin = async () => {
       if(!email || !password){
          alert('Please fill all the fields');
          return;
       }

       setLoading(true);
 
   //soon will write actual logic for sending otp to the user's email 

         setTimeout(() => {
          setLoading(false);
          navigation.navigate('OTPVerification' , {
             email,
             role,
             isNewUser : false,
          });
        } , 1500);
     };



     return (
        <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex :1}}>

            <ScrollView showsVerticalScrollIndicator={false}>
                
                 {/* header of the login screnn  */}

                 <XStack px="$6" py="$6" ai="center">
                    <Button unstyled onPress={() => navigation.goBack()} pressStyle={{opacity : 0.7}}>
                       <Ionicons name="arrow-back" size={24} color="#1f2937"/>
                    </Button>
                 </XStack>

                 <YStack px="$6" pt="$4" pb="$8">

                   {/* title section  */}

                   <YStack mb="$8">

                      <YStack bg={isUser ? '$blue2' : '$green2'} p="$5" br="$8" als="flex-start" mb="$4">

                        <Ionicons name={isUser ? 'people-circle' : 'business'} size={48} color={isUser ? '#3b82f6' : '#10b981'}/>
                      </YStack>

                      <Text fontSize="$10" fontWeight="800" color="$gray12" mb="$2">Welcome Back</Text>

                      <Text fontSize="$10" fontWeight="800" color="$gray12" mb="$2">
                        Login to your {isUser ? 'user' : 'business'} account
                      </Text>
                   </YStack>

                   {/* actual form code  */}

                   <YStack gap="$4">
                     <YStack gap="$2">

                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                           {isUser ? 'user' : 'business'}
                        </Text>

                        <XStack bg="$gray12" br="$4" px="$4" ai="center" bw={2} bc="$gray5" focusStyle={{bc : '$blue8'}}>

                           <Ionicons name="mail-outline" size={20} color="#9ca3af"/>

                        <Input 
                           unstyled flex={1} 
                           placeholder={`Enter your ${isUser ? 'email' : 'business email'}`}
                           value={email}
                           onChangeText={(e) => setEmail(e.nativeEvent.text)}
                           keyboardType="email-address"
                           autoCapitalize="none"
                           size="$4"
                           py="$4"
                           ml="$3"
                        />

                        </XStack>
                     </YStack>


                     {/* password input  */}

                     <YStack gap="$2">
                        <Text fontSize="$4" fontWeight="600" color="$gray12">
                           Password
                        </Text>

                        <XStack bg="$gray2" br="$4" px="$4" ai="center" bw={2} bc="$gray5" focusStyle={{bc :'$blue8'}}>

                           <Ionicons name="lock-closed-outline" size={20} color="#9ca3af"/>

                           <Input 
                           unstyled flex={1} 
                           placeholder="Enter your password"
                           value={password}
                           onChangeText={(e) => setPassword(e.nativeEvent.text)}
                           secureTextEntry={!showPassword}
                           autoCapitalize="none"
                           size="$4"
                           py="$4"
                           ml="$3"
                        />

                        <Button unstyled onPress={() => setShowPassword(!showPassword)} pressStyle={{opacity : 0.6}}>
                           <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9ca3af"/>
                        </Button>
                        </XStack>
                     </YStack>


                     {/* forgot password option */}

                     <XStack jc="flex-end">
                        <Button unstyled onPress={() => {}} pressStyle={{opacity : 0.7}}>
                           <Text fontSize="$3" color="$blue10" fontWeight="600">Forgot Password?</Text>
                        </Button>
                     </XStack>


                     {/* login button  */}

                     <Button size="$6" br="$4" bg={isUser ? '$blue10' : '$green10'} onPress={handleLogin}
                      pressStyle={{scale : 0.98}} disabled={loading} mt="$4">

                        {loading ? (
                            <Text color="white" fontSize="$5" fontWeight="bold">
                              Logging in...
                            </Text>
                        ) : (

                            <XStack ai="center" gap="$2">
                              <Text color="white" fontSize="$5" fontWeight="bold">
                                 Login
                              </Text>
                              <Ionicons name='arrow-forward' size={20} color="white"/>
                            </XStack>
                        )}
                     </Button>
                   </YStack>


                   {/* divider between components using seperator for it */}

                   <XStack ai="center" my="$6" gap="$4">
                     <Separator flex={1}/>
                     <Text fontSize="$3" color="$gray10">
                        OR
                     </Text>
                     <Separator flex={1}/>
                   </XStack>



                   {/* sign up link  */}

                   <XStack jc="center" gap="$2">

                     <Text fontSize="$4" color="$gray11">
                        Don't have an account?
                     </Text>

                     <Button unstyled onPress={() => navigation.navigate('Register' , {role})}
                      pressStyle={{opacity : 0.7}}>

                        <Text fontSize="$4" fontWeight="bold" color={isUser ? '$blue10' : '$green10'}>
                           Sign Up
                        </Text>
                     </Button>
                   </XStack>

                 </YStack>



            </ScrollView>

          </KeyboardAvoidingView>
        </SafeAreaView>
     )
}