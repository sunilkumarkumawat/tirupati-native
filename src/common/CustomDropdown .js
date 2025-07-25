import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const CustomDropdown = ({ label, options, selectedValue, onSelect }) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = value => {
    onSelect(value);
    setVisible(false);
  };

  // Find the label of the selected value
  const getSelectedLabel = () => {
    const selectedOption = options.find(
      option => option.value === selectedValue
    );
    return selectedOption ? selectedOption.label : `Select ${label}`;
  };

  return (
    <View style={styles.dropdownContainer}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownText}>{getSelectedLabel()}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value || index}
                  style={styles.option}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  dropdownButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    color: '#374151',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dropdownText: {
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    maxHeight: '60%',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
});

export default CustomDropdown;
