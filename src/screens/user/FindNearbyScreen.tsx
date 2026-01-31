// find nearby screen (USER)

import { UserStackScreenProps } from "@/src/types/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Circle, Input, Text, XStack, YStack } from "tamagui";



type Props = UserStackScreenProps<'FindNearby'>;


export default function FindNearbyScreen({navigation} : Props) {
      
    const [refreshing , setRefreshing] = useState(false);
    const [location , setLocation] = useState<string>("Detecting location....");
    const [searchQuery , setSearchQuery] = useState("");

    const [sortBy , setSortBy] = useState<'distance' | 'wait' | 'rating'>('distance');



    // dummy data initially 

    const nearbyQueues = [

       {
         id : '1',
         name : 'Starbucks Coffeee',
         category : 'Restaurant',
         distance : '0.2 km',
         distanceValue : 0.2,
         waitTime : 5,
         peopleWaiting  : 6,
         rating : 4.7,
         address : 'Cannaught Place  , Block A',
       },

       {
        id : '2',
        name : 'HDFC Bank',
        category : 'Banking',
        distance : '0.5 km',
        distanceValue : 0.5,
        waitTime : 15,
        peopleWaiting  : 12,
        rating : 4.3,
        address : 'Janpath Road',
      },

      {
        id : '3',
        category : 'Restaurant',
        distance : '0.8 km',
        distanceValue : 0.8,
        waitTime : 20,
        peopleWaiting  : 15,
        rating : 4.9,
        address : 'Cannaught Place  , Block A',
      },

      {
        id : '4',
        name : 'Milano Cafe',
        category : 'Restaurant',
        distance : '1.2 km',
        distanceValue : 1.2,
        waitTime : 10,
        peopleWaiting  : 6,
        rating : 4.6,
        address : 'Cannaught Place  , Block A',
      },

    ];


    useEffect(() => {
        getLocation();
    } , []);





  // get location function 

  const getLocation = async () => {

      try {
          const {status} = await Location.requestForegroundPermissionsAsync();


          if(status !== 'granted') {
             setLocation('Location permission denied');
            
              Alert.alert('Location Permission' , 'Please enable location services to find nearby queues.');

              return;
          };



          const currentLocation = await Location.getCurrentPositionAsync({});
          
          const address =  await Location.reverseGeocodeAsync({
             latitude :  currentLocation.coords.latitude,

             longitude : currentLocation.coords.longitude,
            });


            if(address[0]) {
               setLocation(`${address[0].city} , ${address[0].region}`);
            }


      } catch(error) {
          setLocation("Unable to detect location");
      }
  };



  const onRefresh = async() => {
     setRefreshing(true);
     await getLocation();
     setTimeout(() => setRefreshing(false) , 1000)
  };


   //handling text input from user

   const handleTextChange = (setter : (value : string) => void) => (value : any) => {
    const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
    setter(text);
};



  const getSortedQueue = () => {
      let sorted = [...nearbyQueues];

      switch(sortBy) {
          case 'distance':
            sorted.sort((a , b) => a.distanceValue - b.distanceValue);
            break;


          case 'wait':
             sorted.sort((a , b) => a.waitTime - b.waitTime);
             break;


         case 'rating':
             sorted.sort((a , b) => b.rating - a.rating);
             break;
      }



      if(searchQuery) {
          sorted = sorted.filter( q => 
              q.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||  
              q.category.toLowerCase().includes(searchQuery.toLowerCase()),            
             )
      };


      return sorted;

  };



   // get category icon 

   const   getCategoryIcon = (category : string) => {
      switch(category) {
         case 'Restaurant': return 'restaurant';
         case 'Banking': return 'card';
         case 'Healthcare' : return 'medical';
         case  'Government' : return 'business';
         default : return 'business';
      }
   };





   return (
     <SafeAreaView style={{flex : 1, backgroundColor : "#f8f9fa"}} edges={["bottom"]}>

        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>


          {/* header part of the screen  */}

          <YStack bg="$green10" px="$6" pb="$8">
            <XStack ai="center" gap="$3" mb="$4">

               <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>
                <Ionicons name="arrow-back" size={24} color="white"/>
               </Button>

               <YStack flex={1}>

                 <Text color="white" fontSize="$8" fontWeight="bold">Find Nearby</Text>


                 <XStack ai="center" gap="$2" mt="$1">
                  <Ionicons name="location" size={16} color="white"/>

                  <Text fontSize="$3" color="white" opacity={0.9}>{location}</Text>
                   
                 </XStack>

               </YStack>


               <Button size="$3" chromeless onPress={getLocation} pressStyle={{opacity : 0.6}}>
                 <Ionicons name="refresh" size={24} color="white"/>
               </Button>

            </XStack>


            {/* search section for the queues  */}

            <Card br="$5" p="$0" bg="white" overflow="hidden">

               <XStack ai="center" px="$4" py="$3">

                 <Ionicons name="search" size={20} color="#9ca3af"/>


                 <Input flex={1} placeholder="Search nearby queues..." value={searchQuery} onChangeText={handleTextChange(setSearchQuery)} borderWidth={0} size="$4" ml="$2"/>

               </XStack>
            </Card>

          </YStack>



          {/* sort according to progress option part here  */}


          <YStack px="$6" mt="$-4" pb="$6">

              {/* options  */}

              <Card elevate br="$5" p="$4" bg="white" mb="$4">

                 <Text fontSize="$4" fontWeight="600" color="$gray11" mb="$3">Sort by</Text>

                 <XStack gap="$2">

                   <Button flex={1} size="$3" bg={sortBy === 'distance' ? '$green10' : '$gray2'} br="$3" onPress={() => setSortBy('distance')} pressStyle={{scale : 0.95}}>

                    <XStack ai="center" gap="$1">

                       <Ionicons name="location" size={16} color={sortBy === 'distance' ? 'white' : "#6b7280"}/>

                       <Text fontSize="$3" fontWeight="600" color={sortBy === 'distance' ? 'white' : '$gray11'}>Distance</Text>


                    </XStack>

                   </Button>


                   <Button flex={1} size="$3" bg={sortBy === 'wait' ? '$green10' : '$gray2'} br="$3" onPress={() => setSortBy('wait')} pressStyle={{scale : 0.95}}>



                    <XStack ai="center" gap="$1">

                       <Ionicons name="time" size={16} color={sortBy === 'wait' ? 'white' : '#6b7280'}/>

                       <Text fontSize="$3" fontWeight="600" color={sortBy === 'wait' ? 'white' : '$gray11'}>Wait Time</Text>

                    </XStack>
                   </Button>


                   <Button br="$3" flex={1} size="$3" onPress={() => setSortBy('rating')} bg={sortBy === 'rating' ? '$green10' : '$gray2'}>

                     <XStack ai="center" gap="$1">

                      <Ionicons name="star" size={16} color={sortBy === 'rating' ? 'white' : '$gray11'}/>

                      <Text fontSize="$3" fontWeight="600" color={sortBy === 'rating' ? 'white' : '$gray11'}>
                        Rating
                      </Text>


                     </XStack>
                   </Button>
                 </XStack>
              </Card>




              {/* net result count  */}


              <Text fontSize="$4" fontWeight="600" color="$gray11" mb="$3">
                {getSortedQueue().length} queues found nearby
              </Text>


                {/* nearby queues list code  */}

            <YStack gap="$3">
                {getSortedQueue().map((queue) => (

                   <Card key={queue.id} elevate br="$6" p="$4" bg="white"  onPress={() => navigation.navigate('QueueDetails' , {queueId : queue.id})} pressStyle={{scale : 0.98}}>


                    <XStack ai="flex-start" gap="$3" mb="$3">

                       <Circle size={56} bg='$gray2'> 
                    
                         <Ionicons name={getCategoryIcon(queue.category) as any} size={28} color="#10b981"/>
                       </Circle>



                       <YStack flex={1}>

                          <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$1">{queue.name}</Text>

                          <Text fontSize="$2" color="$gray11" mb="$2">{queue.address}</Text>


                          <XStack gap="$3" mb="$2">
                             <XStack ai="center" gap="$1">

                               <Ionicons name="location" size={14} color="#10b981"/>

                               <Text fontSize="$2" color="$gray10" fontWeight="600">
                                {queue.distance}
                                </Text>

                             </XStack>


                             <XStack ai="center" gap="$1">

                               <Ionicons name="time" size={14} color="#f97316"/>

                               <Text fontSize="$2" color="$gray11">~{queue.waitTime} min</Text>

                             </XStack>


                             <XStack ai="center" gap="$1">
                               <Ionicons name="people" size={14} color="#6b7280"/>

                               <Text fontSize="$2" color="$gray11">{queue.peopleWaiting}</Text>

                             </XStack>
                          </XStack>



                          <XStack ai="center" jc="space-between">

                             <XStack ai="center" gap="$1">
                               <Ionicons name="star" size={14} color="#f59e0b"/>
                               <Text fontSize="$3" fontWeight="600" color="$gray12">{queue.rating}</Text>
                             </XStack>

                             <Button size="$2" bg="$green10" br="$3" px="$3" pressStyle={{scale : 0.95}}>
                               <Text fontSize="$2" fontWeight="600" color="white">Join Queue</Text>
                             </Button>

                          </XStack>

                       </YStack>
                    </XStack>                     
                  </Card>
                ))}



                {/* sorted queue representation here  */}

                {

                   getSortedQueue().length === 0 && (

                      <Card elevate br="$5" p="$8" bg="white" ai="center">
                         <Circle size={80} bg="$gray2" mb="$4">
                          <Ionicons name="location-outline" size={40} color="$9ca3af"/>
                           </Circle>   


                           <Text fontSize="$3" fontWeight="600" color="$gray12">No queues found</Text>

                           <Text fontSize="$3" color='$gray11' mt="$2" ta="center">Try adjusting your search or location</Text>

                      </Card>

                   )}

            
          </YStack>
        </YStack>
 
        </ScrollView>
     </SafeAreaView>


   );
}


