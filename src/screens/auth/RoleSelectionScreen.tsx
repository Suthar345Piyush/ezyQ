// Role Selection Screen {user -> user register screen , business -> business register screen}

import {View , Text , TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { AuthStackScreenProps } from '../../types/navigation.types';
import { UserRole } from '../../types';
 
type Props = AuthStackScreenProps<'RoleSelection'>;


export default function RoleSelectionScreen({navigation} : Props) {
    
    const [selectedRole , setSelectedRole] = useState<UserRole | null>(null);

    const handleContinue = () => {

       if(!selectedRole){
         alert('Please select a role');
         return;
       }

       navigation.navigate('Login' , {role : selectedRole});
    };

    return (
       <SafeAreaView className='flex-1 bg-white'>

         {/* header  */}

         <View className='px-6 py-4 flex-row items-center'>
           <TouchableOpacity className='mr-4' onPress={() => navigation.goBack()}>
             <Ionicons name="arrow-back" size={24} color="#1f2937"/>
           </TouchableOpacity>
           <Text className='text-xl font-bold text-gray-900'>Choose Your Role</Text>
         </View>

         {/* content  */}

         <View className='flex-1 px-6 pt-8'>
          <Text className='text-gray-600 text-base mb-8 text-center'> 
            Select how you want to use Queue Manager
          </Text>



           {/* role user card  */}

           <RoleCard 
             title = "I'm a user"
             description = "Join queues , track wait times , and get notified"
             icon = "person-circle"
             iconColor = "#3b82f6"
             isSelected={selectedRole === 'user'}
             onPress={() => setSelectedRole('user')}
             features={[
               'Join multiple queues',
               'Real-time position tracking',
               'Smart notifications',
               'Queue history'
             ]}
           />


           {/* role business card  */}

           <RoleCard 
             title = "I'm a Business"
             description = "Manage queues , serve customers efficiently"
             icon = "business"
             iconColor = "#10b981"
             isSelected={selectedRole === 'business'}
             onPress={() => setSelectedRole('business')}
             features={[
               'Create & manage queues',
               'Customer management',
               'Analytics dashboard',
               'Multi-queue support'
             ]}
           />
         </View>


         {/* continue button  */}

         <View className='px-6 pb-8'>
          <TouchableOpacity className={`rounded-2xl py-5 ${selectedRole ? 'bg-blue-600 active:scale-98' : 'bg-gray-300'}`} onPress={handleContinue}
            disabled={!selectedRole}>
              <Text className={`text-center text-lg font-bold ${selectedRole ? 'text-white' : 'text-gray-500'}`}>
                 Continue
              </Text>
          </TouchableOpacity>
         </View>
       </SafeAreaView>
    );
}


// role card component 

interface RoleCardProps {
   title : string;
   description : string;
   icon : keyof typeof Ionicons.glyphMap;
   iconColor : string;
   isSelected : boolean;
   onPress : () => void;
   features : string[];
}

function RoleCard({ title, description, icon , iconColor , isSelected , onPress , features} : RoleCardProps) {
    return (
        <TouchableOpacity onPress={onPress} className={`mb-6 rounded-3xl p-6 border-2 ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-20 bg-white'
        }`} style={{elevation : isSelected ? 4 : 0}}>

          {/* header  */}

          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center flex-1'>
              <View className={`p-3 rounded-2xl nr-4 ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                <Ionicons name={icon} size={32} color={iconColor}/>
              </View>
              <View className='flex-1'>
                 <Text className='text-xl font-bold text-gray-900 mb-1'>{title}</Text>
                 <Text className='text-sm text-gray-600'>{description}</Text>
              </View>
            </View>


  {/* checkmark  */}

            <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
               isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}>
               {isSelected && (
                 <Ionicons name="checkmark" size={18} color="#fff"/>
               )}
            </View>
          </View>


          {/* features  */}

          <View className='space-y-2'>
            {features.map((feature , index) => (
               <View key={index} className='flex-row items-center'>
                 <Ionicons name="checkmark-circle" size={16} color={isSelected ? iconColor : '#9ca3af'}/>
                 <Text className={`ml-2 text-sm ${
                   isSelected ? 'text-gray-700' : 'text-gray-500'
                 }`}>{feature}</Text>
               </View>
            ))}
          </View>

        </TouchableOpacity>
    )
}

