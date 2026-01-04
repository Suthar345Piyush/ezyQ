//app navigator code 

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/authStore";
import { RootStackParamList } from "../types/navigation.types";


import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";
import BusinessNavigator from "./BusinessNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {

    const {isAuthenticated , user} = useAuthStore();

    return (
        <Stack.Navigator>
           {isAuthenticated ? (
             <Stack.Screen name="Auth" component={AuthNavigator}/>
           ) : user?.role === 'business' ? (
             <Stack.Screen name="Business" component={BusinessNavigator}/>
           ) : (
             <Stack.Screen name="User" component={UserNavigator}/>
           )}
        </Stack.Navigator>
    );
}




