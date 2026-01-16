// register screen code

import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, Text, Button, Input, Separator, Checkbox } from 'tamagui';
import { AuthStackScreenProps } from '../../types/navigation.types';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import  Constants  from 'expo-constants';


WebBrowser.maybeCompleteAuthSession();


type Props = AuthStackScreenProps<'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const isUser = role === 'user';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


    // google auth setup 

    const [request , response , promptAsync] = Google.useAuthRequest({
      androidClientId : Constants.expoConfig?.extra?.googleAndroidClientId,
      scopes : ['profile' , 'email'],
    });


    //handling the google sign-in response 

  useEffect(() => {
    if(response?.type === 'success') {
       handleGoogleResponse(response);
    } 
   else if(response?.type === 'error') {
       setGoogleLoading(false);
   }

 else if(response?.type === 'dismiss' || response?.type === 'cancel') {
    setGoogleLoading(false);
 }
  } , [response]);

 

  const handleTextChange = (setter: (value: string) => void) => (value: any) => {
    const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
    setter(text);
  };

  const handleRegister = async () => {
    if (isUser) {
      if (!fullName || !email || !password) {
        alert('Please fill all fields');
        return;
      }
    } else {
      if (!businessName || !businessEmail || !password) {
        alert('Please fill all fields');
        return;
      }
    }

    if (!agreeToTerms) {
      alert('Please agree to terms and conditions');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { AuthService } = await import('@/src/stores/authService');

      const emailToCheck = isUser ? email : businessEmail;

      const emailExists = await AuthService.checkEmailExists(emailToCheck);

      if (emailExists) {
        alert('An account with this email already exists. Please login instead.');
        setLoading(false);
        return;
      }

      const result = await AuthService.requestOTP(emailToCheck);

      if (!result.success) {
        alert(result.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      navigation.navigate('OTPVerification', {
        email: emailToCheck,
        role,
        isNewUser: true,
        name: isUser ? fullName : businessName,
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // handle google sign up function 

  const handleGoogleSignUp = async () => {
      if(!agreeToTerms) {
         alert('Please agree to terms and conditions');
         return;
      } 


      setGoogleLoading(true);

      try {
         if(!request){
           alert('Google sign-up is not ready yet. Please try again.');
           setGoogleLoading(false);
           return;
         }

         await promptAsync();
      } 
       catch(error) {
        console.error('Google sign-in error:' , error);
        alert('Failed to open Google sign-in. Please try again.');
        setGoogleLoading(false);
      }
  };


  
  // handling the google sign-in response 

  const handleGoogleResponse = async (response : any) => {

    setGoogleLoading(true);

    try {
       const {GoogleAuthService} = await import("@/src/services/auth/googleAuth.service");


       const result = GoogleAuthService.handleGoogleSignIn(response , role);

       if((await result).success){
         console.log('Google sign-in successful!');
       } else {
          alert((await result).error || 'Google sign-in failed');
       }
    } 
      catch(error) {
         console.error('Google response error:' , error);
         alert('An error occurred during Google sign-in');
      }  
      finally {
         setGoogleLoading(false);
      }
};




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <XStack px="$6" py="$4" ai="center">
            <Button
              unstyled
              onPress={() => navigation.goBack()}
              pressStyle={{ opacity: 0.7 }}
            >
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </Button>
          </XStack>

          <YStack px="$6" pt="$4" pb="$8">
            <YStack mb="$8">
              <YStack
                bg={isUser ? '$blue2' : '$green2'}
                p="$5"
                br="$8"
                als="flex-start"
                mb="$4"
              >
                <Ionicons
                  name={isUser ? 'person-add' : 'business'}
                  size={48}
                  color={isUser ? '#3b82f6' : '#10b981'}
                />
              </YStack>

              <Text fontSize="$10" fontWeight="800" color="$gray12" mb="$2">
                Create Account
              </Text>
              <Text fontSize="$5" color="$gray11" fontWeight="500">
                Sign up as a {isUser ? 'user' : 'business'} to get started
              </Text>
            </YStack>

            <YStack gap="$4">
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  {isUser ? 'Full Name' : 'Business Name'}
                </Text>
                <XStack
                  bg="$gray2"
                  br="$4"
                  px="$4"
                  ai="center"
                  h={56}
                  bw={2}
                  bc="$gray5"
                >
                  <Ionicons
                    name={isUser ? 'person-outline' : 'storefront-outline'}
                    size={22}
                    color="#9ca3af"
                  />
                  <Input
                    unstyled
                    flex={1}
                    placeholder={`Enter your ${isUser ? 'full name' : 'business name'}`}
                    value={isUser ? fullName : businessName}
                    onChangeText={handleTextChange(isUser ? setFullName : setBusinessName)}
                    size="$5"
                    ml="$3"
                    placeholderTextColor="$gray10"
                  />
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  {isUser ? 'Email' : 'Business Email'}
                </Text>
                <XStack
                  bg="$gray2"
                  br="$4"
                  px="$4"
                  ai="center"
                  h={56}
                  bw={2}
                  bc="$gray5"
                >
                  <Ionicons name="mail-outline" size={22} color="#9ca3af" />
                  <Input
                    unstyled
                    flex={1}
                    placeholder={`Enter your ${isUser ? 'email' : 'business email'}`}
                    value={isUser ? email : businessEmail}
                    onChangeText={handleTextChange(isUser ? setEmail : setBusinessEmail)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    size="$5"
                    ml="$3"
                    placeholderTextColor="$gray10"
                  />
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray12">
                  Password
                </Text>
                <XStack
                  bg="$gray2"
                  br="$4"
                  px="$4"
                  ai="center"
                  h={56}
                  bw={2}
                  bc="$gray5"
                >
                  <Ionicons name="lock-closed-outline" size={22} color="#9ca3af" />
                  <Input
                    unstyled
                    flex={1}
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChangeText={handleTextChange(setPassword)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    size="$5"
                    ml="$3"
                    placeholderTextColor="$gray10"
                  />
                  <Button
                    unstyled
                    onPress={() => setShowPassword(!showPassword)}
                    pressStyle={{ opacity: 0.6 }}
                    hitSlop={{left : 10 , right : 10 , top : 10 , bottom : 10}}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#9ca3af"
                    />
                  </Button>
                </XStack>
                <Text fontSize="$2" color="$gray10" mt="$1">
                  Must be at least 6 characters long
                </Text>
              </YStack>

              <XStack ai="center" gap="$3" mt="$2">
                <Checkbox
                  id="terms"
                  size="$5"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  borderWidth={2}
                  borderColor="$gray8"
                >
                  <Checkbox.Indicator>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </Checkbox.Indicator>
                </Checkbox>
                <XStack f={1} flexWrap="wrap" ai="center">
                  <Text fontSize="$3" color="$gray11">
                    I agree to the{' '}
                  </Text>
                  <Button
                    unstyled
                    onPress={() => {}}
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <Text fontSize="$3" color={isUser ? '$blue10' : '$green10'} fontWeight="600">
                      Terms & Conditions
                    </Text>
                  </Button>
                </XStack>
              </XStack>

              <Button
                size="$6"
                br="$4"
                bg={isUser ? '$blue10' : '$green10'}
                onPress={handleRegister}
                pressStyle={{ scale: 0.98 }}
                disabled={loading}
                mt="$4"
              >
                {loading ? (
                  <Text color="white" fontSize="$5" fontWeight="bold">
                    Creating Account...
                  </Text>
                ) : (
                  <XStack ai="center" gap="$2">
                    <Text color="white" fontSize="$5" fontWeight="bold">
                      Create Account
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </XStack>
                )}
              </Button>
            </YStack>

            <XStack ai="center" my="$6" gap="$4">
              <Separator flex={1} />
              <Text fontSize="$3" color="$gray10">
                OR
              </Text>
              <Separator flex={1} />
            </XStack>

            <Button
              size="$6"
              br="$4"
              bg="white"
              bw={2}
              bc="$gray6"
              onPress={handleGoogleSignUp}
              pressStyle={{ scale: 0.98, bg: '$gray2' }}
              disabled={googleLoading || !agreeToTerms}
              opacity={!agreeToTerms ? 0.5 : 1}
              mb="$4"
            >
              <XStack ai="center" gap="$3">
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text color="$gray12" fontSize="$5" fontWeight="600">
                  {googleLoading ? 'Signing up...' : 'Sign up with Google'}
                </Text>
              </XStack>
            </Button>

            <XStack jc="center" gap="$2">
              <Text fontSize="$4" color="$gray11">
                Already have an account?
              </Text>
              <Button
                unstyled
                onPress={() => navigation.navigate('Login', { role })}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  fontSize="$4"
                  color={isUser ? '$blue10' : '$green10'}
                  fontWeight="bold"
                >
                  Login
                </Text>
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}