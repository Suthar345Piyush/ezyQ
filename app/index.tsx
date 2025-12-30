import { useEffect } from "react";
import { Href, router } from "expo-router";
import {View , Text , ActivityIndicator} from 'react-native';
import { useAuthStore } from "../src/stores/authStore";

export  default function Index() {

     const {isAuthenticated , user} = useAuthStore();

     useEffect(() => {

          // dealy to prevent flash 

          const timer = setTimeout(() => {

              if(isAuthenticated && user) {

                  if(user.role === 'business') {

                     router.replace('/(business)/(tabs)/dashboard' as Href);

                  } else {

                     router.replace('/(user)/(tabs)' as Href);

                  }
              } 
                else {

                  router.replace('/(auth)/welcome');

              }
          } , 100);

          return () => clearTimeout(timer);
    
     } , [isAuthenticated , user]);


     return (
       <View className="flex-1 justify-center items-center bg-white">
         <View className="bg-blue-50 p-6 rounded-full">
            <ActivityIndicator size="large" color='#3b82f6'/>
         </View>
          <Text className="text-gray-600 text-base mt-4 font-medium">
            Loading...
          </Text>
       </View>
     );
}
