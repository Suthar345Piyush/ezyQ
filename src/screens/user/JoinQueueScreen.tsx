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

        if(!partySize || parseInt(partySize) < 1) {
           Alert.alert("Invalid Input", "Please enter a valid party size");
           return;
        }

        setLoading(true);

        // will call an api afterwards 

        setTimeout(() => {
           setLoading(false);

           Alert.alert("Success!" , "You've joined the queue!\n Your ticket number is #43",
           [
             {
               text : "View Ticket",
               onPress : () => navigation.navigate('Home')
             }
           ]
          );
        } , 1500);
     };


     return (
         
         <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}} edges={["bottom"]}>
             <ScrollView showsVerticalScrollIndicator={false}>

                {/* header  */}

                <YStack bg="$blue10" px="$6" pt="$6" pb="$8">

                   <XStack ai="center" gap="$3" mb="$4">

                     <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>

                       <Ionicons name="arrow-back" size={24} color="white"/>
                     </Button>

                     <YStack flex={1}>

                      <Text fontSize="$8" fontWeight="bold" color="white">
                         Join Queue
                      </Text>

                      <Text fontSize="$3" color='white' opacity={0.9} mt="$1">
                         {queueData.name}
                      </Text>

                  </YStack>
                </XStack>


                {/* current status of the queue   */}

                <Card br="$5" p="$4" bg="white">
                   <XStack gap="$3" mb="$3">
                     <YStack flex={1} ai="center" py="$2" bg="$blue2" br="$3">
                        <Text>
                           #{queueData.currentNumber}
                        </Text>

                        <Text fontSize="$2" color="$blue11">Current</Text>
                     </YStack>


                     <YStack flex={1} ai="center" py="$2" bg="$orange2" br="$3">

                       <Text fontSize="$6" fontWeight="bold" color="$orange11">
                         {queueData.peopleWaiting}
                       </Text>

                       <Text fontSize="$2" color="$orange11">
                        Waiting
                       </Text>

                     </YStack>


                     <YStack flex={1} ai="center" py="$2" bg="$green2" br="$3">

                       <Text fontSize="$6" fontWeight='bold' color="$green11">
                         ~{queueData.estimatedWaitForNew}m
                       </Text>

                       <Text fontSize="$2" color="$green11">Your Wait</Text>

                     </YStack>

                   </XStack>
                </Card>

          </YStack>



          <YStack px="$6" mt="$-4" pb="$6">

               {/* party/people size  */}

               <Card elevate br="$5" p="$5" bg="white" mb="$4">

                     <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">
                       Party Details
                     </Text>


                     <YStack gap="$3">
                       <YStack gap="$2">

                          <Text fontSize="$4" fontWeight="600" color="$gray12">Party Size *</Text>

                          <XStack gap="$2">
                              {[1 , 2 , 3 , 4 , 5 , 6].map((size) => (
                                  
                                    <Button key={size} >

                                       <Text>

                                       </Text>

                                    </Button>

                              ))}

                          </XStack>

                       </YStack>
                       
                     </YStack>

            
               </Card>
             
          </YStack>



             
          </ScrollView>
      </SafeAreaView>
   
     )


     










}


