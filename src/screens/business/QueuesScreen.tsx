// Queues screen - screen with all the queues (search queues) along with their status - active , paused , closed

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView , RefreshControl } from "react-native";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";
import { XStack , YStack , Card , Text , Circle, Button, Input } from "tamagui";
import  {useState} from 'react';
import { Ionicons } from "@expo/vector-icons";



type Props = BusinessTabScreenProps<'Queues'>;


// main function for the  screen layout  

export default function QueuesScreen({navigation , route} : Props) {


     const [refreshing , setRefreshing] = useState(false);
     const [searchQuery , setSearchQuery] = useState("");


    // function to take safe input from tamagui input function
    // basically setting the input text 
    
    const handleTextChange = (setter : (value : string) => void) => (value : any) => {
        const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
        setter(text);
    }


  

  // dummy data

  const QUEUES = [

       {
          id : "1",
          name : "Government Office",
          category : "Government",
          status : "active",
          current_number : 35,
          current_capacity : 26,
          avg_wait_time : 15,
          max_capacity : 40,
          color : "$green10",
       },

       {
        id : "2",
        name : "City Bank",
        category : "Banking",
        status : "active",
        current_number : 25,
        current_capacity : 15,
        avg_wait_time : 10,
        max_capacity : 30,
        color : "$blue10",
     },

     {
      id : "3",
      name : "City Hospital",
      category : "Healthcare",
      status : "active",
      current_number : 43,
      current_capacity : 60,
      avg_wait_time : 20,
      max_capacity : 120,
      color : "$red10",
   },

   {
    id : "4",
    name : "Food Coffee",
    category : "Restaurant",
    status : "paused",
    current_number : 25,
    current_capacity : 12,
    avg_wait_time : 5,
    max_capacity : 20,
    color : "$gray10",
  },

  {
    id : "5",
    name : "Mr.Cineplex",
    category : "Entertainment",
    status : "active",
    current_number : 45,
    current_capacity : 35,
    avg_wait_time : 5,
    max_capacity : 80,
    color : "$black10",
 },
  
 {
  id : "6",
  name : "Mr.Clinic",
  category : "Healthcare",
  status : "active",
  current_number : 30,
  current_capacity : 12,
  avg_wait_time : 15,
  max_capacity : 25,
  color : "$red10",
},
      ];


      // filtering queues based on their name or category they belong to   

      const filteredQueues = QUEUES.filter(q => q.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.category.toLowerCase().includes(searchQuery.toLowerCase())
       );



       // taking count of active and paused queues 

       const activeQCnt = QUEUES.filter(q => q.status === 'active').length;

       const pausedQCnt = QUEUES.filter(q => q.status === 'paused').length;



       // refresh control function 

       const onRefresh = async () => {
          setRefreshing(true);

          setTimeout(() => setRefreshing(false) , 1000)
       };


      //  queue status specific color 
    
     const getStatusColor = (status : string) => {
         switch(status) {
             case 'active':
               return '$green10';

             case 'paused':
               return '$orange10';

             case 'closed':
               return '$gray10';

             default:
               return '$gray10';
         }
     };



       //  queue status specific background color   
    
       const getStatusBg = (status : string) => {
         switch(status) {
             case 'active':
               return '$green2';

             case 'paused':
               return '$orange2';

             case 'closed':
               return '$gray2';

             default:
               return '$gray2';
         }
     };

     return (

         <SafeAreaView style={{ flex : 1 , backgroundColor : '#f8f9fa'}} edges={['bottom']}>

            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

                 {/* header part  */}

                 <YStack bg="$green10" px="$6" pt="$6" pb="$8">
                  <XStack ai="center" jc="space-between" mb="$4">

                     <YStack flex={1}>
                         <Text color="white" fontSize="$8" fontWeight="bold">Queues</Text>
                         <Text fontSize="$3" color="white" opacity={0.9} mt="$1">Manage your queues</Text>
                     </YStack>


                     <Button size="$4" bg="white" br="$4" onPress={() => navigation.navigate('CreateQueues')} pressStyle={{scale : 0.95}}>

                        <XStack ai="center" gap="$2">
                           <Ionicons name="add" size={20} color="#10b981"/>
                           <Text fontSize="$3" fontWeight="600" color="$green10">New</Text>
                        </XStack>
                     </Button>
                  </XStack>



                  {/* stats on the screen  */}

                  <XStack gap="$3">

                     <Card flex={1} br="$4" p="$3" bg="white">
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">{activeQCnt}</Text>
                        <Text fontSize="$2" color="$gray11" mt="$1">Active</Text>
                     </Card>

                     <Card flex={1} br="$4" p="$3" bg="white"> 
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">{pausedQCnt}</Text>
                        <Text fontSize="$2" color="$gray11" mt="$1">Paused</Text>
                     </Card>

                     <Card flex={1} br="$4" p="$3" bg="white"> 
                        <Text fontSize="$6" fontWeight="bold" color="$gray12">{QUEUES.length}</Text>
                        <Text fontSize="$2" color="$gray11" mt="$1">Total</Text>
                     </Card>

                  </XStack>
            </YStack>


            {/* search for the queue   */}

            <YStack px="$6" mt="$-4" pb="$6">
                <Card elevate br="$5" p="$0" bg="white" mb="$4" overflow="hidden">
                   <XStack ai="center" px="$4" py="$3">
                      <Ionicons name="search" size={20} color="#9ca3af"/>

                      <Input 
                       flex={1}
                       placeholder="Search queues..."
                       value={searchQuery}
                       onChangeText={handleTextChange(setSearchQuery)}
                       borderWidth={0}
                       size="$4"
                       ml="$2"
                       />
                   </XStack>
                </Card>


                {/* iterating on queue list  */}

                <YStack gap="$3">

                  {filteredQueues.map((queue) => (

                    <Card  elevate key={queue.id} br="$5" p="$4" bg="white" onPress={() => navigation.navigate('QueueDetails' , {queueId : "123"})} pressStyle={{scale : 0.98}}>
                        <XStack ai="center" jc="space-between" mb="$4">
                           <YStack flex={1}>
                              <Text fontSize="$5" fontWeight="bold" color="$gray12">{queue.name}</Text>
                              <Text fontSize="$2" color="$gray11" mt="$1">{queue.category}</Text>
                            </YStack>



                            <XStack bg={getStatusBg(queue.status)} px="$3" py="$3" br="$3" ai="center" gap="$2">

                               <Circle size={6} bg={getStatusColor(queue.status)} />

                                <Text fontSize="$2" color={getStatusColor(queue.status)} fontWeight="600" textTransform="uppercase">
                                    {queue.status}
                                 </Text>

                          </XStack>
                     </XStack>



                  <XStack gap="$3">

                      <YStack flex={1} bg="$gray2" p="$3" br="$3" ai="center">
                        <Text fontSize="$7" fontWeight="bold" color="$gray12">{queue.current_capacity}</Text>
                        <Text fontSize="$3" fontWeight="600" color="$gray11" >Waiting</Text>
                      </YStack>


                      <YStack flex={1}bg="$gray2" p="$3" br="$3" ai="center">
                         <Text fontSize="$7" fontWeight="bold" color="$gray12">#{queue.current_number}</Text>
                         <Text fontSize="$3" fontWeight="600" color="$gray11">Current</Text>
                      </YStack>


                      <YStack flex={1}bg="$gray2" p="$3" br="$3" ai="center">
                         <Text fontSize="$7" fontWeight="bold" color="$gray12">{queue.avg_wait_time}</Text>
                         <Text fontSize="$3" fontWeight="600" color="$gray11">Wait</Text>
                      </YStack>


                      <YStack flex={1}bg="$gray2" p="$3" br="$3" ai="center">
                         <Text fontSize="$7" fontWeight="bold" color="$gray12">{queue.max_capacity}</Text>
                         <Text fontSize="$3" fontWeight="600" color="$gray11">Maximum Capacity</Text>
                      </YStack>

                     </XStack>


                     {/* progress bar representation  */}

                     <YStack mt="$3">
                        <XStack jc="space-between" mb="$2">
                          <Text fontSize="$2" color="$gray11">Capacity</Text>
                          <Text fontSize="$2" color="$gray11">{queue.current_capacity / queue.max_capacity}</Text>
                        </XStack>


                        <YStack bg="$gray2" h={6} br="$3" overflow="hidden">
                          <XStack bg={queue.color} h={6} width={`${(queue.current_capacity / queue.max_capacity) * 100}%`}/>
                        </YStack>

                     </YStack>
                    </Card>

                  ))}


                  {
                     filteredQueues.length === 0 && (
                        <Card elevate br="$5" p="$8" bg="white" ai="center">
                           <Circle size={80} bg="$gray2" mb="$4">
                              <Ionicons name="search-outline" size={40} color="#9ca3af"/>
                           </Circle>

                           <Text fontSize="$5" fontWeight="600" color="$gray12">No queues found</Text>

                           <Text fontSize="$3" color="$gray10" mt="$2">Try a different search term</Text>
                        </Card>
                     )
                  }

                </YStack>

            </YStack>

            </ScrollView>
         </SafeAreaView>
     )
};


