// ----------------------------- explore screen code here ----------------------------- // 



import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack  , XStack , Text , Card , Button , Input , Circle } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { UserTabScreenProps } from "@/src/types/navigation.types";


type Props = UserTabScreenProps<'Explore'>;


// making dummy data for now  

const CATEGORIES = [
   {id : '1' , name : 'All' , icon : 'apps' , color : '$blue10'},
   {id : '2' , name : 'Restaurant' , icon : 'restaurant' , color : '$orange10'},
   {id : '3' , name : 'Banking' , icon : 'card' , color : '$green10'},
   {id : '4' , name : 'Healthcare' , icon : 'medical' , color : '$red10'},
   {id : '5' , name : 'Government' , icon : 'business' , color : '$purple10'},
];


// hardcoded data for all queues 

const ALL_QUEUES = [

    {
       id : '1',
       name : 'Coffee Shop',
       category : 'Restaurant',
       waitTime : 5,
       peopleWaiting : 8,
       distance : '0.2km',
       rating : 4.7,
       status : 'active',
    },


    {
      id : '2',
      name : 'City Hospital',
      category : 'Healthcare',
      waitTime : 30,
      peopleWaiting : 15,
      distance : '1.5km',
      rating : 4.3,
      status : 'active',
   },

   {
    id : '3',
    name : 'City Bank',
    category : 'Banking',
    waitTime : 12,
    peopleWaiting : 6,
    distance : '0.8km',
    rating : 4.5,
    status : 'active',
  },

  {
    id : '4',
    name : 'Government Office',
    category : 'Government',
    waitTime : 45,
    peopleWaiting : 15,
    distance : '1.4km',
    rating : 4.1,
    status : 'active',
  },

  {
    id : '5',
    name : 'Food Plaza',
    category : 'Restaurant',
    waitTime : 6,
    peopleWaiting : 4,
    distance : '0.9km',
    rating : 4.6,
    status : 'active',
  },

  {
    id : '6',
    name : 'Mr.Clinic',
    category : 'Healthcare',
    waitTime : 4,
    peopleWaiting : 2,
    distance : '1.2km',
    rating : 4.4,
    status : 'active',
  }
];



// ----------------- main screen function start --------------------- //

export default function ExploreScreen({ navigation} : Props) {

    const [selectedCategory , setSelectedCategory] = useState('1');
    const [searchQuery , setSearchQuery] = useState('');


    //handling text change in all input fields 

    const handleTextChange = (setter : (value : string) => void) => (value : any) => {
         const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
         setter(text);
    };


    //filtering the queues 
    // matching the category of the selected queue by user 


    const filteredQueues = ALL_QUEUES.filter((queue) => {
        const matchesCategory = selectedCategory === '1' || queue.category === CATEGORIES.find((c) => c.id === selectedCategory)?.name;

        const matchesSearch = searchQuery === '' || queue.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });


    // category icon method to get icons 

    const getCategoryIcon = (category : string) => {
        switch(category) {

           case 'Restaurant':
            return 'restaurant';
           
           case 'HealthCare':
            return 'medical';
            
           case 'Government':
            return 'business';

           case 'Banking':
            return 'card';
           
           default:
            return 'business';
        }
    };


    return (

       <SafeAreaView style={{flex : 1 , backgroundColor : 'white'}}>
         <YStack flex={1}>

             {/* header part  */}

             <YStack px="$6" pt="$4" pb="$3" borderBlockWidth={1} borderBottomColor="$gray4">

                <Text fontSize="$9" fontWeight="bold" color="$gray12" mb="$4">Explore Queues</Text>

                {/* search queues   */}

                <XStack bg="$gray2" br="$5" px="$4" ai="center" h={48}>

                   <Ionicons name="search" size={20} color="#9ca3af"/>

                   <Input unstyled flex={1} placeholder="Search for queues..."
                     value={searchQuery} onChangeText={handleTextChange(setSearchQuery)} size="$4" ml="$3" placeholderTextColor="$gray10"/>

                     {searchQuery && (
                         <Button unstyled onPress={() => setSearchQuery('')} pressStyle={{opacity : 0.6}}>
                              <Ionicons name="close-circle" size={24} color="$9ca3af"/>
                         </Button>
                     )}
                </XStack>
             </YStack>

            
            {/* categories section  */}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{padding : 24 , gap : 12}}>


              {CATEGORIES.map((category) => (
                  
                    <Button key={category.id} unstyled onPress={() => setSelectedCategory(category.id)}
                      pressStyle={{scale : 0.95}}>

                        <YStack ai="center" gap="$2" px="$4" py="$3" br="$6" bg={selectedCategory === category.id ? category.color : '$gray2'} minWidth={90}>

                           <Circle size={40} bg={selectedCategory === category.id ? 'white' : '$gray4'}>

                              <Ionicons name={category.icon as any} size={20} color={selectedCategory === category.id ? category.color.replace('$' , '#') : '#6b7280'}/>

                           </Circle>

                           <Text fontSize="$2" fontWeight="600" color={selectedCategory === category.id ? 'white' : '$gray11'}>

                           </Text>
                        </YStack>
                    </Button>
              ))}
            </ScrollView>



            {/* queue list  */}

            <ScrollView showsVerticalScrollIndicator={false}>
               <YStack px="$6" pb="$6" gap="$3">

                 <Text fontSize="$4" fontWeight="600" color="$gray11" mb="$2">
                   {filteredQueues.length} queues found
                 </Text>


                 {filteredQueues.map((queue) => (

                    <Card key={queue.id} elevate br="$5" p="$4" bg="white" onPress={() => navigation.navigate('QueueDetails' , {queueId : queue.id})} pressStyle={{scale : 0.98}}>

                       <XStack ai="flex-start" gap="$3">
                        <Circle size={60} bg="$gray2">

                           <Ionicons name={getCategoryIcon(queue.category) as any}
                            size={30} color="#3b82f6"/>

                        </Circle> 


                        <YStack flex={1}>
                          <XStack ai="center" jc="space-between" mb="$2">

                            <Text fontSize="$5" fontWeight="bold" color="$gray12">
                              {queue.name}
                            </Text>

                            <XStack bg="$green2" px="$2" py="$1" br="$2" ai="center" gap="$1">

                              <Circle size={6} bg="$green10"/>
                                <Text fontSize="$1" color="$gray11" fontWeight="600">ACTIVE</Text>

                            </XStack>
                          </XStack>

                          <Text fontSize="$2" color="$gray10" mb="$3">{queue.category}</Text>



           {/* card items - location , time , distance  */}
     
                          <XStack gap="$3" mb="$3" ai="center">

                             <XStack ai="center" gap="$1">
                               <Ionicons name="time-outline" size={16} color="#6b7280"/>

                               <Text fontSize="$3" color="$gray11">{queue.waitTime} min</Text>
                             </XStack>
                             
                          <XStack ai="center" gap="$1">
                             <Ionicons name="people-outline" size={16} color="#6b7280"/>

                              <Text fontSize="$3" color="$gray11">{queue.peopleWaiting} waiting</Text>
                          </XStack>

                        <XStack>
                            <Ionicons name="location-outline" size={16} color="#3b82f6"/>

                               <Text fontSize="$3" color="$blue10">{queue.distance}</Text>

                            </XStack>
                          </XStack>


                          <XStack ai="center" jc="space-between">
                            <XStack ai="center" gap="$1">
                               <Ionicons  name="star" size={16} color="#f59e0b"/>
                               <Text fontSize="$3" fontWeight="600" color="$gray12">{queue.rating}</Text>

                               <Text fontSize="$2" color="$gray10">(245 review)</Text>
                            </XStack>

                            <Button size="$3" bg="$blue10" br="$3" px="$4" pressStyle={{scale : 0.95}}>

                              <Text color="white" fontSize="$2" fontWeight="600">Join Queue</Text>
                            </Button>
                          </XStack>
                        </YStack>
                       </XStack>
                    </Card>
                 ))};

                 {filteredQueues.length === 0 && (
                    <YStack ai="center" jc="center" py="$10">
                       <Circle size={80} bg="$gray2" mb="$4">

                        <Ionicons name="search-outline" size={40} color="#9ca3af" />
                       </Circle>

                       <Text fontSize="$5" fontWeight="600" color="$gray12" mb="$2">
                            No queues found
                       </Text>

                       <Text fontSize="$3" color="$gray10" ta="center">
                         Try adjusting your search or category
                       </Text>
                    </YStack>
                 )}



               </YStack>
            </ScrollView>





         </YStack>
       </SafeAreaView>

    )
};







