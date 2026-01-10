// Register Screen for both User and Business

import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, Text, Button, Input, Separator, Checkbox } from 'tamagui';
import { AuthStackScreenProps } from '../../types/navigation.types';

type Props = AuthStackScreenProps<'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const isUser = role === 'user';

  // User fields

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Business fields

  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  
  // Common

  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    // Validation

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
       
    // soon will using resend email api to send emails to user

    try {
        // auth service 
        
        const {AuthService} = await import('@/src/stores/authService');

        const emailToCheck = isUser ? email : businessEmail;

        //checking email exist or not  

        const emailExists = await AuthService.checkEmailExists(emailToCheck);


        if(emailExists) {
           alert('Account with this email already exists. Please login.');
           setLoading(false);
           return;
        }

      //requesting the otp for next verification 

      const reqOtp = await AuthService.requestOTP(emailToCheck);

      if(!reqOtp.success) {
         alert(reqOtp.error || 'Failed to sent OTP');
         setLoading(false);
         return;
      }


      // then navigate it to otp screen , in this registering the user/business (it's first time for it )

      navigation.navigate('OTPVerification' , {
          email : emailToCheck,
          role,
          isNewUser : true,
          name : isUser ? fullName : businessName,
      });


    } catch(error) {
         console.error('Registration error:' , error);
         alert('An error occurred. Please try again.'); 
    }  
       finally {
          setLoading(false);
       }
       
       
  };





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Header of the screen*/}

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

            {/* Title Section */}


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

            {/*  Form content */}


            <YStack gap="$4">


              {/* user: full name /business: Business Name */}


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
                    onChangeText={isUser ? ((e) => setFullName(e.nativeEvent.text)) : ((e) => setBusinessName(e.nativeEvent.text))}
                    size="$5"
                    ml="$3"
                    placeholderTextColor="$gray10"
                  />
                </XStack>
              </YStack>


              {/* email input */}

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
                    onChangeText={isUser ? ((e) => setEmail(e.nativeEvent.text)) : ((e) => setBusinessEmail(e.nativeEvent.text))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    size="$5"
                    ml="$3"
                    placeholderTextColor="$gray10"
                  />
                </XStack>
              </YStack>



              {/* password input */}

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
                    onChangeText={((e) => setPassword(e.nativeEvent.text))}
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



              {/* Terms and Conditions sections checkbox */}

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
                    <Ionicons name="checkmark" size={16} color={isUser ? '$blue' : '$green'} />
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


              {/* register Button */}

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



            {/* divider using separator */}

            <XStack ai="center" my="$6" gap="$4">
              <Separator flex={1} />
              <Text fontSize="$3" color="$gray10">
                OR
              </Text>
              <Separator flex={1} />
            </XStack>

            {/* login link to login page  */}

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