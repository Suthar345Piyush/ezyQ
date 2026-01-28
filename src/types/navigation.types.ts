// type for navigation system 

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { UserRole } from "./index";
import type { CompositeScreenProps } from "@react-navigation/native";


//root stack

export type RootStackParamList = {
   Auth : NavigatorScreenParams<AuthStackParamList>;
   User : NavigatorScreenParams<UserTabParamList>;
   Business : NavigatorScreenParams<BusinessStackParamList>;
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
};

// user stack items list  

export type  UserStackParamList = {
    UserTabs : NavigatorScreenParams<UserTabParamList>;
    QueueDetails : {
       queueId : string | undefined;
    };
    JoinQueue :  {
       queueId : string | undefined;
    };
    EditProfile : undefined;
};


//business bottom tabs 

export type BusinessTabParamList = {
   Dashboard : undefined;
   Queues : undefined;
   Analytics : undefined;
   Settings : undefined;
}


// business stack items list 

export type BusinessStackParamList = {
    BusinessTabs : NavigatorScreenParams<BusinessTabParamList>;
    QueueDetails : {
       queueId : string | undefined;
    };
    CreateQueues : undefined;
};


// screen props types  

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList , T>; 


export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
NativeStackScreenProps<AuthStackParamList , T>;



export type UserTabScreenProps<T extends keyof UserTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<UserTabParamList , T>,
    NativeStackScreenProps<UserStackParamList>
    >;

export type UserStackScreenProps<T extends keyof UserStackParamList> =
  CompositeScreenProps<
      NativeStackScreenProps<UserStackParamList , T>,
      BottomTabScreenProps<UserTabParamList>
   >;


export type BusinessStackScreenProps<T extends keyof BusinessStackParamList> = 
   CompositeScreenProps<
     NativeStackScreenProps<BusinessStackParamList , T>,
     BottomTabScreenProps<BusinessTabParamList>
    >;


    
export type BusinessTabScreenProps<T extends keyof BusinessTabParamList> =
  CompositeScreenProps<
     BottomTabScreenProps<BusinessTabParamList , T>,
     NativeStackScreenProps<BusinessStackParamList>
   >;



// navigation props types for hooks  

declare global {
   namespace ReactNavigation {
     interface RootParamList extends RootStackParamList {}
   }
}

