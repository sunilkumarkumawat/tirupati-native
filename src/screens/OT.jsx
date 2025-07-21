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

const otData = [
  {
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
  },
  {
    id: 2,
    patientName: "Priya Patel",
    uhidPatientId: "UHID002",
    ipd: "IPD002",
    age: 30,
    gender: "Female",
    mobile: "+91 87654 32109",
    doctor: "Dr. Amit Kumar",
    doa: "2025-01-12",
    dod: "2025-01-15",
    status: "Discharged",
    roomWard: "Ward B",
    bedNo: "B-205",
    idProof: "PAN Card",
    relative: "Husband - Kiran Patel",
    category: "Private",
  },
  {
    id: 3,
    patientName: "Arjun Singh",
    uhidPatientId: "UHID003",
    ipd: "IPD003",
    age: 40,
    gender: "Male",
    mobile: "+91 76543 21098",
    doctor: "Dr. Kavya Reddy",
    doa: "2025-01-18",
    dod: "",
    status: "Active",
    roomWard: "ICU",
    bedNo: "ICU-5",
    idProof: "Driving License",
    relative: "Wife - Sunita Singh",
    category: "Emergency",
  },
  {
    id: 4,
    patientName: "Kavya Reddy",
    uhidPatientId: "UHID004",
    ipd: "IPD004",
    age: 35,
    gender: "Female",
    mobile: "+91 65432 10987",
    doctor: "Dr. Rajesh Gupta",
    doa: "2025-01-10",
    dod: "2025-01-14",
    status: "Discharged",
    roomWard: "Ward C",
    bedNo: "C-310",
    idProof: "Voter ID",
    relative: "Mother - Lata Reddy",
    category: "Insurance",
  },
  {
    id: 5,
    patientName: "Rohit Kumar",
    uhidPatientId: "UHID005",
    ipd: "IPD005",
    age: 50,
    gender: "Male",
    mobile: "+91 54321 09876",
    doctor: "Dr. Sunita Sharma",
    doa: "2025-01-20",
    dod: "",
    status: "Active",
    roomWard: "Ward A",
    bedNo: "A-205",
    idProof: "Passport",
    relative: "Son - Vikash Kumar",
    category: "General",
  },
]

const genderOptions = ["All Genders", "Male", "Female", "Other"]
const ipdOptions = ["All IPD", "IPD001", "IPD002", "IPD003", "IPD004", "IPD005"]
const idProofOptions = ["All ID Proof", "Aadhar", "PAN Card", "Driving License", "Voter ID", "Passport"]
const employeeIdOptions = ["All Employee ID", "EMP001", "EMP002", "EMP003", "EMP004", "EMP005"]
const statusOptions = ["All Status", "Active", "Discharged", "Transferred"]
const categoryOptions = ["All Category", "General", "Private", "Emergency", "Insurance"]

const OTPage = () => {
  const [patients, setPatients] = useState(otData)
  const [filters, setFilters] = useState({
    patientName: "",
    uhidPatientId: "",
    mobile: "",
    idProof: "All ID Proof",
    employeeId: "All Employee ID",
    ipd: "All IPD",
    gender: "All Genders",
    fromDate: "",
    toDate: "",
  })
  const [filteredPatients, setFilteredPatients] = useState(otData)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  
  // Add patient form states
  const [showAddForm, setShowAddForm] = useState(false)
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
    idProof: "Aadhar",
    relative: "",
    category: "General",
  })

  // Dropdown states for filters
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showIpdDropdown, setShowIpdDropdown] = useState(false)
  const [showIdProofDropdown, setShowIdProofDropdown] = useState(false)
  const [showEmployeeIdDropdown, setShowEmployeeIdDropdown] = useState(false)

  // Dropdown states for form
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)
  const [showFormStatusDropdown, setShowFormStatusDropdown] = useState(false)
  const [showFormIdProofDropdown, setShowFormIdProofDropdown] = useState(false)
  const [showFormCategoryDropdown, setShowFormCategoryDropdown] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [filters, searchKeyword, patients])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filtered = [...patients]

    // Apply main search keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((patient) => {
        return (
          patient.patientName.toLowerCase().includes(keyword) ||
          patient.uhidPatientId.toLowerCase().includes(keyword) ||
          patient.mobile.includes(keyword) ||
          patient.doctor.toLowerCase().includes(keyword) ||
          patient.status.toLowerCase().includes(keyword) ||
          patient.gender.toLowerCase().includes(keyword) ||
          patient.ipd.toLowerCase().includes(keyword)
        )
      })
    }

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
    if (filters.gender !== "All Genders") {
      filtered = filtered.filter((patient) => patient.gender === filters.gender)
    }
    if (filters.ipd !== "All IPD") {
      filtered = filtered.filter((patient) => patient.ipd === filters.ipd)
    }
    if (filters.idProof !== "All ID Proof") {
      filtered = filtered.filter((patient) => patient.idProof === filters.idProof)
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
      idProof: "All ID Proof",
      employeeId: "All Employee ID",
      ipd: "All IPD",
      gender: "All Genders",
      fromDate: "",
      toDate: "",
    })
    setSearchKeyword("")
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

  // Generate UHID and IPD
  const generateUHID = () => {
    const nextId = Math.max(...patients.map(p => p.id)) + 1
    return `UHID${String(nextId).padStart(3, '0')}`
  }

  const generateIPD = () => {
    const nextId = Math.max(...patients.map(p => p.id)) + 1
    return `IPD${String(nextId).padStart(3, '0')}`
  }

  // Handle add patient
  const handleAddPatient = () => {
    if (!newPatient.patientName || !newPatient.mobile || !newPatient.doa || !newPatient.age) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const patient = {
      id: Math.max(...patients.map(p => p.id)) + 1,
      ...newPatient,
      uhidPatientId: newPatient.uhidPatientId || generateUHID(),
      ipd: newPatient.ipd || generateIPD(),
      age: parseInt(newPatient.age),
    }

    setPatients(prev => [...prev, patient])
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
      idProof: "Aadhar",
      relative: "",
      category: "General",
    })
    setShowAddForm(false)
    Alert.alert("Success", "Patient added successfully!")
  }

  const closeAllDropdowns = () => {
    setShowGenderDropdown(false)
    setShowIpdDropdown(false)
    setShowIdProofDropdown(false)
    setShowEmployeeIdDropdown(false)
    setShowFormGenderDropdown(false)
    setShowFormStatusDropdown(false)
    setShowFormIdProofDropdown(false)
    setShowFormCategoryDropdown(false)
  }

  const PatientCard = ({ patient }) => (
    <TouchableOpacity style={[styles.ptmCard, { borderLeftColor: getStatusColor(patient.status) }]}>
      <View style={styles.ptmHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {patient.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>{patient.patientName}</Text>
            <Text style={styles.classInfo} allowFontScaling={false}>
              {patient.gender} • Age: {patient.age} • {patient.uhidPatientId}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
          <Text style={styles.statusText} allowFontScaling={false}>{patient.status}</Text>
        </View>
      </View>
      
      <View style={styles.meetingDetails}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName} allowFontScaling={false}>{patient.doctor}</Text>
          <Text style={styles.subject} allowFontScaling={false}>IPD: {patient.ipd} • {patient.category}</Text>
        </View>
        <View style={[styles.purposeBadge, { backgroundColor: getStatusColor(patient.status) }]}>
          <Text style={styles.purposeText} allowFontScaling={false}>{patient.roomWard}</Text>
        </View>
      </View>
      
      <View style={styles.patientDetailsRow}>
        <Text style={styles.detailText} allowFontScaling={false}>Bed: {patient.bedNo}</Text>
        <Text style={styles.detailText} allowFontScaling={false}>ID: {patient.idProof}</Text>
      </View>
      
      <View style={styles.meetingSchedule}>
        <View style={styles.dateTimeInfo}>
          <Text style={styles.dateLabel} allowFontScaling={false}>📅 DOA: {formatDate(patient.doa)}</Text>
          <Text style={styles.timeLabel} allowFontScaling={false}>📞 {patient.mobile}</Text>
        </View>
        {patient.dod && (
          <View style={styles.dateTimeInfo}>
            <Text style={styles.dateLabel} allowFontScaling={false}>📅 DOD: {formatDate(patient.dod)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.ptmFooter}>
        <Text style={styles.duration} allowFontScaling={false}>Relative: {patient.relative}</Text>
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
          val !== "All Genders" &&
          val !== "All IPD" &&
          val !== "All ID Proof" &&
          val !== "All Employee ID") ||
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
                placeholder="Search by patient, UHID, mobile, doctor..."
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
              <Text style={styles.dropdownButtonText} allowFontScaling={false}>Filter Patients</Text>
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
                <View style={[styles.filterSection, showIdProofDropdown && { zIndex: 10000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>ID Proof</Text>
                  {renderDropdown(
                    idProofOptions, 
                    filters.idProof, 
                    (value) => handleFilterChange("idProof", value),
                    showIdProofDropdown,
                    setShowIdProofDropdown
                  )}
                </View>

                {/* Employee ID Filter */}
                <View style={[styles.filterSection, showEmployeeIdDropdown && { zIndex: 9000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Employee ID</Text>
                  {renderDropdown(
                    employeeIdOptions, 
                    filters.employeeId, 
                    (value) => handleFilterChange("employeeId", value),
                    showEmployeeIdDropdown,
                    setShowEmployeeIdDropdown
                  )}
                </View>

                {/* IPD Filter */}
                <View style={[styles.filterSection, showIpdDropdown && { zIndex: 8000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>IPD</Text>
                  {renderDropdown(
                    ipdOptions, 
                    filters.ipd, 
                    (value) => handleFilterChange("ipd", value),
                    showIpdDropdown,
                    setShowIpdDropdown
                  )}
                </View>

                {/* Gender Filter */}
                <View style={[styles.filterSection, showGenderDropdown && { zIndex: 7000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Gender</Text>
                  {renderDropdown(
                    genderOptions, 
                    filters.gender, 
                    (value) => handleFilterChange("gender", value),
                    showGenderDropdown,
                    setShowGenderDropdown
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

        {/* Patient List */}
        <View style={styles.ptmsList}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <View key={patient.id.toString()}>
                <PatientCard patient={patient} />
                {index < filteredPatients.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} allowFontScaling={false}>No patients found</Text>
              <Text style={styles.emptySubtext} allowFontScaling={false}>Try adjusting your search or filter criteria</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Patient Modal */}
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
            <Text style={styles.modalTitle} allowFontScaling={false}>Add New Patient</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
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

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>UHID/Patient ID</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Auto-generated if empty"
                value={newPatient.uhidPatientId}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, uhidPatientId: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>IPD</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Auto-generated if empty"
                value={newPatient.ipd}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, ipd: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

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

            <View style={styles.formSection}>
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

            <View style={[styles.formSection, showFormGenderDropdown && { zIndex: 10000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Gender</Text>
              {renderDropdown(
                ["Male", "Female", "Other"], 
                newPatient.gender, 
                (value) => setNewPatient(prev => ({ ...prev, gender: value })),
                showFormGenderDropdown,
                setShowFormGenderDropdown
              )}
            </View>

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

            <View style={styles.formSection}>
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

            <View style={styles.formSection}>
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

            <View style={[styles.formSection, showFormStatusDropdown && { zIndex: 9000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Status</Text>
              {renderDropdown(
                statusOptions.slice(1), 
                newPatient.status, 
                (value) => setNewPatient(prev => ({ ...prev, status: value })),
                showFormStatusDropdown,
                setShowFormStatusDropdown
              )}
            </View>

            <View style={styles.formSection}>
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

            <View style={styles.formSection}>
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

            <View style={[styles.formSection, showFormIdProofDropdown && { zIndex: 8000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>ID Proof</Text>
              {renderDropdown(
                idProofOptions.slice(1), 
                newPatient.idProof, 
                (value) => setNewPatient(prev => ({ ...prev, idProof: value })),
                showFormIdProofDropdown,
                setShowFormIdProofDropdown
              )}
            </View>

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

            <View style={[styles.formSection, showFormCategoryDropdown && { zIndex: 7000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Category</Text>
              {renderDropdown(
                categoryOptions.slice(1), 
                newPatient.category, 
                (value) => setNewPatient(prev => ({ ...prev, category: value })),
                showFormCategoryDropdown,
                setShowFormCategoryDropdown
              )}
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
                onPress={handleAddPatient}
              >
                <Text style={styles.saveFormButtonText} allowFontScaling={false}>Add Patient</Text>
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

  // Patient card styles
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
  patientDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  meetingSchedule: {
    marginBottom: 8,
  },
  dateTimeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
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

export default OTPage