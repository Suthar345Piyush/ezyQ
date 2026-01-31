// ScanQRScreen.tsx
import { UserStackScreenProps } from "@/src/types/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Circle, Text, XStack, YStack } from "tamagui";

type Props = UserStackScreenProps<'ScanQR'>;

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

export default function ScanQRScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    getCameraPermission();
  }, []);

  const getCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    
    // parsing the qr data in format - assuming format: "ezyq://queue/{queueId}"



    try {
      if (data.startsWith('ezyq://queue/')) {
        const queueId = data.replace('ezyq://queue/', '');
        



        Alert.alert(
          'Queue Found!',
          'Would you like to join this queue?',
          [
            {
              text: 'Cancel',
              onPress: () => setScanned(false),
              style: 'cancel'
            },
            {
              text: 'Join',
              onPress: () => {
                navigation.navigate('QueueDetails', { queueId });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not a valid queue code',
          [{ text: 'Try Again', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to read QR code',
        [{ text: 'Try Again', onPress: () => setScanned(false) }]
      );
    }
  };




  if (hasPermission === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <YStack flex={1} ai="center" jc="center" px="$6">
          <Circle size={80} bg="$gray2" mb="$4">
            <Ionicons name="camera" size={40} color="#9ca3af" />
          </Circle>
          <Text fontSize="$5" fontWeight="600" color="white" ta="center">
            Requesting camera permission...
          </Text>
        </YStack>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <YStack flex={1} ai="center" jc="center" px="$6">
          <Circle size={80} bg="$red2" mb="$4">
            <Ionicons name="camera-outline" size={40} color="#ef4444" />
          </Circle>
          <Text fontSize="$6" fontWeight="bold" color="white" ta="center" mb="$2">
            Camera Access Denied
          </Text>
          <Text fontSize="$3" color="$gray11" ta="center" mb="$4">
            Please enable camera permissions in your device settings to scan QR codes
          </Text>
          <Button 
            size="$4" 
            bg="$blue10" 
            br="$4"
            onPress={() => navigation.goBack()}
            pressStyle={{ scale: 0.98 }}
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              Go Back
            </Text>
          </Button>
        </YStack>
      </SafeAreaView>
    );
  }





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <YStack flex={1}>

        {/* Header part */}


        <XStack ai="center" jc="space-between" px="$6" py="$4">
          <Button 
            size="$3" 
            chromeless 
            onPress={() => navigation.goBack()}
            pressStyle={{ opacity: 0.6 }}
          >
            <Ionicons name="close" size={28} color="white" />
          </Button>
          
          <Text fontSize="$5" fontWeight="bold" color="white">
            Scan QR Code
          </Text>

          <Button 
            size="$3" 
            chromeless 
            onPress={() => setFlashOn(!flashOn)}
            pressStyle={{ opacity: 0.6 }}
          >
            <Ionicons 
              name={flashOn ? "flash" : "flash-off"} 
              size={28} 
              color="white" 
            />
          </Button>
        </XStack>



        {/* Camera View section */}



        <YStack flex={1} ai="center" jc="center">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />



          {/* Overlay of the screen */}


          <YStack ai="center" jc="center" flex={1}>


            {/* Top overlay */}



            <YStack 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              height={(Dimensions.get('window').height - qrSize) / 2}
              bg="rgba(0,0,0,0.5)"
            />



            {/* QR Frame Container */}


            <YStack ai="center" jc="center">


              {/* Left overlay */}


              <YStack 
                position="absolute" 
                top={0} 
                bottom={0} 
                left={-(width - qrSize) / 2} 
                width={(width - qrSize) / 2}
                bg="rgba(0,0,0,0.5)"
              />



              {/* Right overlay */}


              <YStack 
                position="absolute" 
                top={0} 
                bottom={0} 
                right={-(width - qrSize) / 2} 
                width={(width - qrSize) / 2}
                bg="rgba(0,0,0,0.5)"
              />



              {/* QR Frame */}


              <YStack 
                width={qrSize} 
                height={qrSize} 
                borderWidth={3} 
                borderColor="white" 
                borderRadius={20}
                position="relative"
              >



                {/* Corner brackets */}


                <YStack position="absolute" top={-3} left={-3} width={40} height={40} borderLeftWidth={5} borderTopWidth={5} borderColor="#3b82f6" borderTopLeftRadius={20} />
                <YStack position="absolute" top={-3} right={-3} width={40} height={40} borderRightWidth={5} borderTopWidth={5} borderColor="#3b82f6" borderTopRightRadius={20} />
                <YStack position="absolute" bottom={-3} left={-3} width={40} height={40} borderLeftWidth={5} borderBottomWidth={5} borderColor="#3b82f6" borderBottomLeftRadius={20} />
                <YStack position="absolute" bottom={-3} right={-3} width={40} height={40} borderRightWidth={5} borderBottomWidth={5} borderColor="#3b82f6" borderBottomRightRadius={20} />




                {/* Scanning line animation */}


                {!scanned && (
                  <YStack 
                    position="absolute" 
                    top={0} 
                    left={0} 
                    right={0} 
                    height={3} 
                    bg="#3b82f6"
                    animation="quick"
                    y={qrSize / 2}
                  />
                )}
              </YStack>
            </YStack>



            {/* Bottom overlay */}


            <YStack 
              position="absolute" 
              bottom={0} 
              left={0} 
              right={0} 
              height={(Dimensions.get('window').height - qrSize) / 2}
              bg="rgba(0,0,0,0.5)"
            />
          </YStack>
        </YStack>




        {/* Instructions part */}


        <YStack px="$6" pb="$8" pt="$4" bg="rgba(0,0,0,0.7)">
          <Card br="$5" p="$4" bg="rgba(255,255,255,0.1)" mb="$3">
            <XStack ai="center" gap="$3">
              <Circle size={50} bg="$blue10">
                <Ionicons name="qr-code" size={28} color="white" />
              </Circle>
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="white" mb="$1">
                  Position the QR code
                </Text>
                <Text fontSize="$3" color="$gray11">
                  Center the QR code within the frame to scan
                </Text>
              </YStack>
            </XStack>
          </Card>



          {scanned && (
            <Card br="$5" p="$4" bg="$blue10">
              <XStack ai="center" gap="$3">
                <Circle size={40} bg="white">
                  <Ionicons name="checkmark" size={24} color="#3b82f6" />
                </Circle>
                <YStack flex={1}>
                  <Text fontSize="$4" fontWeight="600" color="white">
                    QR Code Scanned!
                  </Text>
                  <Text fontSize="$3" color="white" opacity={0.9}>
                    Processing...
                  </Text>
                </YStack>
              </XStack>
            </Card>
          )}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}


