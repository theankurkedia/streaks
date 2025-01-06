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
  initialiseHabits: () => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;
  completions: Completion;
  initialiseCompletions: () => Promise<void>;
  getHabitCompletions: (habitId: string) => {
    [date: string]: boolean;
  };
  toggleHabitCompletion: (date: string, habitId: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  initialiseHabits: async () => {
    const habits = await getHabitsData();
    set({ habits });
  },
  addHabit: async (habit: Habit) => {
    const habits = get().habits;
    habits.push({ ...habit, id: Math.random().toString(36).substring(2, 10) });
    set({ habits });
    await saveHabitsData(habits);
  },
  removeHabit: async (habitId: string) => {
    const habits = get().habits;
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    set({ habits: updatedHabits });
    await saveHabitsData(updatedHabits);
  },
  setHabits: (habits: Habit[]) => set({ habits }),
  completions: {},
  initialiseCompletions: async () => {
    const completions = await getHabitCompletionsFromDb();
    set({ completions });
  },
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
