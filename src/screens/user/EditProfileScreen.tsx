// edit profile screen 

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView , Alert , Image , TouchableOpacity } from "react-native";
import { YStack , XStack , Card , Text , Button , Circle , Input } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuthStore } from "@/src/stores/authStore";
import { UserStackScreenProps } from "@/src/types/navigation.types";
import * as ImagePicker from 'expo-image-picker';



// calling user stack props for the screen rendering  

type Props = UserStackScreenProps<'EditProfile'>;



export default function EditProfileScreen( {navigation} : Props) {
       
       // taking user from auth store for editing  

       const {user} = useAuthStore();

       const [formData , setFormData] = useState({
          name : user?.name || "",
          email : user?.email || "",
          password : "New Delhi , India",
          location : "+91 1234567890",
       });


       const [profileImage , setProfileImage] = useState<string | null>(null);
       const [loading , setLoading] = useState(false);



       // image pickup function 


       const pickImage = async() => {

          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();


          if(status !== 'granted') {
             Alert.alert("Permission Denied", "We need camera roll permissions to change your profile picture.");
             return;
          }


          // getting image/final image  

          const result = await ImagePicker.launchImageLibraryAsync({
             mediaTypes : ['images' , 'videos'],
             allowsEditing : true,
             aspect : [1 , 1],
             quality : 0.8,
          });


          if(!result.canceled) {
             setProfileImage(result.assets[0].uri);
          }


          


          
       }









} 