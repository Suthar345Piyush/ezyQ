import '../global.css';
import { useEffect, useState } from 'react';  // Re-add useState if you removed it
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { databaseService } from '../src/services/database/database.service';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {
  const [error, setError] = useState<string | null>(null);

  const initialize = useAuthStore(state => state.initialize);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await databaseService.intialize();
      console.log('DB ready');

      console.log('Initializing auth...');
      await initialize();
      console.log('Auth ready');
    } catch (err) {
      console.error('App initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize app');
    }
  };

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 w-full max-w-sm">
          <Text className="text-red-600 text-xl font-bold text-center mb-2">Error</Text>
          <Text className="text-red-700 text-base text-center mb-4">{error}</Text>
          <Text className="text-red-600 text-sm text-center">Please restart the app</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Register root index */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Register your groups—TypeScript now knows these paths exist */}
        
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen name="(business)" options={{ headerShown: false }} />
        
        <Slot />  {/* Outlet for rendering actual screens */}
      </Stack>
    </>
  );
}