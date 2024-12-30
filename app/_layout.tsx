import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Calendar from '../components/Calendar';
import DailyProgress from '../components/DailyProgress';
import DayDetailsModal from '../components/DayDetailsModal';
import HabitForm from '../components/HabitForm';
import MonthlyAnalytics from '../components/MonthlyAnalytics';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [habits, setHabits] = useState([
    { id: 1, name: 'Exercise' },
    { id: 2, name: 'Read' },
    { id: 3, name: 'Meditate' },
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitData, setHabitData] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState<any>(null);

  const addHabit = (habit: any) => {
    setHabits([...habits, { id: habits.length + 1, ...habit }]);
  };

  const updateHabitCompletion = (date: any, habitId: any, completed: any) => {
    const dateString = date.toISOString().split('T')[0];
    setHabitData((prevData: any) => ({
      ...prevData,
      [dateString]: {
        ...prevData[dateString],
        [habitId]: completed,
      },
    }));
  };

  const handleLongPress = (date: any) => {
    setModalDate(date);
    setModalVisible(true);
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            habitData={habitData}
            onLongPress={handleLongPress}
          />
          <HabitForm onAddHabit={addHabit} />
          <DailyProgress
            habits={habits}
            selectedDate={selectedDate}
            habitData={habitData}
            updateHabitCompletion={updateHabitCompletion}
          />
          <MonthlyAnalytics habits={habits} />
        </View>
      </ScrollView>
      <DayDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        date={modalDate}
        habits={habits}
        habitData={habitData}
      />
    </SafeAreaView>
    </ThemeProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
