// join queue screen for user section 

import { ScrollView , Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Button , Circle , Input , TextArea } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { UserStackScreenProps } from "@/src/types/navigation.types";


type Props = UserStackScreenProps<'JoinQueue'>;


export default function JoinQueueScreen({navigation , route} : Props) {


     const {queueId} = route.params;
     const [partySize , setPartySize] = useState("1");
     const [notes , setNotes] = useState("");
     const [loading , setLoading] = useState(false);


     // testing queue data 

     const queueData = {
       id : queueId,
       name : "Starbucks - Connaught Place",
       category : "Restaurant",
       currentNumber : 34,
       avgWaitTime : 6,
       peopleWaiting : 12,
       estimatedWaitForNew : 15,

       rules : [
           "Please arrive 5 minutes before your turn",
           "Maximum wait time in 30 minutes",
           "Party size can be adjusted later"
       ]
     };



     // join queue function 

     
     const handleJoinQueue = async() => {
       
     }


     










}


