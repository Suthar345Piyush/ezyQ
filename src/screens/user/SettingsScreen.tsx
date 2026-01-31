// settings screen (USER)

import { UserStackScreenProps } from "@/src/types/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Switch, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Circle, Separator, Text, Theme, XStack, YStack } from "tamagui";


type Props = UserStackScreenProps<'Settings'>;


export default function UserSettingsScreen({navigation} : Props) {

     const systemColorScheme = useColorScheme();


     const [settings , setSettings] = useState({
         pushNotifications : true,
         queueAlerts : true,
         emailNotifications : false,
         smsAlerts : true,
         darkMode : systemColorScheme === 'dark',
         soundEffects : true,
         vibration : true,
     });


     useEffect(() => {
        setSettings(prev => ({...prev , darkMode : systemColorScheme === 'dark'}));
     } , [systemColorScheme]);



     const toggleSetting = (key : keyof typeof settings) => {
        setSettings(prev => ({...prev , [key]: !prev[key]}));
     };



     const settingsOptions = [
        {
           section : "Notifications",
           items : [

             {
               key : "pushNotifications" as const,
               icon : "notifications",
               title : "Push Notifications",
               description : "Receive queue updates",
               color : "#3b82f6"
             },

             {
               key : "queueAlerts" as const,
               icon : "alarm",
               title : "Queue Alerts",
               description : "Alerts when your turn is near",
               color : "#f97316"
             },

             {
               key : "emailNotifications" as const,
               icon : "mail",
               title : "Email Notifications",
               description : "Receive updates via email",
               color : "#8b5cf6"
             },


             {
               key : "smsAlerts" as const,
               icon : "chatbox",
               title : "SMS Alerts",
               description : "Text message notifications",
               color :  "#10b981"
             }
           ]
        },

        {
          section: "Preferences",
          items: [
            {
              key: "darkMode" as const,
              icon: "moon",
              title: "Dark Mode",
              description: "Use dark theme",
              color: "#6366f1"
            },
            {
              key: "soundEffects" as const,
              icon: "volume-high",
              title: "Sound Effects",
              description: "Play notification sounds",
              color: "#f59e0b"
            },
            {
              key: "vibration" as const,
              icon: "phone-portrait",
              title: "Vibration",
              description: "Vibrate on notifications",
              color: "#ec4899"
            }
          ]
        }
     ];



       return (

           <Theme name={settings.darkMode ? 'dark' : 'light'}>

              <SafeAreaView style={{flex : 1 , backgroundColor : settings.darkMode ? '#1a1a1a' : 
            '#f8f9fa'}} edges={["bottom"]}>

                 <ScrollView showsVerticalScrollIndicator={false}>

                   {/* header part  */}

                   <YStack bg="$blue10" px="$6" pt="$6" pb="$8">
                     <XStack ai="center" gap="$3" mb="$2">

                       <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>

                          <Ionicons name="arrow-back" size={24} color="white"/>

                       </Button>

                       <YStack flex={1}>

                         <Text color="white" fontSize="$8" fontWeight="bold">
                           Settings
                         </Text>

                         <Text color='white' fontSize="$3" opacity={0.9} mt="$1">Manage your preferences</Text>
                       </YStack> 
                       
                     </XStack>
                   </YStack>



                   {/* settings parts  */}


                   <YStack mt="$-4" pb="$6" px="$6">

                     {settingsOptions.map((section , sectionIndex) => (

                        <YStack key={sectionIndex} mb="$4">

                           <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$3">
                             {section.section}
                           </Text>


                           <Card elevate br="$5" bg={settings.darkMode ? '$gray3' : 'white'} overflow="hidden">

                             {section.items.map((item , itemIndex) => (

                                <YStack key={item.key}>
                                   <XStack ai="center" p="$4" jc='space-between'>
                                     <XStack ai="center" gap="$3" flex={1}>
                                       <Circle size={40} bg={settings.darkMode ? '$gray4' : '$gray2'}>

                                        <Ionicons name={item.icon as any}
                                          size={20} color={item.color}/>

                                       </Circle>

                                       <YStack flex={1}>

                                         <Text fontSize="$4" fontWeight="600" color="$gray12">{item.title}</Text>

                                         <Text fontSize="$2" color="$gray11" mt="$1">{item.description}</Text>

                                       </YStack>
                                     </XStack>


                                     <Switch value={settings[item.key]} onValueChange={() => toggleSetting(item.key)} trackColor={{false : '#d1d5db' , true : '#3b82f6'}} thumbColor="white"/>

                                   </XStack>

                                   {itemIndex  < section.items.length - 1 && (
                                     <Separator mx="$4"/>
                                   )}

                                </YStack>

                             ))}

                           </Card>


                           </YStack>
                     ))}


                     {/* other settings  */}

                     <YStack mb="$4">

                       <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$3">Other</Text>

                       <Card elevate br="$5" bg={settings.darkMode ? '$gray3' : 'white'}>

                         <Button chromeless pressStyle={{opacity : 0.6}}>
                           <XStack ai="center" p="$4" jc="space-between" width="100%">
                            <XStack ai="center" gap="$3">

                              <Circle size={40} bg={settings.darkMode ? '$gray4' : '$gray2'}>

                                <Ionicons name="language" size={20} color="#10b981"/>
                                 
                              </Circle>

                              <YStack>
                                <Text fontSize="$4" fontWeight="600" color="$gray12">
                                  Language
                                </Text>

                                <Text fontSize="$2" mt="$1" color="$gray11">
                                      English (US)                                  
                                </Text>
                              </YStack>

                            </XStack>

                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                  
                           </XStack>
                         </Button>

                         <Separator mx="$4" />



                         <Button chromeless pressStyle={{opacity : 0.6}}>

                          <XStack ai="center" p="$4" jc="space-between" width="100%">
                             <XStack ai="center" gap="$3">

                               <Circle size={40} bg={settings.darkMode ? '$gray4' : '$gray2'}>

                                 <Ionicons name="location" size={20} color="#f97316"/>

                               </Circle>

                               <YStack>
                                <Text fontSize="$4" fontWeight="600" color="$gray12">
                                  Location Services
                                </Text>

                                <Text fontSize="$2" color="$gray11" mt="$1">
                                  Manage location access
                                </Text>
                               </YStack>
                             </XStack>

                             <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                          </XStack>
                        </Button>

                        <Separator mx="$4"/>




                        <Button chromeless pressStyle={{opacity : 0.6}}>

                        <XStack ai="center" p="$4" jc="space-between" width="100%">
                             <XStack ai="center" gap="$3">

                               <Circle size={40} bg={settings.darkMode ? '$gray4' : '$gray2'}>

                                 <Ionicons name="shield-checkmark" size={20} color="#8b5cf6"/>

                               </Circle>

                               <YStack>
                                <Text fontSize="$4" fontWeight="600" color="$gray12">
                                  Privacy & Security
                                </Text>

                                <Text fontSize="$2" color="$gray11" mt="$1">
                                  Control your data
                                </Text>
                               </YStack>
                             </XStack>

                             <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                          </XStack>
                           
                        </Button>

                       </Card>

                     </YStack>



                     {/* data and storage part  */}

                     <YStack mb="$4">

                       <Text fontSize="$4" fontWeight="600" color="$gray12" mb="$3">
                        Data & Storage
                       </Text>


                       <Card elevate br="$5" bg={settings.darkMode ? '$gray3' : 'white'} overflow="hidden">

                        <Button chromeless pressStyle={{opacity : 0.6}}>
                           <XStack ai="center" p="$4" jc="space-between" width="100%">

                            <XStack ai="center" gap="$3">

                               <Circle size={40} bg={settings.darkMode ? '$gray4' : '$gray2'}>
                                <Ionicons name="download" size={20} color="3b82f6"/>

                               </Circle>

                               <Text fontSize="$4" fontWeight="600" color="$gray12">Download Queue Data</Text>

                            </XStack>

                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                             
                           </XStack>
                        </Button>


                        <Separator mx="$4"/>


                        <Button chromeless pressStyle={{opacity : 0.6}}>

                           <XStack ai="center" p="$4" jc="space-between" width="100%">

                             <XStack ai="center" gap="$3">

                               <Circle size={40} bg="$red2">

                                 <Ionicons name="trash" size={20} color="#ef4444"/>

                               </Circle>

                               <Text fontSize="$4" fontWeight="600" color="$red11">Clear Cache</Text>

                             </XStack>

                             <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                           </XStack>
                        </Button>
                         
                       </Card>

                     </YStack>

                   </YStack>

                 </ScrollView>
              </SafeAreaView>
           </Theme>

       )

}