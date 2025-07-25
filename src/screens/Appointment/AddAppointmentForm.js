import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Keyboard, // Import Keyboard to dismiss it
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

// Options for dropdowns (moved from Appointment.js)
const panelMedicalAidOptions = ["General Panel", "Insurance Panel", "Corporate Panel", "VIP Panel", "Senior Citizen Panel"];
const salutationOptions = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
const genderOptions = ["Male", "Female", "Other"];
const doctorOptions = ["Dr. Priya Singh", "Dr. Amit Kumar", "Dr. Kavya Reddy", "Dr. Rajesh Gupta", "Dr. Sunita Sharma"];
const idProofOptions = ["Aadhar", "PAN Card", "Driving License", "Voter ID", "Passport"];
const infoSourceOptions = ["Online", "Phone", "Walk-in", "Referral"];
// const locationOptions = ["OPD Block A", "OPD Block B", "OPD Block C", "Emergency", "VIP Block"];
const royaltyCardOptions = ["Regular", "Silver Member", "Gold Member", "Platinum Member"];

const AddAppointmentForm = ({ route, navigation }) => {
  // Callback function to pass new appointment data back to previous screen
  const onAppointmentAdded = route.params?.onAppointmentAdded;
  // Existing appointments to help generate unique IDs (if needed, though typically done on backend)
  const existingAppointments = route.params?.existingAppointments || [];

  // Form states (moved from Appointment.js)
  const [newAppointment, setNewAppointment] = useState({
    appointmentId: "",
    panelMedicalAid: "Gen. Panel", // Changed from "Gen.Panel" for consistency with options
    tokenNumber: "",
    salutation: "Mr",
    patientName: "",
    age: "",
    gender: "Male",
    dob: "",
    email: "",
    mobile: "",
    appointmentDate: "",
    doctor: "Dr. Priya Singh",
    address: "",
    infoSource: "Online",
    location: "",
    uhidPatientId: "",
    idProof: "Aadhar",
    royaltyCard: "Regular",
  });

  // Dropdown visibility states for form (moved from Appointment.js)
  const [showFormPanelDropdown, setShowFormPanelDropdown] = useState(false);
  const [showFormSalutationDropdown, setShowFormSalutationDropdown] = useState(false);
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false);
  const [showFormDoctorDropdown, setShowFormDoctorDropdown] = useState(false);
  const [showFormIdProofDropdown, setShowFormIdProofDropdown] = useState(false);
  const [showFormInfoSourceDropdown, setShowFormInfoSourceDropdown] = useState(false);
  const [showFormLocationDropdown, setShowFormLocationDropdown] = useState(false);
  const [showFormRoyaltyDropdown, setShowFormRoyaltyDropdown] = useState(false);

  // Helper to close all dropdowns (moved from Appointment.js)
  const closeAllDropdowns = () => {
    setShowFormPanelDropdown(false);
    setShowFormSalutationDropdown(false);
    setShowFormGenderDropdown(false);
    setShowFormDoctorDropdown(false);
    setShowFormIdProofDropdown(false);
    setShowFormInfoSourceDropdown(false);
    setShowFormLocationDropdown(false);
    setShowFormRoyaltyDropdown(false);
  };

  // Helper function to render dropdowns (moved from Appointment.js)
  const renderDropdown = (options, value, onChange, showDropdown, setShowDropdown) => (
    <View style={[styles.dropdownWrapper, showDropdown && { zIndex: 10000 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns(); // Close others before opening this one
          setShowDropdown(!showDropdown);
          Keyboard.dismiss(); // Dismiss keyboard when opening dropdown
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{value}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdownOptions}>
          <ScrollView style={styles.optionsScrollView} nestedScrollEnabled={true}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, value === option && styles.selectedOption]}
                onPress={() => {
                  onChange(option);
                  setShowDropdown(false);
                }}
              >
                <Text style={[styles.optionText, value === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  // Generate appointment number and token (moved from Appointment.js)
  const generateAppointmentNumber = () => {
    const nextId = existingAppointments.length > 0 ? Math.max(...existingAppointments.map(a => a.id)) + 1 : 1;
    return `APPT${String(nextId).padStart(3, '0')}`;
  };

  const generateToken = () => {
    const nextId = existingAppointments.length > 0 ? Math.max(...existingAppointments.map(a => a.id)) + 1 : 1;
    return `TKN${String(nextId).padStart(3, '0')}`;
  };

  // Handle saving the new appointment (modified from handleAddAppointment)
  const handleSaveAppointment = () => {
    // Validation with alerts
    if (!newAppointment.patientName) {
      Alert.alert("Error", "Patient Name is required");
      return;
    }
    if (!newAppointment.age) {
      Alert.alert("Error", "Age is required");
      return;
    }
    if (!newAppointment.gender) {
      Alert.alert("Error", "Gender is required");
      return;
    }
    if (!newAppointment.dob) {
      Alert.alert("Error", "Date of Birth is required");
      return;
    }
    if (!newAppointment.mobile) {
      Alert.alert("Error", "Mobile number is required");
      return;
    }
    if (!newAppointment.doctor) {
      Alert.alert("Error", "Doctor selection is required");
      return;
    }

    const appointment = {
      // ID will be generated by the parent (Appointment.js) or backend
      ...newAppointment,
      appointmentId: newAppointment.appointmentId || generateAppointmentNumber(),
      tokenNumber: newAppointment.tokenNumber || generateToken(),
      // Keep original field names for compatibility
      appointmentNo: newAppointment.appointmentId || generateAppointmentNumber(),
      token: newAppointment.tokenNumber || generateToken(),
      fromDate: newAppointment.appointmentDate,
      toDate: newAppointment.appointmentDate,
      appStatus: "Scheduled", // Default status for new appointments
      createdBy: "Receptionist", // Default creator
      age: parseInt(newAppointment.age),
    };

    // Call the callback function passed from Appointment.js
    if (onAppointmentAdded) {
      onAppointmentAdded(appointment);
    }

    // Navigate back to the previous screen (Appointment.js)
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };


  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
          <Text style={styles.closeButtonText} allowFontScaling={false}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle} allowFontScaling={false}>Add New Appointment</Text>
        <View style={styles.placeholder} />
      </View>

       <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.formContentContainer}
              bounces={false}
            >
        {/* 1st Row: Appointment ID, Panel Medical AID, Token Number */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Appointment ID</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Auto-generated"
              value={newAppointment.appointmentId}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, appointmentId: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={[styles.formFieldThird, showFormPanelDropdown && { zIndex: 10000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>Medical AID</Text>
            {renderDropdown(
              panelMedicalAidOptions,
              newAppointment.panelMedicalAid,
              (value) => setNewAppointment(prev => ({ ...prev, panelMedicalAid: value })),
              showFormPanelDropdown,
              setShowFormPanelDropdown
            )}
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Token Number</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Auto-generated"
              value={newAppointment.tokenNumber}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, tokenNumber: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* 2nd Row: Salutation, Patient Name */}
        <View style={styles.formRow}>
          <View style={[styles.formFieldHalf, showFormSalutationDropdown && { zIndex: 9000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>Salutation</Text>
            {renderDropdown(
              salutationOptions,
              newAppointment.salutation,
              (value) => setNewAppointment(prev => ({ ...prev, salutation: value })),
              showFormSalutationDropdown,
              setShowFormSalutationDropdown
            )}
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Patient Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter patient name"
              value={newAppointment.patientName}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, patientName: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* 3rd Row: Age, Gender, DOB */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Age *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter age"
              value={newAppointment.age}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, age: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              allowFontScaling={false}
            />
          </View>
          <View style={[styles.formFieldThird, showFormGenderDropdown && { zIndex: 8000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>Gender *</Text>
            {renderDropdown(
              genderOptions,
              newAppointment.gender,
              (value) => setNewAppointment(prev => ({ ...prev, gender: value })),
              showFormGenderDropdown,
              setShowFormGenderDropdown
            )}
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>DOB *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-MM-DD"
              value={newAppointment.dob}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, dob: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* 4th Row: Email */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Email</Text>
          <TextInput
            style={styles.formInput}
            placeholder="patient@email.com"
            value={newAppointment.email}
            onChangeText={(text) => setNewAppointment(prev => ({ ...prev, email: text }))}
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            allowFontScaling={false}
          />
        </View>

        {/* 5th Row: Mobile, Appointment Date */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Mobile *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="+91 XXXXX XXXXX"
              value={newAppointment.mobile}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, mobile: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Appointment Date</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-MM-DD"
              value={newAppointment.appointmentDate}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, appointmentDate: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* 6th Row: Doctor */}
        <View style={[styles.formSection, showFormDoctorDropdown && { zIndex: 7000 }]}>
          <Text style={styles.formLabel} allowFontScaling={false}>Doctor *</Text>
          {renderDropdown(
            doctorOptions,
            newAppointment.doctor,
            (value) => setNewAppointment(prev => ({ ...prev, doctor: value })),
            showFormDoctorDropdown,
            setShowFormDoctorDropdown
          )}
        </View>

        {/* 7th Row: Address */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Address</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Enter complete address"
            value={newAppointment.address}
            onChangeText={(text) => setNewAppointment(prev => ({ ...prev, address: text }))}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={3}
            allowFontScaling={false}
          />
        </View>

        {/* 8th Row: Info Source, Location */}
        <View style={styles.formRow}>
          <View style={[styles.formFieldHalf, showFormInfoSourceDropdown && { zIndex: 6000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>Info Source</Text>
            {renderDropdown(
              infoSourceOptions,
              newAppointment.infoSource,
              (value) => setNewAppointment(prev => ({ ...prev, infoSource: value })),
              showFormInfoSourceDropdown,
              setShowFormInfoSourceDropdown
            )}
          </View>
          <View style={[styles.formFieldHalf, showFormLocationDropdown && { zIndex: 5000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>Location</Text>
            {/* {renderDropdown(
              locationOptions,
              newAppointment.location,
              (value) => setNewAppointment(prev => ({ ...prev, location: value })),
              showFormLocationDropdown,
              setShowFormLocationDropdown
            )} */}
            <TextInput
              style={styles.formInput}
              placeholder="Enter Location"
              value={newAppointment.location}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, location: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* UHID/Patient ID, ID Proof, Royalty Card */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>UHID/Patient ID</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter UHID or Patient ID"
              value={newAppointment.uhidPatientId}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, uhidPatientId: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={[styles.formFieldThird, showFormIdProofDropdown && { zIndex: 4000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>ID Proof</Text>
            {renderDropdown(
              idProofOptions,
              newAppointment.idProof,
              (value) => setNewAppointment(prev => ({ ...prev, idProof: value })),
              showFormIdProofDropdown,
              setShowFormIdProofDropdown
            )}
          </View>
          <View style={[styles.formFieldThird, showFormRoyaltyDropdown && { zIndex: 3000 }]}>
            <Text style={styles.formLabel} allowFontScaling={false}>Royalty Card</Text>
            {renderDropdown(
              royaltyCardOptions,
              newAppointment.royaltyCard,
              (value) => setNewAppointment(prev => ({ ...prev, royaltyCard: value })),
              showFormRoyaltyDropdown,
              setShowFormRoyaltyDropdown
            )}
          </View>
        </View>


        <View style={styles.formActions}>
          <TouchableOpacity
            style={styles.cancelFormButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelFormButtonText} allowFontScaling={false}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveFormButton}
            onPress={handleSaveAppointment}
          >
            <Text style={styles.saveFormButtonText} allowFontScaling={false}>Add Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: { // Renamed from modalContainer for clarity in new file
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    flex: 1,
    padding: 16,
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
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
    paddingVertical: 10,
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
    paddingVertical: 10,
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

  // Dropdown styles (copied from original Appointment.js)
  dropdownWrapper: {
    position: "relative",
    zIndex: 1, // Default zIndex, will be overridden by specific dropdowns
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
    maxHeight: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 9999, // High zIndex to ensure it's on top
    zIndex: 9999, // High zIndex to ensure it's on top
  },
  optionsScrollView: {
    flex: 1,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
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
});

export default AddAppointmentForm;