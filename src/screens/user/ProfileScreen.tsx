
// profile screen code 

import UserRepository from "@/src/services/database/repositories/UserRepository";
import { useAuthStore } from "@/src/stores/authStore";
import { UserTabScreenProps } from "@/src/types/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Circle, Separator, Text, XStack, YStack } from "tamagui";



type Props = UserTabScreenProps<'Profile'>;


  // menu items array 

const MENU_ITEMS = [

   {
     id : '1',
     title : 'Edit Profile',
     icon : 'person-outline',
     color : '$blue10',
     action : 'edit_profile',
     screen : 'EditProfile'
   },

   {
    id : '2',
    title : 'Notifications',
    icon : 'notifications-outline',
    color : '$purple10',
    action : 'notifications'
  },

  {
    id : '3',
    title : 'Payment Methods',
    icon : 'card-outline',
    color : '$green10',
    action : 'payment'
  },

  {
    id : '4',
    title : 'Favorites',
    icon : 'heart-outline',
    color : '$red10',
    action : 'favorites'
  },

  {
    id : '5',
    title : 'Settings',
    icon : 'settings-outline',
    color : '$gray11',
    action : 'settings',
    screen : 'Settings',
  },

  {
    id : '6',
    title : 'Help & Support',
    icon : 'help-circle-outline',
    color : '$orange10',
    action : 'help',
    screen : 'HelpSupport'
  },

  {
    id : '7',
    title : 'About',
    icon : 'information-circle-outline',
    color : '$blue10',
    action : 'about',
  },

];




// main function for the profile screen 

export default function ProfileScreen({navigation} : Props) {
    
     const {user , logout , refreshUser} = useAuthStore();
     const [profileImage , setProfileImage] = useState<string | null>(user?.avatar_url || null);
     const [stats , setStats] = useState({
        queuesJoined : 0,
        completed : 0,
        avgRating : 0,
     });


     useEffect(() => {
        loadUserStats();
     } , [user?.id]);

     
  // user queue stats function 

     const loadUserStats = async() => {
         if(user?.id) return;


         try {
           const userStats = await UserRepository.getUserStats(user?.id as any);

           setStats({
             queuesJoined : userStats.total_queue_joined,
             completed : userStats.total_queue_joined,
             avgRating : 4.8,
           });
         } 
          catch(error) {
             console.error('Error loading stats:' , error);
          }
     };


     // handle image picker function 

     const handleImagePicker = () => {
        Alert.alert(
           'Change Profile Picture',
           'Choose an option',

           [
             {
               text : 'Take Photo',
               onPress : async () => {
                   const {status} = await ImagePicker.requestCameraPermissionsAsync();


                   if(status !== 'granted') {
                      Alert.alert('Permission Denied' , 'Camera permission is required');
                      return;
                   }


                   const result = await ImagePicker.launchCameraAsync({
                      allowsEditing : true,
                      aspect : [1 , 1],
                      quality : 0.8
                   });

                   if(!result.canceled){
                      await saveProfileImage(result.assets[0].uri);
                   }
               }
             },


             {
               text : 'Choose from Gallery',
               onPress : async () => {
                  const {status} = await ImagePicker.requestCameraPermissionsAsync();

                  if(status !== 'granted') {
                     Alert.alert('Permission Denied' , 'Gallery permission is required');
                     return;
                  }


                  const result = await ImagePicker.launchImageLibraryAsync({
                     mediaTypes : ['images' , 'videos'],
                     allowsEditing : true,
                     aspect : [1 , 1],
                     quality : 0.8
                  });

                  if(!result.canceled) {
                     await saveProfileImage(result.assets[0].uri);
                  }
               }
             },

             {
              text : 'Cancel',
              style : 'cancel'
             }
           ]
        );
     };


     // profile picture saving function 

     const saveProfileImage = async(uri : string) => {

          try {
             if(user?.id) {

                await UserRepository.update(user.id , {avatar_url : uri});
                
                await refreshUser();
                Alert.alert('Success' , 'Profile picture updated successfully!');
              
             }
             
          } catch(error) {
             console.error('Error updating profile picture:' , error);
             Alert.alert('Error' , 'Failed to update profile picture');
          }
     };

     


     // user logout function 
     
     const handleLogout = () => {
        Alert.alert('Logout' , 'Are you sure you want to logout?' , [
          {
            text : 'Cancel',
            style : 'cancel',
          },

          {
             text : 'Logout',
             style : 'destructive',

             onPress : async () => {
               await logout();
             }
          }
        ] , {cancelable : true})
     };



     // selecting menu items  

     const handleMenuPress = (action : string , screen? : string) => {

        if(screen) {
           navigation.navigate(screen as any);
           return;
        }
         

         switch(action) {

            case 'notifications':
               Alert.alert('Notifications' , 'Feature coming soon');
               break;

            case 'payment':
               Alert.alert('Payment' , 'Feature coming soon');
               break;

            case 'favorites':
               Alert.alert('Favorites' , 'Feature coming soon');
               break;
            
            case 'about':
               Alert.alert('About EzyQ' , 'Version 1.0.0\n\nQueue Management Made Easy');
               break;
         }
     };


     return (

        <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}} edges={['bottom']}>
           <ScrollView showsVerticalScrollIndicator={false}>

              {/* header part  */}


              <YStack bg="$blue10" px="$6" pt="$6" pb="$10">
                <Text fontSize="$9" fontWeight="bold" color="white" mb="$6">Profile</Text>


                {/* profile card  */}

                <Card elevate br="$6" p="$5" bg="white">

                  <YStack ai="center" mb="$4">

                    <TouchableOpacity onPress={handleImagePicker}>
                      <YStack ai="center" position="relative">

                         {
                           profileImage ? (
                               <Image source={{uri : profileImage}}
                                style={{
                                   width : 100,
                                   height : 100,
                                   borderRadius : 50,
                                   marginBottom : 16
                                }}
                               />
                           ) : (

                              <Circle size={100} bg="$blue2" mb="$4">
                                 <Text fontSize="$10" fontWeight="bold" color="$blue10">
                                   {user?.name?.charAt(0).toUpperCase() || 'U'}
                                 </Text>
                              </Circle>

                           )}


                           <Circle size={36} bg="$blue10" position="absolute" bottom={12} right={0} borderWidth={3} borderColor="white">

                              <Ionicons name="camera" size={18} color="white" />
                           </Circle>

                      </YStack>
                    </TouchableOpacity>

                    

                    <Text fontSize="$7" fontWeight="bold" color="$gray12" mb="$1">{user?.name || 'Guest User'}</Text>
 
                    <Text fontSize="$4" color="$gray11">{user?.email || 'guest@ezyq.com'}</Text>
                  </YStack>


                   {/* all user's own queue record here  (dummy data) */}

                   <XStack gap="$3">

                    {/* joined queue   */}

                     <YStack flex={1} ai="center" py="$3" bg="$blue2" br="$4">
                       <Text fontSize="$7" fontWeight="bold" color="$blue11">{stats.queuesJoined}</Text>
                       <Text fontSize="$2" color="$blue11" fontWeight="600">Queues Joined</Text>
                     </YStack>

                     {/* completed queue  */}

                     <YStack flex={1} ai="center" py="$3" bg="$blue2" br="$4">
                       <Text fontSize="$7" fontWeight="bold" color="$blue11">{stats.completed}</Text>
                       <Text fontSize="$2" color="$blue11" fontWeight="600">Completed</Text>
                     </YStack>


                      {/* user's average rating   */}

                      <YStack flex={1} ai="center" py="$3" bg="$blue2" br="$4">
                        <Text fontSize="$7" fontWeight="bold" color="$blue11">{stats.avgRating}</Text>
                        <Text fontSize="$2" color="$blue11" fontWeight="600">Avg Rating</Text>
                      </YStack>

                   </XStack>

                </Card>

              </YStack>


              {/* rendering menu items   */}


              <YStack px="$6" mt="$-4" pb="$6">
                <Card elevate br="$6" bg="white" overflow="hidden">

                  {MENU_ITEMS.map((item , index) => (

                       <YStack key={item.id}>
                        <Button unstyled onPress={() => handleMenuPress(item.action , item.screen)} pressStyle={{bg : '$gray2'}}>

                          <XStack ai="center" p="$4" gap="$3">

                            <Circle size={44} bg="$gray2">

                               <Ionicons name={item.icon as any} size={22} color={item.color.replace('$' , '#')}/>

                            </Circle>

                            <YStack flex={1}>
                               <Text fontSize="$4" fontWeight="600" color="$gray12">{item.title}</Text>
                            </YStack>

                             <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                          </XStack>
                        </Button>

                        {index < MENU_ITEMS.length - 1 && (
                           <Separator mx="$4" borderColor="$gray4"/>
                        )}
                  </YStack>
                  ))}
                </Card>


                {/* logout button  */}

                <Button  ml="$1" size="$5" bg="$red10" br="$6" onPress={handleLogout} pressStyle={{scale : 0.98 , bg : '$red11'}} mt="$5">

                  <XStack ai="center" gap="$2">

                    <Ionicons name="log-out-outline" size={20} color="white"/>

                    <Text fontSize="$4" color="white" fontWeight="bold">Logout</Text>
                  </XStack>
                </Button>



                {/* some info about the app  */}

                <YStack ai="center" mt="$6" gap="$2">

                  <Text fontSize="$2" color="$gray10">
                    EzyQ - Queue Management System
                  </Text>

                  <Text fontSize="$2" color="$gray9">Version 1.0.0</Text>

                  <XStack gap="$4" mt="$3"> 

                    <Button chromeless size="$2">
                      <Text fontSize="$2" color="$blue10" fontWeight="600">Privacy Policy</Text>
                    </Button>

                    <Text color="$gray9">•</Text>

                    <Button chromeless size="$2">
                      <Text fontSize="$2" color="$blue10" fontWeight="600">Terms of Service</Text>

                    </Button>
                  </XStack>
                </YStack>
              </YStack>

           </ScrollView>
        </SafeAreaView>

     )




};







function refreshUser() {
   throw new Error("Function not implemented.");
}

