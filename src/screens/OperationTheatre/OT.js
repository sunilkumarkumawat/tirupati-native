import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback, // Import TouchableWithoutFeedback
} from "react-native"
import { ScrollView } from 'react-native-gesture-handler';

// Single patient template - only one patient will be shown
const patientTemplate = {
  id: 1,
  patientName: "Aarav Sharma",
  uhidPatientId: "UHID001",
  ipd: "IPD001",
  age: 25,
  gender: "Male",
  mobile: "+91 98765 43210",
  doctor: "Dr. Priya Singh",
  doa: "2025-01-15",
  dod: "2025-01-18",
  status: "Active",
  roomWard: "Ward A",
  bedNo: "A-101",
  idProof: "Aadhar",
  relative: "Father - Raj Sharma",
  category: "General",
}

const OTPage = ({ navigation }) => { // Add navigation prop
  const [patients, setPatients] = useState([patientTemplate]) // Only one patient
  const [filters, setFilters] = useState({
    patientName: "",
    uhidPatientId: "",
    mobile: "",
    idProof: "",
    employeeId: "",
    ipd: "",
    gender: "",
    fromDate: "",
    toDate: "",
  })
  const [filteredPatients, setFilteredPatients] = useState([patientTemplate])
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [expandedCards, setExpandedCards] = useState({})
  const [showMenuForPatientId, setShowMenuForPatientId] = useState(null); // State for 3-dot menu

  useEffect(() => {
    applyFilters()
  }, [filters, patients])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filtered = [...patients]
    // Apply filters
    if (filters.patientName) {
      filtered = filtered.filter((patient) =>
        patient.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
      )
    }
    if (filters.uhidPatientId) {
      filtered = filtered.filter((patient) =>
        patient.uhidPatientId.toLowerCase().includes(filters.uhidPatientId.toLowerCase())
      )
    }
    if (filters.mobile) {
      filtered = filtered.filter((patient) => patient.mobile.includes(filters.mobile))
    }
    if (filters.gender) {
      filtered = filtered.filter((patient) =>
        patient.gender.toLowerCase().includes(filters.gender.toLowerCase())
      )
    }
    if (filters.ipd) {
      filtered = filtered.filter((patient) =>
        patient.ipd.toLowerCase().includes(filters.ipd.toLowerCase())
      )
    }
    if (filters.idProof) {
      filtered = filtered.filter((patient) =>
        patient.idProof.toLowerCase().includes(filters.idProof.toLowerCase())
      )
    }
    if (filters.employeeId) {
      filtered = filtered.filter((patient) =>
        patient.employeeId && patient.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
      )
    }
    if (filters.fromDate) {
      filtered = filtered.filter((patient) => patient.doa >= filters.fromDate)
    }
    if (filters.toDate) {
      filtered = filtered.filter((patient) => {
        if (patient.dod) {
          return patient.dod <= filters.toDate
        }
        return true
      })
    }
    setFilteredPatients(filtered)
  }

  const clearFilters = () => {
    setFilters({
      patientName: "",
      uhidPatientId: "",
      mobile: "",
      idProof: "",
      employeeId: "",
      ipd: "",
      gender: "",
      fromDate: "",
      toDate: "",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981"
      case "Discharged":
        return "#6366f1"
      case "Transferred":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Handle add patient - navigate to AddPatientForm
  const handleAddPatient = () => {
    navigation.navigate('AddPatientForm', {
      onPatientAdded: (newPatient) => {
        // This ID generation logic is now handled in AddPatientForm before calling onPatientAdded
        setPatients(prev => [...prev, newPatient])
        Alert.alert("Success", "Patient added successfully!")
      },
      onCancel: () => navigation.goBack(), // This correctly tells AddPatientForm to go back
      patients: patients, // Pass the current patients list for ID generation in AddPatientForm
    })
  }

  const toggleCardExpansion = (patientId) => {
    setExpandedCards(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }))
  }

  // Functions for 3-dot menu
  const toggleMenu = (patientId) => {
    setShowMenuForPatientId(prevId => (prevId === patientId ? null : patientId));
  };

  const navigateToForm = (formName, params) => {
    navigation.navigate(formName, params);
  };

  const PatientCard = ({ patient, showMenuForPatientId, toggleMenu, navigateToForm }) => {
    const isExpanded = expandedCards[patient.id]
    const isMenuOpen = showMenuForPatientId === patient.id;

    return (
      <View style={styles.patientCard}>
        {/* Basic Info and Top Right 3-dot button */}
        <View style={styles.patientHeader}>
          <View style={styles.patientInfo}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText} allowFontScaling={false}>
                {patient.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.studentDetails}>
              <Text style={styles.studentName} allowFontScaling={false}>{patient.patientName}</Text>
              <Text style={styles.classInfo} allowFontScaling={false}>
                {patient.gender} • Age: {patient.age} • UHID: {patient.uhidPatientId}
              </Text>
              <Text style={styles.classInfo} allowFontScaling={false}>
                DOA: {patient.doa} • Room/Ward: {patient.roomWard}
                </Text>
              <Text style={styles.classInfo} allowFontScaling={false}>Doctor: {patient.doctor}</Text>
            </View>
          </View>
          {/* 3-dot button in the top right corner */}
          <TouchableOpacity
            style={styles.threeDotButton}
            onPress={() => toggleMenu(patient.id)}
          >
            <Text style={styles.threeDotIcon} allowFontScaling={false}>&#8942;</Text> {/* Vertical ellipsis */}
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu for 3-dot button (absolute position relative to patientCard) */}
        {isMenuOpen && (
          <View style={styles.dropdownMenuContainer}>
            <TouchableOpacity
              style={styles.dropdownMenuItem}
              onPress={() => {
                navigateToForm('SchedulerPreOpNoteForm', { patientId: patient.id, patientName: patient.patientName });
                toggleMenu(null); // Close menu after selection
              }}
            >
              <Text style={styles.dropdownMenuItemText} allowFontScaling={false}>Schedular & Pre Operative Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownMenuItem}
              onPress={() => {
                navigateToForm('PostOpNoteForm', { patientId: patient.id, patientName: patient.patientName });
                toggleMenu(null);
              }}
            >
              <Text style={styles.dropdownMenuItemText} allowFontScaling={false}>Post Operative Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownMenuItem}
              onPress={() => {
                navigateToForm('EyeSurgeryNoteForm', { patientId: patient.id, patientName: patient.patientName });
                toggleMenu(null);
              }}
            >
              <Text style={styles.dropdownMenuItemText} allowFontScaling={false}>Eye Surgery Note</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>IPD:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.ipd}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Mobile:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.mobile}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>DOA:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{formatDate(patient.doa)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>DOD:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{formatDate(patient.dod)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Status:</Text>
              <Text style={[styles.detailValue, { color: getStatusColor(patient.status) }]} allowFontScaling={false}>{patient.status}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Room/Ward:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.roomWard}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Bed No:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.bedNo}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>ID Proof:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.idProof}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Relative:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.relative}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Category:</Text>
              <Text style={styles.detailValue} allowFontScaling={false}>{patient.category}</Text>
            </View>
          </View>
        )}

        {/* New Footer Section for See More and Action Buttons */}
        <View style={styles.patientCardFooter}>
          {/* See More Button - Left Below Corner */}
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => toggleCardExpansion(patient.id)}
          >
            <Text style={styles.seeMoreText} allowFontScaling={false}>
              {isExpanded ? "See Less" : "See More..."}
            </Text>
          </TouchableOpacity>

          {/* View, Edit, Delete Buttons - Right Below Corner */}
          <View style={styles.bottomActionButtons}>
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
      </View>
    )
  }

  const hasActiveFilters = () => {
    return Object.values(filters).some(val => val !== "")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Full-screen overlay to close menu on outside tap */}
      {showMenuForPatientId !== null && (
        <TouchableWithoutFeedback onPress={() => setShowMenuForPatientId(null)}>
          <View style={styles.fullScreenOverlay} />
        </TouchableWithoutFeedback>
      )}

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
        // Disable scroll if filter dropdown or patient menu is open
        scrollEnabled={!showFilterDropdown && showMenuForPatientId === null}
      >
        {/* Filter and Add Button Row */}
        <View style={styles.searchAndAddContainer}>
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <View style={styles.filterButtonContent}>
                <Text style={styles.filterButtonText} allowFontScaling={false}>Filter Patients</Text>
                {hasActiveFilters() && (
                  <View style={styles.activeFilterBadge}>
                    <Text style={styles.activeFilterBadgeText} allowFontScaling={false}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.dropdownArrow} allowFontScaling={false}>{showFilterDropdown ? "▲" : "▼"}</Text>
            </TouchableOpacity>
          </View>
          {/* Changed onPress to handleAddPatient */}
          <TouchableOpacity style={styles.addAppointmentButton} onPress={handleAddPatient}>
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
                contentContainerStyle={{ ...styles.filterContentContainer, flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                bounces={true}
                overScrollMode="never"
                scrollIndicatorInsets={{ right: 1 }}
                indicatorStyle="black"
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
                {/* Employee ID Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Employee ID</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter employee ID"
                    value={filters.employeeId}
                    onChangeText={(text) => handleFilterChange("employeeId", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
                </View>
                {/* IPD Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>IPD</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter IPD number"
                    value={filters.ipd}
                    onChangeText={(text) => handleFilterChange("ipd", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
                </View>
                {/* Gender Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Gender</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter gender"
                    value={filters.gender}
                    onChangeText={(text) => handleFilterChange("gender", text)}
                    placeholderTextColor="#9ca3af"
                    allowFontScaling={false}
                  />
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
          </View>
        )}
        {/* Patient List */}
        <View style={styles.patientsList}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <View key={patient.id.toString()}>
                <PatientCard
                  patient={patient}
                  showMenuForPatientId={showMenuForPatientId}
                  toggleMenu={toggleMenu}
                  navigateToForm={navigateToForm}
                />
                {index < filteredPatients.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} allowFontScaling={false}>No patients found</Text>
              <Text style={styles.emptySubtext} allowFontScaling={false}>Try adjusting your filter criteria</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  // Full-screen overlay for closing menus
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // Make it transparent
    zIndex: 5, // Lower than the dropdown menu (which is 10) but higher than scroll content
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
    zIndex: 999,
  },
  dropdownMenu: {
    position: "absolute",
    top: 0,
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
    elevation: 10,
    zIndex: 1000, // This needs to be higher than the fullScreenOverlay
  },
  filterScrollView: {
    flex: 1,
    paddingRight: 2,
  },
  filterContentContainer: {
    padding: 14,
    paddingBottom: 24,
    paddingRight: 12,
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
  // Patient card styles
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
    position: 'relative', // Added for absolute positioning of dropdown
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
  // 3-dot button styles (now directly in patientHeader)
  threeDotButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0", // A neutral background for the dots
    marginLeft: 8, // Keep some margin from the patient info
  },
  threeDotIcon: {
    fontSize: 20,
    color: "#6b7280",
    fontWeight: "bold",
  },
  // Dropdown menu styles
  dropdownMenuContainer: {
    position: 'absolute',
    top: 10, // Adjust as needed to position relative to the 3-dot button
    right: 10, // Adjust as needed
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10, // Ensure it appears above the fullScreenOverlay (zIndex: 5)
    minWidth: 220, // Increased width to accommodate text
    paddingVertical: 5,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: "#374151",
  },
  // See More button and action buttons moved to a new footer
  patientCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  seeMoreButton: {
    paddingVertical: 1,
    paddingHorizontal: 8,
  },
  seeMoreText: {
    fontSize: 12,
    color: "#4dd0e1",
    fontWeight: "600",
  },
  bottomActionButtons: {
    flexDirection: "row",
    alignItems: 'center',
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

export default OTPage