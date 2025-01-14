import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Calendar } from '../components/Calendar';
import { AddEditDialog } from '../components/AddEditDialog';
import { AppBar } from '../components/AppBar';
import { useHabitsStore } from '../store';
import { CalendarSkeleton } from '../components/CalendarSkeleton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Habit } from '../types';
import { registerForPushNotificationsAsync } from '../src/utils/notifications';

export default function App() {
  const [selectedHabit, setSelectedHabit] = useState<Habit>();
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  const { habits, initialiseData, isInitialising, saveNotifToken } =
    useHabitsStore();

  useEffect(() => {
    initialiseData();
    if (Platform.OS === 'android') {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          // Store token in your backend or local storage
          // saveNotifToken(token.data);
        }
      });
    }
  }, []);

  const openAddEditDialog = (habit?: Habit) => {
    if (habit) {
      setSelectedHabit(habit);
    } else {
      setSelectedHabit(undefined);
    }
    setIsAddHabitDialogVisible(true);
  };

  const onDialogClose = () => {
    setIsAddHabitDialogVisible(false);
    setSelectedHabit(undefined);
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
          habit={selectedHabit}
          visible={isAddHabitDialogVisible}
          onClose={onDialogClose}
        />
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
