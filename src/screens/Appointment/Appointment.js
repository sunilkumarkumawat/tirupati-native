import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native"

const appointmentData = [
  {
    id: 1,
    appointmentId: "APT001",
    panelMedicalAid: "General Panel",
    tokenNumber: "TKN001",
    salutation: "Mr",
    patientName: "Aarav Sharma",
    mobile: "+91 98765 43210",
    appStatus: "Scheduled",
    gender: "Male",
    doctor: "Dr. Priya Singh",
    createdBy: "Receptionist",
    fromDate: "2025-01-15",
    toDate: "2025-01-15",
    appointmentNo: "APPT001",
    token: "TKN001",
    address: "123 Main St, City",
    age: 25,
    dob: "1999-01-15",
    email: "aarav.sharma@email.com",
    appointmentDate: "2025-01-15",
    infoSource: "Online",
    location: "OPD Block A",
    uhidPatientId: "UHID001",
    idProof: "Aadhar",
    royaltyCard: "Gold Member",
  },
  {
    id: 2,
    appointmentId: "APT002",
    panelMedicalAid: "Insurance Panel",
    tokenNumber: "TKN002",
    salutation: "Mrs",
    patientName: "Priya Patel",
    mobile: "+91 87654 32109",
    appStatus: "Completed",
    gender: "Female",
    doctor: "Dr. Amit Kumar",
    createdBy: "Doctor",
    fromDate: "2025-01-12",
    toDate: "2025-01-12",
    appointmentNo: "APPT002",
    token: "TKN002",
    address: "456 Oak Ave, Town",
    age: 30,
    dob: "1994-05-12",
    email: "priya.patel@email.com",
    appointmentDate: "2025-01-12",
    infoSource: "Referral",
    location: "OPD Block B",
    uhidPatientId: "UHID002",
    idProof: "PAN Card",
    royaltyCard: "Silver Member",
  },
  {
    id: 3,
    appointmentId: "APT003",
    panelMedicalAid: "Corporate Panel",
    tokenNumber: "TKN003",
    salutation: "Mr",
    patientName: "Arjun Singh",
    mobile: "+91 76543 21098",
    appStatus: "Scheduled",
    gender: "Male",
    doctor: "Dr. Kavya Reddy",
    createdBy: "Receptionist",
    fromDate: "2025-01-18",
    toDate: "2025-01-18",
    appointmentNo: "APPT003",
    token: "TKN003",
    address: "789 Pine Ln, Village",
    age: 40,
    dob: "1984-08-18",
    email: "arjun.singh@email.com",
    appointmentDate: "2025-01-18",
    infoSource: "Walk-in",
    location: "Emergency",
    uhidPatientId: "UHID003",
    idProof: "Driving License",
    royaltyCard: "Regular",
  },
  {
    id: 4,
    appointmentId: "APT004",
    panelMedicalAid: "VIP Panel",
    tokenNumber: "TKN004",
    salutation: "Ms",
    patientName: "Kavya Reddy",
    mobile: "+91 65432 10987",
    appStatus: "Completed",
    gender: "Female",
    doctor: "Dr. Rajesh Gupta",
    createdBy: "Admin",
    fromDate: "2025-01-10",
    toDate: "2025-01-10",
    appointmentNo: "APPT004",
    token: "TKN004",
    address: "101 Elm Rd, City",
    age: 35,
    dob: "1989-12-10",
    email: "kavya.reddy@email.com",
    appointmentDate: "2025-01-10",
    infoSource: "Phone",
    location: "VIP Block",
    uhidPatientId: "UHID004",
    idProof: "Voter ID",
    royaltyCard: "Platinum Member",
  },
  {
    id: 5,
    appointmentId: "APT005",
    panelMedicalAid: "Senior Citizen Panel",
    tokenNumber: "TKN005",
    salutation: "Mr",
    patientName: "Rohit Kumar",
    mobile: "+91 54321 09876",
    appStatus: "Cancelled",
    gender: "Male",
    doctor: "Dr. Sunita Sharma",
    createdBy: "Receptionist",
    fromDate: "2025-01-20",
    toDate: "2025-01-20",
    appointmentNo: "APPT005",
    token: "TKN005",
    address: "222 Birch Blvd, Town",
    age: 50,
    dob: "1974-03-20",
    email: "rohit.kumar@email.com",
    appointmentDate: "2025-01-20",
    infoSource: "Online",
    location: "OPD Block C",
    uhidPatientId: "UHID005",
    idProof: "Passport",
    royaltyCard: "Gold Member",
  },
]

const panelMedicalAidOptions = ["General Panel", "Insurance Panel", "Corporate Panel", "VIP Panel", "Senior Citizen Panel"]
const salutationOptions = ["Mr", "Mrs", "Ms", "Dr", "Prof"]
const genderOptions = ["Male", "Female", "Other"]
const doctorOptions = ["Dr. Priya Singh", "Dr. Amit Kumar", "Dr. Kavya Reddy", "Dr. Rajesh Gupta", "Dr. Sunita Sharma"]
const idProofOptions = ["Aadhar", "PAN Card", "Driving License", "Voter ID", "Passport"]
const infoSourceOptions = ["Online", "Phone", "Walk-in", "Referral"]
const locationOptions = ["OPD Block A", "OPD Block B", "OPD Block C", "Emergency", "VIP Block"]
const royaltyCardOptions = ["Regular", "Silver Member", "Gold Member", "Platinum Member"]

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState(appointmentData)
  const [filters, setFilters] = useState({
    patientName: "",
    mobile: "",
    uhidPatientId: "",
    idProof: "",
    royaltyCard: "",
  })
  const [filteredAppointments, setFilteredAppointments] = useState(appointmentData)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [expandedCards, setExpandedCards] = useState({})
  
  // Add appointment form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    appointmentId: "",
    panelMedicalAid: "Gen.Panel",
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
    location: "OPD Block A",
    uhidPatientId: "",
    idProof: "Aadhar",
    royaltyCard: "Regular",
  })

  // Dropdown states for form
  const [showFormPanelDropdown, setShowFormPanelDropdown] = useState(false)
  const [showFormSalutationDropdown, setShowFormSalutationDropdown] = useState(false)
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)
  const [showFormDoctorDropdown, setShowFormDoctorDropdown] = useState(false)
  const [showFormIdProofDropdown, setShowFormIdProofDropdown] = useState(false)
  const [showFormInfoSourceDropdown, setShowFormInfoSourceDropdown] = useState(false)
  const [showFormLocationDropdown, setShowFormLocationDropdown] = useState(false)
  const [showFormRoyaltyDropdown, setShowFormRoyaltyDropdown] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [filters, appointments])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filtered = [...appointments]

    // Apply filters
    if (filters.patientName) {
      filtered = filtered.filter((appt) => 
        appt.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
      )
    }
    if (filters.mobile) {
      filtered = filtered.filter((appt) => appt.mobile.includes(filters.mobile))
    }
    if (filters.uhidPatientId) {
      filtered = filtered.filter((appt) => 
        appt.uhidPatientId.toLowerCase().includes(filters.uhidPatientId.toLowerCase())
      )
    }
    if (filters.idProof) {
      filtered = filtered.filter((appt) => 
        appt.idProof.toLowerCase().includes(filters.idProof.toLowerCase())
      )
    }
    if (filters.royaltyCard) {
      filtered = filtered.filter((appt) => 
        appt.royaltyCard.toLowerCase().includes(filters.royaltyCard.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }

  const clearFilters = () => {
    setFilters({
      patientName: "",
      mobile: "",
      uhidPatientId: "",
      idProof: "",
      royaltyCard: "",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "#6366f1"
      case "Completed":
        return "#10b981"
      case "Cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Generate appointment number and token
  const generateAppointmentNumber = () => {
    const nextId = Math.max(...appointments.map(a => a.id)) + 1
    return `APPT${String(nextId).padStart(3, '0')}`
  }

  const generateToken = () => {
    const nextId = Math.max(...appointments.map(a => a.id)) + 1
    return `TKN${String(nextId).padStart(3, '0')}`
  }

  // Handle add appointment
  const handleAddAppointment = () => {
    // Validation with alerts
    if (!newAppointment.patientName) {
      Alert.alert("Error", "Patient Name is required")
      return
    }
    if (!newAppointment.age) {
      Alert.alert("Error", "Age is required")
      return
    }
    if (!newAppointment.gender) {
      Alert.alert("Error", "Gender is required")
      return
    }
    if (!newAppointment.dob) {
      Alert.alert("Error", "Date of Birth is required")
      return
    }
    if (!newAppointment.mobile) {
      Alert.alert("Error", "Mobile number is required")
      return
    }
    if (!newAppointment.doctor) {
      Alert.alert("Error", "Doctor selection is required")
      return
    }

    const appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      ...newAppointment,
      appointmentId: newAppointment.appointmentId || generateAppointmentNumber(),
      tokenNumber: newAppointment.tokenNumber || generateToken(),
      // Keep original field names for compatibility
      appointmentNo: newAppointment.appointmentId || generateAppointmentNumber(),
      token: newAppointment.tokenNumber || generateToken(),
      fromDate: newAppointment.appointmentDate,
      toDate: newAppointment.appointmentDate,
      appStatus: "Scheduled",
      createdBy: "Receptionist",
      age: parseInt(newAppointment.age),
    }

    setAppointments(prev => [...prev, appointment])
    setNewAppointment({
      appointmentId: "",
      panelMedicalAid: "General Panel",
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
      location: "OPD Block A",
      uhidPatientId: "",
      idProof: "Aadhar",
      royaltyCard: "Regular",
    })
    setShowAddForm(false)
    Alert.alert("Success", "Appointment added successfully!")
  }

  const closeAllDropdowns = () => {
    setShowFormPanelDropdown(false)
    setShowFormSalutationDropdown(false)
    setShowFormGenderDropdown(false)
    setShowFormDoctorDropdown(false)
    setShowFormIdProofDropdown(false)
    setShowFormInfoSourceDropdown(false)
    setShowFormLocationDropdown(false)
    setShowFormRoyaltyDropdown(false)
  }

  const toggleCardExpansion = (appointmentId) => {
    setExpandedCards(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }))
  }

  const PatientCard = ({ appt }) => {
    const isExpanded = expandedCards[appt.id]
    
    return (
      <View style={styles.patientCard}>
        {/* Basic Info Only */}
        <View style={styles.patientHeader}>
          <View style={styles.patientInfo}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText} allowFontScaling={false}>
                {appt.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentDetails}>
              <Text style={styles.studentName} allowFontScaling={false}>{appt.patientName}</Text>
              <Text style={styles.classInfo} allowFontScaling={false}>
                {appt.gender} • Age: {appt.age}                        
              </Text>
              <Text style={styles.classInfo} allowFontScaling={false}>Apt ID: {appt.appointmentId} </Text>
              <Text style={styles.classInfo} allowFontScaling={false}>Doctor: {appt.doctor} </Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.rescheduleButton]}>
              <Text style={styles.actionButtonIcon} allowFontScaling={false}>👁</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.completeButton]}>
              <Text style={styles.actionButtonIcon} allowFontScaling={false}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
              <Text style={styles.actionButtonIcon} allowFontScaling={false}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* See More Button */}
        <TouchableOpacity 
          style={styles.seeMoreButton} 
          onPress={() => toggleCardExpansion(appt.id)}
        >
          <Text style={styles.seeMoreText} allowFontScaling={false}>
            {isExpanded ? "See Less" : "See More..."}
          </Text>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Medical AID:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.panelMedicalAid}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Token Number:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.tokenNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Salutation:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.salutation}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>DOB:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.dob}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Email:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Mobile:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.mobile}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Appointment Date:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.appointmentDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Doctor:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.doctor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Address:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Info Source:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.infoSource}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Location:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>UHID:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.uhidPatientId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>ID Proof:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.idProof}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Royalty Card:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{appt.royaltyCard}</Text>
            </View>
          </View>
        )}
      </View>
    )
  }

  const hasActiveFilters = () => {
    return Object.values(filters).some(val => val !== "")
  }

  const renderDropdown = (options, value, onChange, showDropdown, setShowDropdown) => (
    <View style={[styles.dropdownWrapper, showDropdown && { zIndex: 10000 }]}>
      <TouchableOpacity 
        style={styles.dropdownContainer}
        onPress={() => {
          closeAllDropdowns()
          setShowDropdown(!showDropdown)
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
                  onChange(option)
                  setShowDropdown(false)
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
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Filter and Add Button Row - Replacing Search */}
        <View style={styles.searchAndAddContainer}>
          <View style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <View style={styles.filterButtonContent}>
                <Text style={styles.filterButtonText} allowFontScaling={false}>Filter Appointments</Text>
                {hasActiveFilters() && (
                  <View style={styles.activeFilterBadge}>
                    <Text style={styles.activeFilterBadgeText} allowFontScaling={false}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.dropdownArrow} allowFontScaling={false}>{showFilterDropdown ? "▲" : "▼"}</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.addAppointmentButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addIcon} allowFontScaling={false}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Dropdown */}
        {showFilterDropdown && (
          <View style={styles.filtersContainer}>
            <View style={styles.dropdownMenu}>
              <ScrollView 
                style={styles.filterScrollView} 
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={styles.filterContentContainer}
              >
                {/* Patient Name Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Patient Name</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter patient name"
                    value={filters.patientName}
                    onChangeText={(text) => handleFilterChange("patientName", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
                </View>
                
                {/* Mobile Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Mobile</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter mobile number"
                    value={filters.mobile}
                    onChangeText={(text) => handleFilterChange("mobile", text)}
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    allowFontScaling={false}
                  />
                </View>

                {/* UHID/Patient ID Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>UHID/Patient ID</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter UHID or Patient ID"
                    value={filters.uhidPatientId}
                    onChangeText={(text) => handleFilterChange("uhidPatientId", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
                </View>

                {/* ID Proof Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>ID Proof</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter ID proof type"
                    value={filters.idProof}
                    onChangeText={(text) => handleFilterChange("idProof", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
                </View>

                {/* Royalty Card Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Royalty Card</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter royalty card type"
                    value={filters.royaltyCard}
                    onChangeText={(text) => handleFilterChange("royaltyCard", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
                </View>

                {/* Filter Action Buttons */}
                <View style={styles.filterActions}>
                  <TouchableOpacity style={styles.clearButtonLarge} onPress={clearFilters}>
                    <Text style={styles.clearButtonLargeText} allowFontScaling={false}>Clear All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.applyButtonLarge} 
                    onPress={() => setShowFilterDropdown(false)}
                  >
                    <Text style={styles.applyButtonLargeText} allowFontScaling={false}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Appointment List */}
        <View style={styles.patientsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt, index) => (
              <View key={appt.id.toString()}>
                <PatientCard appt={appt} />
                {index < filteredAppointments.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} allowFontScaling={false}>No appointments found</Text>
              <Text style={styles.emptySubtext} allowFontScaling={false}>Try adjusting your filter criteria</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Appointment Modal - formSheet keeps header/footer visible */}
      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowAddForm(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddForm(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText} allowFontScaling={false}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle} allowFontScaling={false}>Add New Appointment</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
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
                  (value) => setNewAppointment(prev =>({ ...prev, salutation: value })),
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
                {renderDropdown(
                  locationOptions, 
                  newAppointment.location, 
                  (value) => setNewAppointment(prev => ({ ...prev, location: value })),
                  showFormLocationDropdown,
                  setShowFormLocationDropdown
                )}
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity 
                style={styles.cancelFormButton} 
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelFormButtonText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveFormButton} 
                onPress={handleAddAppointment}
              >
                <Text style={styles.saveFormButtonText} allowFontScaling={false}>Add Appointment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 16,
  },
  
  // Search and Add Button Row (now Filter and Add)
  searchAndAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  searchContainer: {
    flex: 0.8,
  },
  filterButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "bold",
  },
  activeFilterBadge: {
    marginLeft: 8,
    backgroundColor: "#4dd0e1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeFilterBadgeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  addAppointmentButton: {
    flex: 0.25,
    backgroundColor: "#4dd0e1",
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 18,
  },
  addIcon: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },

  // Filter Dropdown
  filtersContainer: {
    marginBottom: 16,
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginTop: 4,
    height: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1000,
  },
  filterScrollView: {
    flex: 1,
  },
  filterContentContainer: {
    padding: 14,
    paddingBottom: 24,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  filterInput: {
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
  filterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  clearButtonLarge: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  clearButtonLargeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4dd0e1",
  },
  applyButtonLarge: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#4dd0e1",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#4dd0e1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  applyButtonLargeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },

  // Modal styles
  modalContainer: {
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
    maxHeight: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 9999,
    zIndex: 9999,
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

  // Appointment card styles (keeping original style names)
  patientsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  patientCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 2,
    borderLeftColor: "#4dd0e1",
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  patientInfo: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4dd0e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  classInfo: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rescheduleButton: {
    backgroundColor: "#4dd0e1",
  },
  completeButton: {
    backgroundColor: "#10b981",
  },
  cancelButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonIcon: {
    fontSize: 16,
    color: "white",
  },
  seeMoreButton: {
    alignSelf: "flex-end",
    paddingVertical: 1,
    paddingHorizontal: 8,
  },
  seeMoreText: {
    fontSize: 12,
    color: "#4dd0e1",
    fontWeight: "600",
  },
  expandedDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
    textAlign: "center",
  },
})

export default AppointmentPage 