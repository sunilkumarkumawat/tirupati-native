import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

// Single patient template - only one patient will be shown initially, same as OT.js
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
};

// Sample employee data (replace with your actual data)
const employeeList = [
  "Dr. Priya Singh",
  "Dr. Alok Kumar",
  "Nurse Sarah",
  "Admin John Doe",
  "Technician Emily White",
  "Dr. Rina Gupta",
  "Dr. Sameer Khan",
  "Nurse Jessica",
  "Admin Robert",
  "Technician David",
];


const Registration = ({ navigation }) => {
  const filterButtonRef = useRef(null);
  const [filterButtonLayout, setFilterButtonLayout] = useState(null);

  const [patients, setPatients] = useState([patientTemplate]);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState(null); // null means show filter type options

  // New state for the employee search dropdown
  const [showEmployeeSearchDropdown, setShowEmployeeSearchDropdown] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employeeList);


  const [patientFilterInputs, setPatientFilterInputs] = useState({
    uhidPatientId: "",
    aadharCard: "",
    mobile: "",
    idProof: "",
    royaltyCard: "",
    patientName: "",
    relative: "",
  });

  const [employeeFilterInputs, setEmployeeFilterInputs] = useState({
    search: "", // This will hold the selected employee name
    patient: "",
    uniqueId: "",
    mobile: "",
  });

  const [abhaAbdmFilterInputs, setAbhaAbdmFilterInputs] = useState({
    aadharId: "",
    abhaId: "",
    mobile: "",
  });

  // Effect to filter employees based on search query
  useEffect(() => {
    if (employeeSearchQuery) {
      const lowerCaseQuery = employeeSearchQuery.toLowerCase();
      setFilteredEmployees(
        employeeList.filter((employee) =>
          employee.toLowerCase().includes(lowerCaseQuery)
        )
      );
    } else {
      setFilteredEmployees(employeeList);
    }
  }, [employeeSearchQuery]);


  const [expandedCards, setExpandedCards] = useState({});
  const [showMenuForPatientId, setShowMenuForPatientId] = useState(null);

  const handleSpecificFilterInputChange = (filterType, field, value) => {
    if (filterType === "Patient") {
      setPatientFilterInputs((prev) => ({ ...prev, [field]: value }));
    } else if (filterType === "Employee") {
      setEmployeeFilterInputs((prev) => ({ ...prev, [field]: value }));
    } else if (filterType === "ABHA/ABDM") {
      setAbhaAbdmFilterInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSelectFilterType = (type) => {
    setSelectedFilterType(type);
    // Clear previous filter inputs when switching types to avoid old data lingering
    setPatientFilterInputs({ uhidPatientId: "", aadharCard: "", mobile: "", idProof: "", royaltyCard: "", patientName: "", relative: "" });
    setEmployeeFilterInputs({ search: "", patient: "", uniqueId: "", mobile: "" });
    setAbhaAbdmFilterInputs({ aadharId: "", abhaId: "", mobile: "" });
    // Close employee search dropdown if open
    setShowEmployeeSearchDropdown(false);
    setEmployeeSearchQuery(""); // Reset search query
  };

  const handleDismissFilterModal = () => {
    setShowFilterModal(false);
    setSelectedFilterType(null); // Always reset to show options when modal is dismissed
    setShowEmployeeSearchDropdown(false); // Ensure employee search dropdown closes
    setEmployeeSearchQuery(""); // Reset search query on modal dismiss
    Keyboard.dismiss();
  };

  // New function to go back to filter type selection
  const handleBackToFilterTypes = () => {
    setSelectedFilterType(null);
    setShowEmployeeSearchDropdown(false); // Close employee search dropdown
    setEmployeeSearchQuery(""); // Reset search query
    Keyboard.dismiss();
  };

  const hasActiveSpecificFilters = () => {
    // This checks if ANY specific filter inputs have values across all types
    return (
      Object.values(patientFilterInputs).some(val => val !== "") ||
      Object.values(employeeFilterInputs).some(val => val !== "") ||
      Object.values(abhaAbdmFilterInputs).some(val => val !== "")
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Discharged":
        return "#6366f1";
      case "Transferred":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleAddPatient = () => {
    navigation.navigate('AddRegistrationForm', {
      onPatientAdded: (newPatient) => {
        setPatients(prev => [...prev, newPatient]);
        Alert.alert("Success", "Patient added successfully!");
      },
      onCancel: () => navigation.goBack(),
      patients: patients,
    });
  };

  const toggleCardExpansion = (patientId) => {
    setExpandedCards(prev => ({
      ...prev,
      [patientId]: !prev[patientId]
    }));
  };

  const toggleMenu = (patientId) => {
    setShowMenuForPatientId(prevId => (prevId === patientId ? null : patientId));
  };

  const navigateToForm = (formName, params) => {
    navigation.navigate(formName, params);
  };

  const PatientCard = ({ patient, showMenuForPatientId, toggleMenu, navigateToForm }) => {
    const isExpanded = expandedCards[patient.id];
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
                <Text style={styles.detailValue} allowFontScaling={false}>{patient.dod}</Text>
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
    );
  };

  // Render the filter input fields based on selectedFilterType
  const renderFilterContent = () => {
    return (
      <View>
        {selectedFilterType && ( // Show header only when a specific filter type is selected
          <View style={styles.filterModalHeader}>
            <TouchableOpacity onPress={handleBackToFilterTypes} style={styles.backButton}>
              <Text style={styles.backButtonText}>{"< "}</Text>
            </TouchableOpacity>
            <Text style={styles.filterModalTitle}>{selectedFilterType} Filters</Text>
            <View style={{ width: 60 }} /> {/* Spacer to balance the header */}
          </View>
        )}

        {/* Content based on selectedFilterType */}
        {!selectedFilterType ? (
          // Show filter type options if no specific type is selected
          <View style={styles.dropdownOptions}>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => handleSelectFilterType("Patient")}
            >
              <Text style={styles.dropdownOptionText}>Patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => handleSelectFilterType("Employee")}
            >
              <Text style={styles.dropdownOptionText}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => handleSelectFilterType("ABHA/ABDM")}
            >
              <Text style={styles.dropdownOptionText}>ABHA/ABDM</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Show specific filter inputs based on selectedFilterType
          <View style={styles.specificFilterInputsContainer}>
            {selectedFilterType === "Patient" && (
              <>
                <TextInput
                  style={styles.filterInput}
                  placeholder="UHID/Patient ID"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.uhidPatientId}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "uhidPatientId", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Aadhar Card"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.aadharCard}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "aadharCard", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Mobile"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.mobile}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "mobile", val)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="ID Proof"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.idProof}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "idProof", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Royalty Card"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.royaltyCard}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "royaltyCard", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Patient Name"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.patientName}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "patientName", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Relative"
                  placeholderTextColor="#9ca3af"
                  value={patientFilterInputs.relative}
                  onChangeText={(val) => handleSpecificFilterInputChange("Patient", "relative", val)}
                />
              </>
            )}
            {selectedFilterType === "Employee" && (
              <>
                {/* Replaced TextInput with TouchableOpacity for dropdown trigger */}
                <TouchableOpacity
                  style={styles.filterDropdownTrigger}
                  onPress={() => {
                    setShowEmployeeSearchDropdown(true);
                    Keyboard.dismiss(); // Dismiss any open keyboard
                  }}
                >
                  <Text style={styles.filterDropdownValue}>
                    {employeeFilterInputs.search || "Search Employee"}
                  </Text>
                  <Text style={styles.dropdownArrowSmall}>▼</Text>
                </TouchableOpacity>

                {/* Employee Search Dropdown Modal */}
                <Modal
                  transparent={true}
                  visible={showEmployeeSearchDropdown}
                  onRequestClose={() => setShowEmployeeSearchDropdown(false)}
                  animationType="fade"
                >
                  <TouchableWithoutFeedback onPress={() => setShowEmployeeSearchDropdown(false)}>
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={[
                          styles.employeeSearchDropdownContent,
                          // Position the dropdown relative to the filter modal content
                          // This is a rough estimate; precise positioning might need more useRef/measureInWindow
                          {
                            top: filterButtonLayout ? filterButtonLayout.y + filterButtonLayout.height + 5 : 100, // Fallback if layout not ready
                            right: filterButtonLayout ? Dimensions.get('window').width - filterButtonLayout.x - filterButtonLayout.width : 20,
                            width: filterButtonLayout ? filterButtonLayout.width * 1.5 : 250, // Adjust width as needed
                            // You might need to adjust the left/right/width based on your actual layout
                            // For simplicity, let's just center it for now if no layout
                            alignSelf: 'center',
                            marginTop: selectedFilterType ? 0 : 0, // Adjust if needed
                          }
                        ]}>
                          <TextInput
                            style={styles.employeeSearchInput}
                            placeholder="Search Employee..."
                            placeholderTextColor="#9ca3af"
                            value={employeeSearchQuery}
                            onChangeText={setEmployeeSearchQuery}
                            autoFocus={true} // Focus on search input when dropdown opens
                          />
                          <ScrollView
                            style={styles.employeeOptionsScrollView}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                            keyboardShouldPersistTaps="handled"
                            persistentScrollbar={true}
                            indicatorStyle="black"
                          >
                            {filteredEmployees.length > 0 ? (
                              filteredEmployees.map((employee, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={styles.dropdownOption}
                                  onPress={() => {
                                    handleSpecificFilterInputChange("Employee", "search", employee);
                                    setShowEmployeeSearchDropdown(false);
                                    setEmployeeSearchQuery(""); // Clear search query after selection
                                    Keyboard.dismiss();
                                  }}
                                >
                                  <Text style={styles.dropdownOptionText}>{employee}</Text>
                                </TouchableOpacity>
                              ))
                            ) : (
                              <View style={styles.noResults}>
                                <Text style={styles.noResultsText}>No employees found</Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>

                <TextInput
                  style={styles.filterInput}
                  placeholder="Patient"
                  placeholderTextColor="#9ca3af"
                  value={employeeFilterInputs.patient}
                  onChangeText={(val) => handleSpecificFilterInputChange("Employee", "patient", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Unique ID"
                  placeholderTextColor="#9ca3af"
                  value={employeeFilterInputs.uniqueId}
                  onChangeText={(val) => handleSpecificFilterInputChange("Employee", "uniqueId", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Mobile"
                  placeholderTextColor="#9ca3af"
                  value={employeeFilterInputs.mobile}
                  onChangeText={(val) => handleSpecificFilterInputChange("Employee", "mobile", val)}
                  keyboardType="numeric"
                />
              </>
            )}
            {selectedFilterType === "ABHA/ABDM" && (
              <>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Aadhar ID"
                  placeholderTextColor="#9ca3af"
                  value={abhaAbdmFilterInputs.aadharId}
                  onChangeText={(val) => handleSpecificFilterInputChange("ABHA/ABDM", "aadharId", val)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="ABHA ID"
                  placeholderTextColor="#9ca3af"
                  value={abhaAbdmFilterInputs.abhaId}
                  onChangeText={(val) => handleSpecificFilterInputChange("ABHA/ABDM", "abhaId", val)}
                />
                <TextInput
                  style={styles.filterInput}
                  placeholder="Mobile"
                  placeholderTextColor="#9ca3af"
                  value={abhaAbdmFilterInputs.mobile}
                  onChangeText={(val) => handleSpecificFilterInputChange("ABHA/ABDM", "mobile", val)}
                  keyboardType="numeric"
                />
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  const handleFilterButtonPress = () => {
    filterButtonRef.current.measureInWindow((x, y, width, height) => {
      setFilterButtonLayout({ x, y, width, height });
      setShowFilterModal(true);
      setSelectedFilterType(null); // Ensure modal starts with type selection
      setShowEmployeeSearchDropdown(false); // Close employee search dropdown if open
      setEmployeeSearchQuery(""); // Reset search query
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Full-screen overlay to close patient 3-dot menu on outside tap */}
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
        // Disable scroll if filter modal or patient menu or employee search dropdown is open
        scrollEnabled={!showFilterModal && showMenuForPatientId === null && !showEmployeeSearchDropdown}
      >
        {/* Filter (3-dot) and Add Button Row */}
        <View style={styles.searchAndAddContainer}>
          <TouchableOpacity
            ref={filterButtonRef}
            style={styles.threeDotFilterButton}
            onPress={handleFilterButtonPress}
          >
            <Text style={styles.threeDotIcon} allowFontScaling={false}>⋮</Text>
            {hasActiveSpecificFilters() && (
              <View style={styles.activeFilterBadgeTopRight}>
                <Text style={styles.activeFilterBadgeText} allowFontScaling={false}>Active</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Add Patient Button */}
          <TouchableOpacity style={styles.addAppointmentButton} onPress={handleAddPatient}>
            <Text style={styles.addIcon} allowFontScaling={false}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Main Filter Modal */}
        <Modal
          transparent={true}
          visible={showFilterModal}
          onRequestClose={handleDismissFilterModal}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={handleDismissFilterModal}>
            <View style={styles.modalOverlay}>
              {filterButtonLayout && (
                <TouchableWithoutFeedback>
                  <View style={[
                    styles.filterModalContentDropdown,
                    {
                      top: filterButtonLayout.y + filterButtonLayout.height + 5,
                      right: Dimensions.get('window').width - filterButtonLayout.x - filterButtonLayout.width,
                    }
                  ]}>
                    {renderFilterContent()}
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Patient List */}
        <View style={styles.patientsList}>
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <View key={patient.id.toString()}>
                <PatientCard
                  patient={patient}
                  showMenuForPatientId={showMenuForPatientId}
                  toggleMenu={toggleMenu}
                  navigateToForm={navigateToForm}
                />
                {index < patients.length - 1 && <View style={styles.separator} />}
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
  );
};

const { width } = Dimensions.get('window');
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
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  searchAndAddContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
    justifyContent: "flex-end",
  },
  threeDotFilterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  threeDotIcon: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 18,
  },
  activeFilterBadgeTopRight: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: "#4dd0e1",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'white',
  },
  activeFilterBadgeText: {
    fontSize: 9,
    color: "white",
    fontWeight: "600",
  },
  addAppointmentButton: {
    width: 60,
    height: 44,
    backgroundColor: "#4dd0e1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addIcon: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  filterModalContentDropdown: {
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
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButtonText: {
    fontSize: 14,
    color: '#4dd0e1',
    fontWeight: '600',
  },
  filterModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  dropdownOptions: {
    // No specific styles needed here, just a container
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  specificFilterInputsContainer: {
    gap: 10,
    paddingTop: 5, // Small padding after header
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
  // New styles for the employee search dropdown
  filterDropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterDropdownValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrowSmall: {
    fontSize: 12,
    color: "#6b7280",
  },
  employeeSearchDropdownContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    minWidth: 250, // Adjust as needed
    maxHeight: 250, // Max height for scrollable list
    position: 'absolute',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1001, // Higher zIndex than filterModalContentDropdown
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  employeeSearchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    color: "#374151",
    marginBottom: 8,
  },
  employeeOptionsScrollView: {
    flex: 1,
  },
  noResults: {
    padding: 10,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  patientsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  patientCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
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
    marginBottom: 8,
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
    flex: 1,
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
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  threeDotButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
  },
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
  compactInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  compactInfoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
    textAlign: "center",
  },
  infoValue: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
  },
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
});

export default Registration;