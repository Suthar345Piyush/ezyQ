// queue details screen code 

import { ScrollView , RefreshControl , Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Circle , Button , Separator } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";


type  Props = BusinessTabScreenProps<'QueueDetails'>;


export default function QueueDetailScreen({navigation , route} : Props) {
       
        const {queueId} = route.params;

        const [refreshing  , setRefreshing] = useState(false);


        // dummy data for initial working  

        const queue = {
           id : queueId,
           name : "General Service",
           category : "Service",
           status : "active",
           current_number : 15,
           current_capacity : 24,
           max_capacity : 40,
           avg_wait_time : "15 min",
           served_today : 127,
           description : "Main service queue for general customer support and inquiries",
        };


        // dummy customer data to show  

        const customers = [
           {id : '1' , token_number : 14 , name : 'Person1' , joined : '10:40 AM' , status : 'serving'},
           {id : '2' , token_number : 15 , name : 'Person2' , joined : '10:50 AM' , status : 'waiting'},
           {id : '3' , token_number : 16 , name : 'Person3' , joined : '10:45 AM' , status : 'waiting'},
           {id : '4' , token_number : 17 , name : 'Person4' , joined : '10:39 AM' , status : 'waiting'},
           {id : '5' , token_number : 18 , name : 'Person5' , joined : '10:23 AM' , status : 'waiting'},
        ];


        // screen refresh function 

        const onRefresh = async () => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false) , 1000);
        }


      // some actions that we can perform on queue like 
      // 1. call next person , 2. pause queue , 3. closing/ending the queue  

      const handleCallNext = () => {
         Alert.alert('Call Next' , 'Call customer #16 to service counter?');
      }


      const handlePauseQueue = () => {
         Alert.alert('Pause Queue' , 'This will stop accepting new customers.');
      }

      const handleCloseQueue = () => {
         Alert.alert('Close Queue' , 'Are you sure you want to close this queue?');
      }


      return (
            
           <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}} edges={['bottom']}>

             <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

             
             {/* header part of the screen  */}

             <YStack bg="$green10" px="$6" pt="$6" pb="$8">
               <XStack ai="center" gap="$3" mb="$4">

                <Button size='$3' chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>

                  <Ionicons name="arrow-back" size={24} color="white"/>
                </Button>

                <YStack flex={1}>
                  <Text color="white" fontSize="$8" fontWeight="bold">
                    {queue.name}
                  </Text>

                  <Text color="white" fontSize="$3" opacity={0.9} mt="$1">{queue.category}</Text>

                </YStack>

                <Button size="$3" chromeless onPress={() => navigation.navigate('Settings')} pressStyle={{opacity : 0.6}}>

                  <Ionicons name="settings" size={24} color='white'/>
                </Button>
              </XStack>

   
   {/* some queue  stats  */}

              <XStack gap="$3">

                <Card flex={1} br="$4" p="$3" bg="white">
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">#{queue.current_number}</Text>
                    <Text fontSize="$2" color="$gray11" mt="$1">Current</Text>
                </Card>



                <Card flex={1} br="$4" p="$3" bg="white">
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">{queue.current_capacity}</Text>
                    <Text fontSize="$2" color="$gray11" mt="$1">Waiting</Text>
                </Card>



                <Card flex={1} br="$4" p="$3" bg="white">
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">{queue.served_today}</Text>
                    <Text fontSize="$2" color="$gray11" mt="$1">Served</Text>
                </Card>

              </XStack>




    {/* some buttons to perform actions in card format*/}

  
              <YStack px="$6" mt="$-4" pb="$6">

                <Card elevate br="$5" p="$4" bg="white" mb="$4">
                    <YStack gap="$3">
                      <Button size="$5" bg="$green10" br="$4" onPress={handleCallNext} pressStyle={{scale : 0.98}}>

                        <XStack ai="center" gap="$2">
                           <Ionicons name="megaphone" size={24} color='white'/>
                           <Text fontSize="$5" fontWeight="600" color="white">Call Next Customer</Text>
                        </XStack>
                      </Button>




                      <XStack gap="$3">
                        <Button flex={1} size="$4" bg="$orange2" br="$4" onPress={handlePauseQueue} pressStyle={{scale : 0.98}}>

                               <XStack ai="center" gap="$2">
                                 <Ionicons name="pause" size={20} color="#f97316" />
                                  <Text fontSize="$4" fontWeight="600" color="$orange11">Pause</Text>

                               </XStack>                           
                        </Button>


                        <Button flex={1} size="$4" bg="$red2" br="$4" onPress={handleCloseQueue} pressStyle={{scale : 0.98}}>

                          <XStack ai="center" gap="$2">
                            <Ionicons name="close-circle" size={20} color="#ef4444"/>
                            <Text fontSize="$4" fontWeight="600" color="$red11">Close</Text>
                          </XStack>
                        </Button>
                    </XStack>
                </YStack>
            </Card>




            {/* queue information */}

            <Card elevate br="$5" p="$5" bg="white" mb="$4">
              <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">Queue Information</Text>

              <YStack gap="$3">
                <XStack jc="space-between">

                  <Text fontSize="$3" color="$gray11">Status</Text>


                  <XStack ai="center" gap="$2">

                     <Circle size={8} bg="$green10"/>
                     <Text fontSize="$3" fontWeight="600" color="$green11" textTransform='uppercase'>{queue.status}</Text>

                  </XStack>
                </XStack>

                {/* separator to separate the containers  */}

                <Separator />

                <XStack jc="space-between">
                   <Text fontSize="$3" color="$gray11">Avg Wait Time</Text>
                   <Text fontSize="$3" fontWeight="600" color="$gray12">{queue.avg_wait_time}</Text>
                </XStack>

                <Separator />

                <XStack jc="space-between">
                   <Text fontSize="$3" color="$gray11">Capacity</Text>
                   <Text fontSize="$3" fontWeight="600" color="$gray12">{queue.current_capacity / queue.max_capacity}</Text>
                </XStack>

                <Separator />

                <XStack jc="space-between">
                   <Text fontSize="$3" color="$gray11">Served Today</Text>
                   <Text fontSize="$3" fontWeight="600" color="$gray12">{queue.served_today} customers</Text>
                </XStack>

              </YStack>

            </Card>


            {/* customers currently in queue   */}

            <YStack gap="$3">
               <XStack ai="center" jc="space-between">
                 <Text fontSize="$5" fontWeight="bold" color="$gray12">Customers in Queue</Text>
                 <Circle size={30} bg="$green2">
                   <Text fontSize="$3" fontWeight="bold" color="$green11">{customers.length}</Text>
                 </Circle>
               </XStack>

               {
                 customers.map((customer , index) => (
                     
                    <Card key={customer.id} elevate br="$5" p="$4" bg={customer.status === 'serving' ? '$green2' : 'white'}>
                       
                       <XStack ai="center" jc="space-between">
                         <XStack ai="center" gap="$3" flex={1}>

                           <Circle size={50} bg={customer.status === 'serving' ? '$green10' : '$gray2'}>

                             <Text fontSize="$5" fontWeight="bold" color={customer.status === 'serving' ? 'white' : '$gray11'}>#{customer.token_number}</Text>

                           </Circle>

                           <YStack flex={1}>
                             <Text fontSize="$4" fontWeight="600" color="$gray12">{customer.name}</Text>

                             <Text fontSize="$2" color="$gray11" mt="$1">Joined at {customer.joined}</Text>

                           </YStack>
                         </XStack>

                         {
                           customer.status === 'serving' && (
                             <XStack bg="$green10" px="$3" py="$2" br="$3">
                               <Text fontSize="$2" fontWeight="600" color="white">SERVING</Text>
                              </XStack>
                           )
                         }

                       </XStack>
                    </Card>
                 ))}

                  {
                     customers.length === 0 && (
                       <Card elevate br="$5" p="$8" bg="white" ai="center">
                         <Circle size={80} bg="$gray2" mb="$4">
                            <Ionicons name="people-outline" size={40} color="#9ca3af"/>
                         </Circle>

                         <Text fontSize="$5" fontWeight="600" color="$gray12">No customers waiting</Text>

                         <Text fontSize="$3" color="$gray10" mt="$2">Queue is currently empty</Text>
                       </Card>
                     )
                  }

            </YStack>

          </YStack>

      </YStack>

  </ScrollView>
</SafeAreaView>

)};

