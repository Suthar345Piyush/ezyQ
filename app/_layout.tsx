import '../global.css';
import { useEffect , useState } from 'react';
import { Slot, Stack } from 'expo-router';
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
             console.log('DB ready');

             console.log('Initializing auth...');

             await intialize();
             console.log('Auth ready');

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
         <View className='flex-1 justify-center items-center bg-white'>
           <View className='items-center'>
             <ActivityIndicator size='large' color='#3b82f6'/>
             <Text className='text-gray-600 text=lg font-medium mt-4'>
               Loading...
             </Text>
           </View>
         </View>
       );
    }

    return (
       <>
        <StatusBar style='auto'/>
        <Slot />
       </>
    )






}
