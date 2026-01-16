// src/services/auth/auth.service.ts
// Updated with Resend email integration

import { UserRepository } from '@/src/services/database/repositories/UserRepository';
import { User, UserRole } from '@/src/types/index';
import { generateId } from '@/src/utils/index';
import { ResendEmailService } from '@/src/services/email/resend.service';

// In-memory OTP storage (use Redis in production)
const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

export class AuthService {

  /**
   * Generate 6-digit OTP
   */


  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Request OTP for email verification
   * Now uses Resend to send real emails!
   */



  static async requestOTP(email: string): Promise<{ success: boolean; error?: string }> {
    try {

      // Validating  email


      if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
      }

      // Generate OTP


      const otp = this.generateOTP();

      // Store OTP (expires in 10 minutes)


      const expiresAt = Date.now() + 10 * 60 * 1000;
      otpStorage.set(email.toLowerCase(), { otp, expiresAt });

      console.log(`📧 Generated OTP for ${email}: ${otp}`);



      // Send OTP via Resend


      const emailSent = await ResendEmailService.sendOTPEmail(email, otp);

      if (!emailSent) {
        // Fallback to alert for development if email fails
        console.warn('⚠️ Email sending failed, showing alert instead');
        alert(`Development Mode - Your OTP is: ${otp}\n\n(In production, this would be sent to ${email})`);
      }

      return { success: true };
    } catch (error) {
      console.error('Request OTP error:', error);
      return { success: false, error: 'Failed to send OTP' };
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const normalizedEmail = email.toLowerCase();
      const stored = otpStorage.get(normalizedEmail);

      if (!stored) {
        return {
          success: false,
          error: 'OTP expired or not found. Please request a new one.',
        };
      }

      // Check expiration
      if (Date.now() > stored.expiresAt) {
        otpStorage.delete(normalizedEmail);
        return {
          success: false,
          error: 'OTP expired. Please request a new one.',
        };
      }

      // Verify OTP
      if (stored.otp !== otp) {
        return { success: false, error: 'Invalid OTP. Please try again.' };
      }

      // OTP verified - remove from storage
      otpStorage.delete(normalizedEmail);

      return { success: true };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'Failed to verify OTP' };
    }
  }



  /**
   * Register new user
   */


  static async register(
    email: string,
    name: string,
    role: UserRole,
    phone?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const normalizedEmail = email.toLowerCase();

      // Check if user exists
      const existingUser = await UserRepository.getByEmail(normalizedEmail);

      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user
      const newUser = await UserRepository.create({
        id: generateId(),
        name,
        email: normalizedEmail,
        phone,
        role,
      });

      console.log('✅ User registered:', newUser.email);

      // Send welcome email (don't wait for it)
      ResendEmailService.sendWelcomeEmail(newUser.email, newUser.name).catch(
        (err) => console.error('Welcome email failed:', err)
      );

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to register user' };
    }
  }

  /**
   * Login existing user
   */
  static async login(
    email: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const normalizedEmail = email.toLowerCase();

      // Find user
      const user = await UserRepository.getByEmail(normalizedEmail);

      if (!user) {
        return {
          success: false,
          error: 'No account found with this email',
        };
      }

      console.log('✅ User logged in:', user.email);

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to login' };
    }
  }

  /**
   * Check if email exists
   */
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await UserRepository.emailExists(email.toLowerCase());
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  }



  /**
   * Generate auth token (will use JWT in production)
   */

  static generateAuthToken(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${userId}_${timestamp}_${random}`;
  }



  /**
   * Clear expired OTPs from storage
   */

  
  static clearExpiredOTPs(): void {
    const now = Date.now();

    for (const [email, data] of otpStorage.entries()) {
      if (now > data.expiresAt) {
        otpStorage.delete(email);
      }
    }
  }
}

export default AuthService;