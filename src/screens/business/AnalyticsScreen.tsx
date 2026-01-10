
import { YStack, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={{ flex: 1  , backgroundColor : 'white'}}>
      <YStack f={1} jc="center" ai="center" bg="$background">
        <Text fontSize="$8" fontWeight="bold" color="$gray12">
          Analytics
        </Text>
      </YStack>
    </SafeAreaView>
  );
}