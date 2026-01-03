import './global.css'; 
import {View , Text , TouchableOpacity , ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from "@expo/vector-icons";
import { AuthStackScreenProps } from '@/src/types/navigation.types';

type Props = AuthStackScreenProps<'Welcome'>;

export default function WelcomeScreen({navigation} : Props) {
    return (
       <SafeAreaView className='flex-1 bg-gradient-to-b from-blue-50 to-white'>
        <ScrollView className='flex-1' contentContainerStyle={{flexGrow : 1}} showsVerticalScrollIndicator={false}>

     
        {/* header section  */}
 
          <View className='pt-16 pb-8 px-6'>
            <View className='items-center mb-8'>
              <View className='relative'>

                 <View className='absolute inset-0 bg-blue-400 rounded-full opacity-20 blur-3xl scale-125'>

                  <View className='bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-2xl'>
                    <Ionicons name="people-circle" size={90} color="#fff"/>
                  </View>

                  <View className='absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg'>
                    <Ionicons name="checkmark" size={20} color="#fff"/>
                  </View>
                 </View>
              </View>

              <View className='items-center'>
                <Text className='text-5xl font-extrabold text-gray-900 text-center mb-2'>
                  ezyQ
                </Text>
                <View className='h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full'/>
              </View>

              <Text className='text-lg text-gray-600 text-center font-medium mt-6 px-4'>
                Skip the wait , manage your time{'\n'}Join queues instantly⚡
              </Text>
            </View>


            {/* features grid   */}

            <View className='px-6 py-6'>
              <View className='flex-row flex-wrap justify-between'>
                <FeatureCard 
                  icon="time-outline"
                  iconColor='#3b82f6'
                  title='Real-time'
                  description='Live updates'
                 />

                <FeatureCard 
                  icon="notifications-outline"
                  iconColor='#8b5cf6'
                  title='Notifications'
                  description='Never miss turn'
                 />

                <FeatureCard 
                  icon="location-outline"
                  iconColor='#10b981'
                  title='Find Nearby'
                  description='Discover queues'
                 />

                <FeatureCard 
                  icon="shield-checkmark"
                  iconColor='#f59e0b'
                  title='Secure'
                  description='OTP verified'
                 />
              </View>
            </View>

      {/* spacer  */}

            <View className='flex-1'/>

            <View className='px-6 pb-8 space-y-4'>

              {/* get started button - role selection  */}

              <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')} 
                className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl active:scale-98'
                 style={{elevation : 8}}>

                  <View className='flex-row items-center justify-center py-5 px-6'>
                    <Text className='text-white text-xl font-bold mr-3'>Get Started</Text>
                    <Ionicons name='arrow-forward-circle' size={28} color='#fff'/>
                  </View>
              </TouchableOpacity>
            </View>
           </View>
        </ScrollView>
       </SafeAreaView>
    )
};



// feature card props

interface FeatureCardProps {
   icon : keyof typeof Ionicons.glyphMap;
   iconColor : string;
   title : string;
   description : string;
}


function FeatureCard({icon , iconColor , title , description} : FeatureCardProps) {
    return (
       <View className='w-[48%] bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100'>
         <View className='bg-gray-50 p-3 rounded-xl self-start mb-3'>
           <Ionicons name={icon} size={28} color={iconColor}/>
         </View>
         <Text className='text-gray-900 text-base font-bold mb-1'> 
          {title}
         </Text>
         <Text className='text-gray-500 text-xs'> 
          {description}
         </Text>
       </View>
    )
};


