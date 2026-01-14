import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { YStack, XStack, Text, Button, Input, Separator } from 'tamagui';
import { AuthStackScreenProps } from '../../types/navigation.types';
import { GoogleAuthService } from '@/src/services/auth/googleAuth.service';

type Props = AuthStackScreenProps<'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const isUser = role === 'user';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ✅ Call hook at top level unconditionally

  const { request, response, promptAsync } = GoogleAuthService.useGoogleAuth();

  // Handle Google auth response
  useEffect(() => {
    if (response) {
      handleGoogleResponse();
    }
  }, [response]);

  const handleGoogleResponse = async () => {
    if (!response) return;

    setGoogleLoading(true);

    try {
      const result = await GoogleAuthService.handleGoogleSignIn(response, role);

      if (result.success && result.user) {
        console.log('Google login successful');

        // Navigation should happen automatically via auth state


      } else {
        alert(result.error || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('An error occurred during Google sign-in');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleTextChange = (setter: (value: string) => void) => (value: any) => {
    const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
    setter(text);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const { AuthService } = await import('@/src/stores/authService');

      const emailExists = await AuthService.checkEmailExists(email);

      if (!emailExists) {
        alert('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }

      const result = await AuthService.requestOTP(email);

      if (!result.success) {
        alert(result.error || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      navigation.navigate('OTPVerification', {
        email,
        role,
        isNewUser: false,
      });
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!promptAsync) {
      alert('Google sign-in is not available. Please check your configuration.');
      return;
    }

    setGoogleLoading(true);

    try {
      await promptAsync();
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again');
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
                  name={isUser ? 'person-circle' : 'business'}
                  size={48}
                  color={isUser ? '#3b82f6' : '#10b981'}
                />
              </YStack>

              <Text fontSize="$10" fontWeight="800" color="$gray12" mb="$2">
                Welcome Back
              </Text>
              <Text fontSize="$5" color="$gray11" fontWeight="500">
                Login to your {isUser ? 'user' : 'business'} account
              </Text>
            </YStack>

            <YStack gap="$4">
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
                    value={email}
                    onChangeText={handleTextChange(setEmail)}
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
                    placeholder="Enter your password"
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
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#9ca3af"
                    />
                  </Button>
                </XStack>
              </YStack>

              <XStack jc="flex-end">
                <Button
                  unstyled
                  onPress={() => {}}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text fontSize="$3" color="$blue10" fontWeight="600">
                    Forgot Password?
                  </Text>
                </Button>
              </XStack>

              <Button
                size="$6"
                br="$4"
                bg={isUser ? '$blue10' : '$green10'}
                onPress={handleLogin}
                pressStyle={{ scale: 0.98 }}
                disabled={loading}
                mt="$4"
              >
                {loading ? (
                  <Text color="white" fontSize="$5" fontWeight="bold">
                    Logging in...
                  </Text>
                ) : (
                  <XStack ai="center" gap="$2">
                    <Text color="white" fontSize="$5" fontWeight="bold">
                      Login
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
              onPress={handleGoogleSignIn}
              pressStyle={{ scale: 0.98, bg: '$gray2' }}
              disabled={googleLoading}
              mb="$4"
            >
              <XStack ai="center" gap="$3">
                <Ionicons name="logo-google" size={24} color="#DB4437" />
                <Text color="$gray12" fontSize="$5" fontWeight="600">
                  {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </Text>
              </XStack>
            </Button>

            <XStack jc="center" gap="$2">
              <Text fontSize="$4" color="$gray11">
                Don't have an account?
              </Text>
              <Button
                unstyled
                onPress={() => navigation.navigate('Register', { role })}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  fontSize="$4"
                  color={isUser ? '$blue10' : '$green10'}
                  fontWeight="bold"
                >
                  Sign Up
                </Text>
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}