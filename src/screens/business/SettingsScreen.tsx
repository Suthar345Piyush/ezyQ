import { YStack , Text , Button } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/src/stores/authStore";


export default function SettingsScreen() {
    
    const {user , logout} = useAuthStore();

    return (
       <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}}>
        <YStack f={1} jc="center" ai="center" bg="$background" p="$6">
           <Text fontSize="$8" fontWeight="bold" color="$gray12">
             {user?.name || 'Business'}
           </Text>

           <Text color="$gray10">{user?.email}</Text>

           <Button theme="red" onPress={logout} mt="$4">
               Logout
           </Button>
        </YStack>
       </SafeAreaView>
    )


}