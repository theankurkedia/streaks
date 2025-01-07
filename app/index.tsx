import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar } from '../components/Calendar';
import { AddHabitDialog } from '../components/AddHabitDialog';
import { AppBar } from '../components/AppBar';
import { useHabitsStore } from '../store';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  const { habits, initialiseHabits, initialiseCompletions } =
    useHabitsStore();

  useEffect(() => {
    initialiseHabits();
    initialiseCompletions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <AppBar onAddHabit={() => setIsAddHabitDialogVisible(true)} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          {habits?.map((habit: any) => (
            <Calendar key={habit?.id} habit={habit} />
          ))}
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
    backgroundColor: '#0d1b2a',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
    gap: 16,
  },
  offlineNotice: {
    backgroundColor: '#FFD700',
    color: '#000',
    textAlign: 'center',
    padding: 10,
  },
});
