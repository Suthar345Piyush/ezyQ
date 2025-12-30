// (auth)/welcome file  

import {  ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';

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
           
           
           />



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
