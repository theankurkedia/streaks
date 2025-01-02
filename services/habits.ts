import { supabase } from '../supabaseConfig';

export const getHabitDataFromDb = async (user: any) => {
  return supabase.from('habit_data').select('*').eq('user_id', user?.id);
};

export const getHabitsFromDb = async (user: any) => {
  return supabase.from('habits').select('*').eq('user_id', user?.id);
};

export const addHabitToDb = async (user: any, habit: any) => {
  if (!user) return null;
  const { data, error } = await supabase
    .from('habits')
    .insert({ name: habit.name, user_id: user?.id })
    .select();
  if (error) console.error('Error adding habit:', error);
  else return data[0];
};

export const updateHabitCompletionInDb = async (
  user: any,
  date: any,
  habitId: any,
  completed: any
) => {
  if (!user) return;

  // First check if record exists
  const { data: existingData } = await supabase
    .from('habit_data')
    .select('*')
    .eq('user_id', user.id)
    .eq('habit_id', habitId)
    .eq('date', date)
    .single();

  if (existingData) {
    // Update existing record
    const { data, error } = await supabase
      .from('habit_data')
      .update({ completed })
      .eq('user_id', user.id)
      .eq('habit_id', habitId)
      .eq('date', date);
    if (error) console.error('Error updating habit completion:', error);
    return data;
  } else {
    // Insert new record
    const { data, error } = await supabase.from('habit_data').insert({
      user_id: user.id,
      habit_id: habitId,
      date: date,
      completed,
    });
    if (error) console.error('Error inserting habit completion:', error);
    return data;
  }
};
