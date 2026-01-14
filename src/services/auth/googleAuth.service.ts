// src/services/auth/googleAuth.service.ts
// Google Authentication Service - Android Only Version
// Uses environment variables for security

import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { UserRole } from '@/src/types';
import { AuthService } from '@/src/stores/authService';
import { UserRepository } from '../database/repositories/UserRepository';
import { useAuthStore } from '@/src/stores/authStore';

// Complete the auth session

WebBrowser.maybeCompleteAuthSession();

// Get Client ID from environment variables

const GOOGLE_CLIENT_ID_ANDROID = 
  Constants.expoConfig?.extra?.googleAndroidClientId || '';

// Validate Client ID exists


if (!GOOGLE_CLIENT_ID_ANDROID) {
  console.error('⚠️ Google Android Client ID not found!');
  console.error('Please create .env file with GOOGLE_ANDROID_CLIENT_ID');
}

export interface GoogleAuthResult {
  success: boolean;
  user?: any;
  error?: string;
}

export class GoogleAuthService {

  /**
   *
   * Initialize Google Sign-In for Android
   */

  static useGoogleAuth() {
    const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: GOOGLE_CLIENT_ID_ANDROID,
      scopes: ['profile', 'email'],
    });

    return { request, response, promptAsync };
  }


  /**
   * Handle Google Sign-In response
   */

  static async handleGoogleSignIn(
    response: any,
    role: UserRole
  ): Promise<GoogleAuthResult> {
    try {
      if (response?.type !== 'success') {
        return {
          success: false,
          error: 'Google sign-in was cancelled or failed',
        };
      }



      // Get user info from Google

      const { authentication } = response;
      const userInfo = await this.fetchGoogleUserInfo(authentication.accessToken);

      if (!userInfo) {
        return {
          success: false,
          error: 'Failed to fetch user information from Google',
        };
      }


      // Check if user already exists


      const existingUser = await UserRepository.getByEmail(userInfo.email);

      if (existingUser) {

        // User exists - login

        if (existingUser.role !== role) {
          return {
            success: false,
            error: `This email is registered as a ${existingUser.role}. Please select the correct role.`,
          };
        }



        // Set user in auth store


        await useAuthStore.getState().setUser(existingUser);

        console.log('User logged in via Google:', existingUser.email);
        return {
          success: true,
          user: existingUser,
        };
      } else {


        // New user - register


        const registerResult = await AuthService.register(
          userInfo.email,
          userInfo.name,
          role
        );

        if (!registerResult.success || !registerResult.user) {
          return {
            success: false,
            error: registerResult.error || 'Failed to register user',
          };
        }



        // Update with Google profile picture if available


        if (userInfo.picture) {
          await UserRepository.update(registerResult.user.id, {
            avatar_url: userInfo.picture,
          });
        }



        // Set user in auth store


        await useAuthStore.getState().setUser(registerResult.user);

        console.log('User registered via Google:', registerResult.user.email);
        return {
          success: true,
          user: registerResult.user,
        };
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google sign-in failed',
      };
    }
  }


  /**
   * Fetch user info from Google
   */


  private static async fetchGoogleUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      return {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        givenName: userInfo.given_name,
        familyName: userInfo.family_name,
      };
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      return null;
    }
  }

  /**
   * Sign out from Google - just clearing the session 
   */


  static async signOut(): Promise<void> {
    try {
      // Clear local auth store
      await useAuthStore.getState().logout();
      
      console.log('Signed out from Google');
    } catch (error) {
      console.error('Google sign-out error:', error);
    }
  }
}

export default GoogleAuthService;