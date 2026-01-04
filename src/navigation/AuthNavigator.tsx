import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/navigation.types";

import WelcomeScreen from "../screens/auth/WelcomeScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";


const Stack = createNativeStackNavigator<AuthStackParamList>();


export default function AuthNavigator() {
   return (
      <Stack.Navigator screenOptions={{ headerShown : false , animation : 'slide_from_right'}}>

        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen}/>

      </Stack.Navigator>
   )
}

