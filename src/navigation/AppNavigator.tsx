// navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryScreen from '../screens/LibraryScreen';
import PlayerScreen from '../screens/PlayerScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Library">
    <Stack.Screen name="Library" component={LibraryScreen}  options={{ headerShown: false }}/>
    <Stack.Screen name="Player" component={PlayerScreen}  options={{ headerShown: false }}/>
  </Stack.Navigator>
);

export default AppNavigator;
