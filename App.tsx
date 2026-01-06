// app.tsx file  

import { useEffect , useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { TamaguiProvider, Theme } from "tamagui";
import { SafeAreaProvider } from "react-native-safe-area-context";

import tamaguiConfig from "./tamagui.config";
import AppNavigator from "./src/navigation/AppNavigator";
import { databaseService } from "./src/services/database/database.service";
import { useAuthStore } from "./src/stores/authStore";
import { YStack , Text , Spinner } from "tamagui";


export default function App() {

    const [isAppReady , setIsAppReady] = useState(false);
    const [error , setError] = useState<string | null>(null);
    const initialize = useAuthStore(state => state.initialize);


    useEffect(() => {
       initializeApp();
    } , []);


    const initializeApp = async () => {
        try {
           console.log('Initializing App..');

            console.log('Initializing DB...');

            await databaseService.intialize();

            console.log('DB ready');


            console.log('Initializing auth..');

            await initialize();

            console.log('Auth ready');

            setIsAppReady(true);

            console.log('App initialized successfully');
        } 
         catch(error) {
           console.error('App initialization failed:' , error);
           setError(error instanceof Error ? error.message : 'Failed to initialize app');
         }
    };


    // error screen
    
    if(error) {
       return (
          <TamaguiProvider config={tamaguiConfig}>
            <Theme name="light">
               <SafeAreaProvider>
                 <YStack f={1} jc="center" ai="center" bg="$background" px="$6">
                   <YStack bg="$red2" p="$6" bw={2} bc="$red5" maxWidth={400}>
                     <Text color="$red10" fontSize="$8" fontWeight="bold" ta="center" mb="$2">
                       Initialization Error
                     </Text>

                     <Text color="$red11" fontSize="$4" ta="center" mb="$4">
                      {error}
                     </Text>

                     <Text color="$red10" fontSize="$3" ta="center">
                       Please restart the app
                     </Text>
                   </YStack>
                 </YStack>
               </SafeAreaProvider>
            </Theme>
          </TamaguiProvider>
       );
    }


    // loading screen 
 
    if(!isAppReady){
       return (
         <TamaguiProvider config={tamaguiConfig}>
          <Theme name="light">
            <SafeAreaProvider>
                <YStack f={1} jc="center" ai="center" bg="$background">
                  <YStack ai="center" gap="$4">
                    <YStack bg="$blue2" p="$8" br="$12" shadowColor="$shadowColor" shadowRadius={8}>
                      <Spinner size="large" color="$blue10"/>
                    </YStack>
                    <Text color="$blue" fontSize="$6" fontWeight="bold">
                      EzyQ
                    </Text>
                    <Text color="$gray10" fontSize="$3" mt="$2">
                      Loading...
                    </Text>
                  </YStack>
                </YStack>
            </SafeAreaProvider>
          </Theme>
         </TamaguiProvider>
       );
    }


    // main app 

    return (
       <TamaguiProvider config={tamaguiConfig}>
        <Theme name="dark">
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar style="auto"/>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </Theme>
       </TamaguiProvider>
    )






}



