import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits';
const HABIT_DATA_KEY = '@habitData';
const OFFLINE_ACTIONS_KEY = '@offlineActions';

export const storeHabits = async (habits: any) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Error storing habits:', e);
  }
};

export const getHabits = async () => {
  try {
    const habits = await AsyncStorage.getItem(HABITS_KEY);
    return habits ? JSON.parse(habits) : [];
  } catch (e) {
    console.error('Error getting habits:', e);
    return [];
  }
};

export const storeHabitData = async (habitData: any) => {
  try {
    await AsyncStorage.setItem(HABIT_DATA_KEY, JSON.stringify(habitData));
  } catch (e) {
    console.error('Error storing habit data:', e);
  }
};

export const getHabitData = async () => {
  try {
    const habitData = await AsyncStorage.getItem(HABIT_DATA_KEY);
    return habitData ? JSON.parse(habitData) : {};
  } catch (e) {
    console.error('Error getting habit data:', e);
    return {};
  }
};

export const addOfflineAction = async (action: any) => {
  try {
    const actions = await getOfflineActions();
    actions.push(action);
    await AsyncStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(actions));
  } catch (e) {
    console.error('Error adding offline action:', e);
  }
};

export const getOfflineActions = async () => {
  try {
    const actions = await AsyncStorage.getItem(OFFLINE_ACTIONS_KEY);
    return actions ? JSON.parse(actions) : [];
  } catch (e) {
    console.error('Error getting offline actions:', e);
    return [];
  }
};

export const clearOfflineActions = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_ACTIONS_KEY);
  } catch (e) {
    console.error('Error clearing offline actions:', e);
  }
};
