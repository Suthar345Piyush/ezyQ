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
          name : user?.name as any,
          email : user?.email as any,
          location : "New Delhi , India" as any,
          phone : "+91 1234567890" as any,
       });


       const [profileImage , setProfileImage] = useState<string | null>(null);
       const [loading , setLoading] = useState(false);


        
   // helper function for taking safe user input (just for text input)  

   //   const handleTextChange = (setter: (value: string) => void) => (value: any) => {
   //    const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
   //    setter(text);
   //  };



       // picture access function 


       const pickImage = async() => {

          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();


          if(status !== 'granted') {
             Alert.alert("Permission Denied", "We need camera roll permissions to change your profile picture.");
             return;
          }


          // getting image/final result of image 

          const result = await ImagePicker.launchImageLibraryAsync({
             mediaTypes : ['images' , 'videos'],
             allowsEditing : true,
             aspect : [1 , 1],
             quality : 0.8,
          });


          if(!result.canceled) {
             setProfileImage(result.assets[0].uri);
          }



          // camera access function 

          const takePhoto = async() => {

               const {status} = await ImagePicker.requestCameraPermissionsAsync();


               if(status !== 'granted') {
                   Alert.alert("Permission Denied" , "We need camera permissions to take a photo");
                   return;
               }



               // if we got permission 


               const result = await ImagePicker.launchCameraAsync({
                  allowsEditing : true,
                  aspect : [1 , 1],
                  quality : 0.8,
               });


               if(!result.canceled){
                  setProfileImage(result.assets[0].uri);
               }
          };



         //  image handle function 


         const handleImagePicker = () => {
              Alert.alert(
                'Change Profile Picture' , 'Choose an option', 
                [
                  {text : 'Take Photo' , onPress : takePhoto},
                  {text : 'Choose from Gallery' , onPress : pickImage},
                  {text : 'Cancel' , style : 'cancel'}
                ]
              )
         };





         // final image saving function 


         const handleSave  = () => {
              setLoading(true); 

              // will do this properly when integrate the api 

              setTimeout(() => {
                 setLoading(false);

                 Alert.alert('Success' , 'Profile Updated successfully!');

                 navigation.goBack();

              } , 1000);
         };




         return (

             <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}} edges={["bottom"]}>
                <ScrollView showsVerticalScrollIndicator={false}>

                   {/* header part  */}

                   <YStack bg="$blue10" px="$6" pt="$6" pb="$8">

                      <XStack ai="center" gap="$3" mb="$2">

                          <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>

                               <Ionicons name="arrow-back" size={24} color='white'/>
                            
                          </Button>

                          <YStack flex={1}>

                            <Text fontSize="$8" fontWeight="bold" color='white'>
                               Edit Profile
                            </Text>

                            <Text fontSize="$3" opacity={0.9} mt="$1" color='white'>Update your information</Text>

                          </YStack>
                      </XStack>
                   </YStack>


                   {/* profile picture  */}

                   <YStack px="$6" mt="$-6" pb="$6">
                      <Card elevate br="$6" bg="white" mb="$4" ai="center">
                        <TouchableOpacity onPress={handleImagePicker}>

                            <YStack>

                               {
                                 profileImage ? (

                                     <Image source={{uri : profileImage}} style={{
                                        width : 120,
                                        height : 120,
                                        borderRadius : 60,
                                        borderWidth : 4,
                                        borderColor : '#3b82f6'
                                     }}/>

                                 ) : (

                                     <Circle size={120} bg="$blue2" borderWidth={4} borderColor="$blue10">
                                       <Text>
                                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                                       </Text>
                                     </Circle>

                                 )
                               }

                               <Circle size={40} bg="$blue10" position="absolute" bottom={0} right={0} borderWidth={3} borderColor="white">

                                 <Ionicons name="camera" size={2} color="white"/>

                               </Circle>

                               <Text fontSize="$4" color="$blue10" fontWeight="600" mt="$3">
                                 Change Photo
                               </Text>

                               <Text fontSize="$2" color="$gray11" ta="center">
                                 Upload a photo to personalize your profile
                               </Text>

                            </YStack>
                        </TouchableOpacity>

                      </Card>


                   {/* editing personal information  */}

                   <Card elevate br="$5" p="$5" bg="white" mb="$4">
                      <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$4">
                         Personal Information
                      </Text>



                      <YStack gap="$4">
                         <YStack gap="$3">

                           <Text fontSize="$3" fontWeight="600" color="$gray11">Full Name</Text>


                           <Input 
                           value={formData.name} onChangeText={(text) => setFormData({...formData , name : text})} 
                           placeholder="Enter your name"
                           borderColor="$gray5"
                           focusStyle={{borderColor : "$blue10"}}
                           size="$4"
                           p="$3"
                           />

                         </YStack>


                         <YStack gap="$2">
                           <Text fontSize="$3" fontWeight="600" color="$gray11">Email Address</Text>


                           <Input placeholder="Enter your email"
                            value={formData.email}
                            borderColor="$gray5" 
                             keyboardType="email-address"  focusStyle={{borderColor : "$blue10"}} size="$4" p="$3" onChangeText={(text) => setFormData({...formData , email : text})} />

                         </YStack>


                         <YStack gap="$2">

                            <Text fontSize="$3" fontWeight="600" color="$gray11">Phone Number</Text>

                            <Input placeholder="Enter your phone"
                            value={formData.phone}
                            borderColor="$gray5" 
                             keyboardType="phone-pad"  focusStyle={{borderColor : "$blue10"}} size="$4" p="$3" onChangeText={(text) => setFormData({...formData , phone : text})} />

                         </YStack>


                         <YStack gap="$3">

                           <Text fontSize="$8" fontWeight="600" color="$gray11">Location</Text>


                           <Input 
                             value={formData.location} 
                             onChangeText={(text) => setFormData({...formData  , location : text})}
                             placeholder="Enter your location"
                             borderColor="$gray5"
                             focusStyle={{borderColor : '$blue10'}}
                             p="$3"
                             size="$4"
                           />
  
                         </YStack>

                      </YStack>
                   </Card>


                   {/* account settings  */}


                   <Card elevate br="$5" p="$5" bg="white" mb="$4">
                      <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">
                         Account Settings 
                      </Text>


                      <YStack  gap="#3">
                        <Button chromeless jc="flex-start" pressStyle={{opacity : 0.6}}>

                           <XStack ai="center" gap="$3" width="100%">

                               <Circle size={40} bg="$orange2">

                                  <Ionicons name="lock-closed" size={20} color="#f97316"/>

                               </Circle>

                               <YStack flex={1}>
                                  <Text fontSize="$4" fontWeight="600" color="$gray12">
                                    Change Password
                                  </Text>

                                  <Text fontSize="$2" color="$gray11" mt="$1">Update your password</Text>
                                  
                               </YStack>

                               <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                           </XStack>
                            
                        </Button>
                      </YStack>

                   </Card>


                   {/* final save button to save all the progress  */}

                   <Button size="$6" bg="$blue10" br="$4" onPress={handleSave} pressStyle={{scale : 0.98}} disabled={loading} opacity={loading ? 0.6 : 1} mb="$3">

                      <XStack ai="center" gap="$2">

                         <Ionicons name="checkmark-circle" size={24} color="white"/>

                         <Text fontSize="$5" fontWeight="600" color="white">{loading ? 'Saving...' : 'Save Changes'}</Text>

                      </XStack>
                   </Button>


                   <Button size="$4" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>
                      
                      <Text fontSize="$4" color="$gray11">Cancel</Text>

                   </Button>


                </YStack>

                </ScrollView>
             </SafeAreaView>

         )


      }
   }