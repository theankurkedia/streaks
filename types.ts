export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
}

export interface Completion {
  [key: string]: {
    [date: string]: boolean;
  };
}

export interface Storage {
  habits: Habit[];
  completions: Completion;
}
