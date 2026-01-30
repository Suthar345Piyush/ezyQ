// help and support screen (USER)

import { ScrollView , Linking , Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , XStack , Card , Text , Circle , Input , Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { UserStackScreenProps } from "@/src/types/navigation.types";


type Props = UserStackScreenProps<'HelpSupport'>;


export default function HelpSupportScreen({navigation} : Props) {
    
     const [searchQuery , setSearchQuery] = useState("");

     const [expandedFaq , setExpandedFaq] = useState<number | null>(null);



       //handling text  input fields from client 

    const handleTextChange = (setter : (value : string) => void) => (value : any) => {
      const text = typeof value === 'string' ? value : (value?.nativeEvent?.text || '');
      setter(text);
      };


     const faqs = [

       {
         question : "How do I join a queue?",
         answer : "To join a queue, simply search for the business or scan their QR code. Then tap 'Join Queue' and you'll receive your ticket number."
       },

       {
        question : "Can I save my spot if I leave?",
        answer : "Yes! Your spot is saved automatically. You'll receive notifications when your turn is approaching. Make sure notifications are enabled."
       },

       {
        question : "How do I cancel my queue ticket?",
        answer : "Open your active queue ticket and tap 'Leave Queue' . Your spot will be released and the next person will be called."
       },

       {
        question: "What if I miss my turn?",
        answer: "You'll be marked as 'No Show'. Some businesses allow you to rejoin at the end of the queue, while others may require you to join again."
       },

       {
        question: "How accurate are wait time estimates?",
        answer: "Wait times are calculated based on average service times and current queue length. They're estimates and may vary based on actual service times."
       },

       {
        question: "Can I join multiple queues at once?",
        answer: "Yes, you can be in multiple queues simultaneously. Each will have its own ticket and notifications."
       }

     ];


     // contact options 

     const contactOptions = [
        
         { 
          icon : "mail",
          title : "Email Support",
          description : "suppory@ezyq.com",
          color : "#3b92f6",
          action : () => Linking.openURL("mailto:support@ezyq.com")
         },

         {
          icon : "call",
          title : "Phone Support",
          description : "+91 1800-XXX-XXXX",
          color : "#10b981",
          action : () => Linking.openURL("tel:+911234567890"),
         },

        {
          icon : "chatbubbles",
           title : "Live Chat",
           description : "Chat with our team",
           color : "#8b5cf6",
           action : () => Alert.alert("Live Chat" , "Opening chat support..."),
         },


         {
          icon : "logo-whatsapp",
           title : "WhatsApp",
           description : "Message us on whatsapp",
           color : "#25D366",
           action : () => Linking.openURL("https://wa.me//911234567890"),
         }
     ];


     const resources = [
      {
        icon: "book",
        title: "User Guide",
        description: "Complete guide to using EzyQ",
        color: "#f59e0b"
      },
      {
        icon: "videocam",
        title: "Video Tutorials",
        description: "Watch how-to videos",
        color: "#ef4444"
      },
      {
        icon: "newspaper",
        title: "What's New",
        description: "Latest updates and features",
        color: "#06b6d4"
      }
     ];


    // filtering question answer 

     const filteredFaqs = faqs.filter(faq => 
         searchQuery === "" || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );



        return (

           <SafeAreaView style={{flex : 1 , backgroundColor : '#f8f9fa'}}>
             <ScrollView showsVerticalScrollIndicator={false}>
                
                   {/* header  */}

                   <YStack bg="$blue10" px="$6" pt="$6" pb="$8">
                     <XStack ai="center" gap="$3" mb="$4">
                       <Button size="$3" chromeless onPress={() => navigation.goBack()} pressStyle={{opacity : 0.6}}>

                         <Ionicons name="arrow-back" size={24} color="white"/>
                         
                       </Button>

                       <YStack flex={1}>
                         <Text color="white" fontSize="$8" fontWeight="bold">Help & Support</Text>

                         <Text color="white" fontSize="$3" opacity={0.9} mt="$1">We're here to help you</Text>
                         
                       </YStack>

                     </XStack>


                     {/* search  */}

                     <Card br="$5" p="$0" bg="white" overflow="hidden">

                       <XStack ai="center" px="$4" py="$3">

                         <Ionicons name="search" size={20} color="#9ca3af"/>

                         <Input flex={1} placeholder="Search for help..." value={searchQuery} onChangeText={handleTextChange(setSearchQuery)}  size="$4" borderWidth={0} ml="$2"/>


                       </XStack>
                     </Card>

                </YStack>


                <YStack px="$6" mt="$-4" pb="$6">
                    
                      {/* quick contact place  */}

                      <YStack mb="$4">

                         <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">Contact Us</Text>

                         <YStack gap="$3">

                           {contactOptions.map((option , index) => (

                               <Card key={index} elevate br="$5" p="$4" bg="white" onPress={option.action} pressStyle={{scale : 0.98}}>

                                   <XStack ai="center" gap="$3">
                                     <Circle size={50} bg="$gray2">

                                       <Ionicons name={option.icon as any} size={26} color={option.color}/>
                                       
                                     </Circle>

                                     <YStack flex={1}>

                                       <Text fontSize="$4" color="$gray11" mt="$1">{option.title}</Text>

                                     </YStack>

                                     <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>

                                   </XStack>
                               </Card>
                           ))}

                         </YStack>
                      </YStack>


                      {/* faq's section  */}


                      <YStack mb="$4">

                         <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">Frequently Asked Questions</Text>

                         <YStack gap="$3">

                           {filteredFaqs.map((faq , index) => (

                              <Card key={index} br="$5" p="$4" bg="white" onPress={() => setExpandedFaq(expandedFaq === index  ? null : index)} pressStyle={{scale : 0.98}}>

                                <XStack ai="center" jc="space-between" mb={expandedFaq === index ? '$3' : 0}>

                                   <Text fontSize="$4" fontWeight="600" color="$gray12">
                                      {faq.question}
                                   </Text>

                                   <Ionicons name={expandedFaq === index ? 'chevron-up' : 'chevron-down'} size={20} color="#9ca3af"/>

                                </XStack>

                                {expandedFaq === index && (

                                   <Text fontSize="$3" color="$gray11" lineHeight={20}>
                                    {faq.answer}
                                    </Text>

                                )}

                              </Card>

                           ))}

                           {filteredFaqs.length === 0 && (

                              <Card elevate br="$5" p="$8" bg="white" ai="center">

                                 <Circle size={60} bg="$gray2" mb="$3">

                                   <Ionicons name="search-outline" size={30} color="#9ca3af"/>

                                 </Circle>

                                 <Text fontSize="$4" fontWeight="600" color="$gray12">
                                  No results found
                                 </Text>

                              </Card>
                           )}
                           
                         </YStack>

                      </YStack>



                      {/* resources  */}

                      <YStack mb="$4">

                         <Text fontSize="$5" fontWeight="bold" color="$gray12" mb="$3">Resources</Text>

                         <YStack>

                           {resources.map((resource , index) =>
                            (
                              <Card key={index} elevate br="$5" p="$4" bg="white" pressStyle={{scale : 0.98}}>

                                 <XStack ai="center" gap="$3">
                                   
                                    <Circle size={50} bg="$gray2">

                                       <Ionicons name={resource.icon as any} size={26} color={resource.color}/>
                                    </Circle>

                                    <YStack flex={1}>

                                       <Text fontSize="$4" fontWeight="600" color="$gray12">{resource.title}</Text>

                                       <Text fontSize="$3" color="$gray11" mt="$1">
                                        {resource.description}
                                       </Text>
                                    </YStack>

                                    <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>

                                 </XStack>
                                  
                              </Card>
                           ))}
                         </YStack>
                      </YStack>


                      {/* 24/7 support section last */}


                      <Card elevate br="$5" p="$5" bg="$blue2" mb="$4">

                         <XStack ai="center" gap="$3">

                           <Circle size={50} bg="$blue10">

                             <Ionicons name="headset" size={26} color="white"/>
                           </Circle>

                           <YStack flex={1}>

                             <Text fontSize="$5" fontWeight="bold" color="$blue11" mb="$1">Still need help?</Text>

                             <Text fontSize="$3" color="$blue11" lineHeight={20}>
                                Our Support team is available 24/7 to assist you
                             </Text>

                           </YStack>

                         </XStack>


                         <Button size="$4" bg="$blue10" br="$4" mt="$4" pressStyle={{scale : 0.98}}>
                            
                             <Text fontSize="$4" fontWeight="600" color="white">Contact Support</Text>

                         </Button>

                      </Card>

                </YStack>

             </ScrollView>
           </SafeAreaView>

        )

}