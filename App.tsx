import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MusicProvider } from '@/context/MusicContext';
import PlayerScreen from '@/screens/PlayerScreen';
import LibraryScreen from '@/screens/LibraryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <MusicProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Player">
          <Stack.Screen name="Library" component={LibraryScreen}  options={{ headerShown: false }}/>
          <Stack.Screen name="Player" component={PlayerScreen}  options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </MusicProvider>
  );
}
