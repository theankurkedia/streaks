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
import { icons, X } from 'lucide-react-native';
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

interface Props {
  visible: boolean;
  onClose: () => void;
  habit?: Habit;
}

const getVisibleIcons = (iconSearch: string, selectedIcon?: string) => {
  const allIcons = Object.entries(icons);
  const selectedIconEntry = selectedIcon
    ? [allIcons.find(([name]) => name === selectedIcon)!]
    : [];
  return [
    ...selectedIconEntry,
    ...allIcons
      .filter(
        ([name]) =>
          name !== selectedIcon &&
          name.toLowerCase().includes(iconSearch?.toLowerCase() || '')
      )
      .slice(0, 31),
  ];
};

export function AddEditDialog(props: Props) {
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(
    props.habit
  );
  const [iconSearch, setIconSearch] = useState('');
  const { addHabit, editHabit: editHabitStore } = useHabitsStore();
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (props.habit) {
      setSelectedHabit(props.habit);
    }
  }, [props.habit]);

  useEffect(() => {
    translateY.value = withSpring(props.visible ? 0 : SCREEN_HEIGHT, {
      damping: 50,
      stiffness: 100,
    });
  }, [props.visible]);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleAddHabit = () => {
    if (!selectedHabit?.name) return;

    if (props.habit) {
      editHabitStore(selectedHabit);
    } else {
      addHabit(selectedHabit);
    }
    setSelectedHabit(undefined);
    props.onClose();
  };

  const visibleIcons = getVisibleIcons(iconSearch, props.habit?.icon);

  return (
    <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
      <View style={styles.line} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={props.onClose}>
          <X color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {props.habit?.id ? 'Edit Habit' : 'Add New Habit'}
        </Text>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { opacity: selectedHabit?.name ? 1 : 0.5 },
          ]}
          onPress={handleAddHabit}
          disabled={!selectedHabit?.name}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Habit Name"
        placeholderTextColor="#6B7280"
        value={selectedHabit?.name}
        onChangeText={text =>
          setSelectedHabit(prev => ({ ...(prev ?? {}), name: text }) as Habit)
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
          {visibleIcons.map(([name, Icon]) => (
            <TouchableOpacity
              key={name}
              style={[
                styles.iconButton,
                selectedHabit?.icon === name && styles.selectedIconButton,
              ]}
              onPress={() =>
                setSelectedHabit(
                  prev => ({ ...(prev ?? {}), icon: name }) as Habit
                )
              }
            >
              <Icon
                color={selectedHabit?.icon === name ? '#fff' : '#6B7280'}
                size={24}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
});
