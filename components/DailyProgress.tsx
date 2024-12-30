import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DailyProgress({ habits, selectedDate, habitData, updateHabitCompletion }: any) {
  const dateString = selectedDate.toISOString().split('T')[0];
  const dayData = habitData[dateString] || {};

  const animatedValues = useRef(habits.map(() => new Animated.Value(0))).current;

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
      {habits.map((habit: any, index: any) => (
        <TouchableOpacity
          key={habit.id}
          style={styles.habitRow}
          onPress={() => handleToggle(habit.id)}
        >
          <Text style={styles.habitName}>{habit?.name}</Text>
          <Animated.View style={[
            styles.checkbox,
            {
              backgroundColor: animatedValues[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: ['#fff', '#007AFF'],
              }),
              borderColor: animatedValues[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: ['#666', '#007AFF'],
              }),
            },
          ]}>
            <Ionicons
              name={dayData[habit.id] ? 'checkmark' : 'square-outline'}
              size={20}
              color="#fff"
            />
          </Animated.View>
        </TouchableOpacity>
      ))}
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

