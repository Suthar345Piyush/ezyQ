
// profile screen code 

import { ScrollView , Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack , YStack , Text , Card , Button , Circle , Separator } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { UserTabScreenProps } from "@/src/types/navigation.types";
import { useAuthStore } from "@/src/stores/authStore";



type Props = UserTabScreenProps<'Profile'>;


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
};







