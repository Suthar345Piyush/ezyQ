// create the login screen for the app 

import { YStack , Text , Button } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";



export default function HomeScreen() {
    return (
       <SafeAreaView style={{flex : 1 , backgroundColor : "black"}}>
        <YStack f={1} jc="center" ai="center" bg="$background" p="$6">
          <Text fontSize="$8" fontWeight="bold" color="$gray12" mb="$4">
             Login Screen
          </Text>

          <Text color="$gray10" ta="center">
             Coming Soon...
          </Text>
        </YStack>
       </SafeAreaView>
    );
}


