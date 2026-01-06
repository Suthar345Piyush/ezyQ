import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { YStack , XStack , Text , Button , Card} from "tamagui";
import { AuthStackScreenProps } from "@/src/types/navigation.types";
import { UserRole } from "@/src/types";


type Props = AuthStackScreenProps<'RoleSelection'>;


export default function RoleSelectionScreen({navigation} : Props) {
    
    const [selectedRole , setSelectedRole] = useState<UserRole | null>(null);

    const handleContinue = () => {
        if(!selectedRole) {
           alert('Please select a role');
           return;
        };

        navigation.navigate('Login' , {role : selectedRole});
    };


    return (
       <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}}>

            {/* header  */}

            <XStack px="$6" py="$4" ai="center">
              <Button unstyled mr="$4" onPress={() => navigation.goBack()} pressStyle={{opacity : 0.7}}>
                <Ionicons name="arrow-back" size={24} color="#1f2937"/>
              </Button>
              <Text fontSize="$7" fontWeight="bold" color="$gray12">Choose your Role</Text>
            </XStack> 


            {/* content  */}

            <YStack f={1} px="$6" pt="$8">
               <Text color="$gray11" fontSize="$4" mb="$8" ta="center">
                 Select how you want to use Queue Manager
               </Text>

               {/* role user card  */}

               <RoleCard 
                  title = "I'm a user"
                  description = "Join queues , track wait times , and get notified"
                  icon = "person-circle"
                  iconColor="#3b82f6"
                  isSelected={selectedRole === 'user'}
                  onPress={() => setSelectedRole('user')}
                  features={[
                    'Join multiple queues',
                    'Real-time position tracking',
                    'Smart notifications',
                    'Queue history'
                  ]}
               />


               <RoleCard 
                  title = "I'm a Business"
                  description = "Create queues , manage queues , serve customers efficiently"
                  icon = "business"
                  iconColor="#10b981"
                  isSelected={selectedRole === 'business'}
                  onPress={() => setSelectedRole('business')}
                  features={[
                    'Create & manage queues',
                    'Customer management',
                    'Analytics dashboard',
                    'Multi-queue support'
                  ]}
               />
            </YStack>


            {/* continue button  */}

            <YStack px="$6" pb="$8">
              <Button size="$6" br="$6"  bg={selectedRole ? '$blue10' : '$gray5'}
                onPress={handleContinue} disabled={!selectedRole} pressStyle={selectedRole ? {scale : 0.98} : {}} disabledStyle={{opacity : 1}}
                >
                  <Text fontSize="$6" fontWeight="bold" color={selectedRole ? 'white' : '$gray10'}>
                     Continue
                  </Text>
              </Button>
            </YStack>
       </SafeAreaView>
    );



    //role card components 


    interface RoleCardProps {
        title : string;
        description : string;
        icon : keyof typeof Ionicons.glyphMap;
        iconColor : string;
        isSelected : boolean;
        onPress : () => void;
        features : string[];
    }


    function RoleCard({title  , description , icon , iconColor , isSelected , onPress , features} : RoleCardProps) {
          
          return (

              <Card elevate={isSelected} mb="$6" br="$8" p="$6" bw={2} bc={isSelected ? '$blue10' : '$gray5'}
                bg={isSelected ? '$blue2' : 'white'} onPress={onPress} pressStyle={{scale : 0.98}} animation="quick">



                  {/* header  */}

                  <XStack ai="center" jc="space-between" mb="$4">

                    <XStack ai="center" f={1}>
                      <YStack p="$3" br="$6" mr="$4" bg={isSelected ? 'white' : '$gray3'}>
                        <Ionicons name={icon} size={32} color={iconColor}/>
                      </YStack>

                      <YStack f={1}>

                        <Text fontSize="$7" fontWeight="bold" color="$gray12" mb="$1">
                          {title}
                        </Text>

                        <Text fontSize="$3" color="$gray11">
                          {description}
                        </Text>
                      </YStack>
                    </XStack>



                    {/* checkmark  */}

                    <YStack w={28} h={28} br="$12" bw={2} bc={isSelected ? '$blue10' : '$gray6'} 
                      bg={isSelected ? '$blue10' : 'transparent'} ai="center" jc="center">

                         {isSelected && (
                           <Ionicons name="checkmark" size={18} color="#fff"/>
                         )}

                    </YStack>
                  </XStack>



                  {/* features  */}


                  <YStack gap="$2">
                    {features.map((feature , index) => (
                       <XStack key={index} ai="center">
                        <Ionicons name="checkmark-circle" size={16} color={isSelected ? iconColor : '#9ca3af'}/>

                        <Text ml="$2" fontSize="$3" color={isSelected ? '$gray11' : '$gray10'}>
                          {feature}
                        </Text>
                       </XStack>
                    ))}
                  </YStack>
              </Card>
          );
    }


    













}