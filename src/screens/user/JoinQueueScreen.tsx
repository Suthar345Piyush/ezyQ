// join queue screen for user section 

import { ScrollView , Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Button , Circle , Input , TextArea, ZStack, Separator } from "tamagui";
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


     // helper function for taking safe user input (just for text input)  

     const handleTextChange = (setter: (value: string) => void) => (value: any) => {
      const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
      setter(text);
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
                                  
                                    <Button key={size} size="$4" flex={1} bg={partySize === size.toString() ? "$blue10" : "$gray2"} br="$3" onPress={() => setPartySize(size.toString())} pressStyle={{scale : 0.95}}>


                                       <Text fontSize="$4" fontWeight="600" color={partySize === size.toString() ? "white" : "$gray11"}>
                                         {size}
                                       </Text>
                                    </Button>
                              ))}
                          </XStack>


                          <Input placeholder="Custom size" value={partySize} onChangeText={handleTextChange(setPartySize)} keyboardType="numeric" focusStyle={{borderColor : "$blue10"}} size="$4" p="$3" mt="$2"/>

                       </YStack>


                       <YStack gap="$2">
                         <Text fontSize="$4" fontWeight="600" color="$gray12">Special Notes (Optional)</Text>

                         <TextArea placeholder="Any Special requirements or notes..." value={notes} onChangeText={handleTextChange(setNotes)} borderColor="$gray5" focusStyle={{borderColor : "$blue10"}} size="$4" p="$3" numberOfLines={3} />

                       </YStack>
                       
                     </YStack>

               </Card>



               {/* queue rules  */}


               <Card elevate br="$5" p="$5" bg="white" mb="$4">
                 <XStack ai="center" gap="$2" mb="$3">

                    <Circle size={32} bg="$orange2">
                       <Ionicons name="information-circle" size={20} color="#f97316"/>
                    </Circle>

                    <Text fontSize='$5' fontWeight="bold" color="$gray12">Queue Rules</Text>

                 </XStack>


                 <YStack gap="$2">
                   {queueData.rules.map((rule , index) => (

                      <XStack key={index} gap="$2" ai="flex-start">

                         <Text fontSize="$3" color="$blue10" fontWeight="600">•</Text>
                         <Text fontSize="$3" color="$gray11" flex={1} lineHeight={20}>{rule}</Text>

                      </XStack>

                   ))}

                 </YStack>


               </Card>


               {/* estimated ticket of the user  */}


               <Card elevate br="$5" p="$5" bg="$blue2" mb="$4">

                 <XStack ai="center" jc="space-between">

                   <YStack flex={1}>

                     <Text fontSize="$4" fontWeight="600" color="$blue11" mb="$1">Your Estimated Ticket</Text> 

                     <Text fontSize="$3" color="$blue11">Based on current queue</Text>

                   </YStack>

                   <Circle size={60} bg="$blue10">

                     <Text fontSize="$8" fontWeight="bold" color="white">#42</Text>

                   </Circle>
                 </XStack>
               </Card>



               {/* summary at the end of the screen  */}


               <Card elevate br="$5" p="$5" bg="white" mb="$4">

                 <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">Summary</Text>

                 <YStack gap="$3">
                   <XStack jc="space-between">

                     <Text fontSize="$3" color="$gray11">Queue</Text>
                     <Text fontSize="$3" fontWeight="600" color="$gray12">{queueData.name}</Text>

                   </XStack>

                   <Separator />

                   <XStack jc="space-between">

                     <Text fontSize="$3" color="$gray11">Party Size</Text>
                     <Text fontSize="$3" fontWeight="600" color='$green12'>{partySize} {parseInt(partySize) === 1 ? 'person' : 'people'}</Text>

                   </XStack>

                   <Separator />

                   <XStack jc="space-between">
                     <Text fontSize="$3" color="$gray11">Estimated Wait</Text>
                     <Text fontSize="$3" fontWeight="600" color="$green10">~{queueData.estimatedWaitForNew} minutes</Text>
                   </XStack>
                   
                 </YStack>

               </Card>


               {/* join queue button  */}


               <Button size="$5" bg="$blue10" br="$4" onPress={handleJoinQueue} pressStyle={{scale : 0.98}} disabled={loading} opacity={loading ? 0.6 : 1} mb="$3">

                 <XStack>

                   {loading ? (
                      <>
                       <Circle size={20}/>
                       <Text fontSize="$5" fontWeight="600" color="white">Joining...</Text>
                       
                     </>
                   ) : (

                    <>
                      <Ionicons name="checkmark-circle" size={24} color="white" />

                      <Text fontSize="$$" fontWeight="600" color="white">Confirm & Join Queue</Text>

                     </>

                   )}


                 </XStack>
                 
               </Button>


               <Button size="$4" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>
                 <Text fontSize="$4" color="$gray11">
                  Cancel
                 </Text>
               </Button>
          </YStack>

          </ScrollView>
      </SafeAreaView>
   
     )


     










}


