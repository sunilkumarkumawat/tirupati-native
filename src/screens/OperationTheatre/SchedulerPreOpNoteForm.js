import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const SchedulerPreOpNoteForm = ({ route, navigation }) => {
  const { patientId, patientName } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Scheduler & Pre Operative Note</Text>
        <Text style={styles.subtitle}>For Patient: {patientName} (ID: {patientId})</Text>
        
        {/* Placeholder for your form fields */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{'2025-07-22'}</Text>
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Pre-operative Assessment:</Text>
          <Text style={styles.value}>{'Patient is stable and ready for surgery.'}</Text>
        </View>
        {/* Add more form fields here */}

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  formSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    textAlign: 'right',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4dd0e1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SchedulerPreOpNoteForm;