import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { BusinessStackParamList, BusinessTabParamList } from "../types/navigation.types";

import DashboardScreen from "../screens/business/DashboardScreen";
import QueuesScreen from "../screens/business/QueuesScreen";
import AnalyticsScreen from "../screens/business/AnalyticsScreen";
import SettingsScreen from "../screens/business/SettingsScreen";
import QueueDetailsScreen from "../screens/business/QueueDetailsScreen";
import CreateQueuesScreen from  "@/src/screens/business/CreateQueueScreen";

const BusinessStack = createNativeStackNavigator<BusinessStackParamList>();
const BusinessTab = createBottomTabNavigator<BusinessTabParamList>();

// Bottom Tab Navigator


function BusinessTabNavigator() {
  return (
    <BusinessTab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#008000",
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
      <BusinessTab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />

      <BusinessTab.Screen 
        name="Queues" 
        component={QueuesScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <BusinessTab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />

      <BusinessTab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </BusinessTab.Navigator>
  );
}



// Main Stack Navigator


export default function BusinessNavigator() {
  return (
    <BusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <BusinessStack.Screen 
        name="BusinessTabs" 
        component={BusinessTabNavigator} 
      />
      <BusinessStack.Screen 
        name="QueueDetails" 
        component={QueueDetailsScreen}
        options={{ headerShown: true, title: "Queue Details" }}
      />
      <BusinessStack.Screen 
        name="CreateQueues" 
        component={CreateQueuesScreen}
        options={{ headerShown: true, title: "Create Queue" }}
      />
    </BusinessStack.Navigator>
  );
}