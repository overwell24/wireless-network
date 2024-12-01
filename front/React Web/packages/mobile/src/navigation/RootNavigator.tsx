// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import CafeListScreen from '../screens/CafeListScreen';
import CafeDetailPage from '../screens/CafeDetailPage';

export type RootStackParamList = {
  Main: undefined;
  CafeList: undefined;
  CafeDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CafeList" 
          component={CafeListScreen} 
          options={{ title: '카페 목록' }}
        />
        <Stack.Screen 
          name="CafeDetail" 
          component={CafeDetailPage} 
          options={{ title: '카페 상세' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
