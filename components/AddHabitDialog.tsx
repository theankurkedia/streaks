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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Habit } from '../types';
import { useHabitsStore } from '../store';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PADDING_HORIZONTAL = 20;
const ICON_MARGIN = 4;
const COLUMNS = 8; // We want 4 icons per row
const AVAILABLE_WIDTH = SCREEN_WIDTH - PADDING_HORIZONTAL * 2;
const ICON_SIZE = (AVAILABLE_WIDTH - ICON_MARGIN * 2 * COLUMNS) / COLUMNS;

interface AddHabitDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function AddHabitDialog({ visible, onClose }: AddHabitDialogProps) {
  const [habit, setHabit] = useState<Habit>();
  const [iconSearch, setIconSearch] = useState('');
  const { addHabit } = useHabitsStore();
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : SCREEN_HEIGHT, {
      damping: 50,
      stiffness: 100,
    });
  }, [visible]);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
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
      <TextInput
        style={styles.input}
        placeholder="Search icons..."
        placeholderTextColor="#6B7280"
        value={iconSearch}
        onChangeText={setIconSearch}
      />
      <ScrollView style={styles.iconGrid}>
        <View style={styles.iconContainer}>
          {Object.entries(icons)
            .filter(([name]) =>
              name.toLowerCase().includes(iconSearch?.toLowerCase() || '')
            )
            .slice(0, 32)
            .map(([name, Icon]) => (
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
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#1F2937',
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
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
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    margin: ICON_MARGIN,
  },
  selectedIconButton: {
    backgroundColor: '#3B82F6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 'auto',
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
