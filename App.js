import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native'; // Use this if on React Native 0.63+
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Countdown from './Screens/Countdown';
import Settings from './Screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  const deviceTheme = useColorScheme(); // Get system theme
  const [theme, setTheme] = useState(deviceTheme); // Initialize theme state

  // Update theme when system theme changes
  useEffect(() => {
    setTheme(deviceTheme);
  }, [deviceTheme]);

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Countdown">
        <Stack.Screen name="Countdown" options={{ headerShown: false }}>
          {(props) => <Countdown {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" options={{ headerShown: true }}>
          {(props) => <Settings {...props} theme={theme} toggleTheme={toggleTheme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}