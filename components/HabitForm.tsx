import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

export default function HabitForm({ onAddHabit }: any) {
  const [habit, setHabit] = useState({ name: '' });

  const handleSubmit = () => {
    if (habit.name) {
      onAddHabit({ ...habit });
      setHabit({ name: '' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Habit</Text>
      <TextInput
        style={styles.input}
        value={habit.name}
        onChangeText={(text) => setHabit({ ...habit, name: text })}
        placeholder='e.g., Exercise'
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
