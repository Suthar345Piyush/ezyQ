import { useEffect } from "react";
import { router } from "expo-router";
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from "../src/stores/authStore";

export default function Index() {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role) {  // Add user?.role check
      const timer = setTimeout(() => {
        if (user.role === 'business') {
          router.push('/(business)/(tabs)/dashboard');
        } else {
          router.push('/(user)/(tabs)');  // TS happy now!
        }
      }, 100);

      return () => clearTimeout(timer);
    } else if (!isLoading && !isAuthenticated) {  // Quick unauth redirect
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, user?.role, isLoading]);  // Safe deps



  // Spinner covers all cases
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="bg-blue-50 p-6 rounded-full">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
      <Text className="text-gray-600 text-lg font-medium mt-4">Loading...</Text>
    </View>
  );
}