import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserStackParamList, UserTabParamList } from "../types/navigation.types";

import ExploreScreen from "../screens/user/ExploreScreen";
import HistoryScreen from "../screens/user/HistoryScreen";
import HomeScreen from "../screens/user/HomeScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import QueueDetailsScreen from "../screens/user/QueueDetailsScreen";

import EditProfileScreen from "../screens/user/EditProfileScreen";
import FindNearbyScreen from "../screens/user/FindNearbyScreen";
import HelpSupportScreen from "../screens/user/HelpSupportScreen";
import JoinQueueScreen from "../screens/user/JoinQueueScreen";
import ScanQRScreen from "../screens/user/ScanQRScreen";
import UserSettingsScreen from "../screens/user/SettingsScreen";





const UserStack = createNativeStackNavigator<UserStackParamList>();
const UserTab = createBottomTabNavigator<UserTabParamList>();



// Bottom Tab Navigator

function UserTabNavigator() {
  return (
    <UserTab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        },
      }}
    >
      <UserTab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <UserTab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />

      <UserTab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />

      <UserTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </UserTab.Navigator>
  );
}




// Main Stack Navigator


export default function UserNavigator() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen 
        name="UserTabs" 
        component={UserTabNavigator} 
      />
      <UserStack.Screen 
        name="QueueDetails" 
        component={QueueDetailsScreen}
        options={{ headerShown: true, title: "Queue Details" }}
      />
      <UserStack.Screen 
        name="JoinQueue" 
        component={JoinQueueScreen}
        options={{ headerShown: true, title: "Join Queue" }}
      />


     <UserStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ headerShown: true, title: "Edit Profile" }}
      />


     <UserStack.Screen 
        name="Settings" 
        component={UserSettingsScreen}
        options={{ headerShown: true, title: "Join Queue" }}
      />


     <UserStack.Screen 
        name="HelpSupport" 
        component={HelpSupportScreen}
        options={{ headerShown: true, title: "Join Queue" }}
      />

     <UserStack.Screen 
        name="FindNearby" 
        component={FindNearbyScreen}
        options={{ headerShown: true, title: "Join Queue" }}
      />


     <UserStack.Screen 
        name="ScanQR" 
        component={ScanQRScreen}
        options={{ headerShown: true, title: "Join Queue" }}
      />  




    </UserStack.Navigator>




  );
}