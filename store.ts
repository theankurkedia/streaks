import { create } from 'zustand';
import {
  getHabitCompletionsFromDb,
  getHabitsData,
  saveCompletionsData,
  saveHabitsData,
} from './services/db';
import { Completion, Habit } from './types';

interface HabitsStore {
  habits: Habit[];
  completions: Completion;
  notifToken?: string;
  isInitialising: boolean;
  initialiseData: () => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  editHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  getHabitCompletions: (habitId: string) => {
    [date: string]: boolean;
  };
  toggleHabitCompletion: (date: string, habitId: string) => Promise<void>;
  saveNotifToken: (token: string) => void;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  isInitialising: false,
  completions: {},
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
    habits.push({
      ...habit,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
    });
    set({ habits });
    await saveHabitsData(habits);
  },
  editHabit: async (habit: Habit) => {
    const habits = get().habits;
    const updatedHabits = habits.map(h => (h.id === habit.id ? habit : h));
    set({ habits: updatedHabits });
    await saveHabitsData(updatedHabits);
  },
  deleteHabit: async (habitId: string) => {
    // Remove completions for the habit
    const { [habitId]: deletedCompletions, ...remainingCompletions } =
      get().completions;
    set({ completions: remainingCompletions });
    await saveCompletionsData(remainingCompletions);

    // Remove the habit
    const updatedHabits = get().habits.filter(habit => habit.id !== habitId);
    set({ habits: updatedHabits });
    await saveHabitsData(updatedHabits);
  },
  setHabits: (habits: Habit[]) => set({ habits }),
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
  saveNotifToken: (token: string) => set({ notifToken: token }),
}));
