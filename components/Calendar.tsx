import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { formatDate } from '../utils/date';

interface Props {
  habit: {
    id: string;
    name: string;
    icon?: string;
  };
  habitData: Record<string, Record<string, boolean>>;
  onToggleDate: (date: Date) => void;
}

export function Calendar({ habit, habitData, onToggleDate }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const BOX_SIZE = 10;
  const MARGIN = 2;
  const GRID_SIZE = BOX_SIZE + MARGIN * 2;
  const TOTAL_DAYS = 364; // 52 weeks * 7 days
  const WEEKS = 52;

  const calendarData = useMemo(() => {
    if (!habit) return [];

    const today = new Date();
    return Array.from({ length: TOTAL_DAYS + 1 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (TOTAL_DAYS - index));
      const dateString = formatDate(date);
      return {
        date,
        completed: habitData[dateString]?.[habit?.id] || false,
      };
    });
  }, [habit?.id, habitData]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  }, []);

  if (!habit) return null;

  const getContributionColor = (completed: boolean) => {
    return completed ? '#39D353' : '#161B22';
  };

  const getContributionCount = () => {
    return calendarData.filter(day => day.completed).length;
  };

  const renderGrid = () => {
    return calendarData.map((day, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.contributionBox,
          {
            backgroundColor: getContributionColor(day.completed),
            position: 'absolute',
            top: (index % 7) * GRID_SIZE,
            left: Math.floor(index / 7) * GRID_SIZE,
          },
        ]}
        onPress={() => onToggleDate(day.date)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.contributionCount}>
            {getContributionCount()} contributions in the last year
          </Text>
        </View>
        <TouchableOpacity
          style={styles.todayButton}
          onPress={() => onToggleDate(new Date())}
        >
          <Text style={styles.todayButtonText}>Mark Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View
          style={[
            styles.contributionGrid,
            {
              width: WEEKS * GRID_SIZE,
              height: 7 * GRID_SIZE,
            },
          ]}
        >
          {renderGrid()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1117',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contributionCount: {
    color: '#8B949E',
    fontSize: 12,
    marginTop: 4,
  },
  todayButton: {
    backgroundColor: '#238636',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  todayButtonText: {
    color: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  contributionGrid: {
    position: 'relative',
  },
  contributionBox: {
    width: 10,
    height: 10,
    margin: 2,
    borderRadius: 2,
  },
});
