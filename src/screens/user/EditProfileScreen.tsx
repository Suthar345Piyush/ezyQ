// EditProfileScreen.tsx
import { useAuthStore } from "@/src/stores/authStore";
import { UserStackScreenProps } from "@/src/types/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Circle, Input, Text, XStack, YStack } from "tamagui";

type Props = UserStackScreenProps<'EditProfile'>;




export default function EditProfileScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+91 98765 43210",
    location: "New Delhi, India"
  });
  



  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture');
      return;
    }




    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };


     // setter function to handle clean user inputs on search bar or at any other place 

     const handleTextChange = (setter : (value : string) => void) => (value : any) => {
        const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || 
         '');
         setter(text);
     }




  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take a photo');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };




  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };




  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    }, 1000);
  };




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>


        {/* Header part of the screen */}


        <YStack bg="$blue10" px="$6" pt="$6" pb="$8">
          <XStack ai="center" gap="$3" mb="$2">
            <Button 
              size="$3" 
              chromeless 
              onPress={() => navigation.goBack()}
              pressStyle={{ opacity: 0.6 }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Button>
            <YStack flex={1}>
              <Text color="white" fontSize="$8" fontWeight="bold">
                Edit Profile
              </Text>
              <Text color="white" fontSize="$3" opacity={0.9} mt="$1">
                Update your information
              </Text>
            </YStack>
          </XStack>
        </YStack>




        <YStack px="$6" mt="$-6" pb="$6">


          {/* Profile Picture */}



          <Card elevate br="$6" p="$5" bg="white" mb="$4" ai="center">
            <TouchableOpacity onPress={handleImagePicker}>
              <YStack ai="center" gap="$3">

                {profileImage ? (
                  <Image 
                    source={{ uri: profileImage }} 
                    style={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: 60,
                      borderWidth: 4,
                      borderColor: '#3b82f6'
                    }} 
                  />
                ) : (
                  <Circle size={120} bg="$blue2" borderWidth={4} borderColor="$blue10">
                    <Text fontSize="$10" fontWeight="bold" color="$blue10">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </Circle>
                )}



                
                <Circle 
                  size={40} 
                  bg="$blue10" 
                  position="absolute" 
                  bottom={0} 
                  right={0}
                  borderWidth={3}
                  borderColor="white"
                >


                  <Ionicons name="camera" size={20} color="white" />
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




          {/* Personal Information section */}



          <Card elevate br="$5" p="$5" bg="white" mb="$4">
            <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$4">
              Personal Information
            </Text>



            <YStack gap="$4">
              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600" color="$gray11">
                  Full Name
                </Text>
                <Input
                  value={formData.name}

                  onChangeText={handleTextChange((text) => setFormData({...formData , name : text}))}

                  placeholder="Enter your name"
                  borderColor="$gray5"
                  focusStyle={{ borderColor: "$blue10" }}
                  size="$4"
                  p="$3"
                />
              </YStack>




              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600" color="$gray11">
                  Email Address
                </Text>
                <Input
                  value={formData.email}

                  onChangeText={handleTextChange((text) => setFormData({...formData , email : text}))}

                  placeholder="Enter your email"
                  keyboardType="email-address"
                  borderColor="$gray5"
                  focusStyle={{ borderColor: "$blue10" }}
                  size="$4"
                  p="$3"
                />
              </YStack>



              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600" color="$gray11">
                  Phone Number
                </Text>
                <Input
                  value={formData.phone}

                  onChangeText={handleTextChange((text) => setFormData({...formData , phone : text}))}

                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                  borderColor="$gray5"
                  focusStyle={{ borderColor: "$blue10" }}
                  size="$4"
                  p="$3"
                />
              </YStack>


              <YStack gap="$2">
                <Text fontSize="$3" fontWeight="600" color="$gray11">
                  Location
                </Text>
                <Input
                  value={formData.location}

                  onChangeText={handleTextChange((text) => setFormData({...formData , location : text}))}
                  
                  placeholder="Enter your location"
                  borderColor="$gray5"
                  focusStyle={{ borderColor: "$blue10" }}
                  size="$4"
                  p="$3"
                />
              </YStack>
            </YStack>
          </Card>



          {/* Account Settings section */}



          <Card elevate br="$5" p="$5" bg="white" mb="$4">
            <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">
              Account Settings
            </Text>

            <YStack gap="$3">
              <Button 
                chromeless 
                jc="flex-start"
                pressStyle={{ opacity: 0.6 }}
              >
                <XStack ai="center" gap="$3" width="100%">
                  <Circle size={40} bg="$orange2">
                    <Ionicons name="lock-closed" size={20} color="#f97316" />
                  </Circle>
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="600" color="$gray12">
                      Change Password
                    </Text>
                    <Text fontSize="$2" color="$gray11" mt="$1">
                      Update your password
                    </Text>
                  </YStack>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </XStack>
              </Button>
            </YStack>
          </Card>



          {/* Save Button part */}



          <Button 
            size="$5" 
            bg="$blue10" 
            br="$4"
            onPress={handleSave}
            pressStyle={{ scale: 0.98 }}
            disabled={loading}
            opacity={loading ? 0.6 : 1}
            mb="$3"
          >


            <XStack ai="center" gap="$2">
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text fontSize="$5" fontWeight="600" color="white">
                {loading ? 'Saving...' : 'Save Changes'}
              </Text>
            </XStack>
          </Button>




          <Button 
            size="$4" 
            chromeless 
            onPress={() => navigation.goBack()}
            pressStyle={{ opacity: 0.6 }}
          >
            <Text fontSize="$4" color="$gray11">Cancel</Text>
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>



  );
}