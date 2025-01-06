import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { icons } from 'lucide-react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Habit } from '../types';
import { useHabitsStore } from '../store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface AddHabitDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function AddHabitDialog({ visible, onClose }: AddHabitDialogProps) {
  const [habit, setHabit] = useState<Habit>();

  const { addHabit } = useHabitsStore();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 2) {
        // Adjusted threshold for half screen
        scrollTo(0);
        onClose();
      } else {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  useEffect(() => {
    if (visible) {
      scrollTo(MAX_TRANSLATE_Y / 2);
    } else {
      scrollTo(0);
    }
  }, [visible, scrollTo]);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP
    );

    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleAddHabit = () => {
    if (habit) {
      addHabit(habit);
      setHabit(undefined);
      onClose();
    }
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
        <View style={styles.line} />
        <Text style={styles.title}>Add New Habit</Text>
        <TextInput
          style={styles.input}
          placeholder="Habit Name"
          placeholderTextColor="#6B7280"
          value={habit?.name}
          onChangeText={text =>
            setHabit(prev => ({ ...(prev ?? {}), name: text }) as Habit)
          }
        />
        <Text style={styles.subtitle}>Select an Icon</Text>
        <ScrollView style={styles.iconGrid}>
          <View style={styles.iconContainer}>
            {Object.entries(icons).map(([name, Icon]) => (
              <TouchableOpacity
                key={name}
                style={[
                  styles.iconButton,
                  habit?.icon === name && styles.selectedIconButton,
                ]}
                onPress={() =>
                  setHabit(prev => ({ ...(prev ?? {}), icon: name }) as Habit)
                }
              >
                <Icon
                  color={habit?.icon === name ? '#fff' : '#6B7280'}
                  size={24}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={handleAddHabit}
          >
            <Text style={styles.buttonText}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#1F2937',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    zIndex: 1000,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: '#6B7280',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#374151',
    color: '#fff',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  iconGrid: {
    maxHeight: 200,
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    margin: 4,
  },
  selectedIconButton: {
    backgroundColor: '#3B82F6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
