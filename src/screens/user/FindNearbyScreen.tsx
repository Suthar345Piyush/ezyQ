// find nearby screen (USER)

import { UserStackScreenProps } from "@/src/types/navigation.types";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



type Props = UserStackScreenProps<'FindNearby'>;


export default function FindNearbyScreen({navigation} : Props) {
      
    const [refreshing , setRefreshing] = useState(false);
    const [location , setLocation] = useState<string>("Detecting location....");
    const [searchQuery , setSearchQuery] = useState("");

    const [sortBy , setSetBuy] = useState<'distance' | 'wait' | 'rating'>('distance');



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
        distance : '0.2 km',
        distanceValue : 0.2,
        waitTime : 5,
        peopleWaiting  : 6,
        rating : 4.7,
        address : 'Cannaught Place  , Block A',
      },

      {
        id : '4',
        name : 'Starbucks Coffeee',
        category : 'Restaurant',
        distance : '0.2 km',
        distanceValue : 0.2,
        waitTime : 5,
        peopleWaiting  : 6,
        rating : 4.7,
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

             longitude : currentLocation.coords.latitude,
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



  const sortedQueue = () => {
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
     <SafeAreaView style={{flex : 1, backgroundColor : "#f8f9fa"}}>

        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>


          {/* header part of the screen  */}


          
           
        </ScrollView>
     </SafeAreaView>
   )









}