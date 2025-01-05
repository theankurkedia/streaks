import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

interface AppBarProps {
  onAddHabit: () => void;
}

export function AppBar({ onAddHabit }: AppBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Streaks</Text>
      <TouchableOpacity onPress={onAddHabit} style={styles.addButton}>
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
});
