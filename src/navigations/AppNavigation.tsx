import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Homescreen';
import DetailScreen from '../screens/DetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { setSearchMovies } from '../features/movies/moviesSlice';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useAppDispatch();



  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
