// ---------------------------------history screen code here --------------------------------------------- // 

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Text  , Card , Circle , Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { UserTabScreenProps } from "@/src/types/navigation.types";


type Props = UserTabScreenProps<'History'>;



// dummy data for history section 

const QUEUE_HISTORY = [
  {
    id : '1',
    name : 'Coffee Shop',
    category : 'Restaurant',
    waitTime : 5,
    time : '',
    date : '',
    
    distance : '0.2km',
    rating : 4.7,
    status : 'active',
 },


 {
   id : '2',
   name : 'City Hospital',
   category : 'Healthcare',
   waitTime : 30,
   peopleWaiting : 15,
   distance : '1.5km',
   rating : 4.3,
   status : 'active',
},

{
 id : '3',
 name : 'City Bank',
 category : 'Banking',
 waitTime : 12,
 peopleWaiting : 6,
 distance : '0.8km',
 rating : 4.5,
 status : 'active',
},

{
 id : '4',
 name : 'Government Office',
 category : 'Government',
 waitTime : 45,
 peopleWaiting : 15,
 distance : '1.4km',
 rating : 4.1,
 status : 'active',
},

{
 id : '5',
 name : 'Food Plaza',
 category : 'Restaurant',
 waitTime : 6,
 peopleWaiting : 4,
 distance : '0.9km',
 rating : 4.6,
 status : 'active',
},

{
 id : '6',
 name : 'Mr.Clinic',
 category : 'Healthcare',
 waitTime : 4,
 peopleWaiting : 2,
 distance : '1.2km',
 rating : 4.4,
 status : 'active',
}
]