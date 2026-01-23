// queue creation screen code here 


import { ScrollView , KeyboardAvoidingView , Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Circle , Button , Input , TextArea} from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { BusinessTabScreenProps } from "@/src/types/navigation.types";



type Props = BusinessTabScreenProps<'CreateQueues'>;

export default function CreateQueueScreen({navigation} : Props) {
        
    //  queue creation form 

    const [formData , setFormData] = useState({
        name : "",
        category : "",
        description : "",
        maxCapacity : "",
        estimatedTime : "",
    });

    const categories = [
        {id : '1' , name : 'Service' , icon : 'people' , color : '$gray10'},
        {id : '2' , name : 'Support' , icon : 'headset' , color : '$blue10'},
        {id : '3' , name : 'Express' , icon : 'flash' , color : '$orange10'},
        {id : '4' , name : 'VIP' , icon : 'star' , color : '$purple10'},
        {id : '5' , name : 'General' , icon : 'list' , color : '$gray10'},
    ];



    const [selectedCategory , setSelectedCategory] = useState("");


    // queue creation handle function 

    const handleCreate = () => {
       console.log("Creating queue with:" , {...formData , category :selectedCategory});

       navigation.goBack();
    };



    return (
        <SafeAreaView style={{flex : 1 , backgroundColor : "#f8f9fa"}}>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex : 1}}>

             <ScrollView showsVerticalScrollIndicator={false}>

               <YStack bg="$green10" px="$6" pt="$6" pb="%8">
                 <XStack ai="center" gap="$3" mb="$2">
                   
                  <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>

                    <Ionicons name="arrow-back" size={24} color="white" />
                  </Button>

                  <YStack flex={1}>
                     <Text fontSize="$8" fontWeight="bold" color="white">Create Queue</Text>

                     <Text fontSize="$3" color="white" opacity={0.9} mt="$1">Set up a new queue</Text>

                  </YStack>
                 </XStack>
               </YStack>


   {/* form space card  */}

               <YStack px="$6" mt="$-4" pb="$6">
                 <Card elevate br="$5" p="$5" bg="white" mb="$4">

                  <YStack gap="$4">

                    <YStack gap="$2">

                      <Text fontSize="$4" fontWeight="600" color="$gray12">Queue Name *</Text>

                      <Input 
                         placeholder="e.g., General Service"
                         value={formData.name}
                         onChangeText={(text) => setFormData({...formData , name : text as any})}
                         borderColor="$gray5"
                         focusStyle={{borderColor : '$green10'}}
                         size="$4"
                         p="$3"
                         />

                    </YStack>




                    {/* category part  */}

                    <YStack gap="$2">
                       <Text fontSize="$4" fontWeight="600" color="$gray12">Category *</Text>

                       <XStack gap="$2" flexWrap="wrap">
                         {categories.map((cate) => (
                            
                             <Button key={cate.id} size="$3" bg={selectedCategory === cate.name ? cate.color : '$gray2'} onPress={() => setSelectedCategory(cate.name)} pressStyle={{scale : 0.95}}>


                              <XStack ai="center" gap="$2">

                                <Ionicons name={cate.icon as any} size={16} color={selectedCategory === cate.name ? 'white' : '#6b7280'}/>

                                <Text fontSize="$3" fontWeight="600" color={selectedCategory === cate.name ? 'white' : '$gray11'}>{cate.name}</Text>

                              </XStack>
                            </Button>

                         ))}
                       </XStack>
                    </YStack>


                    {/* long description about queue   */}

                    <YStack gap="$2">
                       <Text fontSize="$4" fontWeight="600" color="$gray12">Description</Text>



                       <TextArea 
                         placeholder="Describe your queue..."
                         value={formData.description}
                         onChangeText={(text) => setFormData({...formData , description : text as any})} borderColor="$gray5" focusStyle={{borderColor : '$green10'}}

                         p="$3" size="$4" numberOfLines={4} 
                          />
                    </YStack>



                    {/* maximum capacity of the queue  */}

                    <YStack gap="$2">
                       <Text fontSize="$4" fontWeight="600" color="$gray12">Maximum Capacity *</Text>

                      

                       <Input placeholder="e.g., 50" value={formData.maxCapacity} onChangeText={(text) => setFormData({...formData , maxCapacity : text as any})} keyboardType="numeric" borderColor="$gray5" focusStyle={{borderColor : '$green10'}} size="$4" p="$3"/>

                    </YStack>


                    {/* service time   */}


                    <YStack gap="$2">
                       <Text fontSize="$4" fontWeight="600" color="$gray12">Est. Service Time (minutes)*</Text>

                      

                       <Input placeholder="e.g., 50" value={formData.estimatedTime} onChangeText={(text) => setFormData({...formData , estimatedTime : text as any})} keyboardType="numeric" borderColor="$gray5" focusStyle={{borderColor : '$green10'}} size="$4" p="$3"/>

                    </YStack>


                  </YStack>
                 </Card>



                 {/* info card  */}

                 <Card bg="$blue2" br="$5" p="$4" mb="$4">
                   <XStack gap="$3">
                     <Circle size={40} bg="$blue10">
                       <Ionicons name="information" size={24} color="white"/>
                     </Circle>

                     <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$blue11" mb='$1'>
                        Queue Tips
                      </Text>

                      <Text fontSize="$3" color="$blue11" lineHeight={20}> Set realistic capacity and service times. You can always adjust these later from queue settings.
</Text>

                     </YStack>



                   </XStack>
                 </Card>


                  {/* button at the end   */}

                  <Button size="$5" bg="$green10" br="$4" onPress={handleCreate} pressStyle={{scale : 0.98}} disabled={!formData.name || !selectedCategory || !formData.maxCapacity || !formData.estimatedTime} opacity={!formData.name ||  !selectedCategory || !formData.maxCapacity || !formData.estimatedTime ? 0.5 : 1}>



                     <XStack ai="center" gap="$2">
                       <Ionicons name="add-circle" size={24} color="white"/>
                       <Text fontSize="$5" fontWeight="600" color="white">Create Queue</Text>
                     </XStack>
                  </Button>


                  <Button size="$4" chromeless br="$4" mt="$3" onPress={() => navigation.goBack()}
                   pressStyle={{opacity : 0.6}}>

                    <Text fontSize="$4" color="$gray11">Cancel</Text>

                  </Button>

               </YStack>

             </ScrollView>
             
          </KeyboardAvoidingView>
        </SafeAreaView>
    )
};



