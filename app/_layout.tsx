import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Calendar } from '../components/Calendar';
import HabitForm from '../components/HabitForm';
import DailyProgress from '../components/DailyProgress';
// import MonthlyAnalytics from '../components/MonthlyAnalytics';
import DayDetailsModal from '../components/DayDetailsModal';
import SignIn from '../components/SignIn';
import {
  storeHabits,
  getHabits,
  storeHabitData,
  getHabitData,
  addOfflineAction,
  getOfflineActions,
  clearOfflineActions,
} from '../utils/offlineStorage';
import { formatDate } from '../utils/date';
import {
  addHabitToDb,
  getHabitDataFromDb,
  getHabitsFromDb,
  updateHabitCompletionInDb,
} from '../services/habits';
import { AppBar } from '../components/AppBar';
import { AddHabitDialog } from '../components/AddHabitDialog';

function MainApp() {
  const { user, loading } = useAuth();
  const [habits, setHabits] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habitData, setHabitData] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isAddHabitDialogVisible, setIsAddHabitDialogVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        syncOfflineActions();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchHabitData();
    }
  }, [user]);

  const syncOfflineActions = async () => {
    const offlineActions = await getOfflineActions();
    for (const action of offlineActions) {
      if (action.type === 'addHabit') {
        await addHabitToDb(user, action.habit);
      } else if (action.type === 'updateHabitCompletion') {
        await updateHabitCompletionInDb(
          user,
          action.date,
          action.habitId,
          action.completed
        );
      }
    }
    await clearOfflineActions();
  };

  const fetchHabits = async () => {
    if (isOnline && user) {
      const { data, error } = await getHabitsFromDb(user);
      if (error) console.error('Error fetching habits:', error);
      else {
        setHabits(data?.filter(Boolean));
        await storeHabits(data?.filter(Boolean));
      }
    } else {
      const storedHabits = await getHabits();
      setHabits(storedHabits?.filter(Boolean));
    }
  };

  const fetchHabitData = async () => {
    if (isOnline && user) {
      const { data, error } = await getHabitDataFromDb(user);
      if (error) console.error('Error fetching habit data:', error);
      else {
        const formattedData: any = {};
        data.forEach((item: any) => {
          if (!formattedData[item.date]) formattedData[item.date] = {};
          formattedData[item.date][item.habit_id] = item.completed;
        });
        setHabitData(formattedData);
        await storeHabitData(formattedData);
      }
    } else {
      const storedHabitData = await getHabitData();
      setHabitData(storedHabitData);
    }
  };

  const addHabit = async (habit: any) => {
    if (isOnline && user) {
      const newHabit = await addHabitToDb(user, habit);
      setHabits([...habits, newHabit]?.filter(Boolean));
      await storeHabits([...habits, newHabit]?.filter(Boolean));
    } else {
      const newHabit = { ...habit, id: Date.now(), user_id: user?.id };
      setHabits([...habits, newHabit]?.filter(Boolean));
      await storeHabits([...habits, newHabit]?.filter(Boolean));
      await addOfflineAction({ type: 'addHabit', habit: newHabit });
    }
  };

  const updateHabitCompletion = async (
    date: any,
    habitId: any,
    completed: any
  ) => {
    const dateString = formatDate(date);
    setHabitData((prevData: any) => ({
      ...prevData,
      [dateString]: {
        ...prevData[dateString],
        [habitId]: completed,
      },
    }));
    await storeHabitData({
      ...habitData,
      [dateString]: {
        ...habitData[dateString],
        [habitId]: completed,
      },
    });

    if (isOnline && user) {
      await updateHabitCompletionInDb(user, dateString, habitId, completed);
    } else {
      await addOfflineAction({
        type: 'updateHabitCompletion',
        date: dateString,
        habitId,
        completed,
      });
    }
  };

  const handleLongPress = (date: any) => {
    setModalDate(date);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <AppBar onAddHabit={() => setIsAddHabitDialogVisible(true)} />
      {!isOnline && (
        <Text style={styles.offlineNotice}>
          You are offline. Changes will sync when you're back online.
        </Text>
      )}
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          {habits?.map((habit: any) => (
            <Calendar
              key={habit?.id}
              habit={habit}
              habitData={habitData}
              onToggleDate={() => {
                //
              }}
            />
          ))}
          <HabitForm onAddHabit={addHabit} />
          <DailyProgress
            habits={habits}
            selectedDate={selectedDate}
            habitData={habitData}
            updateHabitCompletion={updateHabitCompletion}
          />
          {/* <MonthlyAnalytics habits={habits} habitData={habitData} /> */}
        </View>
      </ScrollView>
      <AddHabitDialog
        visible={isAddHabitDialogVisible}
        onClose={() => setIsAddHabitDialogVisible(false)}
        onAddHabit={addHabit}
      />
      <DayDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        date={modalDate}
        habits={habits}
        habitData={habitData}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
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
