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

                        <YStack>

                        </YStack>

                    </Button>

              ))}

            </ScrollView>
           
         </YStack>
        
       </SafeAreaView>

    )
};







