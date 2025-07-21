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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
  {
    id: 4,
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
  },
  {
    id: 5,
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
  },
]

const appStatusOptions = ["All Status", "Scheduled", "Completed", "Cancelled"]
const genderOptions = ["All Genders", "Male", "Female", "Other"]
const doctorOptions = [
  "All Doctors",
  "Dr. Priya Singh",
  "Dr. Amit Kumar",
  "Dr. Kavya Reddy",
  "Dr. Rajesh Gupta",
  "Dr. Sunita Sharma",
]
const createdByOptions = ["All", "Receptionist", "Doctor", "Admin"]

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState(appointmentData)
  const [filters, setFilters] = useState({
    patient: "",
    mobile: "",
    appStatus: "All Status",
    gender: "All Genders",
    doctor: "All Doctors",
    createdBy: "All",
    fromDate: "",
    toDate: "",
  })
  const [filteredAppointments, setFilteredAppointments] = useState(appointmentData)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  
  // Add appointment form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    mobile: "",
    appStatus: "Scheduled",
    gender: "Male",
    doctor: "Dr. Priya Singh",
    createdBy: "Receptionist",
    fromDate: "",
    toDate: "",
    address: "",
    age: "",
  })

  // Dropdown states for filters
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [showCreatedByDropdown, setShowCreatedByDropdown] = useState(false)

  // Dropdown states for form
  const [showFormStatusDropdown, setShowFormStatusDropdown] = useState(false)
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)
  const [showFormDoctorDropdown, setShowFormDoctorDropdown] = useState(false)
  const [showFormCreatedByDropdown, setShowFormCreatedByDropdown] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [filters, searchKeyword, appointments])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filtered = [...appointments]

    // Apply main search keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((appt) => {
        return (
          appt.patientName.toLowerCase().includes(keyword) ||
          appt.mobile.includes(keyword) ||
          appt.doctor.toLowerCase().includes(keyword) ||
          appt.createdBy.toLowerCase().includes(keyword) ||
          appt.appStatus.toLowerCase().includes(keyword) ||
          appt.gender.toLowerCase().includes(keyword)
        )
      })
    }

    // Apply filters
    if (filters.patient) {
      filtered = filtered.filter((appt) => 
        appt.patientName.toLowerCase().includes(filters.patient.toLowerCase())
      )
    }
    if (filters.mobile) {
      filtered = filtered.filter((appt) => appt.mobile.includes(filters.mobile))
    }
    if (filters.appStatus !== "All Status") {
      filtered = filtered.filter((appt) => appt.appStatus === filters.appStatus)
    }
    if (filters.gender !== "All Genders") {
      filtered = filtered.filter((appt) => appt.gender === filters.gender)
    }
    if (filters.doctor !== "All Doctors") {
      filtered = filtered.filter((appt) => appt.doctor === filters.doctor)
    }
    if (filters.createdBy !== "All") {
      filtered = filtered.filter((appt) => appt.createdBy === filters.createdBy)
    }
    if (filters.fromDate) {
      filtered = filtered.filter((appt) => appt.fromDate >= filters.fromDate)
    }
    if (filters.toDate) {
      filtered = filtered.filter((appt) => appt.toDate <= filters.toDate)
    }

    setFilteredAppointments(filtered)
  }

  const clearFilters = () => {
    setFilters({
      patient: "",
      mobile: "",
      appStatus: "All Status",
      gender: "All Genders",
      doctor: "All Doctors",
      createdBy: "All",
      fromDate: "",
      toDate: "",
    })
    setSearchKeyword("")
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
    if (!newAppointment.patientName || !newAppointment.mobile || !newAppointment.fromDate || !newAppointment.age) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      ...newAppointment,
      appointmentNo: generateAppointmentNumber(),
      token: generateToken(),
      toDate: newAppointment.toDate || newAppointment.fromDate,
      age: parseInt(newAppointment.age),
    }

    setAppointments(prev => [...prev, appointment])
    setNewAppointment({
      patientName: "",
      mobile: "",
      appStatus: "Scheduled",
      gender: "Male",
      doctor: "Dr. Priya Singh",
      createdBy: "Receptionist",
      fromDate: "",
      toDate: "",
      address: "",
      age: "",
    })
    setShowAddForm(false)
    Alert.alert("Success", "Appointment added successfully!")
  }

  const closeAllDropdowns = () => {
    setShowStatusDropdown(false)
    setShowGenderDropdown(false)
    setShowDoctorDropdown(false)
    setShowCreatedByDropdown(false)
    setShowFormStatusDropdown(false)
    setShowFormGenderDropdown(false)
    setShowFormDoctorDropdown(false)
    setShowFormCreatedByDropdown(false)
  }

  const PTMCard = ({ appt }) => (
    <TouchableOpacity style={[styles.ptmCard, { borderLeftColor: getStatusColor(appt.appStatus) }]}>
      <View style={styles.ptmHeader}>
        <View style={styles.studentInfo}>
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
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appt.appStatus) }]}>
          <Text style={styles.statusText} allowFontScaling={false}>{appt.appStatus}</Text>
        </View>
      </View>
      <View style={styles.meetingDetails}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName} allowFontScaling={false}>{appt.doctor}</Text>
          <Text style={styles.subject} allowFontScaling={false}>Created By: {appt.createdBy}</Text>
        </View>
        <View style={[styles.purposeBadge, { backgroundColor: getStatusColor(appt.appStatus) }]}>
          <Text style={styles.purposeText} allowFontScaling={false}>Appt. No: {appt.appointmentNo}</Text>
        </View>
      </View>
      <View style={styles.meetingSchedule}>
        <View style={styles.dateTimeInfo}>
          <Text style={styles.dateLabel} allowFontScaling={false}>📅 {formatDate(appt.fromDate)}</Text>
          <Text style={styles.timeLabel} allowFontScaling={false}>📞 {appt.mobile}</Text>
        </View>
      </View>
      <View style={styles.ptmFooter}>
        <Text style={styles.duration} allowFontScaling={false}>Token: {appt.token}</Text>
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
    </TouchableOpacity>
  )

  const hasActiveFilters = () => {
    return Object.values(filters).some(
      (val) =>
        (typeof val === "string" &&
          val !== "" &&
          val !== "All Status" &&
          val !== "All Genders" &&
          val !== "All Doctors" &&
          val !== "All") ||
        val !== null
    )
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
        {/* Search Bar and Add Button Row */}
        <View style={styles.searchAndAddContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon} allowFontScaling={false}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by patient, mobile, doctor, status..."
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
              {searchKeyword.length > 0 && (
                <TouchableOpacity onPress={() => setSearchKeyword("")} style={styles.clearButton}>
                  <Text style={styles.clearButtonText} allowFontScaling={false}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.addAppointmentButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addIcon} allowFontScaling={false}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Dropdown */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <View style={styles.dropdownButtonContent}>
              <Text style={styles.dropdownButtonText} allowFontScaling={false}>Filter Appointments</Text>
              {hasActiveFilters() && (
                <View style={styles.activeFilterBadge}>
                  <Text style={styles.activeFilterBadgeText} allowFontScaling={false}>Active</Text>
                </View>
              )}
            </View>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>{showFilterDropdown ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          
          {showFilterDropdown && (
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
                    value={filters.patient}
                    onChangeText={(text) => handleFilterChange("patient", text)}
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

                {/* App Status Filter */}
                <View style={[styles.filterSection, showStatusDropdown && { zIndex: 10000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>App Status</Text>
                  {renderDropdown(
                    appStatusOptions, 
                    filters.appStatus, 
                    (value) => handleFilterChange("appStatus", value),
                    showStatusDropdown,
                    setShowStatusDropdown
                  )}
                </View>

                {/* Gender Filter */}
                <View style={[styles.filterSection, showGenderDropdown && { zIndex: 9000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Gender</Text>
                  {renderDropdown(
                    genderOptions, 
                    filters.gender, 
                    (value) => handleFilterChange("gender", value),
                    showGenderDropdown,
                    setShowGenderDropdown
                  )}
                </View>

                {/* Doctor Filter */}
                <View style={[styles.filterSection, showDoctorDropdown && { zIndex: 8000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Doctor</Text>
                  {renderDropdown(
                    doctorOptions, 
                    filters.doctor, 
                    (value) => handleFilterChange("doctor", value),
                    showDoctorDropdown,
                    setShowDoctorDropdown
                  )}
                </View>

                {/* Created By Filter */}
                <View style={[styles.filterSection, showCreatedByDropdown && { zIndex: 7000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Created By</Text>
                  {renderDropdown(
                    createdByOptions, 
                    filters.createdBy, 
                    (value) => handleFilterChange("createdBy", value),
                    showCreatedByDropdown,
                    setShowCreatedByDropdown
                  )}
                </View>

                {/* Date Filters Row */}
                <View style={styles.dateFiltersRow}>
                  <View style={styles.dateFilterSection}>
                    <Text style={styles.filterLabel} allowFontScaling={false}>From Date</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="YYYY-MM-DD"
                      value={filters.fromDate}
                      onChangeText={(text) => handleFilterChange("fromDate", text)}
                      placeholderTextColor="#9ca3af"
                      allowFontScaling={false}
                    />
                  </View>
                  
                  <View style={styles.dateFilterSection}>
                    <Text style={styles.filterLabel} allowFontScaling={false}>To Date</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="YYYY-MM-DD"
                      value={filters.toDate}
                      onChangeText={(text) => handleFilterChange("toDate", text)}
                      placeholderTextColor="#9ca3af"
                      allowFontScaling={false}
                    />
                  </View>
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
          )}
        </View>

        {/* Appointment List */}
        <View style={styles.ptmsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt, index) => (
              <View key={appt.id.toString()}>
                <PTMCard appt={appt} />
                {index < filteredAppointments.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} allowFontScaling={false}>No appointments found</Text>
              <Text style={styles.emptySubtext} allowFontScaling={false}>Try adjusting your search or filter criteria</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Appointment Modal */}
      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
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
            <View style={styles.formSection}>
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

            <View style={styles.formSection}>
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

            <View style={styles.formSection}>
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

            <View style={[styles.formSection, showFormGenderDropdown && { zIndex: 10000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Gender</Text>
              {renderDropdown(
                ["Male", "Female", "Other"], 
                newAppointment.gender, 
                (value) => setNewAppointment(prev => ({ ...prev, gender: value })),
                showFormGenderDropdown,
                setShowFormGenderDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormDoctorDropdown && { zIndex: 9000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Doctor</Text>
              {renderDropdown(
                doctorOptions.slice(1), 
                newAppointment.doctor, 
                (value) => setNewAppointment(prev => ({ ...prev, doctor: value })),
                showFormDoctorDropdown,
                setShowFormDoctorDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormStatusDropdown && { zIndex: 8000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Status</Text>
              {renderDropdown(
                appStatusOptions.slice(1), 
                newAppointment.appStatus, 
                (value) => setNewAppointment(prev => ({ ...prev, appStatus: value })),
                showFormStatusDropdown,
                setShowFormStatusDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormCreatedByDropdown && { zIndex: 7000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Created By</Text>
              {renderDropdown(
                createdByOptions.slice(1), 
                newAppointment.createdBy, 
                (value) => setNewAppointment(prev => ({ ...prev, createdBy: value })),
                showFormCreatedByDropdown,
                setShowFormCreatedByDropdown
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Appointment Date *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newAppointment.fromDate}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, fromDate: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Address</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter patient address"
                value={newAppointment.address}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, address: text }))}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
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
  
  // Search and Add Button Row
  searchAndAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  searchContainer: {
    flex: 0.8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    color: "#9ca3af",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    paddingVertical: 12,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#9ca3af",
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
  dropdownButton: {
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
  dropdownButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownButtonText: {
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
  
  dateFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dateFilterSection: {
    flex: 1,
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

  // Appointment card styles
  ptmsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  ptmCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 2,
  },
  ptmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  studentInfo: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusText: {
    color: "white",
    fontSize: 8,
    fontWeight: "700",
  },
  meetingDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  subject: {
    fontSize: 11,
    color: "#4dd0e1",
    fontWeight: "500",
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  purposeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  meetingSchedule: {
    marginBottom: 8,
  },
  dateTimeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  timeLabel: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  ptmFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  duration: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    flex: 1,
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