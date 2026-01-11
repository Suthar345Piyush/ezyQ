// OTP Verification Screen

import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, Text, Button, Input, Circle } from 'tamagui';
import { AuthStackScreenProps } from '../../types/navigation.types';

type Props = AuthStackScreenProps<'OTPVerification'>;

export default function OTPVerificationScreen({ navigation, route }: Props) {
  const { email, role, isNewUser } = route.params;
  const isUser = role === 'user';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<any[]>([]);



  // Timer for resend OTP


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string | any, index: number) => {

    // Extract string value if it's an event object


    const textValue = typeof value === 'string' ? value : value?.nativeEvent?.text || '';
    
    // Only allow single digits


    if (textValue.length > 1) return;
    if (textValue && isNaN(Number(textValue))) return;

    const newOtp = [...otp];
    newOtp[index] = textValue;
    setOtp(newOtp);

    // Auto focus next input


    if (textValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }

    setLoading(true);
    
    try {

      // Import services dynamically

      const { AuthService } = await import('@/src/stores/authService');
      const { useAuthStore } = await import('@/src/stores/authStore');
      
      // Verify OTP

      const verifyResult = await AuthService.verifyOTP(email, otpCode);
      
      if (!verifyResult.success) {
        alert(verifyResult.error || 'Invalid OTP');
        setLoading(false);
        return;
      }

      // If new user, register them

      if (isNewUser) {
        const registerResult = await AuthService.register(
          email,
          route.params.name || 'User',
          role
        );
        
        if (!registerResult.success || !registerResult.user) {
          alert(registerResult.error || 'Registration failed');
          setLoading(false);
          return;
        }

        // Set user in auth store

        await useAuthStore.getState().setUser(registerResult.user);
        
        alert('Registration successful! Welcome to EzyQ');
      } else {

        // Existing user - login

        const loginResult = await AuthService.login(email);
        
        if (!loginResult.success || !loginResult.user) {
          alert(loginResult.error || 'Login failed');
          setLoading(false);
          return;
        }

        // Set user in auth store

        await useAuthStore.getState().setUser(loginResult.user);
        
        alert('Login successful! Welcome back');
      }



      // Navigation will be handled automatically by AppNavigator
      // based on isAuthenticated state


    } catch (error) {
      console.error('OTP verification error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    try {
     
      const { AuthService } = await import('@/src/stores/authService');
      
      // Request new OTP


      const result = await AuthService.requestOTP(email);
      
      if (!result.success) {
        alert(result.error || 'Failed to resend OTP');
        return;
      }

      // Reset OTP inputs and timer


      setOtp(['', '', '', '', '', '']);
      setResendTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
      
      alert('New OTP sent successfully!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <XStack px="$6" py="$4" ai="center">
          <Button
            unstyled
            onPress={() => navigation.goBack()}
            pressStyle={{ opacity: 0.7 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </Button>
        </XStack>

        <YStack px="$6" pt="$4" pb="$8" ai="center">

          {/* Icon */}


          <YStack mb="$8">
            <Circle
              size={120}
              bg={isUser ? '$blue2' : '$green2'}
              shadowColor="$shadowColor"
              shadowRadius={20}
              shadowOpacity={0.1}
            >
              <YStack
                bg={isUser ? '$blue10' : '$green10'}
                p="$6"
                br="$12"
              >
                <Ionicons
                  name="mail-open-outline"
                  size={56}
                  color="white"
                />
              </YStack>
            </Circle>
          </YStack>

          {/* Title Section */}


          <YStack mb="$8" ai="center">
            <Text fontSize="$10" fontWeight="800" color="$gray12" mb="$2" ta="center">
              Verify Your Email
            </Text>
            <Text fontSize="$4" color="$gray11" fontWeight="500" ta="center" px="$4">
              We've sent a 6-digit code to
            </Text>
            <Text fontSize="$4" color={isUser ? '$blue10' : '$green10'} fontWeight="700" mt="$2">
              {email}
            </Text>
          </YStack>

          {/* OTP Input */}

          <YStack mb="$6" w="100%" px="$4">
            <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$4" ta="center">
              Enter OTP Code
            </Text>
            <XStack jc="space-between" gap="$1" maxWidth={270} ml='$-4'>
              {otp.map((digit, index) => (
                <YStack key={index} flex={1} maxWidth={50} aspectRatio={1}>
                  <Input
                    ref={(ref: any) => (inputRefs.current[index] = ref)}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    maxLength={1}
                    keyboardType="number-pad"
                    textAlign="center"
                    size="$7"
                    w="100%"
                    h="100%"
                    br="$4"
                    bg="$gray2"
                    bw={2}
                    bc={digit ? (isUser ? '$blue8' : '$green8') : '$gray5'}
                    color="$gray12"
                    focusStyle={{
                      bc: isUser ? '$blue10' : '$green10',
                      bg: 'white',
                    }}
                  />
                </YStack>
              ))}
            </XStack>
          </YStack>

          {/* Resend Section */}

          <XStack ai="center" gap="$2" mb="$8">
            <Text fontSize="$3" color="$gray11">
              Didn't receive code?
            </Text>
            {canResend ? (
              <Button
                unstyled
                onPress={handleResendOtp}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  fontSize="$3"
                  color={isUser ? '$blue10' : '$green10'}
                  fontWeight="bold"
                >
                  Resend OTP
                </Text>
              </Button>
            ) : (
              <Text fontSize="$3" color="$gray10" fontWeight="600">
                Resend in {resendTimer}s
              </Text>
            )}
          </XStack>

          {/* Verify Button */}

          <YStack w="100%">
            <Button
              size="$6"
              br="$4"
              bg={isUser ? '$blue10' : '$green10'}
              onPress={handleVerify}
              pressStyle={{ scale: 0.98 }}
              disabled={loading || otp.join('').length !== 6}
              opacity={otp.join('').length !== 6 ? 0.5 : 1}
            >
              {loading ? (
                <Text color="white" fontSize="$5" fontWeight="bold">
                  Verifying...
                </Text>
              ) : (
                <XStack ai="center" gap="$3">
                  <Text color="white" fontSize="$5" fontWeight="bold">
                    Verify & Continue
                  </Text>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                </XStack>
              )}
            </Button>
          </YStack>

          {/* Info Text */}
          <YStack mt="$8" bg="$gray2" p="$4" br="$4" w="100%">
            <XStack gap="$3">
              <Ionicons name="information-circle" size={20} color="#6b7280" />
              <YStack f={1}>
                <Text fontSize="$3" color="$gray11" lineHeight={20}>
                  {isNewUser
                    ? 'Please verify your email to complete registration'
                    : 'Enter the OTP sent to your email to login securely'}
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}