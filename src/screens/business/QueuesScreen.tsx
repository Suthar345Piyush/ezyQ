// Queues screen - screen with all the queues (search queues) along with their status - active , paused , cancelled 

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView , RefreshControl } from "react-native";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";
import { XStack , YStack , Card , Text , Circle } from "tamagui";
import  {useState , useEffect} from 'react';


type Props = BusinessTabScreenProps<'Queues'>;


// main function for the  screen layout  

export default function QueuesScreen({navigation} : Props) {


     const [refreshing , setRefreshing] = useState(false);
     const [searchQuery , setSearchQuery] = useState("");

  

  // dummy data

  const QUEUES = [

       {
          id : "1",
          name : "Government Office",
          category : "Government",
          status : "active",
          current_number : "35",
          current_capacity : "26",
          avg_wait_time : "15",
          max_capacity : "40",
          color : "$green10",
       },

       {
        id : "2",
        name : "City Bank",
        category : "Banking",
        status : "active",
        current_number : "25",
        current_capacity : "15",
        avg_wait_time : "10",
        max_capacity : "30",
        color : "$blue10",
     },

     {
      id : "3",
      name : "City Hospital",
      category : "Healthcare",
      status : "active",
      current_number : "43",
      current_capacity : "60",
      avg_wait_time : "20",
      max_capacity : "120",
      color : "$red10",
   },

   {
    id : "4",
    name : "Food Coffee",
    category : "Restaurant",
    status : "paused",
    current_number : "25",
    current_capacity : "12",
    avg_wait_time : "5",
    max_capacity : "20",
    color : "$gray10",
  },

  {
    id : "5",
    name : "Mr.Cineplex",
    category : "Entertainment",
    status : "active",
    current_number : "45",
    current_capacity : "50",
    avg_wait_time : "5",
    max_capacity : "80",
    color : "$black10",
 },
  
 {
  id : "6",
  name : "Mr.Clinic",
  category : "Healthcare",
  status : "active",
  current_number : "30",
  current_capacity : "12",
  avg_wait_time : "15",
  max_capacity : "25",
  color : "$red10",
},
      ];



      <YStack>
         
      </YStack>








}
