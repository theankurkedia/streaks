import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../utils/date';

export default function DailyProgress({
  habits,
  selectedDate,
  habitData,
  updateHabitCompletion,
}: any) {
  const dateString = formatDate(selectedDate);
  const dayData = habitData[dateString] || {};

  const animatedValues = useRef(
    habits.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animatedValues.forEach((value: any, index: any) => {
      Animated.spring(value, {
        toValue: dayData[habits[index].id] ? 1 : 0,
        useNativeDriver: false,
      }).start();
    });
  }, [dayData, habits]);

  const handleToggle = (habitId: any) => {
    const newValue = !dayData[habitId];
    updateHabitCompletion(selectedDate, habitId, newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Progress</Text>
      {habits.map((habit: any, index: any) => {
        return (
          <TouchableOpacity
            key={habit.id}
            style={styles.habitRow}
            onPress={() => handleToggle(habit.id)}
          >
            <Text style={styles.habitName}>{habit?.name}</Text>
            <Ionicons
              name={dayData[habit.id] ? 'checkbox' : 'square-outline'}
              size={20}
              color={dayData[habit.id] ? '#007AFF' : undefined}
            />
          </TouchableOpacity>
        );
      })}
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
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  habitName: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
