import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function BusinessTabLayout() {
   return (
      <Tabs screenOptions={{
         headerShown : false,
         tabBarActiveTintColor : '#3b82f6',
      }}>

        <Tabs.Screen name="dashboard" options={{
          title : 'Dashboard',
          tabBarIcon : ({color , size}) => {
             <Ionicons name="stats-chart" color={color} size={size}/>
          }
        }}/>
      </Tabs>
   );
}


