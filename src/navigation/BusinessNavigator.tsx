import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BusinessTabParamList } from "../types/navigation.types";


import DashboardScreen from "../screens/business/DashboardScreen";
import QueuesScreen from "../screens/business/QueuesScreen";
import AnalyticsScreen from "../screens/business/AnalyticsScreen";
import SettingsScreen from "../screens/business/SettingsScreen";


const Tab = createBottomTabNavigator<BusinessTabParamList>();


export default function BusinessNavigator() {
    
     return (
        <Tab.Navigator screenOptions={{headerShown : false , tabBarActiveTintColor : "#3b82f6" ,
         tabBarInactiveTintColor : "#9ca3af", tabBarStyle : {
           borderTopWidth : 1,
           borderTopColor : '#e5e7eb',
           height : 60,
           paddingBottom : 8,
           paddingTop : 8,
         },
          tabBarLabelStyle : {
             fontSize : 12,
             fontWeight : '600'
          },
          }}>

            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="stats-chart" size={size} color={color}/>
               ),
            }}/>

            <Tab.Screen name="Queues" component={QueuesScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="people" size={size} color={color}/>
               ),
            }}/>


            <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="bar-chart" size={size} color={color}/>
               ),
            }}/>

            <Tab.Screen name="Settings" component={SettingsScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="settings" size={size} color={color}/>
               ),
            }}/>

        </Tab.Navigator>
     );
}