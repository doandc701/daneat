import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        {/* You can add more screens here that are not part of the tab bar, e.g., Detail, Auth, etc. */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
