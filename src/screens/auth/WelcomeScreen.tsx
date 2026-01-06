// welcome screen 

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack , Text , XStack , Button , Card , Circle } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import type  { AuthStackScreenProps } from "@/src/types/navigation.types";

type Props = AuthStackScreenProps<'Welcome'>;

export default function  WelcomeScreen({navigation} : Props) {

    return (
       <SafeAreaView style={{flex : 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
    
       {/* header part  */}

          <YStack pt="$16" pb="$8" px="$6">
            {/* icon  */}

            <YStack ai="center" mb="$8">
              <YStack position="relative">

                <YStack bg="$blue10" p="$8" br="$10" shadowColor="$shadowColor" shadowRadius={20} shadowOpacity={0.3}>
                  <Ionicons name="people-circle" size={90} color="#fff"/>
                </YStack>

                <Circle position="absolute" bottom={-8} right={-8} size={40} bg="$green10" shadowColor="$shadowColor" shadowRadius={8}>
                  <Ionicons name="checkmark" size={20} color="#fff"/>
                </Circle>
              </YStack>
            </YStack>


            {/* title    */}

            <YStack ai="center">
              <Text fontSize="$11" fontWeight="800" color="$blue10Light" ta="center" mb="$2">
                 EzyQ
              </Text>

              <YStack h={6} w={96} bg="$black" br="$10"/>
            </YStack>


            {/* subtitle  */}

            <Text fontSize="$5" color="$gray11" ta="center" fontWeight="500" mt="$1" px="$4">
               Skip the wait , manage your time{'\n'}Join queues instantly⚡
            </Text>
          </YStack>


          <YStack px="$6" py="$6">
            <XStack flexWrap="wrap" jc="space-between">
            <FeatureCard
              icon="time-outline"
              iconColor="#3b82f6"
              title="Real-time"
              description="Live updates"
            />
            <FeatureCard
              icon="notifications-outline"
              iconColor="#8b5cf6"
              title="Notifications"
              description="Never miss turn"
            />
            <FeatureCard
              icon="location-outline"
              iconColor="#10b981"
              title="Find Nearby"
              description="Discover queues"
            />
            <FeatureCard
              icon="shield-checkmark"
              iconColor="#f59e0b"
              title="Secure"
              description="OTP verified"
            />
            </XStack>
          </YStack>

           {/* Spacer */}

        <YStack height={40} />

         <YStack px="$6" pb="$8" gap="$4">

            {/* get started button  */}

            <Button size="$6" theme="blue" onPress={() => navigation.navigate('RoleSelection')}
               br="$6" pressStyle={{scale : 0.98}} shadowColor="$shadowColor" shadowRadius={12} shadowOpacity={0.3}>
              <XStack ai="center" gap="$3">
                <Text color="white" fontSize="$6" fontWeight="bold">Get Started</Text>
                <Ionicons name="arrow-forward-circle" size={28} color="#fff"/>
              </XStack>
            </Button>
         </YStack>
        </ScrollView>
       </SafeAreaView>
    );
}


// feature card props 

interface FeatureCardProps {
   icon : keyof typeof Ionicons.glyphMap;
   iconColor : string;
   title : string;
   description : string;
}

function FeatureCard({ icon , iconColor , title , description} : FeatureCardProps) {
    return (

       <Card width="48%" mb="$4" p="$4" elevate bordered br="$6">

        <YStack bg="$gray2" p="$3" br="$4" als="flex-start" mb="$3">
          <Ionicons name={icon} size={28} color={iconColor}/>
        </YStack>

        <Text fontSize="$4" fontWeight="bold" color="$gray12" mb="$1">
          {title}
        </Text>

        <Text fontSize="$2" color="$gray10">
          {description}
        </Text>
       </Card>
    );
}


