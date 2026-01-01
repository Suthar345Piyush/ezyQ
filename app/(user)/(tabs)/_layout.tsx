import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function UserTabLayout() {
   return (
      <Tabs screenOptions={{
         headerShown : false,
         tabBarActiveTintColor : '#3b82f6',
      }}>

        <Tabs.Screen name="index" options={{
          title : 'Home',
          tabBarIcon : ({color , size}) => {
             <Ionicons name="home" color={color} size={size}/>
          }
        }}/>
      </Tabs>
   );
}

