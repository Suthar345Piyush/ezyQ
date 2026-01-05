import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { UserTabParamList } from "../types/navigation.types";


import HomeScreen from "../screens/user/HomeScreen";
import ExploreScreen from "../screens/user/ExploreScreen";
import HistoryScreen from "../screens/user/HistoryScreen";
import ProfileScreen from "../screens/user/ProfileScreen";


const Tab = createBottomTabNavigator<UserTabParamList>();


export default function BusinessNavigator() {
    
     return (
        <Tab.Navigator screenOptions={{headerShown : false , tabBarActiveTintColor : "#3b82f6" ,
         tabBarInactiveTintColor : "#3b82f6", tabBarStyle : {
           borderTopWidth : 1,
           borderTopColor : '#e5e7ab',
           height : 60,
           paddingBottom : 8,
           paddingTop : 8,
         },
          tabBarLabelStyle : {
             fontSize : 12,
             fontWeight : '600'
          },
          }}>

            <Tab.Screen name="Home" component={HomeScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="stats-chart" size={size} color={color}/>
               ),
            }}/>

            <Tab.Screen name="Explore" component={ExploreScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="people" size={size} color={color}/>
               ),
            }}/>


            <Tab.Screen name="History" component={HistoryScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="bar-chart" size={size} color={color}/>
               ),
            }}/>

            <Tab.Screen name="Profile" component={ProfileScreen} options={{
               tabBarIcon : ({color , size}) => (
                 <Ionicons name="" size={size} color={color}/>
               ),
            }}/>

        </Tab.Navigator>
     );
}