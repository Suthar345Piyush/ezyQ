// authentication store complete code

import {create} from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "../types";
import {UserRepository} from '@/src/services/database/repositories/UserRepository';
import {AuthService} from '@/src/stores/authService';

const AUTH_STORAGE_KEY = '@ezyq_auth';
const USER_STORAGE_KEY = '@ezyq_user';

interface AuthState { 
   user : User | null;
   isAuthenticated : boolean;
   isLoading : boolean;
   authToken : string | null;

   // actions that going to happen 

   initialize : () => Promise<void>;

   login : (email : string , password : string) => Promise<{success : boolean  , error?: string}>;

   register : (email : string , name : string , role : 'user' | 'business' , phone?: string)  => Promise<{success : boolean , error?: string}>;

   logout : () => Promise<void>;

   setUser : (user : User) => Promise<void>;

   updateUser : (updates : Partial<User>) => Promise<void>;

   clearAuth : () => Promise<void>

};






