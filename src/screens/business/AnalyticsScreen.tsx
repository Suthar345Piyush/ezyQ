// analytics screen code here 

import { ScrollView , RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Circle } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";


type Props = BusinessTabScreenProps<'Analytics'>;


export default function AnalyticsScreen({navigation} : Props) {
     
     const  [refreshing  , setRefreshing] = useState(false);


     
     // dummy analytics data 

     const analytics = {
        todayServed : 127,
        avgWaitTime : "12 min",
        peakHour : "2-3 PM",
        rating : "4.5",
        weeklyStatus : [
            {day : "Mon", served : 67},
            {day : "Tue", served : 45},
            {day : "Wed", served : 66},
            {day : "Thu", served : 68},
            {day : "Fri", served : 63},
            {day : "Sat", served : 61},
            {day : "Sun", served : 23}
        ],

        topQueues : [
           {name : 'City Hospital', served : 125 , percentage : 35},
           {name : 'City Bank', served : 105 , percentage : 32},
           {name : 'Government Office', served : 95 , percentage : 27}
        ]
     };


     // refresh function 

     const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false) , 1000);
     };


     // maximum customers served in a queue  

     const maxServed = Math.max(...analytics.weeklyStatus.map(s => s.served));



     return (

        <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}} edges={['bottom']}>
           <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>


                  {/* header  */}

              <YStack bg="$green10" px="$6" pt="$6" pb="$8">

                 <XStack ai="center" jc="space-between" mb="$2">

                   <Text fontSize="$8" fontWeight="bold" color="white">Analytics</Text>

                   <Circle size={40} bg="white" opacity={0.2}>
                     <Ionicons name="stats-chart" size={24} color="white"/>
                   </Circle>
                 </XStack>

                 <Text color="white" fontSize="$3" opacity={0.9}>Performance Overview</Text>
              </YStack>



              {/* all main metrices to show on screen */}

              <YStack px="$6" mt="$-4" pb="$6">
                 <XStack gap="$3" mb="$6">

                  {/* served in a day  */}

                   <Card flex={1} elevate br="$5" p="$4" bg="white">
                     <Circle size={40} bg="$green2" mb="$3">
                       <Ionicons name="checkmark-done" size={22} color="#10b981"/>
                     </Circle>

                     <Text fontSize="$7" fontWeight="bold" color="$gray12">{analytics.todayServed}</Text>

                     <Text fontSize="$2"  color="$gray11" mt="$1">Served Today</Text>
                   </Card>



                   <Card flex={1} elevate br="$5" p="$4" bg="white">
                     <Circle size={40} bg="$blue2" mb="$3">
                       <Ionicons name='time' size={22} color="#3b82f6"/>
                     </Circle>

                     <Text fontSize="$7" fontWeight="bold" color="$gray12">{analytics.avgWaitTime}</Text>

                     <Text fontSize="$2"  color="$gray11" mt="$1">Avg Wait</Text>
                   </Card>
                 </XStack>


                          {/* peak hour & rating design  */}

                 <XStack gap="$3" mb="$6">

                   <Card flex={1} elevate br="$5" p="$4" bg='white'>
                     <Circle size={40} bg="$orange2" mb="$3">
                        <Ionicons name='trending-up' size={22}  color="#f97316"/>
                     </Circle>

                     <Text fontSize="$7" fontWeight="bold" color="$gray12">{analytics.peakHour}</Text>
                     <Text fontSize="$2" color="$gray11" mt="$1">Peak Hour</Text>
                   </Card>


                   <Card flex={1} elevate br="$5" p="$4" bg='white'>
                     <Circle size={40} bg="$yellow2" mb="$3">
                        <Ionicons name='star' size={22}  color="#eab308"/>
                     </Circle>

                     <Text fontSize="$7" fontWeight="bold" color="$gray12">{analytics.rating}</Text>
                     <Text fontSize="$2" color="$gray11" mt="$1">Rating</Text>
                   </Card>

                 </XStack>


                        {/* weekly status chart showdown  */}

                 <YStack gap="$3" mb="$6">

                   <Text fontSize="$6" fontWeight="bold" color="$gray12">Weekly Status</Text>

                    <Card elevate br="$5" p="$5" bg="white">
                      <YStack gap="$4">
                         
                          {analytics.weeklyStatus.map((stats , index) => (
                              <XStack key={index} ai="center" gap="$3">

                                      {/* at that time we served that much amount of people   */}

                                  <Text fontSize="$3" fontWeight="600" color="$gray11" width={35}>{stats.day}</Text>

                                  <YStack flex={1}>

                                     <XStack h={32} bg='$green10' br="$3" ai="center" px="$3" width={`${(stats.served / maxServed) * 100}`}>

                                       <Text fontSize="$3" fontWeight="600" color="white">{stats.served}</Text>

                                     </XStack>
                                  </YStack>

                              </XStack>
                          ))}
                         
                      </YStack>
                    </Card>

                 </YStack>


                 {/* best queues representation */}

                 <YStack gap="$3">

                   <Text fontSize="$5" fontWeight="bold" color="$gray12">Best Queues</Text>
                    {analytics.topQueues.map((bestq , index) => (
                         
                          <Card elevate key={index} br="$5" p="$4" bg="white">
                            <XStack ai="center" jc="space-between" mb="$3">

                              <YStack flex={1}>
                                 <Text fontSize="$4" fontWeight="600" color="$gray12">{bestq.name}</Text>

                                 <Text fontSize="$5" fontWeight="bold" color="$green11">{bestq.served} customers</Text>
                              </YStack>

                              <Circle size={50} bg="$green2">
                                  <Text fontSize="$5" fontWeight="bold" color="$green11">{bestq.percentage}%</Text>
                              </Circle>

                              <YStack bg="$green2" h={8} br="$4" overflow="hidden">
                                  <XStack bg="$green10" h={8} width={`${bestq.percentage}%`}>

                                  </XStack>

                              </YStack>

                            </XStack>
                          </Card>
                    ))}
                 </YStack>
           
              </YStack>
               
           </ScrollView>

        </SafeAreaView>

     )};


