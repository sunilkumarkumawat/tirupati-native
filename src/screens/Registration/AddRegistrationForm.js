import React, { useState, useRef } from "react" // Import useRef
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions,
  ScrollView, // Import ScrollView from react-native
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
  Keyboard, // Import Keyboard
  Modal, // Import Modal
} from "react-native"

const genderOptions = ["Male", "Female", "Other"]
const statusOptions = ["Active", "Discharged", "Transferred"] // Re-used for "Status*"
const categoryOptions = ["General", "Private", "Emergency", "Insurance"]

// DROPDOWN OPTIONS (from previous turn)
const patientTypeOptions = ["New Patient", "Old Patient", "Referral"] // Example options
const medicalPlanOptions = ["Cash", "Insurance", "CGHS", "ECHS"] // Example options
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NA"] // Example options

// DROPDOWN OPTIONS (from earlier in this turn)
const panelCompanyOptions = ["Panel A", "Company B", "Self Pay"] // Example options
const doctorOptions = ["Dr. Smith", "Dr. Jones", "Dr. Lee", "Dr. Priya Singh"] // Example options
const specializationOptions = ["Cardiology", "Pediatrics", "Orthopedics", "General Medicine"] // Example options

// NEWLY ADDED DROPDOWN OPTIONS (from current turn)
const dialysisUnitOptions = ["Unit A", "Unit B", "Unit C"] // Example options
const wardRoomOptions = ["Ward A", "Ward B", "Room 101", "Room 102", "ICU 1", "Emergency Hall"] // Example options
const bedRoomNoOptions = ["A-1", "A-2", "B-1", "B-2", "101-A", "101-B", "ICU-Bed1"] // Example options
const idProofTypeOptions = ["Aadhar Card", "PAN Card", "Voter ID", "Passport", "Driving License", "Other"] // NEW: ID Proof Type Options


// Options for the new header 3-dot menu in AddRegistrationForm
const headerMenuOptions = [
  "OPD-Registration",
  "Day Care/Dialysis",
  "Accidental Case",
  "IPD Admission",
  "ICU/Emergency",
  "MR & Visitor's Entry",
];


const AddRegistrationForm = ({ navigation, route }) => {

  const { onAddPatient, onCancel = () => navigation.navigate('Registration'), patients: existingPatients } = route.params || {};

  const headerMenuRef = useRef(null);
  const [headerMenuLayout, setHeaderMenuLayout] = useState(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  // PREVIOUS DROPDOWN STATES
  const [showPatientTypeDropdown, setShowPatientTypeDropdown] = useState(false);
  const [showMedicalPlanDropdown, setShowMedicalPlanDropdown] = useState(false);
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);
  const [showPanelCompanyDropdown, setShowPanelCompanyDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)
  const [showFormStatusDropdown, setShowFormStatusDropdown] = useState(false) // This existed, but now for a required field
  const [showFormCategoryDropdown, setShowFormCategoryDropdown] = useState(false)

  // NEW DROPDOWN STATES (from current turn)
  const [showDialysisUnitDropdown, setShowDialysisUnitDropdown] = useState(false);
  const [showWardRoomDropdown, setShowWardRoomDropdown] = useState(false);
  const [showBedRoomNoDropdown, setShowBedRoomNoDropdown] = useState(false);
  const [showIdProofTypeDropdown, setShowIdProofTypeDropdown] = useState(false); // NEW: For ID Proof Type


  const [newPatient, setNewPatient] = useState({
    patientName: "",
    middleName: "",
    surname: "",
    uhidPatientId: "",
    ipd: "",
    age: "",
    gender: "Male",
    mobile: "",
    doctor: "", // Now from dropdown
    doa: "",
    dod: "",
    status: "Active", // Now from dropdown
    roomWard: "", // Now from dropdown
    bedNo: "", // Now from dropdown
    idProof: "", // This is the 'ID Proof' field
    relative: "", // This is the 'Relative' field from previous
    category: "General",

    // NEW FIELDS FROM SCREENSHOT (from previous turn)
    patientType: "",
    medicalPlan: "",
    uidaiAadhaar: "",
    bloodGroup: "NA",
    dob: "",
    followUpsDate: "",
    reminderDate: "",
    tokenNo: "",
    timeSlot: "",
    opdNo: "",
    wardNo: "",
    referredBy: "",
    address: "",
    country: "",
    stateProvince: "",
    city: "",
    pinZip: "",
    idProofType: "", // Now from dropdown
    idProofNo: "",
    healthCardPolicyNo: "",
    tidTraId: "",
    emailId: "",
    religion: "",
    education: "",
    occupation: "",
    maritalStatus: "",
    informationSources: "",
    location: "",

    // Patient Attendant Entry (from previous turn)
    attendant1Name: "",
    attendant1Relation: "",
    attendant1Address: "",
    attendant1Mobile: "",
    attendant2Name: "",
    attendant2Relation: "",
    attendant2Address: "",
    attendant2Mobile: "",

    // Financial summary (simplified) (from previous turn)
    advanceDeposit: "0",
    dueCredit: "0",

    // NEW FIELDS FROM EARLIER IN THIS TURN
    panelCompany: "",
    specialization: "",
    nextToKin: "", // Renamed from 'relative'

    // NEW FIELDS FROM CURRENT TURN
    dialysisUnit: "", // NEW (Dropdown)
    reasonForAdmit: "", // NEW (Form Input)
    diagnosis: "", // NEW (Form Input)
    procedureSurgery: "", // NEW (Form Input)
    // Removed days and time from newPatient, now managed by scheduleEntries
  })

  // NEW STATE FOR DYNAMIC SCHEDULE ENTRIES
  const [scheduleEntries, setScheduleEntries] = useState([{ days: "", time: "" }]);


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
    // Updated required fields to include new ones
    if (!newPatient.patientName || !newPatient.mobile || !newPatient.doa || !newPatient.age ||
      !newPatient.panelCompany || !newPatient.doctor || !newPatient.nextToKin ||
      !newPatient.status || !newPatient.dialysisUnit || !newPatient.bedNo || // New required dropdowns
      !newPatient.diagnosis || !newPatient.procedureSurgery // New required text inputs
    ) {
      Alert.alert("Error", "Please fill in all required fields (Patient Name, Mobile, DOA, Age, Panel/Company, Doctor, Relative/Next to kin, Status, Dialysis Unit, Bed/Room No, Diagnosis, Procedure/Surgery).")
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
      scheduleEntries: scheduleEntries, // Include dynamic schedule entries
    }

    // Call the onAddPatient callback passed from OTPage
    if (onAddPatient) {
      onAddPatient(patient)
    }

    // Reset form
    setNewPatient({
      patientName: "", middleName: "", surname: "", uhidPatientId: "", ipd: "", age: "",
      gender: "Male", mobile: "", doctor: "", doa: "", dod: "", status: "Active",
      roomWard: "", bedNo: "", idProof: "", relative: "", category: "General",
      patientType: "", medicalPlan: "", uidaiAadhaar: "", bloodGroup: "NA", dob: "",
      followUpsDate: "", reminderDate: "", tokenNo: "", timeSlot: "", opdNo: "",
      wardNo: "", referredBy: "", address: "", country: "", stateProvince: "",
      city: "", pinZip: "", idProofType: "", idProofNo: "", healthCardPolicyNo: "",
      tidTraId: "", emailId: "", religion: "", education: "", occupation: "",
      maritalStatus: "", informationSources: "", location: "",
      attendant1Name: "", attendant1Relation: "", attendant1Address: "", attendant1Mobile: "",
      attendant2Name: "", attendant2Relation: "", attendant2Address: "", attendant2Mobile: "",
      advanceDeposit: "0", dueCredit: "0",
      panelCompany: "", specialization: "", nextToKin: "",
      dialysisUnit: "", reasonForAdmit: "", diagnosis: "", procedureSurgery: "",
    })
    setScheduleEntries([{ days: "", time: "" }]); // Reset schedule entries

    Alert.alert("Success", "Patient added successfully!")
    // Navigate back after successful addition using the onCancel prop
    onCancel();
  }

  const closeAllDropdowns = () => {
    setShowFormGenderDropdown(false)
    setShowFormStatusDropdown(false)
    setShowFormCategoryDropdown(false)
    // Close PREVIOUS dropdowns
    setShowPatientTypeDropdown(false);
    setShowMedicalPlanDropdown(false);
    setShowBloodGroupDropdown(false);
    setShowPanelCompanyDropdown(false);
    setShowDoctorDropdown(false);
    setShowSpecializationDropdown(false);
    // Close NEW dropdowns
    setShowDialysisUnitDropdown(false);
    setShowWardRoomDropdown(false);
    setShowBedRoomNoDropdown(false);
    setShowIdProofTypeDropdown(false); // NEW: Close ID Proof Type dropdown


    setShowHeaderMenu(false); // Close header menu as well
    Keyboard.dismiss(); // Dismiss keyboard when any dropdown is closed
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

  const renderStatusDropdown = () => (
    <View style={[styles.dropdownWrapper, showFormStatusDropdown && { zIndex: 999 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns()
          setShowFormStatusDropdown(!showFormStatusDropdown)
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.status || "Select Status"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showFormStatusDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {statusOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.status === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, status: option }))
                  setShowFormStatusDropdown(false)
                }}
              >
                <Text style={[styles.optionText, newPatient.status === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )

  const renderCategoryDropdown = () => (
    <View style={[styles.dropdownWrapper, showFormCategoryDropdown && { zIndex: 998 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns()
          setShowFormCategoryDropdown(!showFormCategoryDropdown)
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.category}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showFormCategoryDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {categoryOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.category === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, category: option }))
                  setShowFormCategoryDropdown(false)
                }}
              >
                <Text style={[styles.optionText, newPatient.category === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )

  // PREVIOUS DROPDOWN RENDERING FUNCTIONS
  const renderPatientTypeDropdown = () => (
    <View style={[styles.dropdownWrapper, showPatientTypeDropdown && { zIndex: 1000 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowPatientTypeDropdown(!showPatientTypeDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.patientType || "Select"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showPatientTypeDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {patientTypeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.patientType === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, patientType: option }));
                  setShowPatientTypeDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.patientType === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderMedicalPlanDropdown = () => (
    <View style={[styles.dropdownWrapper, showMedicalPlanDropdown && { zIndex: 999 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowMedicalPlanDropdown(!showMedicalPlanDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.medicalPlan || "Select"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showMedicalPlanDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {medicalPlanOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.medicalPlan === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, medicalPlan: option }));
                  setShowMedicalPlanDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.medicalPlan === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderBloodGroupDropdown = () => (
    <View style={[styles.dropdownWrapper, showBloodGroupDropdown && { zIndex: 998 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowBloodGroupDropdown(!showBloodGroupDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.bloodGroup || "Select"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showBloodGroupDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {bloodGroupOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.bloodGroup === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, bloodGroup: option }));
                  setShowBloodGroupDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.bloodGroup === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  // EARLIER DROPDOWN RENDERING FUNCTIONS (from current turn)
  const renderPanelCompanyDropdown = () => (
    <View style={[styles.dropdownWrapper, showPanelCompanyDropdown && { zIndex: 1000 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowPanelCompanyDropdown(!showPanelCompanyDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.panelCompany || "Select"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showPanelCompanyDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {panelCompanyOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.panelCompany === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, panelCompany: option }));
                  setShowPanelCompanyDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.panelCompany === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderDoctorDropdown = () => (
    <View style={[styles.dropdownWrapper, showDoctorDropdown && { zIndex: 999 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowDoctorDropdown(!showDoctorDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.doctor || "Select Doctor"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showDoctorDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {doctorOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.doctor === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, doctor: option }));
                  setShowDoctorDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.doctor === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderSpecializationDropdown = () => (
    <View style={[styles.dropdownWrapper, showSpecializationDropdown && { zIndex: 998 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowSpecializationDropdown(!showSpecializationDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.specialization || "Select Specialization"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showSpecializationDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {specializationOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.specialization === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, specialization: option }));
                  setShowSpecializationDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.specialization === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  // NEW DROPDOWN RENDERING FUNCTIONS (from current turn)
  const renderDialysisUnitDropdown = () => (
    <View style={[styles.dropdownWrapper, showDialysisUnitDropdown && { zIndex: 1000 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowDialysisUnitDropdown(!showDialysisUnitDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.dialysisUnit || "Select Unit"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showDialysisUnitDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {dialysisUnitOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.dialysisUnit === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, dialysisUnit: option }));
                  setShowDialysisUnitDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.dialysisUnit === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderWardRoomDropdown = () => (
    <View style={[styles.dropdownWrapper, showWardRoomDropdown && { zIndex: 999 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowWardRoomDropdown(!showWardRoomDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.roomWard || "Select Ward/Room"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showWardRoomDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {wardRoomOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.roomWard === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, roomWard: option }));
                  setShowWardRoomDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.roomWard === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderBedRoomNoDropdown = () => (
    <View style={[styles.dropdownWrapper, showBedRoomNoDropdown && { zIndex: 998 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowBedRoomNoDropdown(!showBedRoomNoDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.bedNo || "Select Bed/Room No"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showBedRoomNoDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {bedRoomNoOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.bedNo === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, bedNo: option }));
                  setShowBedRoomNoDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.bedNo === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  // NEW: Render ID Proof Type Dropdown
  const renderIdProofTypeDropdown = () => (
    <View style={[styles.dropdownWrapper, showIdProofTypeDropdown && { zIndex: 997 }]}>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns();
          setShowIdProofTypeDropdown(!showIdProofTypeDropdown);
        }}
      >
        <Text style={styles.dropdownValue} allowFontScaling={false}>{newPatient.idProofType || "Select ID Proof Type"}</Text>
        <Text style={styles.dropdownArrowSmall} allowFontScaling={false}>▼</Text>
      </TouchableOpacity>
      {showIdProofTypeDropdown && (
        <View style={[styles.dropdownOptions, styles.formDropdownOptions]}>
          <ScrollView
            style={styles.optionsScrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            persistentScrollbar={true}
            indicatorStyle="black"
          >
            {idProofTypeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dropdownOption, newPatient.idProofType === option && styles.selectedOption]}
                onPress={() => {
                  setNewPatient(prev => ({ ...prev, idProofType: option }));
                  setShowIdProofTypeDropdown(false);
                }}
              >
                <Text style={[styles.optionText, newPatient.idProofType === option && styles.selectedOptionText]} allowFontScaling={false}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );


  // NEW: Functions for dynamic schedule entries
  const handleAddScheduleEntry = () => {
    setScheduleEntries(prevEntries => [...prevEntries, { days: "", time: "" }]);
  };

  const handleRemoveScheduleEntry = (index) => {
    setScheduleEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
  };

  const handleScheduleEntryChange = (value, field, index) => {
    setScheduleEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
      return updatedEntries;
    });
  };


  // Function to handle header 3-dot button press
  const handleHeaderMenuPress = () => {
    headerMenuRef.current.measureInWindow((x, y, width, height) => {
      setHeaderMenuLayout({ x, y, width, height });
      closeAllDropdowns(); // Close other dropdowns before opening header menu
      setShowHeaderMenu(true);
    });
  };

  // Function to dismiss header menu
  const handleDismissHeaderMenu = () => {
    setShowHeaderMenu(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Use onCancel prop for back button */}
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Text style={styles.backButtonText} allowFontScaling={false}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} allowFontScaling={false}>Add New Registration</Text>
        {/* New 3-dot button for header menu */}
        <TouchableOpacity
          ref={headerMenuRef}
          style={styles.threeDotButtonHeader}
          onPress={handleHeaderMenuPress}
        >
          <Text style={styles.threeDotIcon} allowFontScaling={false}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Header 3-dot Menu Modal */}
      <Modal
        transparent={true}
        visible={showHeaderMenu}
        onRequestClose={handleDismissHeaderMenu} // For Android back button
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={handleDismissHeaderMenu}>
          <View style={styles.modalOverlay}>
            {headerMenuLayout && (
              <TouchableWithoutFeedback onPress={() => { /* Prevents closing when tapping on the menu itself */ }}>
                <View style={[
                  styles.headerMenuContentDropdown,
                  {
                    top: headerMenuLayout.y + headerMenuLayout.height + 5,
                    right: Dimensions.get('window').width - headerMenuLayout.x - headerMenuLayout.width,
                  }
                ]}>
                  {headerMenuOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        Alert.alert("Menu Option Selected", `You selected: ${option}`);
                        handleDismissHeaderMenu();
                      }}
                    >
                      <Text style={styles.dropdownMenuItemText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.formContentContainer}
        bounces={false}
        // Disable scroll if header menu is open
        scrollEnabled={!showHeaderMenu}
      >
        {/* First Row: UHID, Patient Type, Medical Plan */}
        <View style={styles.formRow}>
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
            <Text style={styles.formLabel} allowFontScaling={false}>Patient Type *</Text>
            {renderPatientTypeDropdown()}
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Medical Plan *</Text>
            {renderMedicalPlanDropdown()}
          </View>
        </View>

        {/* Second Row: UIDAI/Aadhaar, Blood Group, DOA (already exists) */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>UIDAI/Aadhaar</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter UIDAI/Aadhaar"
              value={newPatient.uidaiAadhaar}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, uidaiAadhaar: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Blood Group</Text>
            {renderBloodGroupDropdown()}
          </View>
          <View style={styles.formFieldThird}>
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
        </View>

        {/* Third Row: Patient Name, Middle Name, Surname */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Salute+Patient Name *</Text>
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
            <Text style={styles.formLabel} allowFontScaling={false}>Middle Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter middle name"
              value={newPatient.middleName}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, middleName: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Surname</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter surname"
              value={newPatient.surname}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, surname: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* Fourth Row: Age, DoB, Gender */}
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
            <Text style={styles.formLabel} allowFontScaling={false}>DoB (DD/MM/YY)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="DD/MM/YY"
              value={newPatient.dob}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, dob: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Gender</Text>
            {renderGenderDropdown()}
          </View>
        </View>

        {/* Fifth Row: Follow-Ups Date, Reminder Date */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Follow-Ups Date</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-MM-DD - HH:MM"
              value={newPatient.followUpsDate}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, followUpsDate: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Reminder Date</Text>
            <TextInput
              style={styles.formInput}
              placeholder="YYYY-MM-DD - HH:MM"
              value={newPatient.reminderDate}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, reminderDate: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* Sixth Row: Mobile (already exists in a row above, but screenshot shows it below Follow-Ups) */}
        <View style={styles.formSection}>
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

        {/* Seventh Row: Token No., Time Slot, OPD No., Ward No. */}
        <View style={styles.formRow}>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>Token No.</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Token No."
              value={newPatient.tokenNo}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, tokenNo: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>Time Slot</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Time Slot"
              value={newPatient.timeSlot}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, timeSlot: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>OPD No.</Text>
            <TextInput
              style={styles.formInput}
              placeholder="OPD No."
              value={newPatient.opdNo}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, opdNo: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>Ward No.</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Ward No."
              value={newPatient.wardNo}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, wardNo: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* Eighth Row: Panel/Company, Doctor, Specialization */}
        <View style={styles.formRow}>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Panel/Company *</Text>
            {renderPanelCompanyDropdown()}
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Doctor *</Text>
            {renderDoctorDropdown()}
          </View>
          <View style={styles.formFieldThird}>
            <Text style={styles.formLabel} allowFontScaling={false}>Specialization</Text>
            {renderSpecializationDropdown()}
          </View>
        </View>

        {/* Ninth Row: Relative/Next to kin */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Relative/Next to kin *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Relative/Next to kin"
            value={newPatient.nextToKin}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, nextToKin: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>

        {/* NEW: Tenth Row: Status, Dialysis Unit */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Status *</Text>
            {renderStatusDropdown()}
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Dialysis Unit *</Text>
            {renderDialysisUnitDropdown()}
          </View>
        </View>

        {/* NEW: Eleventh Row: Ward/Room, Bed/Room No */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Ward/Room</Text>
            {renderWardRoomDropdown()}
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Bed/Room No *</Text>
            {renderBedRoomNoDropdown()}
          </View>
        </View>

        {/* NEW: Twelfth Row: Reason for Admit, Diagnosis, Procedure/Surgery */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Reason for Admit</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Reason for Admit"
            value={newPatient.reasonForAdmit}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, reasonForAdmit: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Diagnosis *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Diagnosis"
            value={newPatient.diagnosis}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, diagnosis: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Procedure/Surgery *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Procedure/Surgery"
            value={newPatient.procedureSurgery}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, procedureSurgery: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>

        {/* Original: Referred By (now appears after new fields) */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Referred By</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Referred By"
            value={newPatient.referredBy}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, referredBy: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>

        {/* Original: Address, Country, State, City, PinZip (now appears after new fields) */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Address</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Address"
            value={newPatient.address}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, address: text }))}
            placeholderTextColor="#9ca3af"
            allowFontScaling={false}
          />
        </View>
        <View style={styles.formRow}>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>Country</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Country"
              value={newPatient.country}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, country: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>State/Province</Text>
            <TextInput
              style={styles.formInput}
              placeholder="State/Province"
              value={newPatient.stateProvince}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, stateProvince: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>City</Text>
            <TextInput
              style={styles.formInput}
              placeholder="City"
              value={newPatient.city}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, city: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>PinZip</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Pin/Zip"
              value={newPatient.pinZip}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, pinZip: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* Original: ID Proof Type, ID Proof No, HealthCard/Policy No, TID/TRA ID (now appears after new fields) */}
        <View style={styles.formRow}>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>ID Proof Type</Text>
            {renderIdProofTypeDropdown()} {/* NEW: Converted to dropdown */}
          </View>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>ID Proof No</Text>
            <TextInput
              style={styles.formInput}
              placeholder="ID Proof No"
              value={newPatient.idProofNo}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, idProofNo: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>HealthCard/Policy No</Text>
            <TextInput
              style={styles.formInput}
              placeholder="HealthCard/Policy No"
              value={newPatient.healthCardPolicyNo}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, healthCardPolicyNo: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldFourth}>
            <Text style={styles.formLabel} allowFontScaling={false}>TID/TRA ID</Text>
            <TextInput
              style={styles.formInput}
              placeholder="TID/TRA ID"
              value={newPatient.tidTraId}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, tidTraId: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* Original: Email ID (now appears after new fields) */}
        <View style={styles.formSection}>
          <Text style={styles.formLabel} allowFontScaling={false}>Email ID</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter Email ID"
            value={newPatient.emailId}
            onChangeText={(text) => setNewPatient(prev => ({ ...prev, emailId: text }))}
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            allowFontScaling={false}
          />
        </View>

        {/* Original: Religion, Education, Occupation, Marital Status (now appears after new fields) */}
        <View style={styles.formRow}>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>Religion</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Religion"
              value={newPatient.religion}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, religion: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>Education</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Education"
              value={newPatient.education}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, education: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>Occupation</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Occupation"
              value={newPatient.occupation}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, occupation: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldQuarter}>
            <Text style={styles.formLabel} allowFontScaling={false}>Marital Status</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Marital Status"
              value={newPatient.maritalStatus}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, maritalStatus: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* Original: Information Sources, Location (now appears after new fields) */}
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Information Sources</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Information Sources"
              value={newPatient.informationSources}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, informationSources: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Location</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Location"
              value={newPatient.location}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, location: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>

        {/* NEW: Dynamic Days and Time inputs with Add/Delete buttons */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>Schedule Information</Text>
        </View>
        {scheduleEntries.map((entry, index) => (
          <View key={index} style={styles.scheduleEntryRow}>
            <View style={styles.formFieldFlex}> {/* Use a flex container for inputs to take available space */}
              <Text style={styles.formLabel} allowFontScaling={false}>Days</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 5"
                value={entry.days}
                onChangeText={(text) => handleScheduleEntryChange(text, "days", index)}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                allowFontScaling={false}
              />
            </View>
            <View style={styles.formFieldFlex}> {/* Use a flex container for inputs to take available space */}
              <Text style={styles.formLabel} allowFontScaling={false}>Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="HH:MM AM/PM"
                value={entry.time}
                onChangeText={(text) => handleScheduleEntryChange(text, "time", index)}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>
            {scheduleEntries.length > 1 && ( // Show delete button if more than one entry
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveScheduleEntry(index)}
              >
                <Text style={styles.deleteButtonText} allowFontScaling={false}>X</Text>
              </TouchableOpacity>
            )}
            {index === scheduleEntries.length - 1 && ( // Show add button only on the last row
              <TouchableOpacity
                style={styles.plusButton} // New style for plus icon
                onPress={handleAddScheduleEntry}
              >
                <Text style={styles.plusButtonText} allowFontScaling={false}>+</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}


        {/* Patient Attendant Entry Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>Patient Attendant Entry</Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-1 Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Attendant-1 Name"
              value={newPatient.attendant1Name}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant1Name: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-1 Relation</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Relation"
              value={newPatient.attendant1Relation}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant1Relation: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-1 Address</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Address"
              value={newPatient.attendant1Address}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant1Address: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-1 Mobile</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mobile"
              value={newPatient.attendant1Mobile}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant1Mobile: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              allowFontScaling={false}
            />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-2 Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Attendant-2 Name"
              value={newPatient.attendant2Name}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant2Name: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-2 Relation</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Relation"
              value={newPatient.attendant2Relation}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant2Relation: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-2 Address</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Address"
              value={newPatient.attendant2Address}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant2Address: text }))}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Attendant-2 Mobile</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mobile"
              value={newPatient.attendant2Mobile}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, attendant2Mobile: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              allowFontScaling={false}
            />
          </View>
        </View>


        {/* Advance/Deposit and Due/Credit Section - Simplified */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>Financial Summary</Text>
        </View>
        <View style={styles.formRow}>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Advance/Deposit</Text>
            <TextInput
              style={styles.formInput}
              placeholder="0"
              value={newPatient.advanceDeposit}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, advanceDeposit: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              allowFontScaling={false}
            />
          </View>
          <View style={styles.formFieldHalf}>
            <Text style={styles.formLabel} allowFontScaling={false}>Due/Credit</Text>
            <TextInput
              style={styles.formInput}
              placeholder="0"
              value={newPatient.dueCredit}
              onChangeText={(text) => setNewPatient(prev => ({ ...prev, dueCredit: text }))}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              allowFontScaling={false}
            />
          </View>
        </View>
        {/* Placeholder for the dynamic table. You'll need to implement this separately if needed. */}
        <View style={styles.placeholderTable}>
          <Text style={styles.placeholderText}>
            (Dynamic Item/Service & Payment Table Not Implemented Here)
          </Text>
        </View>


        <View style={styles.formActions}>
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
    flex: 1,
    textAlign: 'center',
  },
  threeDotButtonHeader: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
  },
  threeDotIcon: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.0)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  headerMenuContentDropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    minWidth: 200,
    maxWidth: 300,
    position: 'absolute',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dropdownMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
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
    marginBottom: 12,
  },
  formFieldHalf: {
    flex: 1,
  },
  formFieldThird: { // Used for 3 columns
    flex: 1,
  },
  formFieldFourth: { // NEW: For 4 columns (e.g., Token No, Time Slot, OPD No, Ward No)
    flex: 1,
  },
  formFieldQuarter: { // NEW: For 4 columns when you want more control (e.g., Country, State, City, PinZip)
    flex: 1,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionHeader: { // NEW: For sections like "Patient Attendant Entry"
    backgroundColor: '#e0f7fa', // Light blue background for header
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4dd0e1',
  },
  sectionTitle: { // NEW: For titles like "Patient Attendant Entry"
    fontSize: 16,
    fontWeight: '700',
    color: '#006064',
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
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
  placeholderTable: { // NEW: Placeholder for the financial table
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 150, // Give it some height
  },
  placeholderText: { // NEW: Text for the placeholder
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  scheduleEntryRow: { // NEW: Style for each dynamic Days/Time row
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items to the bottom, useful for delete button
    gap: 12,
    marginBottom: 12,
    position: 'relative', // Needed for absolute positioning of buttons
  },
  formFieldFlex: { // NEW: Make form fields in schedule row flexible
    flex: 1,
  },
  deleteButton: { // NEW: Style for delete button
    backgroundColor: '#ef4444', // Red color
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4, // Align with text inputs
  },
  deleteButtonText: { // NEW: Style for delete button text
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  plusButton: { // NEW: Style for the inline plus icon
    backgroundColor: '#d1fae5', // Light green
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4, // Align with text inputs
  },
  plusButtonText: { // NEW: Style for the inline plus icon text
    color: '#047857', // Darker green text
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddRegistrationForm;