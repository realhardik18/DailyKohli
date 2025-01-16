import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
export default function Post() {
  const [selectedOption, setSelectedOption] = useState('memory');
  const [inputText, setInputText] = useState('');

  // Get the current date in the format "15th Jan 2024"
  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const daySuffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
    return `${day}${daySuffix} ${month} ${year}`;
  };

  // Render the input field based on the selected option
  const renderInputField = () => {
    switch (selectedOption) {
      case 'memory':
        return (
          <TextInput
            style={styles.input}
            multiline
            placeholder="Type your memory here (100 words limit)"
            placeholderTextColor="#888"
            maxLength={100}
            value={inputText}
            onChangeText={setInputText}
          />
        );
      case 'link':
        return (
          <TextInput
            style={styles.input}
            placeholder="Paste your link here"
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
        );
      case 'promise':
        return (
          <TextInput
            style={styles.input}
            multiline
            placeholder="I promise ____ by the end of 2025"
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
        );
      case 'manifestation':
        return (
          <TextInput
            style={styles.input}
            multiline
            placeholder="I will ___ by the end of 2025"
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
        );
      case 'photo':
        return <Text style={styles.placeholderText}>Photo option selected (implement your photo upload logic here).</Text>;
      case 'goal':
        return <Text style={styles.placeholderText}>Goal option selected (implement your goal input logic here).</Text>;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Display the current date */}
      <Text style={styles.dateText}>{getFormattedDate()}</Text>

      {/* Dropdown to select options */}
      <Picker
        selectedValue={selectedOption}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setSelectedOption(itemValue);
          setInputText(''); // Clear input when option changes
        }}
      >
        <Picker.Item label="Memory" value="memory" />
        <Picker.Item label="Link" value="link" />
        <Picker.Item label="Photo" value="photo" />
        <Picker.Item label="Promise" value="promise" />
        <Picker.Item label="Goal" value="goal" />
        <Picker.Item label="Manifestation" value="manifestation" />
      </Picker>

      {/* Render the input field based on the selected option */}
      {renderInputField()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark theme background
    padding: 20,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});