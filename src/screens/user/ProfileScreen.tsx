
// profile screen code 

import { ScrollView , Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack , YStack , Text , Card , Button , Circle , Separator } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { UserTabScreenProps } from "@/src/types/navigation.types";
import { useAuthStore } from "@/src/stores/authStore";
import EditProfileScreen from "@/src/screens/user/EditProfileScreen";



type Props = UserTabScreenProps<'Profile'>;


  // menu items array 

const MENU_ITEMS = [

   {
     id : '1',
     title : 'Edit Profile',
     icon : 'person-outline',
     color : '$blue10',
     action : 'edit_profile'
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
    action : 'settings'
  },

  {
    id : '6',
    title : 'Help & Support',
    icon : 'help-circle-outline',
    color : '$orange10',
    action : 'help'
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
    
     const {user , logout} = useAuthStore();

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

     const handleMenuPress = (action : string) => {
         
         switch(action) {

            case 'edit_profile':
                Alert.alert('Notifications' , 'Feature coming soon');
                break;
            
            case 'notifications':
               Alert.alert('Notifications' , 'Feature coming soon');
               break;

            case 'payment':
               Alert.alert('Payment' , 'Feature coming soon');
               break;

            case 'favorites':
               Alert.alert('Favorites' , 'Feature coming soon');
               break;

            case 'settings':
               Alert.alert('Settings' , 'Feature coming soon');
               break;
            
            case 'help':
               Alert.alert('Help & Support' , 'Feature coming soon');
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

                    <Circle size={100} bg="$blue2" mb="$4">

                      <Text fontSize="$10" fontWeight="bold" color="$blue10">{user?.name.charAt(0).toUpperCase() || 'U'}</Text>

                    </Circle>

                    <Text fontSize="$7" fontWeight="bold" color="$gray12" mb="$1">{user?.name || 'Guest User'}</Text>
 
                    <Text fontSize="$4" color="$gray11">{user?.email || 'guest@ezyq.com'}</Text>
                  </YStack>


                   {/* all user's own queue record here  (dummy data) */}

                   <XStack gap="$3">

                    {/* joined queue   */}

                     <YStack flex={1} ai="center" py="$3" bg="$blue2" br="$4">
                       <Text fontSize="$7" fontWeight="bold" color="$blue11">25</Text>
                       <Text fontSize="$2" color="$blue11" fontWeight="600">Queues Joined</Text>
                     </YStack>

                     {/* completed queue  */}

                     <YStack flex={1} ai="center" py="$3" bg="$blue2" br="$4">
                       <Text fontSize="$7" fontWeight="bold" color="$blue11">15</Text>
                       <Text fontSize="$2" color="$blue11" fontWeight="600">Completed</Text>
                     </YStack>


                      {/* user's average rating   */}

                      <YStack flex={1} ai="center" py="$3" bg="$blue2" br="$4">
                        <Text fontSize="$7" fontWeight="bold" color="$blue11">4.8</Text>
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
                        <Button unstyled onPress={() => handleMenuPress(item.action)} pressStyle={{bg : '$gray2'}}>

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







