import { create } from 'zustand';
import { Completion, Habit } from './types';
import {
  getHabitCompletionsFromDb,
  getHabitsData,
  saveCompletionsData,
  saveHabitsData,
} from './services/db';

interface HabitsStore {
  habits: Habit[];
  isInitialising: boolean;
  initialiseData: () => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  editHabit: (habit: Habit) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  completions: Completion;
  getHabitCompletions: (habitId: string) => {
    [date: string]: boolean;
  };
  toggleHabitCompletion: (date: string, habitId: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  isInitialising: false,
  initialiseData: async () => {
    set({ isInitialising: true });
    const habits = await getHabitsData();
    const completions = await getHabitCompletionsFromDb();
    set({ habits });
    set({ completions });
    set({ isInitialising: false });
  },
  addHabit: async (habit: Habit) => {
    const habits = get().habits;
    habits.push({ ...habit, id: Math.random().toString(36).substring(2, 10) });
    set({ habits });
    await saveHabitsData(habits);
  },
  editHabit: async (habit: Habit) => {
    const habits = get().habits;
    const updatedHabits = habits.map(h => (h.id === habit.id ? habit : h));
    set({ habits: updatedHabits });
    await saveHabitsData(updatedHabits);
  },
  removeHabit: async (habitId: string) => {
    const habits = get().habits;
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    set({ habits: updatedHabits });
    await saveHabitsData(updatedHabits);
  },
  setHabits: (habits: Habit[]) => set({ habits }),
  completions: {},
  getHabitCompletions: (habitId: string) => {
    const completions = get().completions;
    return completions[habitId];
  },
  toggleHabitCompletion: async (date: string, habitId: string) => {
    const completions = get().completions;
    const completed = completions?.[habitId]?.[date] ?? false;
    if (!completions?.[habitId]) {
      completions[habitId] = {};
    }
    completions[habitId][date] = !completed;
    set({ completions });
    await saveCompletionsData(completions);
  },
}));
