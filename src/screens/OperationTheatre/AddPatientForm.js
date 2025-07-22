import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native"
import { ScrollView } from 'react-native-gesture-handler';

const genderOptions = ["Male", "Female", "Other"]
const statusOptions = ["Active", "Discharged", "Transferred"]
const categoryOptions = ["General", "Private", "Emergency", "Insurance"]

// Modify AddPatientForm to accept navigation and route props
const AddPatientForm = ({ navigation, route }) => {
  // Extract onAddPatient, onCancel, and patients from route.params
  // Provide a default for onCancel to ensure it's always a function
  const { onAddPatient, onCancel = () => navigation.goBack(), patients: existingPatients } = route.params || {};

  const [newPatient, setNewPatient] = useState({
    patientName: "",
    uhidPatientId: "",
    ipd: "",
    age: "",
    gender: "Male",
    mobile: "",
    doctor: "",
    doa: "",
    dod: "",
    status: "Active",
    roomWard: "",
    bedNo: "",
    idProof: "",
    relative: "",
    category: "General",
  })

  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)

  // Generate UHID and IPD - now using existingPatients from props
  const generateUHID = () => {
    // Ensure existingPatients is an array and not empty before mapping
    const maxId = (existingPatients && existingPatients.length > 0)
      ? Math.max(...existingPatients.map(p => p.id))
      : 0; // Start from 0 if no existing patients
    const nextId = maxId + 1;
    return `UHID${String(nextId).padStart(3, '0')}`
  }

  const generateIPD = () => {
    const maxId = (existingPatients && existingPatients.length > 0)
      ? Math.max(...existingPatients.map(p => p.id))
      : 0; // Start from 0 if no existing patients
    const nextId = maxId + 1;
    return `IPD${String(nextId).padStart(3, '0')}`
  }

  // Handle add patient
  const handleAddPatient = () => {
    if (!newPatient.patientName || !newPatient.mobile || !newPatient.doa || !newPatient.age) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const patient = {
      // Use a more robust ID generation for the new patient
      id: (existingPatients && existingPatients.length > 0)
        ? Math.max(...existingPatients.map(p => p.id)) + 1
        : 1, // If no existing patients, start with ID 1
      ...newPatient,
      uhidPatientId: newPatient.uhidPatientId || generateUHID(),
      ipd: newPatient.ipd || generateIPD(),
      age: parseInt(newPatient.age),
    }

    // Call the onAddPatient callback passed from OTPage
    if (onAddPatient) {
      onAddPatient(patient)
    }

    // Reset form
    setNewPatient({
      patientName: "",
      uhidPatientId: "",
      ipd: "",
      age: "",
      gender: "Male",
      mobile: "",
      doctor: "",
      doa: "",
      dod: "",
      status: "Active",
      roomWard: "",
      bedNo: "",
      idProof: "",
      relative: "",
      category: "General",
    })

    Alert.alert("Success", "Patient added successfully!")
    // Navigate back after successful addition using the onCancel prop
    onCancel();
  }

  const closeAllDropdowns = () => {
    setShowFormGenderDropdown(false)
  }

  const renderGenderDropdown = () => (
    <View style={[styles.dropdownWrapper, showFormGenderDropdown && { zIndex: 1000 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns()
          setShowFormGenderDropdown(!showFormGenderDropdown)
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.gender}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showFormGenderDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.gender === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, gender: option }))
                  setShowFormGenderDropdown(false)
                }}
              >
                <Text style={[styles.optionText, newPatient.gender === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Use onCancel prop for back button */}
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Text style={styles.backButtonText} allowFontScaling={false}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} allowFontScaling={false}>Add New Patient</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.formContentContainer}
        bounces={false}
      >
        {/* 1st Row: Patient Name, UHID, IPD */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Patient Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter patient name"
              value={newPatient.patientName}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, patientName: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>UHID/Patient ID</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Auto-generated"
              value={newPatient.uhidPatientId}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, uhidPatientId: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>IPD</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Auto-generated"
              value={newPatient.ipd}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, ipd: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>
        {/* 2nd Row: Age, Gender, Mobile */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Age *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter age"
              value={newPatient.age}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, age: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Gender</Text>
            {renderGenderDropdown()}
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Mobile *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="+91 XXXXX XXXXX"
              value={newPatient.mobile}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, mobile: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              allowFontScaling={false}
            />
          </View>
        </View>
        {/* 3rd Row: Doctor */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Doctor</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter doctor name"
            value={newPatient.doctor}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, doctor: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>
        {/* 4th Row: DOA, DOD */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>DOA (Date of Admission) *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-MM-DD"
              value={newPatient.doa}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, doa: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>DOD (Date of Discharge)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-MM-DD (Optional)"
              value={newPatient.dod}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, dod: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>
        {/* 5th Row: Status, Category */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Status</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter status"
              value={newPatient.status}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, status: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Category</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter category"
              value={newPatient.category}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, category: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>
        {/* 6th Row: Room/Ward, Bed No */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Room/Ward</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter room or ward"
              value={newPatient.roomWard}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, roomWard: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Bed No</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter bed number"
              value={newPatient.bedNo}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, bedNo: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>
        {/* 7th Row: ID Proof */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>ID Proof</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter ID Proof"
            value={newPatient.idProof}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, idProof: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>
        {/* 8th Row: Relative */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Relative</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Relation - Name (e.g., Father - John Doe)"
            value={newPatient.relative}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, relative: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>
        <View style={styles.formActions}>
          {/* Use onCancel prop for cancel button */}
          <TouchableOpacity
            style={styles.cancelFormButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelFormButtonText} allowFontScaling={false}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveFormButton}
            onPress={handleAddPatient}
          >
            <Text style={styles.saveFormButtonText} allowFontScaling={false}>Add Patient</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: "#4dd0e1",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 80,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formContentContainer: {
    paddingBottom: 60,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  formFieldHalf: {
    flex: 1,
  },
  formFieldThird: {
    flex: 1,
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  formInput: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    color: "#374151",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  cancelFormButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  cancelFormButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  saveFormButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#4dd0e1",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#4dd0e1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveFormButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  // Dropdown styles
  dropdownWrapper: {
    position: "relative",
    zIndex: 1,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dropdownValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrowSmall: {
    fontSize: 12,
    color: "#6b7280",
  },
  dropdownOptions: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginTop: 2,
    maxHeight: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 1000,
  },
  optionsScrollView: {
    flex: 1,
    maxHeight: 180,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectedOption: {
    backgroundColor: "#f0f9ff",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedOptionText: {
    color: "#4dd0e1",
    fontWeight: "600",
  },
})

export default AddPatientForm