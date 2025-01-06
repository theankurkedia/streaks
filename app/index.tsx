import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar } from '../components/Calendar';
import HabitForm from '../components/HabitForm';
// import MonthlyAnalytics from '../components/MonthlyAnalytics';
import { AddHabitDialog } from '../components/AddHabitDialog';
import { AppBar } from '../components/AppBar';
import { useHabitsStore } from '../store';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  const { habits, addHabit, initialiseHabits, initialiseCompletions } =
    useHabitsStore();

  useEffect(() => {
    initialiseHabits();
    initialiseCompletions();
  }, []);

  const handleLongPress = (date: any) => {
    setModalDate(date);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <AppBar onAddHabit={() => setIsAddHabitDialogVisible(true)} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          {habits?.map((habit: any) => (
            <Calendar key={habit?.id} habit={habit} />
          ))}
          <HabitForm onAddHabit={addHabit} />
          {/* <DailyProgress
            habits={habits}
            habitData={habitData}
            updateHabitCompletion={updateHabitCompletion}
          /> */}
          {/* <MonthlyAnalytics habits={habits} habitData={habitData} /> */}
        </View>
      </ScrollView>
      <AddHabitDialog
        visible={isAddHabitDialogVisible}
        onClose={() => setIsAddHabitDialogVisible(false)}
      />
      {/* <DayDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        date={modalDate}
        habits={habits}
        habitData={habitData}
      /> */}
    </SafeAreaView>
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
  offlineNotice: {
    backgroundColor: '#FFD700',
    color: '#000',
    textAlign: 'center',
    padding: 10,
  },
});
