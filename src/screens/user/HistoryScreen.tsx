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

              <XStack gap="$3" mb="$4">
                 <Card flex={1} elevate br="$4" p="$4" bg="$blue2">

                   <Text fontSize="$2" color="$blue11" fontWeight="600" mb="$1">Total Queues</Text>

                   <Text fontSize="$8" fontWeight="bold" color="$blue11">{QUEUE_HISTORY.length}</Text>

                 </Card>


                 <Card flex={1} elevate br="4" p="$4" bg="$green2">

                   <Text fontSize="$2" color="$green11" fontWeight="600" mb="$1">Completed</Text>

                  <Text fontSize="$8" fontWeight="bold" color="$blue11">{totalCompleted}</Text>

                 </Card>


                 <Card>

                   <Text></Text>
                   <Text></Text>

                 </Card>

              </XStack>


             </YStack>

           </YStack>
        </SafeAreaView>

    )








 






       

}



