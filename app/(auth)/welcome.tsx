// (auth)/welcome file  

import {  ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import { router } from 'expo-router';
import { databaseService } from '../../src/services/database/database.service';

export default function WelcomeScreen() {
    return (
       <SafeAreaView className='flex-1 bg-white'>
         <ScrollView className='flex-1' contentContainerClassName='flex-grow' showsVerticalScrollIndicator={false}>

           {/* header section of screen  */}

           <View className='pt-12 pb-8 px-6'>
             <View className='items-center mb-6'>
              <View className='relative'>

              <View className='absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-2xl scale-110'/>

               <View className='bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl shadow-2xl'>
                     <Ionicons name="people-circle" size={80} color="#fff"/>
               </View>
             </View>
          </View>

          {/* title  */}

          <Text className='text-4xl font-bold text-gray-600 text-center mb-3'>
             ezyQ - Smart Queue{'\n'}Manager
          </Text>

          {/* subtitle under app name  */}

          <View className='items-center'>
            <Text className='text-lg text-gray-600 text-center font-medium'>
               Skip the wait , save your time
            </Text>

            <View className='h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-3'/>
          </View>
        </View>


        <View className='px-6 py-8'>
           <Feature 
              icon='time-outline' iconColor='#3b82f6' bgColor='bg-blue-50' title='Real-time Updates' description='Get instant notifications about your queue position'/>

              <Feature 
                icon='notifications-outline'
                iconColor='#8b5cf6'
                bgColor='bg-purple-50'
                title='Smart Notifications'
                description="We'll notifiy you when it's almost your turn"
              />

              <Feature icon="location-outline" iconColor='#10b981' bgColor='bg-emerald-50' title='Find Nearby Queues' description='Discover and join queues near your location'
              />

              <Feature icon='speedometer-outline' iconColor='#f59e0b' bgColor='bg-amber-50' title='Time Estimates' description="Know exactly how long you'll wait"
              />
        </View>

         <View className='flex-1' />

         <View className='px-6 pb-6 space-y-3'>

           <TouchableOpacity onPress={() => router.push('/(auth)/register')}
             className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg active:scale-95 transition-transform'
            >

               <View className='flex-row items-center justify-center py-4 px-6'>
                  <Text className='text-white text-lg font-bold mr-2'>
                      Get Started
                  </Text>
                  <Ionicons name='arrow-forward' size={20} color="#fff"/>
               </View>
           </TouchableOpacity>


           <TouchableOpacity onPress={() => router.push('/(auth)/login')}
             className='bg-white border-2 border-gray-200 rounded-2xl active:scale-95 transition-transform'>

              <View className='py-4 px-6'>
                <Text className='text-gray-700 text-base text-center font-semibold'>Already have an account?{' '}</Text>
                </View> 
           </TouchableOpacity>


           <TouchableOpacity onPress={async () => {
              const {seedDatabase} = await import('../../utils/seedDatabase');

              const result = await seedDatabase();

              alert(result.success ? 'Demo data loaded!' : 'Failed to load data');
              
           }}  className='bg-emerald-50 border-2 border-emerald-200 rounded-2xl active:scale-95 transition-transform mt-2'>

            <View className='py-3 px-6'>
               <Text className='text-emerald-700 text-sm text-center font-semibold'>
                 Load demo data 

               </Text>

            </View>

           </TouchableOpacity>

           <TouchableOpacity onPress={async () => {
            try {
               const info = await databaseService.getDatabaseInfo();
               alert(`Table:${info.tables.join(', ')}`);
            } catch(error) {
               alert(`Error : ${error}`);
            }
           }} className='bg-green-500 p-4 rounded-xl mx-6 mb-4'>

             <Text className='text-white font-bold text-center'>
               Check database table 

             </Text>

           </TouchableOpacity>

         </View>




           
         </ScrollView>
       </SafeAreaView>
    )
};

interface FeatureProps {
   icon : keyof typeof Ionicons.glyphMap;
   iconColor : string;
   bgColor : string;
   title : string;
   description : string;
}


function Feature({icon , iconColor , bgColor , title , description} : FeatureProps) {
    return (
       <View className='flex-row items-center mb-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
           
             {/* icon container  */}

             <View className={`${bgColor} p-3 rounded-xl mr-4`}>
              <Ionicons name={icon} size={28} color={iconColor}/>
             </View>

              <View className='flex-1'>
                <Text className='text-gray-900 text-base font-bold mb-1'>
                  {title}
                </Text>
                <Text className='text-gray-900 text-sm leading-5'>
                  {description}
                </Text>

              </View>
       </View>
    )
};
