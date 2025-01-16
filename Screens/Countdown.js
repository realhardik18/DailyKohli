import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Countdown({ theme }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [targetDate, setTargetDate] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const { width: screenWidth } = Dimensions.get('window');
  // Calculate adaptive font sizes with maximum limits
  const timerFontSize = Math.min(screenWidth * 0.08, 40); // Reduced from 0.1
  const dateFontSize = Math.min(screenWidth * 0.035, 16);  // Reduced from 0.04
  const instructionFontSize = Math.min(screenWidth * 0.03, 14); // Reduced from 0.035

  useEffect(() => {
    const target = route.params?.targetDate || Date.now() + 50 * 60 * 1000;
    setTargetDate(new Date(target));
  }, [route.params?.targetDate]);

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      setTimeLeft(Math.max(0, difference));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const handlePressIn = () => {
    setLongPressTimer(
      setTimeout(() => {
        navigation.navigate('Settings');
      }, 5000)
    );
  };

  const handlePressOut = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  const isDarkMode = theme === 'dark';

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable
        style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.timerContainer}>
          <Text 
            style={[
              styles.timerText, 
              { 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: timerFontSize,
              }
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatTime(timeLeft)}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text 
            style={[
              styles.targetDateText, 
              { 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: dateFontSize,
              }
            ]}
            numberOfLines={1}
          >
            Timer until: {targetDate?.toLocaleString()}
          </Text>
          
          <Text 
            style={[
              styles.instructionText, 
              { 
                color: isDarkMode ? '#fff' : '#000',
                fontSize: instructionFontSize,
              }
            ]}
            numberOfLines={1}
          >
            Press and hold for 5 seconds to access settings
          </Text>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  targetDateText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionText: {
    textAlign: 'center',
  },
});