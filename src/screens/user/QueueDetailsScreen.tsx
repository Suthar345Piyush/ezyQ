// queue details screen (user)


import { ScrollView , RefreshControl , Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack , XStack , Text , Card , Button , Circle , Separator } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { UserTabScreenProps } from '@/src/types/navigation.types';


type Props = UserTabScreenProps<'QueueDetails'>;

export default function QueueDetailsScreen({navigation , route} : Props) {
      
      const {queueId} = route.params;
      const [refreshing , setRefreshing] = useState(false);
      const [isInQueue , setIsInQueue] = useState(false);



      // dummy data initially 

      const queueData = {
         id : queueId,
         name : "Starbucks - Connaught Place",
         category : "Restaurant",
         rating : 4.7,
         totalReviews : 245,
         distance : "0.2km",
         address : "Connaught Place , New Delhi, 110001",
         description : "Premium coffee shop with quick service and comformtable seating",
         currentNumber : 23,
         peopleWaiting : 12,
         avgWaitTime : 6,
         status : "active",
         businessHours : "8:00 AM - 10:00 PM",
         amenities : ["WIFI" , "AC" , "Parking"],
      }



      // user's ticket data 

      const useTicket = {
         ticketNUmber : 34,
         position : 3,
         estimatedWait : 12,
         joinedAt : "10:3AM",
         status : "waiting",
      };



       const onRefresh = async ( ) => {
          setRefreshing(true);
          setTimeout(() => setRefreshing(false) , 1000);

       };



      //  queue joining function 

      const handleJoinQueue = () => {
         Alert.alert(
          "Join Queue" , `Join queue at ${queueData.name}`,

          [
             {
               text : "Cancel" , style : "cancel"
             },

             {
              text : "Join",
              onPress : () => {
                 setIsInQueue(true);
                 Alert.alert("Success" , "You've joined the queue! Your ticker number is #42");  
              }
             }
          ]
         )

        };


         // leave queue function 

        const handleLeaveQueue = () => {
              Alert.alert( "Leave Queue" , "Are you sure you want to leave this queue?",
              
              [
                {text : "Cancel" , style : "cancel"},
                {
                   text : "Leave",
                   style : "destructive",

                   onPress : () => {
                      setIsInQueue(false);
                      Alert.alert("Left Queue" , "You've successfully left the queue");
                   }
                }
              ]
           );
        };


        // getting category specific icons 

        const getCategoryIcon = (category : string) => {
           switch (category) {
              case 'Restaurant' : return 'restaurant';
              case 'Healthcare' : return  'medical';
              case 'Banking' : return 'card';
              case 'Goverment' : return 'business';

              default: return 'business';
           }
        };



        return (
            <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}}>
               <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                {/* header part  */}

                <YStack bg="$blue10" px="$6" pt="$6" pb="$8">

                   <XStack ai="center" gap="$3" mb="$4">

                     <Button size="$3" chromeless onPress={() => navigation.goBack()}
                       pressStyle={{opacity : 0.6}}>

                        <Ionicons name="arrow-back" size={24} color="white"/>
                      
                     </Button>

                     <YStack flex={1}>
                       <Text fontSize="$8" fontWeight="bold" color="white">
                         {queueData.name}
                       </Text>

                       <Text color="white" fontSize="$8" opacity={0.9} mt="$1">
                        {queueData.category}
                       </Text>

                     </YStack>

                     <Button size="$3" chromeless pressStyle={{opacity : 0.6}}>
                       <Ionicons name="heart-outline" size={24} color="white"/>
                     </Button>

                   </XStack>


                   {/* quick actions for user  */}

                   <XStack gap="$3">
                     <Card flex={1} br="$4" p="$3" bg="white">

                       <XStack ai="center" gap="$2">
                         <Ionicons name="star" size={16} color="#f59e0b"/>

                         <Text fontSize="$5" fontWeight="bold" color="$gray12">{queueData.rating}</Text>
                         
                       </XStack>

                       <Text fontSize="$2" color="$gray11" mt="$1">({queueData.totalReviews})</Text>

                        
                     </Card>



                     <Card flex={1} br="$4" p="$3" bg="white">
                       <XStack ai="center" gap="$2">
                         <Ionicons name='location' size={16} color="#3b82f6"/>

                         <Text fontSize="$5" fontWeight="bold" color="$gray12">
                           {queueData.distance}
                         </Text>
                       </XStack>
                       <Text fontSize="$2" color="$gray11" mt="$1">Away</Text>

                     </Card>


                     <Card flex={1} br="$4" p="$3" bg="white">
                        <XStack ai="center" gap="$2">
                           <Ionicons name="time" size={16} color="#10b981"/>
                           <Text fontSize="$5" fontWeight="bold" color="$gray12">{queueData.avgWaitTime}m</Text>
                        </XStack>

                        <Text fontSize="$2" color="$gray11" mt="$1">Avg Wait</Text>
                     </Card>

                   </XStack>

                </YStack>

                <YStack px="$6" mt="$-4" pb="$6">

                    {isInQueue && (

                        <Card elevate bordered br="$6" p="$5" mb="$4" bg="white" borderColor="$blue8" borderWidth={2}>

                           <XStack ai="center" jc="space-between" mb="$4">

                             <YStack flex={1}>

                               <Text fontSize="$2" color="$blue10" fontWeight="600" mb="$1">YOUR TICKET</Text>

                               <Text fontSize="$4" color="$gray11">Joined at {useTicket.joinedAt}</Text>
                             </YStack>

                             <Circle size={70} bg="$blue2" borderWidth={3} borderColor="$blue10">

                               <Text fontSize="$9" fontWeight="bold" color="$blue10">
                                 #{useTicket.ticketNUmber}
                               </Text>
                               
                             </Circle>

                           </XStack>


                           <YStack gap="$3" mb="$4">

                             <XStack ai="center" jc="space-between">

                               <Text fontSize="$3" color="$gray11">Current serving</Text>

                               <Text fontSize="$6" fontWeight="bold" color="$gray12">#{queueData.currentNumber}</Text>

                             </XStack>

                          <XStack ai="center" jc="space-between">
                              <Text fontSize="$3" color="$gray11">People Ahead</Text>
                              <Text fontSize="$6" fontWeight="bold" color="$orange10">{useTicket.position}</Text>

                          </XStack>


                          <XStack ai="center" jc="space-between">

                            <Text fontSize="$3" color="$gray11">Estimated Wait</Text>
                           <Text fontSize="$6" fontWeight="bold" color="$green10">~{useTicket.estimatedWait} min</Text>

                          </XStack>

                    </YStack>


                    <Separator mb="$4"/>

                    <Button size="$4" bg="$red2" br="$4" onPress={handleLeaveQueue} pressStyle={{scale : 0.98}}>

                      <XStack ai="center" gap="$2">

                        <Ionicons name="exit-outline" size={20} color="#ef4444"/>

                        <Text fontSize="$4" fontWeight="600" color="$red11">Leave Queue</Text>
                      </XStack>
                    </Button>
                    
                </Card>
                    )}


                    {/* queue status current  */}

                    <Card elevate br="$5" p="$5" bg="white" mb="$4"> 
                       <XStack ai="center" jc="space-between" mb="$4">

                         <Text fontSize="$5" fontWeight="bold" color="$gray12">Current Status</Text>

                         <XStack bg="$green2" px="$3" py="$2" br="$3" ai="center" gap="$2">
                           <Circle size={6} bg="$green11">

                             <Text fontSize="$2" fontWeight="600" color="$green11">ACTIVE</Text>

                           </Circle>

                         </XStack>
                       </XStack>

                       

                       <YStack gap="$3">
                         <XStack ai="center" jc="space-between">

                           <XStack ai="center" gap="$2">
                             <Circle size={36} bg="$blue2">
                               <Ionicons name="timer" size={20} color="#3b82f6"/>
                               
                             </Circle>
                             
                             <Text fontSize="$3" color="$gray11">
                               Now Serving
                             </Text>
                            
                           </XStack>

                           <Text fontSize="$7" fontWeight="bold" color="$blue10">#{queueData.currentNumber}</Text>

                         </XStack>


                         <Separator />


                         <XStack ai="center" jc="space-between">
                           <XStack ai="center" gap="$2"> 
                             <Circle size={36} bg="$orange2">

                               <Ionicons name="people" size={20} color="#f97316"/>
                             </Circle>

                             <Text fontSize="$3"  color="$gray11">People Waiting</Text>

                           </XStack>

                           <Text fontSize="$6" fontWeight="bold" color="$gray12">{queueData.peopleWaiting}</Text>
                         </XStack>


                         <Separator />


                         <XStack ai="center" jc="space-between">

                           <XStack ai="center" gap="$2">

                             <Circle size={36} bg="$green2">

                               <Ionicons name="time" size={20} color="#10b981"/>
                             </Circle>

                             <Text fontSize="$3" color="$gray11">Avg Wait Time</Text>
                           </XStack>

                           <Text fontSize="$6" fontWeight="bold" color="$gray12">~{queueData.avgWaitTime} min</Text>
                         </XStack>

                       </YStack>

                    </Card>


                    {/* about section of the screen  */}

                    <Card elevate br="$5" p="$5" bg="white" mb="$4">

                       <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">About</Text>

                       <Text fontSize="$3" color="$gray11" lineHeight={20} mb="$4">{queueData.description}</Text>


                       <YStack gap="$3">
                         <XStack ai="center" gap="$3">
                           <Ionicons name="location" size={20} color="#6b7280"/>
                           <Text fontSize="$3" color="$gray11" flex={1}>{queueData.address}</Text>
                         </XStack>


                         <XStack ai="center" gap="$3">
                           <Ionicons name="time" size={20} color="#6b7280"/>
                           <Text fontSize="$3" color="$gray11" flex={1}>{queueData.businessHours}</Text>
                         </XStack>




                         <XStack ai="center" gap="$3">
                           <Ionicons name="checkmark-circle" size={20} color="#10b981"/>
                           <XStack gap="$2" flex={1} flexWrap='wrap'>

                             {queueData.amenities.map((amenity , index) => (
                                <XStack key={index} bg="$gray2" px="$2" py="$1" br="$2">
                                   <Text fontSize="$2" color="$gray11">{amenity}</Text>
                                  </XStack>
                             ))}

                           </XStack>
                         </XStack>

                       </YStack>

                    </Card>




                    {/* reviews of the queue from users */}

                    <Card elevate br="$5" p="$5" bg="white" mb="$4">

                       <XStack ai="center" jc="space-between" mb="$4">

                         <Text fontSize="$5" fontWeight="bold" color="$gray12">Reviews</Text>

                         <Button chromeless size="$2" pressStyle={{opacity : 0.6}}>
                            <Text fontSize="$3" color="$blue10" fontWeight="600">See All</Text>
                         </Button>
                    
                       </XStack>




   {/* dummy array to show user' comments , rating and time of post  */}


                       <YStack gap="$3">

                         {[
                           {name :  "Piyush" , rating : 5 , comment : "Good service!!" , time : "1 days ago"},
                           {name : "James" , rating : 4 , comment : "Good service!!" , time : "2 days ago"},
                         ].map((review , index) => (

                           <YStack key={index} gap="$2">

                             <XStack ai="center" jc="space-between">
                               <XStack ai="center" gap="$2">

                                  <Circle size={36} bg="$gray2">

                                     <Text fontSize="$4" fontWeight="600" color="$gray11">{review.name.charAt(0)}</Text>
                                     
                                  </Circle>

                                  <YStack>
                                    <Text fontSize="$3" fontWeight="600" color="$gray12">{review.name}</Text>

                                    <XStack ai="center" gap="$1">

                                       {[1 , 2 , 3 , 4 , 5].map((star) => (

                                          <Ionicons key={star} name={star <= review.rating ? 'star' : 'star-outline'} size={12} color={star <= review.rating ? '#f59e0b' : '#d1d5db'}/>

                                       ))}

                                    </XStack>

                                  </YStack>

                               </XStack>

                               <Text fontSize="$2" color='$gray10'>{review.time}</Text>

                             </XStack>

                             <Text fontSize="$3" color="$gray11" ml="$11">{review.comment}</Text>

                             {index === 0 && <Separator my="$2"/>}


                             </YStack>
                              
                         ))}
                         
                       </YStack>

                    </Card>


                    {/* action buttons like direction , queue joining , call to supprot team */}


                    

















                </YStack>






                 
               </ScrollView>
            </SafeAreaView>
        )




      
}