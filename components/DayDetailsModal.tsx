import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DayDetailsModal({ visible, onClose, date, habits, habitData }: any) {
  if (!date) return null;

  const dateString = date.toISOString().split('T')[0];
  const dayData = habitData[dateString] || {};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
          <ScrollView style={styles.habitList}>
            {habits.map((habit: any) => (
              <View key={habit.id} style={styles.habitItem}>
                <Text style={styles.habitName}>{habit.name}</Text>
                <Ionicons
                  name={dayData[habit.id] ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={dayData[habit.id] ? '#007AFF' : '#666'}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitList: {
    width: '100%',
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  habitName: {
    fontSize: 16,
  },
});

