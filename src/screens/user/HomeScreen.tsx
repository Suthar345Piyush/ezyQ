// user's home screen 

import { ScrollView , RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Text , Card , Button , Avatar , Circle , Input } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { UserTabScreenProps } from "@/src/types/navigation.types";
import { useAuthStore } from "@/src/stores/authStore";


type Props = UserTabScreenProps<'Home'>;


// hardcoding the data , now initial app setup 



// active queues for now

const ACTIVE_QUEUE = {
     id : '1',
     name : 'Starbucks - Delhi',
     ticketNumber : 42,
     currentNumber : 38,
     peopleAhead : 4,
     estimateWait : 12,
     status : 'waiting' as const,
};


// nearby queues  for now  

const NEARBY_QUEUES = [
    {
      id : '2',
      name : 'Mr.Food\'s',
      category : 'Restaurant',
      waitTime : 8,
      peopleWaiting : 12,
      distance : '0.3km',
      rating : 4.5,
    },


    {
      id : '3',
      name : 'Govt. Office',
      category : 'Government',
      waitTime : 45,
      peopleWaiting : 28,
      distance : '1.2km',
      rating : 3.8,
    },


    {
      id : '4',
      name : 'Bank of India',
      category : 'Banking',
      waitTime : 15,
      peopleWaiting : 8,
      distance : '0.5km',
      rating : 4.2,
    },
];



export default function HomeScreen({navigation} : Props) {
     const {user} = useAuthStore();

     const [refreshing , setRefreshing] = useState(false);

     const [searchQuery , setSearchQuery] = useState('');


     const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false) , 1500);
     };


    // greeting function 

     const getGreeting = () => {

       const hour = new Date().getHours();

       if(hour > 12) return 'Good Morning';
       if(hour > 18) return 'Good afternoon';
       
       return 'Good Evening';

     };



     return (

        <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}}>
         <ScrollView showsVerticalScrollIndicator={false} refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
         }>

            {/* header  */}
             
             <YStack bg="$blue10" px="$6" pt="$6" pb="$8">


               <XStack ai="center" jc="space-between" mb="$6">
                 <YStack flex={1}>
                   
                    <Text color="white" fontSize="$3" opacity={0.9}>
                      {getGreeting()}
                    </Text>

                    <Text color="white" fontSize="$8" fontWeight="bold" mt="$1">
                      {user?.name || 'Guest'}
                    </Text>
                 </YStack>

                 <Circle size={50} bg="white" elevation="$2">
                   <Ionicons name="person" size={28} color="#3b82f6"/>
                 </Circle>
               </XStack>



               {/* search bar  */}

               <XStack bg="white" br="$6" px="$4" ai="center" h={52} shadowColor="$shadowColor" shadowRadius={8} shadowOpacity={0.1}>

                 <Ionicons name="search" size={20} color="#9ca3af"/>

                 <Input unstyled flex={1} placeholder="Search for queues..." value={searchQuery} onChangeText={setSearchQuery} size="$4" ml="$3" placeholderTextColor="$gray10"/> 
               </XStack>

             </YStack>




             <YStack px="$6" mt="$-4" pb="$6">

               {/* active queue cards  */}

               {ACTIVE_QUEUE && (
                   <Card elevate bordered br="$6" p="$5" mb="$6" bg="white" borderColor="$blue8" borderWidth={2}>

                   <XStack ai="center" jc="space-between" mb="$4">
                     <YStack flex={1}>

                      <Text fontSize="$2" color="$blue10" fontWeight="600" mb="$1">
                        {ACTIVE_QUEUE.name}
                      </Text>
                     </YStack>

                     <Circle size={60} bg="$blue2">
                       <Text fontSize="$8" fontWeight="bold" color="$blue10">
                           #{ACTIVE_QUEUE.ticketNumber}
                       </Text>
                     </Circle>
                    </XStack> 


                  {/* next progress for the card  */}

                <YStack gap="$3" mb="$4">

                    <XStack ai="center" jc="space-between">
                        <Text fontSize="$3" color="$gray11">
                          Current number
                        </Text>

                        <Text fontSize="$5" fontWeight="bold" color="$gray12">
                         #{ACTIVE_QUEUE.currentNumber}
                        </Text>
                    </XStack>

                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$3" color="$gray11">
                         People ahead
                      </Text>

                      <Text fontSize="$5" fontWeight="bold" color="$orange10">
                        {ACTIVE_QUEUE.peopleAhead}
                      </Text>
                    </XStack>

                    <XStack ai="center" jc="space-between">
                      <Text fontSize="$3" color="$gray11">
                        Estimated wait
                      </Text>

                      <Text fontSize="$5" fontWeight="bold" color="$green10">
                        ~{ACTIVE_QUEUE.estimateWait} min
                      </Text>
                    </XStack>

                  </YStack>


                  <Button size="$4" bg="$blue10" br="$4" pressStyle={{scale : 0.98}} onPress={() => navigation.navigate('QueueDetails' , {queueId :  ACTIVE_QUEUE.id})}>

                     <Text color="white" fontSize="$4" fontWeight="600">
                       View Details
                     </Text>
                  </Button>
                </Card>
               )};





               {/* quick actions on screen to do  */}

               <YStack gap="$3" mb="$6">
                 <Text fontSize="$5" fontWeight="bold" color="$gray12">
                   Quick Actions  
                 </Text>

                 <XStack gap="$3">

                   <Card flex={1} elevate br="$5" p="$4" bg="$green2" onPress={() => navigation.    navigate('Explore')} pressStyle={{scale : 0.98}}>  

                     <Circle size={48} bg="$green10" mb="$3">
                        <Ionicons name="location" size={24} color="white"/>
                     </Circle>

                     <Text fontSize="$4" fontWeight="600" color="$gray12">
                        Find Nearby
                     </Text>

                     <Text fontSize="$2" color="$gray10" mt="$1">Discover queues</Text>

                   </Card>


                   <Card flex={1} elevate br="$5" p="$4" bg="$purple2" onPress={() => {}} pressStyle={{scale : 0.98}}>

                     <Circle size={48} bg="$purple10" mb="$3">
                       <Ionicons name="qr-code" size={24} color="white"/>
                     </Circle>

                     <Text fontSize="$4" fontWeight="600" color="$gray12">
                          Scan QR
                     </Text>

                     <Text fontSize="$2" color="$gray10" mt="$1">
                         Join instantly
                     </Text>
                   </Card>

                  </XStack>
               </YStack>



               {/* nearby queues functionality */}


               <YStack gap="$3">
                 <Text fontSize="$5" fontWeight="bold" color="$gray12">Nearby Queues</Text>

                 {
                   NEARBY_QUEUES.map((queue) => (
                       
                       <Card key={queue.id} elevate br="$5" p="$4" bg="white" onPress={() =>   navigation.navigate('QueueDetails' , {queueId : queue.id})}>  
                         


                          <XStack ai="center" gap="$3">
                             <Circle size={56} bg="$gray3">

                               <Ionicons name={
                                 queue.category === 'Restaurant' ? 'restaurant' : queue.category === 
                                 'Banking' ? 'card' : 'business'
                               }  size={28} color="#6b7280"/>

                             </Circle>




                             <YStack flex={1}>

                              <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$1">
                                 {queue.name}
                              </Text>


   {/* people waiting part in card  */}

                              <XStack ai="center" gap="$2" mb="$1">

                                 <Ionicons name="time-outline" size={14}  color="#6b7280"/>
                                 
                                 <Text fontSize="$2" color="$gray11">
                                   ~{queue.waitTime} min wait
                                 </Text>

                                 <Text color="$gray9">•</Text>

                                 <Text fontSize="$2" color="$gray11">{queue.peopleWaiting} waiting                                 
                                 </Text>

                              </XStack>


                              {/* distance and rating of that queue */}

                              <XStack ai="center" gap="$2">

                                   <Ionicons name="location-outline" size={14} color="#3b82f6"/>

                                   <Text fontSize="$2" color="$blue10">{queue.distance}</Text>


                                   <XStack ai="center" gap="$1" ml="$2">

                                    <Ionicons name="star" size={14} color="#f59e0b"/>

                                   <Text fontSize="$2" color="$gray11">{queue.rating}</Text>

                                  </XStack>

                             </XStack>
                        </YStack>


                        <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                             
                    </XStack>

                </Card>

           ))}
        </YStack>              
               
  </YStack>


  </ScrollView>
</SafeAreaView>

  )}




