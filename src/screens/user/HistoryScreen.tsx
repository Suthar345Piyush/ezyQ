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
    ticketNumber : 42,
    time : '10:40 AM',
    date : '11-12-2025',
    rating : 4.7,
    status : 'completed',
 },

  {
     id : '2',
     name : 'City Bank',
     category : 'Banking',
     ticketNumber : 15,
     status : 'completed',
     date : '12-11-2025',
     time : '02:15 PM',
     waitTime : 18,
     rating : 4.5
  },

  {
    id : '3',
    name : 'Government Office',
    category : 'Government',
    ticketNumber : 14,
    status : 'completed',
    date : '12-1-2025',
    time : '02:19 PM',
    waitTime : 14,
    rating : 4.3
 },

 {
  id : '4',
  name : 'City Hospital',
  category : 'Healthcare',
  ticketNumber : 12,
  status : 'completed',
  date : '2-2-2026',
  time : '06:16 PM',
  waitTime : 12,
  rating : 4.1
},

{
  id : '5',
  name : 'Pizza Hosue',
  category : 'no_show',
  ticketNumber : 11,
  status : 'completed',
  date : '12-11-2025',
  time : '02:15 AM',
  waitTime : 19,
  rating : 3.9
},

 {
  id : '6',
  name : 'Banner Bank',
  category : 'Banking',
  ticketNumber : 19,
  status : 'cancelled',
  date : '12-11-2026',
  time : '02:16 PM',
  waitTime : 19,
  rating : 4.8
 },
];



//  main function for the screen 


export default function HistoryScreen({navigation} : Props) {
   

      // state for filtering queue according (user's choice) for queues

      const [filter , setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

       const filteredHistory = QUEUE_HISTORY.filter((items) => {

         if(filter === 'all') return true;
         if(filter === 'completed') return items.status === 'completed';
         if(filter ===  'cancelled') return items.status === 'cancelled' || items.status === 'no_show';

         return true;
       });


       //color according to status of the queue 

       const getStatusColor = (status : string) => {
          switch (status) {
             case 'completed':
               return '$green10';

             case 'cancelled':
               return '$red10';

             case 'no_show':
               return '$orange10';

             default:
               return '$gray10';
          }
       };


       //status background 

       const getStatusBg = (status : string) => {
        switch (status) {
           case 'completed':
             return '$green2';

           case 'cancelled':
             return '$red2';

           case 'no_show':
             return '$orange2';

           default:
             return '$gray2';
        }
     };

    
   // status text 

     const getStatusText = (status : string) => {
      switch (status) {
         case 'completed':
           return 'Completed';

         case 'cancelled':
           return 'Cancelled';

         case 'no_show':
           return 'No Show';

         default:
           return status;
      }
   };


   // icons according to category 

   const getCategoryIcon = (category : string) => {
    switch (category) {
       case 'Restaurant':
         return 'restaurant';

       case 'Banking':
         return 'card';

       case 'Healthcare':
         return 'medical';

       case 'Government':
         return 'business';

       default:
         return 'business';
    }
 };


    // completed queues in total 

    const totalCompleted = QUEUE_HISTORY.filter((c)  => c.status === 'completed').length;



    // average wait time that taken by queue  

    const avgWaitTime = QUEUE_HISTORY.filter((c) => c.status === 'completed').reduce(
   
      //  accumulator , current value 

       (acc , c) => acc + c.waitTime , 0
    )  / totalCompleted || 0;




    return (

        <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}}>
           <YStack flex={1}>

              {/* header part of screen  */}

             <YStack px="$6" pt="$4" pb="$3" borderBottomWidth={1} borderBottomColor="$gray4">

              <Text fontSize="$9" fontWeight="bold" color="$gray12" mb="$4">Queue History</Text>


              {/* cards with queue statistics */}

              <XStack gap="$4" mb="$4" >
                 <Card flex={1} elevate br="$4" p="$4" bg="$blue2">

                   <Text fontSize="$2" color="$blue11" fontWeight="600" mb="$1">Total Queues</Text>

                   <Text fontSize="$8" fontWeight="bold" color="$blue11">{QUEUE_HISTORY.length}</Text>

                 </Card>


                 <Card flex={1} elevate br="4" p="$4" bg="$green2">

                   <Text fontSize="$2" color="$green11" fontWeight="600" mb="$1">Completed</Text>

                  <Text fontSize="$8" fontWeight="bold" color="$green11">{totalCompleted}</Text>

                 </Card>

                 <Card flex={1} elevate br="$4" p="$4" bg="$purple2">

                   <Text fontSize="$8" fontWeight="600" mb="$1" color="$purple11">Avg Wait</Text>

                   <Text fontSize="$8" fontWeight="bold" color="$purple11">{Math.round(avgWaitTime)}m</Text>

                 </Card>
              </XStack>




              {/* filter tabs of queue status  */}

              <XStack gap="$2">

                <Button flex={1} size="$3" bg={filter === 'all' ? '$blue10' : '$gray2'} br="$3" onPress={() => setFilter('all')} pressStyle={{scale : 0.98}}>

                  <Text fontSize="$3" fontWeight="600" color={filter === 'all' ? 'white' : '$gray11'}>All</Text>
                </Button>


                <Button flex={1} size="$3" bg={filter === 'completed' ? '$blue10' : '$gray2'} br="$3" onPress={() => setFilter('completed')} pressStyle={{scale : 0.98}}>

                  <Text fontSize="$3" fontWeight="600"  color={filter === 'completed' ? 'white' : '$gray11'}>Completed</Text>
                </Button>


                <Button flex={1} size="$3" bg={filter === 'cancelled' ? '$blue10' : '$gray2'} br="$3" onPress={() => setFilter('cancelled')} pressStyle={{scale : 0.98}}>

                  <Text fontSize="$3" fontWeight="600" color={filter === 'cancelled' ? 'white' : '$gray11'}>Cancelled</Text>

                </Button>
              </XStack>
             </YStack>


             {/* list of the history queues  */}

             <ScrollView showsVerticalScrollIndicator={false}>
               
                 <YStack px="%6" py="$4" gap="$4" ml="$3" mr="$3">

                   {filteredHistory.map((item) => (
                      
                       <Card key={item.id} elevate br="$5" p="$4" bg="white" onPress={() => {}} pressStyle={{scale : 0.98}}>

                        <XStack ai="center" gap="$3" mb="$3">

                           <Circle size={56} bg="$gray2">

                             <Ionicons name={getCategoryIcon(item.category) as any} size={28} color="#3b82f6"/>

                           </Circle>

                           <YStack flex={1}>

                             <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$1">{item.name}</Text>

                             <XStack ai="center" gap="$2">
                              <Ionicons name="calendar-outline" size={14} color="#6b7280"/>
                               
                                <Text fontSize="$2" color="$gray11">{item.date} at {item.time}</Text>

                             </XStack>
                           </YStack>


                           <XStack bg={getStatusBg(item.status)} px="$3" py="$2" br="$3" ai="center" gap="$1">

                            <Circle size={6} bg={getStatusColor(item.status)} />

                               <Text fontSize="$2" color={getStatusColor(item.status)} fontWeight="600">

                                 {getStatusText(item.status).toUpperCase()}

                               </Text>
                           </XStack>
                        </XStack>


                        <XStack bg="$gray2" br="$3" p="$3" ai="center" jc="space-between" mb={item.status === 'completed' ? '$3' : 0}>

                           <XStack ai="center" gap="$2">
                            <Text fontSize="$2" color="$gray11">Ticket#</Text>

                            <Text fontSize="$4" fontWeight="bold" color="$gray12">
                                    {item.ticketNumber}
                                 </Text>
                           </XStack>


                           {item.status === 'completed' && (
                              <XStack ai="center" gap="$2">
                                <Ionicons name="time-outline" size={16} color="#6b7280"/>
                                <Text fontSize="$3" color="$gray11"> 
                                  Wait : {item.waitTime} min
                                </Text>
                              </XStack>
                           )}
                        </XStack>



                        {/* rating on the card  */}

                        {item.status === 'completed' && item.rating && (
                            <XStack ai='center' jc="space-between">
                              <XStack ai="center" gap="$1">

                                 {[1,2,3,4,5].map((star) => (
                                     <Ionicons  key={star} name={star <= item.rating! ? 'star' : 'star-outline'}
                                      size={18} color={star <= item.rating! ? '#f59e0b' : '#d1d5db'}/>
                                 ))}

                              </XStack>

                              <Button size="$2" chromeless pressStyle={{opacity : 0.6}}>
                                <Text fontSize="$2" color="$blue10" fontWeight="600">View Receipt</Text>
                              </Button>
                            </XStack>
                        )}
                       </Card>
                   ))}


                   {/* last if nothing work , showing history not found  */}

                  {filteredHistory.length === 0 && (
                     <YStack ai="center" jc="center" py="$10">

                       <Circle size={80} bg="$gray2" mb="$4">

                         <Ionicons name="time-outline" size={40} color="$9ca3af"/>

                       </Circle>

                       <Text fontSize="$5" fontWeight="600" color="$gray12" mb="$2">No history found</Text>

                       <Text fontSize="$3" color="$gray10" ta="center">Your queue history will appear here</Text>
                      </YStack>
                  )}

                 </YStack>

             </ScrollView>




           </YStack>
        </SafeAreaView>

    )








 






       

}



