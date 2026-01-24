//---------------------------------- settings screen code --------------------------------- //

import { ScrollView , Alert , Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Button , Circle , Separator } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";
import { useAuthStore } from "@/src/stores/authStore";


type Props = BusinessTabScreenProps<'Settings'>;


export default function SettingsScreen({navigation} : Props) {

        const {user , logout} = useAuthStore();

    // some settings state 

        const [settings , setSettings] = useState({
            notifications : true,
            soundAlerts : true,
            autoCallNext : false,
            darkMode : false,
        });


   // handling logout 


        const handleLogout = () => {
           Alert.alert("Logout" , "Are you sure you want to logout?" , 
             [
               {text : "Cancel" , style : "cancel"},
               {text : "Logout" , style: "destructive" , onPress : () => {logout()}}
             ])
        };


        // toogle like functionality on settings

        const toggleSetting = (key : keyof typeof settings) => {
            setSettings(prev => ({...prev , [key]: !prev[key]}));
        };


        // some required options on settings screens 



        const settingsOptions = [
            {
               section : "Notifications",
               items : [
                  {
                     key : "notifications" as const,
                     icon : "notifications",
                     title : "Push Notifications",
                     description : "Receive upadates about your queues",
                     color : "$blue10"
                  },

                  {
                     key : "soundAlerts" as const,
                     icon : "volume-high",
                     title : "Sound Alerts",
                     description : "Play sound when customer joins",
                     color : "$orange10"
                  } 
               ]
            },


            {
               section : "Queue Management",
               items : [
                  {
                     key : "autoCallNext" as const,
                     icon : "play-forward",
                     title : "Auto Call Next",
                     description : "Automatically call next customer",
                     color : "$green10"
                  }
               ]
            },


            {
               section : "Appearance",
               items : [
                 {
                   key : "darkMode" as const,
                   icon : "moon",
                   title : "Dark Mode",
                   description : "Use dark theme",
                   color : "$purple10"
                 }
               ]
            }
        ];


      // some account options - here
      
      const accountOptions = [

          {
             icon : "person",
             title : "Profile Settings",
             color : "$green10",
             onPress : () => Alert.alert("Profile" , "Navigate to profile settings")
          },


          {
             icon : "business",
             title : "Business Information",
             color : "$blue10",
             onPress : () => Alert.alert("Business" , "Navigate to business settings")
          },

          {
            icon : "card",
            title : "Subscription & Billing",
            color : "$orange10",
            onPress : () => Alert.alert("Billing" , "Navigate to billing")
          },

          {
            icon : "shield-checkmark",
            title : "Privacy & Security",
            color : "$purple10",
            onPress : () => Alert.alert("Privacy" , "Navigate to privacy settings")
          }
      ];


      return (
         <SafeAreaView style={{flex : 1 , backgroundColor : "#f8f9fa"}}>
            <ScrollView showsVerticalScrollIndicator={false}>

                 {/* header part  */}

                 <YStack bg="$green10" px="$6" pt="$6" pb="$8">

                   <XStack ai="center" gap="$3" mb="$4">
                      <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>
                        
                        <Ionicons name="arrow-back" size={24} color="white"/>
                      </Button>

                      <YStack flex={1}>
                         <Text color="white" fontSize="$8" fontWeight="bold">Settings</Text>

                         <Text color="white" fontSize="$3" opacity={0.9} mt="$1">Manage your preferences</Text>
                         
                      </YStack>
                   </XStack>



                   {/* business profile section  */}

                   <Card br="$5" p="$4" bg="white">
                     <XStack ai="center" gap="$3">
                       <Circle size={60} bg="$green2">
                         <Text>{user?.name?.charAt(0).toUpperCase() || 'B'}</Text>
                       </Circle>

                       <YStack flex={1}>

                         <Text fontSize="$5" fontWeight="bold" color="$green10">{user?.name || 'Business User'}</Text>

                         <Text fontSize="$3" color="$gray11" mt="$1">{user?.email || 'business@example.com'}</Text>
                       </YStack>

                       <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>

                     </XStack>
                   </Card>
                 </YStack>



   {/* various settings options that we have created  */}
               
               <YStack px="$6" mt="$-4" pb="$6">
                 {
                   settingsOptions.map((section , sectionIndex) => (
                      <YStack key={sectionIndex} mb="$4">

                        <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$3">{section.section}</Text>

                        <Card elevate br="$5" bg="white" overflow="hidden">
                           {
                             section.items.map((item , index) => (
                                
                                 <YStack key={item.key}>

                                   <XStack ai="center" p="$4" jc="space-between">
                                     <XStack ai="center" gap="$3" flex={1}>

                                       <Circle size={40} bg={`${item.color.replace('10' , '2')}`}>

                                         <Ionicons name={item.icon as any} size={20} color={item.color.replace('$' , '#')}/>

                                       </Circle>


                                       <YStack flex={1}>

                                         <Text fontSize="$4" fontWeight='600' color="$gray12">{item.title}</Text>

                                         <Text fontSize="$2" color="$gray11" mt="$1">{item.description}</Text>

                                       </YStack>
                                     </XStack>


                                     <Switch value={settings[item.key]} onValueChange={() => toggleSetting(item.key)} trackColor={{ false : '#d1d5db' , true : '#10b981'}}
                                       thumbColor="white"/>

                                   </XStack>

                                   {index < section.items.length - 1 && (
                                      <Separator mx="$4"/>
                                   )}

                                 </YStack>

                             ))}

                        </Card>

                    </YStack>
                   ))
                 }



                 {/* rendering account options  */}


                 <YStack mb="$4">
                   <Text fontSize='$4' fontWeight="600" color="$gray12" mb="$3">
                    Account
                   </Text>

                   <Card elevate br="$5" bg="white" overflow="hidden">
                     {
                       accountOptions.map((option , index) => (
                            
                            <YStack key={index}> 

                               <Button chromeless onPress={option.onPress} pressStyle={{opacity : 0.6}}>

                                  <XStack ai="center" p="$4" jc="space-between" width="100%">

                                     <XStack ai="center" gap="$3" flex={1}>

                                        <Circle size={40} bg={`${option.color.replace('10' , '2')}`}>

                                           <Ionicons name={option.icon as any} size={20} color={option.color.replace('$' , '#')}/>

                                        </Circle>


                                        <Text fontSize="$4" fontWeight="500" color="$gray12">{option.title}</Text>
                                  
                                     </XStack>

                                     <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                                  </XStack>
                               </Button>

                               {
                                 index < accountOptions.length - 1 && (
                                   <Separator mx="$4"/>
                                 )
                               }

                            </YStack>

                       ))
                     }

                   </Card>
                 </YStack>



                 {/* support & help section at the end  of the screen  */}

                 <YStack mb="$4">
                   <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$3">Support & Help</Text>

                     <Card elevate br="$5" bg="white" overflow="hidden">

                       <Button chromeless pressStyle={{opacity : 0.6}}>

                          <XStack ai="center" p="$4" jc="space-between" width="100%">

                            <XStack ai="center" gap="$3">

                                <Circle size={40} bg="$blue2">
                                   <Ionicons name="help-circle" size={20} color="#3b82f6"/>
                                </Circle>

                                <Text fontSize="$4" fontWeight="500" color="$gray12">Help Center</Text>

                            </XStack>

                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                             
                          </XStack>
                       </Button>


                       <Separator mx="$4"/>


                       <Button chromeless pressStyle={{opacity : 0.6}}>

                          <XStack ai="center" p="$4" jc="space-between" width="100%">

                            <XStack ai="center" gap="$3">

                               <Circle size={40} bg="$purple2">
                                 
                                 <Ionicons name="mail" size={20} color="#a855f7"/>
                               </Circle>

                               <Text fontSize="$4" fontWeight="500" color="$gray12">Contact Support</Text>
                            </XStack>

                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                          </XStack>
                       </Button>

                     </Card>

                 </YStack>



                 {/* some last app information  */}

                 <Card elevate br="$5" p="$4" bg="white" mb="$4" ai="center">

                   <Text fontSize="$3" color="$gray11">Queue Manager v1.0.0</Text>

                    <Text fontSize="$2" color="$gray10" mt="$1">© 2026 Queue Manager. All rights reserved.</Text>

                 </Card>



             {/* business logout button  */}

             <Button size="$5" br="$4" bg="$red10" onPress={handleLogout} pressStyle={{scale : 0.98}} mb="$4">

                <XStack ai="center" gap="$2">

                   <Ionicons name="log-out" size={24} color="white"/>
                   <Text fontSize="$5" fontWeight="600" color="white">Logout</Text>
                </XStack>
             </Button>

        </YStack>


            </ScrollView>
         </SafeAreaView>
      )
     }
