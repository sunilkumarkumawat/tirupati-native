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
        {/* Header with Patient Basic Info and Menu */}
        <View style={styles.patientHeader}>
          <View style={styles.patientMainInfo}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText} allowFontScaling={false}>
                {patient.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.patientBasicDetails}>
              <Text style={styles.patientName} allowFontScaling={false}>{patient.patientName}</Text>
              <View style={styles.patientMetaRow}>
                <Text style={styles.uhidText} allowFontScaling={false}>UHID: {patient.uhidPatientId}</Text>
                <Text style={styles.doaText} allowFontScaling={false}>DOA: {formatDate(patient.doa)}</Text>
              </View>
              <View style={styles.doctorRow}>
                <Text style={styles.doctorText} allowFontScaling={false}>Doctor: {patient.doctor}</Text>
                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: getStatusColor(patient.status) }]} allowFontScaling={false}>
                    {patient.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3-dot menu button */}
          <TouchableOpacity
            style={styles.threeDotButton}
            onPress={() => toggleMenu(patient.id)}
          >
            <Text style={styles.threeDotIcon} allowFontScaling={false}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu for 3-dot button */}
        {
          isMenuOpen && (
            <View style={styles.dropdownMenuContainer}>
              <TouchableOpacity
                style={styles.dropdownMenuItem}
                onPress={() => {
                  navigateToForm('SchedulerPreOpNoteForm', { patientId: patient.id, patientName: patient.patientName });
                  toggleMenu(null);
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
          )
        }

        {/* Patient Info Grid - Only visible when NOT expanded */}
        {
          !isExpanded && (
            <View style={styles.compactInfoRow}>
              <View style={styles.compactInfoItem}>
                <Text style={styles.infoLabel} allowFontScaling={false}>AGE</Text>
                <Text style={styles.infoValue} allowFontScaling={false}>{patient.age} yrs</Text>
              </View>
              <View style={styles.compactInfoItem}>
                <Text style={styles.infoLabel} allowFontScaling={false}>GENDER</Text>
                <Text style={styles.infoValue} allowFontScaling={false}>{patient.gender}</Text>
              </View>
              <View style={styles.compactInfoItem}>
                <Text style={styles.infoLabel} allowFontScaling={false}>WARD</Text>
                <Text style={styles.infoValue} allowFontScaling={false}>{patient.roomWard}</Text>
              </View>
            </View>
          )
        }

        {/* Expanded Details - Only show details NOT already visible */}
        {
          isExpanded && (
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
                <Text style={styles.detailLabel} allowFontScaling={false}>DOD:</Text>
                <Text style={styles.detailValue} allowFontScaling={false}>{formatDate(patient.dod)}</Text>
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
          )
        }

        {/* Footer Section */}
        <View style={styles.patientCardFooter}>
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => toggleCardExpansion(patient.id)}
          >
            <Text style={styles.seeMoreText} allowFontScaling={false}>
              {isExpanded ? "See Less" : "See More..."}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomActionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.viewButton]}>
              <Text style={styles.actionButtonIcon} allowFontScaling={false}>👁</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <Text style={styles.actionButtonIcon} allowFontScaling={false}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
              <Text style={styles.actionButtonIcon} allowFontScaling={false}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View >
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
    paddingVertical: 10,
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
  applyButtonLargeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  // Patient card styles - Enhanced
  patientsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  patientCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12, // Reduced from 16
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4dd0e1",
    position: 'relative',
  },
  patientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8, // Reduced from 12
  },
  patientMainInfo: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#4dd0e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#4dd0e1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },
  patientBasicDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 6,
  },
  patientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  doaText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginHorizontal: 8,
  },

  doctorRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 5,
},
  doctorText: {
  fontSize: 13,
  color: "#4b5563",
  fontWeight: "500",
  flex: 1, // Allow doctor text to take available space
},

  uhidText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statusBadge: {
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 12,
  backgroundColor: "#f3f4f6",
  marginLeft: 8, // Add some space between doctor text and status
},
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  // Three dot menu button
  threeDotButton: {
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
  },
  // Dropdown menu for three dots
  dropdownMenuContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    minWidth: 200,
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
  // Replace patientInfoGrid with this compact version:
  compactInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8, // Reduced from 12
    paddingHorizontal: 4,
  },

  compactInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  // infoItem: {
  //   width: "48%",
  //   marginBottom: 8,
  // },
  infoLabel: {
    fontSize: 10, // Reduced from 11
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2, // Reduced from 2
    textAlign: "center",
  },

  infoValue: {
    fontSize: 13, // Reduced from 14
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
  },
  // Expanded details
  expandedDetails: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  detailLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    flex: 0.4,
  },
  detailValue: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    flex: 0.6,
    textAlign: "right",
  },
  // Patient card footer
  patientCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  seeMoreButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  seeMoreText: {
    fontSize: 12,
    color: "#4dd0e1",
    fontWeight: "600",
  },
  bottomActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  viewButton: {
    backgroundColor: "#4dd0e1",
  },
  editButton: {
    backgroundColor: "#f59e0b",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  // Empty state
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
  },
})

export default OTPage