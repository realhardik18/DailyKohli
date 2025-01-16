import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Settings({ theme, toggleTheme }) {
  const navigation = useNavigation();

  const setCountdownTarget = (target) => {
    let targetDate = new Date();
    switch (target) {
      case 'day':
        targetDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        targetDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'year':
        targetDate = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        targetDate.setMinutes(targetDate.getMinutes() + 50);
    }
    navigation.navigate('Countdown', { targetDate: targetDate.getTime() });
  };

  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Set Countdown Target</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#4a4a4a' : '#007AFF' }]} onPress={() => setCountdownTarget('default')}>
          <Text style={styles.buttonText}>50 Minutes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#4a4a4a' : '#007AFF' }]} onPress={() => setCountdownTarget('day')}>
          <Text style={styles.buttonText}>End of Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#4a4a4a' : '#007AFF' }]} onPress={() => setCountdownTarget('month')}>
          <Text style={styles.buttonText}>End of Month</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#4a4a4a' : '#007AFF' }]} onPress={() => setCountdownTarget('year')}>
          <Text style={styles.buttonText}>End of Year</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.themeContainer}>
        <Text style={[styles.themeText, { color: isDarkMode ? '#fff' : '#000' }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  themeText: {
    fontSize: 18,
    marginRight: 10,
  },
});

