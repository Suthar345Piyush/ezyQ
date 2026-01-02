// type for navigation system 

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { UserRole } from "./index";


//root stack

export type RootStackParamList = {
   Auth : NavigatorScreenParams<AuthStackParamList>;
   User : NavigatorScreenParams<UserTabParamList>;
   Business : NavigatorScreenParams<BusinessTabParamList>;
} 


// auth stack 

export type AuthStackParamList = {
   Welcome : undefined;
   RoleSelection : undefined;
   Register : {role : UserRole};
   Login : {role : UserRole};
   OTPVerification : {
     email : string;
     role : UserRole;
     isNewUser : boolean;
     userId? : string;
     name? : string;
   }
};

//user bottom tabs 

export type UserTabParamList = {
    Home : undefined;
    Explore : undefined;
    History : undefined;
    Profile : undefined;
    QueueDetails : {queueId : string};
}

//business bottom tabs 

export type BusinessTabParamList = {
   Dashboard : undefined;
   Queues : undefined;
   Analytics : undefined;
   Settings : undefined;
}


// screen props types  

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList , T>; 


export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
NativeStackScreenProps<AuthStackParamList , T>;


export type UserTabScreenProps<T extends keyof UserTabParamList> = 
BottomTabScreenProps<UserTabParamList , T>;

export type BusinessTabScreenProps<T extends keyof BusinessTabParamList> =
BottomTabScreenProps<BusinessTabParamList , T>;

// navigation props types for hooks  

declare global {
   namespace ReactNavigation {
     interface RootParamList extends RootStackParamList {}
   }
}

