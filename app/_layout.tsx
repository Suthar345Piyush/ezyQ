import '../global.css';
import { useEffect , useState } from 'react';
import { Stack } from 'expo-router';
import {View , Text , ActivityIndicator} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { databaseService } from '../src/services/database/database.service';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {

   const [isDbReady , setIsDbReady] = useState(false);
   const [error , setError] = useState<string | null>(null);


   const intialize = useAuthStore(state => state.initialize);
   const isLoading = useAuthStore(state => state.isLoading);


    useEffect(() => {
       initializeApp();
    } , []); 

    const initializeApp =  async () => {
         try {
            // initializing the db 
             await databaseService.intialize();

             setIsDbReady(true);


             await intialize();

         } catch(err) {
            console.error('App initialization error:' , err);
            setError(err instanceof Error ? err.message : 'Failed to initialize app');
         }
    };


    if(error) {
        return (
           <View className='flex-1 justify-center items-center bg-white px-6'>
             <View className='bg-red-50 p-6 rounded-2xl border-2 border-red-200 w-full max-w-sm'>
               <Text className='text-red-600 text-xl font-bold text-center mb-2'>
                 Error
               </Text>

               <Text className='text-red-700 text-base text-center mb-4'>
                     {error}
               </Text>
               <Text className='text-red-600 text-sm text-center'>
                 Please restart the app
               </Text>
             </View>

           </View>
        );
    }


    if(!isDbReady || isLoading) {
       return (
         <View className='flex-1 justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50'>
           <View className='items-center space-y-4'>
             <View className='bg-white p-8 rounded-full shadow-lg'>
              <ActivityIndicator size="large" color="#3b82f6"/>
             </View>

             <Text className='text-gray-600 text-lg font-medium mt-4'>
               Initializing...
             </Text>

             <View className='flex-row space-x-1 mt-2'>
              <View className='w-2 h-2 bg-blue-400 rounded-full animate-bounce' />
             
                <View className='w-2 h-2 bg-blue-500 rounded-full animate-bounce dealy-100' />

                <View className='w-2 h-2 bg-blue-600 rounded-full animate-bounce dealy-200'/>
             </View>
           </View>

         </View>
       );
    }


    return (
       <>
        <StatusBar style='auto'/>

         <Stack screenOptions={{
             headerStyle :  {
                backgroundColor : '#3b82f6',
             },

             headerTintColor : '#fff',
             headerTitleStyle : {
                fontWeight : '600',
             },
             headerShadowVisible : false,
         }}>

          <Stack.Screen name='index' options={{headerShown : false}} />
          <Stack.Screen name='(auth)' options={{headerShown : false}} />
          <Stack.Screen name='(user)' options={{headerShown : false}} />
          <Stack.Screen name='(business)' options={{headerShown : false}}/>
         </Stack>
       
       </>
    )





}
