import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ selectedDate, onSelectDate, habitData, onLongPress }: any) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getProgressForDate = (date: any) => {
    const dateString = date.toISOString().split('T')[0];
    const dayData = habitData[dateString];
    if (!dayData) return 0;

    const completedHabits = Object.values(dayData).filter(Boolean).length;
    const totalHabits = Object.keys(dayData).length;
    return totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  };

  const getProgressColor = (progress: any) => {
    if (progress < 33) return '#FF6B6B';
    if (progress < 66) return '#FFD93D';
    return '#6BCB77';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.weekDays}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.days}>
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.emptyDay} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = selectedDate.toDateString() === date.toDateString();
          const progress = getProgressForDate(date);
          const progressColor = getProgressColor(progress);

          return (
            <TouchableOpacity
              key={day}
              style={[styles.day, isSelected && styles.selectedDay]}
              onPress={() => onSelectDate(date)}
              onLongPress={() => onLongPress(date)}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress}%`,
                    backgroundColor: progressColor,
                  }
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDay: {
    color: '#666',
    fontSize: 12,
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayText: {
    fontSize: 14,
  },
  selectedDay: {
    backgroundColor: '#e6f3ff',
  },
  selectedDayText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
  },
});

