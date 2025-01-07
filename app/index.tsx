import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Calendar } from '../components/Calendar';
import { AddEditDialog } from '../components/AddEditDialog';
import { AppBar } from '../components/AppBar';
import { useHabitsStore } from '../store';
import { CalendarSkeleton } from '../components/CalendarSkeleton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Habit } from '../types';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit>();
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  const { habits, initialiseData, isInitialising } = useHabitsStore();

  useEffect(() => {
    initialiseData();
  }, []);

  const openAddEditDialog = (habit?: Habit) => {
    if (habit) {
      setEditHabit(habit);
    }
    setIsAddHabitDialogVisible(true);
  };

  const onDialogClose = () => {
    setIsAddHabitDialogVisible(false);
    setEditHabit(undefined);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {isInitialising ? <CalendarSkeleton /> : null}
        <AppBar onAddHabit={openAddEditDialog} />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            {habits?.map((habit: any) => (
              <Calendar
                key={habit?.id}
                habit={habit}
                onClick={() => openAddEditDialog(habit)}
              />
            ))}
          </View>
        </ScrollView>
        <AddEditDialog
          habit={editHabit}
          visible={isAddHabitDialogVisible}
          onClose={onDialogClose}
        />
        {/* <DayDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        date={modalDate}
        habits={habits}
        habitData={habitData}
      /> */}
      </SafeAreaView>
    </GestureHandlerRootView>
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
