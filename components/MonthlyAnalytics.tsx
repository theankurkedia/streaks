import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MonthlyAnalytics({ habits }: any) {
  // This is a simplified version. In a real app, you'd calculate these values based on actual data.
  const calculateCompletionRate = () => {
    return Math.floor(Math.random() * 101);
  };

  const calculateStreak = () => {
    return Math.floor(Math.random() * 31);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Analytics</Text>
      <View style={styles.grid}>
        {habits.map((habit: any) => (
          <View key={habit.id} style={styles.card}>
            <Text style={styles.cardTitle}>{habit.name}</Text>
            <Text style={styles.completionRate}>{calculateCompletionRate()}%</Text>
            <Text style={styles.completionLabel}>Completion rate</Text>
            <Text style={styles.streak}>{calculateStreak()} days</Text>
            <Text style={styles.streakLabel}>Current streak</Text>
          </View>
        ))}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completionRate: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  completionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  streak: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
  },
});

