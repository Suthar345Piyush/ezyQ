// business dashboard screen code here 

import { ScrollView , RefreshControl} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Button , Circle , Spinner } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState , useEffect } from "react";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";
import { useAuthStore } from "@/src/stores/authStore";
import {QueueRepository} from "@/src/services/database/repositories/QueueRepository";


type Props = BusinessTabScreenProps<'Dashboard'>;



export default function DashboardScreen({navigation} : Props) {
   

     const {user} = useAuthStore();
     const [refreshing , setRefreshing] = useState(false);
     const [loading , setLoading] = useState(true);

     const [stats , setStats] = useState({
        total_queues : 0,
        active_queues : 0,
        total_customers : 0,
        total_served : 0,
     });


     const [activeQueues , setActiveQueues] = useState<any[]>([]);


     useEffect(() => {
        if(user?.id){
           loadDashboard();
        }
     } , [user]);



     // load dashboard function 

     const loadDashboard = async () =>  {

         if(!user?.id) return;


         try {
            setLoading(true);

            //  getting business stats 
            const businessStats = await QueueRepository.getBusinessStats(user?.id);
             
            setStats(businessStats);

            // getting active queues 

            const queues = await QueueRepository.getByBusinessId(user.id);

            const active = queues.filter((q) => q.status === 'active');

            setActiveQueues(active);


         } catch(error){
            console.error('Error loading dashboard:' , error);           
         } finally {
           setLoading(false);
         }
     };



     const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboard();
        setRefreshing(false);
     };


     const getGreeting = () => {
       const hour = new Date().getHours();

       if(hour < 12) return 'Good Morning';
       if(hour > 18) return 'Good Afternoon';

       return 'Good Evening';
     };


     if(loading){
        return (
           <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}}>
            <YStack flex={1} ai="center" jc="center">
               <Spinner size="large" color="$green10"/>
               <Text mt="$4" color="$gray11">Loading Dashboard...</Text>
            </YStack>
           </SafeAreaView>
        )
     };



     return (

        <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}} edges={['bottom']}>
          <ScrollView showsVerticalScrollIndicator={false} refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }>

            {/* header part */}

            <YStack bg="$green10" px="$6" pt="$6" pb="$8">
               <XStack ai="center" jc="space-between" mb="$6">
                
                 <YStack flex={1}>
                   <Text color="white" fontSize="$3" opacity={0.9}>{getGreeting()}</Text>

                   <Text color="white" fontSize="$8" fontWeight="bold" mt="$1">{user?.name || 'Business'}</Text>
                 </YStack>

                 <Circle size={50} bg="white" elevation="$2">
                   <Text fontSize="$6" fontWeight="bold" color="$green10">{user?.name?.charAt(0).toUpperCase() || 'B'}</Text>
                 </Circle>

               </XStack>

                {/* quick stats of the queue   */}

                <XStack gap="$3">
                   <Card flex={1} elevate br="$4" p="$4" bg="white">

                     <Circle size={36} bg="$green2" mb="$3">
                       <Ionicons name="people" size={20} color="#10b981"/>
                     </Circle>

                     <Text fontSize="$7" fontWeight="bold" color="$gray12">
                        {stats.total_customers}
                     </Text>

                     <Text fontSize="$2" color="$gray11" mt="$1">
                       Customers
                     </Text>

                   </Card>


                   <Card flex={1} elevate br="$4" p="$4" bg="white">
                    <Circle size={36} bg="$blue2" mb="$3">
                      <Ionicons name="checkmark-done" size={20} color="#3b82f6"/>
                    </Circle>
                    
                    <Text fontSize="$7" fontWeight="bold" color="$gray12">{stats.total_served}</Text>
                    
                    <Text fontSize="$2" color="$gray11" mt="$1">Served Today</Text>

                   </Card>
                </XStack>
            </YStack>



             {/* stats in card fomat  */}

             <YStack px="$6" mt="$-4" pb="$6">

               <XStack gap="$3" mb="$6">
                 <Card flex={1} elevate br="$5" p="$5" bg="white">
                   <YStack ai="center">

                     <Circle size={60} bg="$green2" mb="$3">
                       <Ionicons name="list" size={30} color="#10b981"/>
                     </Circle>

                     <Text fontSize="$8" fontWeight="bold" color="$gray12">
                       {stats.total_queues} 
                     </Text>
                     
                     <Text fontSize="$3" mt="$1" color="$gray11">
                      Total Queues
                     </Text>
                   </YStack>
                 </Card>


                 <Card flex={1} elevate br="$5" p="$5" bg="white">
                    <YStack ai="center">

                      <Circle size={40} bg="$blue2" mb="$3">
                        <Ionicons name="pulse" size={30} color="#3b82f6"/>
                      </Circle>

                      <Text fontSize="$8" fontWeight="bold" color="$gray12">
                         {stats.active_queues}
                      </Text>

                      <Text fontSize="$3" color="$gray11" mt="$1">
                        Active Now
                      </Text>

                    </YStack>
                 </Card>
               </XStack>



               {/* quick actions for dashboard screen  */}

               <YStack gap="$3" mb="$6">
                  <Text fontSize="$5" fontWeight="bold" color="$gray12">Quick Actions</Text>


                  <XStack gap="$3">
                     <Card flex={1} elevate br="$5" p="$5" bg="$green10" onPress={() => navigation.navigate('Queues')} pressStyle={{scale : 0.98}}>


                      <Circle size={48} bg="white" mb="$3">
                         <Ionicons name="add" size={28} color="$10b981"/>
                      </Circle>

                      <Text fontSize="$4" fontWeight="600" color="white">
                         New Queue 
                      </Text>

                      <Text fontSize="$2" color="white" opacity={0.9} mt="$1">
                         Create & manage
                      </Text>

                     </Card>



                     <Card flex={1} elevate br="$5" p="$5" bg="$blue10" onPress={() => navigation.navigate('Analytics')} pressStyle={{scale : 0.98}}>

                      <Circle size={48} bg="white" mb="$3">
                         <Ionicons name="stats-chart" size={28} color="#3b82f6"/>
                      </Circle>

                      <Text fontSize="$4" fontWeight="600" color="white">Analytics</Text>
                      <Text fontSize="$2" color="white" opacity={0.9} mt="$1">View Insights</Text>

                     </Card>


                  </XStack>
               </YStack>




               {/* active queues in the app  */}

               <YStack gap="$3">
                <XStack ai="center" jc="space-between">

                   <Text fontSize="$5" fontWeight="bold" color="$gray12">Active Queues</Text>

                   <Button chromeless size="$3" onPress={() => navigation.navigate('Queues')} pressStyle={{opacity : 0.6}}>

                     <Text fontSize="$3" color="$green10" fontWeight="600">
                       View All
                     </Text>
                   </Button>
                </XStack>


                {activeQueues.length === 0 ? (

                    <Card elevate br="$5" p="$8" bg="white" ai="center">

                      <Circle size={80} bg="$gray2" mb="$4">

                        <Ionicons name="list-outline" size={40} color="#9ca3af"/>
                      </Circle>
                      
                      <Text fontSize="$5" fontWeight="600" color="$gray12" mb="$2">No active Queues</Text>

                      <Text fontSize="$3" color="$gray10" ta="center" mb="$4">Create your first queue to get started</Text>



                      <Button size="$4" bg="$green10" br="$4" onPress={() => navigation.navigate('Queues')} pressStyle={{scale : 0.98}}>

                         <XStack ai="center" gap="$2">

                           <Ionicons name="add-circle" size={20} color="white"/>

                           <Text fontSize="$4" fontWeight="600" color="white">Create Queue</Text>

                         </XStack>

                      </Button>
                       
                    </Card>

                ) : (
                   activeQueues.slice(0 , 3).map((queue) => {

                      <Card key={queue.id} elevate br="$5" p="$4" bg="white" onPress={() => navigation.navigate('Queues')} pressStyle={{scale : 0.98}}>

                        <XStack ai="center" jc="space-between" mb="$3">

                           <YStack flex={1}>
                            <Text fontSize="$5" fontWeight="bold" color="$gray12">
                             {queue.name}
                            </Text>

                            <Text fontSize="$2" color="$gray10" mt="$1">
                                {queue.category || 'General'}
                            </Text>
                             
                           </YStack>

                           <XStack bg="$green2" px="$3" py="$2" br="$3" ai="center" gap="$1">
                            <Circle size={6} bg="$green10" >
                               <Text fontSize="$2" color="$green11" fontWeight="600">ACTIVE</Text>
                            </Circle>

                           </XStack>

                        </XStack>


                        <XStack gap="$4">
                          <YStack flex={1} bg="$gray2" p="$3" br="$3" ai="center">

                             <Text fontSize="$6" fontWeight="bold" color="$gray12">
                               {queue.current_capacity}
                             </Text>

                             <Text fontSize="$2" color="$gray11">Waiting</Text>
                          </YStack>

                          <YStack flex={1} bg="$gray2" p="$3" br="$3" ai="center">

                            <Text fontSize="$6" fontWeight="bold" color="$gray12">#{queue.current_capacity}</Text>

                            <Text fontSize="$2" color="$gray11">Current</Text>

                          </YStack>

                          <YStack flex={1} bg="$gray2" p="$3" br="$3" ai="center">
                            <Text fontSize="$6" fontWeight="bold" color="$gray12">
                                  {queue.max_capacity}
                            </Text>
                            <Text fontSize="$2" color="$gray11">Capacity</Text>
                          </YStack>

                        </XStack>

                      </Card>
                   })
                )}

               </YStack>

             </YStack>

          </ScrollView>
        </SafeAreaView>
     );

}



