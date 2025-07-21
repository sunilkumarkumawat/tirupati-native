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

const prescriptionData = [
  {
    id: 1,
    patientName: "Aarav Sharma",
    uhidPatientId: "UHID001",
    age: 25,
    gender: "Male",
    mobile: "+91 98765 43210",
    doctor: "Dr. Priya Singh",
    department: "Cardiology",
    prescriptionNo: "RX001",
    prescriptionDate: "2025-01-15",
    diagnosis: "Hypertension",
    medicines: "Amlodipine 5mg, Metoprolol 50mg",
    dosage: "1-0-1, 1-1-0",
    duration: "30 days",
    instructions: "Take after meals",
    followUpDate: "2025-02-15",
    status: "Active",
    visitType: "OPD",
  },
  {
    id: 2,
    patientName: "Priya Patel",
    uhidPatientId: "UHID002",
    age: 30,
    gender: "Female",
    mobile: "+91 87654 32109",
    doctor: "Dr. Amit Kumar",
    department: "Gynecology",
    prescriptionNo: "RX002",
    prescriptionDate: "2025-01-12",
    diagnosis: "Iron Deficiency Anemia",
    medicines: "Iron Tablets, Folic Acid",
    dosage: "1-0-0, 0-1-0",
    duration: "60 days",
    instructions: "Take with vitamin C",
    followUpDate: "2025-03-12",
    status: "Completed",
    visitType: "IPD",
  },
  {
    id: 3,
    patientName: "Arjun Singh",
    uhidPatientId: "UHID003",
    age: 40,
    gender: "Male",
    mobile: "+91 76543 21098",
    doctor: "Dr. Kavya Reddy",
    department: "Orthopedics",
    prescriptionNo: "RX003",
    prescriptionDate: "2025-01-18",
    diagnosis: "Osteoarthritis",
    medicines: "Diclofenac, Glucosamine",
    dosage: "1-1-1, 1-0-1",
    duration: "21 days",
    instructions: "Apply ice after exercise",
    followUpDate: "2025-02-08",
    status: "Active",
    visitType: "Emergency",
  },
  {
    id: 4,
    patientName: "Kavya Reddy",
    uhidPatientId: "UHID004",
    age: 35,
    gender: "Female",
    mobile: "+91 65432 10987",
    doctor: "Dr. Rajesh Gupta",
    department: "Dermatology",
    prescriptionNo: "RX004",
    prescriptionDate: "2025-01-10",
    diagnosis: "Eczema",
    medicines: "Hydrocortisone Cream, Moisturizer",
    dosage: "Apply twice daily",
    duration: "14 days",
    instructions: "Avoid hot water",
    followUpDate: "2025-01-24",
    status: "Expired",
    visitType: "OPD",
  },
  {
    id: 5,
    patientName: "Rohit Kumar",
    uhidPatientId: "UHID005",
    age: 50,
    gender: "Male",
    mobile: "+91 54321 09876",
    doctor: "Dr. Sunita Sharma",
    department: "Neurology",
    prescriptionNo: "RX005",
    prescriptionDate: "2025-01-20",
    diagnosis: "Migraine",
    medicines: "Sumatriptan, Propranolol",
    dosage: "SOS, 1-0-1",
    duration: "30 days",
    instructions: "Take at onset of headache",
    followUpDate: "2025-02-20",
    status: "Active",
    visitType: "OPD",
  },
]

const statusOptions = ["All Status", "Active", "Completed", "Expired", "Cancelled"]
const genderOptions = ["All Genders", "Male", "Female", "Other"]
const departmentOptions = [
  "All Departments",
  "Cardiology",
  "Gynecology", 
  "Orthopedics",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Internal Medicine",
]
const doctorOptions = [
  "All Doctors",
  "Dr. Priya Singh",
  "Dr. Amit Kumar",
  "Dr. Kavya Reddy",
  "Dr. Rajesh Gupta",
  "Dr. Sunita Sharma",
]
const visitTypeOptions = ["All Visit Types", "OPD", "IPD", "Emergency"]

const DoctorPrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState(prescriptionData)
  const [filters, setFilters] = useState({
    patientName: "",
    uhidPatientId: "",
    prescriptionNo: "",
    mobile: "",
    doctor: "All Doctors",
    department: "All Departments",
    status: "All Status",
    gender: "All Genders",
    visitType: "All Visit Types",
    fromDate: "",
    toDate: "",
  })
  const [filteredPrescriptions, setFilteredPrescriptions] = useState(prescriptionData)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  
  // Add prescription form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    uhidPatientId: "",
    age: "",
    gender: "Male",
    mobile: "",
    doctor: "Dr. Priya Singh",
    department: "Cardiology",
    prescriptionDate: "",
    diagnosis: "",
    medicines: "",
    dosage: "",
    duration: "",
    instructions: "",
    followUpDate: "",
    status: "Active",
    visitType: "OPD",
  })

  // Dropdown states for filters
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showVisitTypeDropdown, setShowVisitTypeDropdown] = useState(false)

  // Dropdown states for form
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)
  const [showFormStatusDropdown, setShowFormStatusDropdown] = useState(false)
  const [showFormDoctorDropdown, setShowFormDoctorDropdown] = useState(false)
  const [showFormDepartmentDropdown, setShowFormDepartmentDropdown] = useState(false)
  const [showFormVisitTypeDropdown, setShowFormVisitTypeDropdown] = useState(false)

  useEffect(() => {
    applyFilters()
  }, [filters, searchKeyword, prescriptions])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filtered = [...prescriptions]

    // Apply main search keyword
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((prescription) => {
        return (
          prescription.patientName.toLowerCase().includes(keyword) ||
          prescription.uhidPatientId.toLowerCase().includes(keyword) ||
          prescription.prescriptionNo.toLowerCase().includes(keyword) ||
          prescription.mobile.includes(keyword) ||
          prescription.doctor.toLowerCase().includes(keyword) ||
          prescription.department.toLowerCase().includes(keyword) ||
          prescription.diagnosis.toLowerCase().includes(keyword) ||
          prescription.status.toLowerCase().includes(keyword)
        )
      })
    }

    // Apply filters
    if (filters.patientName) {
      filtered = filtered.filter((prescription) => 
        prescription.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
      )
    }
    if (filters.uhidPatientId) {
      filtered = filtered.filter((prescription) => 
        prescription.uhidPatientId.toLowerCase().includes(filters.uhidPatientId.toLowerCase())
      )
    }
    if (filters.prescriptionNo) {
      filtered = filtered.filter((prescription) => 
        prescription.prescriptionNo.toLowerCase().includes(filters.prescriptionNo.toLowerCase())
      )
    }
    if (filters.mobile) {
      filtered = filtered.filter((prescription) => prescription.mobile.includes(filters.mobile))
    }
    if (filters.status !== "All Status") {
      filtered = filtered.filter((prescription) => prescription.status === filters.status)
    }
    if (filters.gender !== "All Genders") {
      filtered = filtered.filter((prescription) => prescription.gender === filters.gender)
    }
    if (filters.doctor !== "All Doctors") {
      filtered = filtered.filter((prescription) => prescription.doctor === filters.doctor)
    }
    if (filters.department !== "All Departments") {
      filtered = filtered.filter((prescription) => prescription.department === filters.department)
    }
    if (filters.visitType !== "All Visit Types") {
      filtered = filtered.filter((prescription) => prescription.visitType === filters.visitType)
    }
    if (filters.fromDate) {
      filtered = filtered.filter((prescription) => prescription.prescriptionDate >= filters.fromDate)
    }
    if (filters.toDate) {
      filtered = filtered.filter((prescription) => prescription.prescriptionDate <= filters.toDate)
    }

    setFilteredPrescriptions(filtered)
  }

  const clearFilters = () => {
    setFilters({
      patientName: "",
      uhidPatientId: "",
      prescriptionNo: "",
      mobile: "",
      doctor: "All Doctors",
      department: "All Departments",
      status: "All Status",
      gender: "All Genders",
      visitType: "All Visit Types",
      fromDate: "",
      toDate: "",
    })
    setSearchKeyword("")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981"
      case "Completed":
        return "#6366f1"
      case "Expired":
        return "#f59e0b"
      case "Cancelled":
        return "#ef4444"
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

  // Generate prescription number
  const generatePrescriptionNo = () => {
    const nextId = Math.max(...prescriptions.map(p => p.id)) + 1
    return `RX${String(nextId).padStart(3, '0')}`
  }

  // Handle add prescription
  const handleAddPrescription = () => {
    if (!newPrescription.patientName || !newPrescription.mobile || !newPrescription.prescriptionDate || !newPrescription.diagnosis) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const prescription = {
      id: Math.max(...prescriptions.map(p => p.id)) + 1,
      ...newPrescription,
      prescriptionNo: generatePrescriptionNo(),
      age: parseInt(newPrescription.age) || 0,
    }

    setPrescriptions(prev => [...prev, prescription])
    setNewPrescription({
      patientName: "",
      uhidPatientId: "",
      age: "",
      gender: "Male",
      mobile: "",
      doctor: "Dr. Priya Singh",
      department: "Cardiology",
      prescriptionDate: "",
      diagnosis: "",
      medicines: "",
      dosage: "",
      duration: "",
      instructions: "",
      followUpDate: "",
      status: "Active",
      visitType: "OPD",
    })
    setShowAddForm(false)
    Alert.alert("Success", "Prescription added successfully!")
  }

  const closeAllDropdowns = () => {
    setShowStatusDropdown(false)
    setShowGenderDropdown(false)
    setShowDoctorDropdown(false)
    setShowDepartmentDropdown(false)
    setShowVisitTypeDropdown(false)
    setShowFormGenderDropdown(false)
    setShowFormStatusDropdown(false)
    setShowFormDoctorDropdown(false)
    setShowFormDepartmentDropdown(false)
    setShowFormVisitTypeDropdown(false)
  }

  const PrescriptionCard = ({ prescription }) => (
    <TouchableOpacity style={[styles.ptmCard, { borderLeftColor: getStatusColor(prescription.status) }]}>
      <View style={styles.ptmHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {prescription.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>{prescription.patientName}</Text>
            <Text style={styles.classInfo} allowFontScaling={false}>
              {prescription.gender} • Age: {prescription.age} • {prescription.uhidPatientId}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(prescription.status) }]}>
          <Text style={styles.statusText} allowFontScaling={false}>{prescription.status}</Text>
        </View>
      </View>
      
      <View style={styles.meetingDetails}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName} allowFontScaling={false}>{prescription.doctor}</Text>
          <Text style={styles.subject} allowFontScaling={false}>{prescription.department} • {prescription.visitType}</Text>
        </View>
        <View style={[styles.purposeBadge, { backgroundColor: getStatusColor(prescription.status) }]}>
          <Text style={styles.purposeText} allowFontScaling={false}>{prescription.prescriptionNo}</Text>
        </View>
      </View>
      
      <View style={styles.prescriptionDetailsSection}>
        <Text style={styles.diagnosisText} allowFontScaling={false}>
          <Text style={styles.labelText}>Diagnosis: </Text>{prescription.diagnosis}
        </Text>
        <Text style={styles.medicineText} allowFontScaling={false}>
          <Text style={styles.labelText}>Medicines: </Text>{prescription.medicines}
        </Text>
        <View style={styles.dosageRow}>
          <Text style={styles.detailText} allowFontScaling={false}>Dosage: {prescription.dosage}</Text>
          <Text style={styles.detailText} allowFontScaling={false}>Duration: {prescription.duration}</Text>
        </View>
      </View>
      
      <View style={styles.meetingSchedule}>
        <View style={styles.dateTimeInfo}>
          <Text style={styles.dateLabel} allowFontScaling={false}>📅 Date: {formatDate(prescription.prescriptionDate)}</Text>
          <Text style={styles.timeLabel} allowFontScaling={false}>📞 {prescription.mobile}</Text>
        </View>
        {prescription.followUpDate && (
          <View style={styles.dateTimeInfo}>
            <Text style={styles.dateLabel} allowFontScaling={false}>🔄 Follow-up: {formatDate(prescription.followUpDate)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.ptmFooter}>
        <Text style={styles.duration} allowFontScaling={false}>
          Instructions: {prescription.instructions || "As directed"}
        </Text>
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
          val !== "All Departments" &&
          val !== "All Visit Types") ||
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
                placeholder="Search by patient, prescription, doctor..."
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
              <Text style={styles.dropdownButtonText} allowFontScaling={false}>Filter Prescriptions</Text>
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

                {/* Prescription No Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Prescription No</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter prescription number"
                    value={filters.prescriptionNo}
                    onChangeText={(text) => handleFilterChange("prescriptionNo", text)}
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

                {/* Status Filter */}
                <View style={[styles.filterSection, showStatusDropdown && { zIndex: 10000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Status</Text>
                  {renderDropdown(
                    statusOptions, 
                    filters.status, 
                    (value) => handleFilterChange("status", value),
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

                {/* Department Filter */}
                <View style={[styles.filterSection, showDepartmentDropdown && { zIndex: 7000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Department</Text>
                  {renderDropdown(
                    departmentOptions, 
                    filters.department, 
                    (value) => handleFilterChange("department", value),
                    showDepartmentDropdown,
                    setShowDepartmentDropdown
                  )}
                </View>

                {/* Visit Type Filter */}
                <View style={[styles.filterSection, showVisitTypeDropdown && { zIndex: 6000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Visit Type</Text>
                  {renderDropdown(
                    visitTypeOptions, 
                    filters.visitType, 
                    (value) => handleFilterChange("visitType", value),
                    showVisitTypeDropdown,
                    setShowVisitTypeDropdown
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

        {/* Prescription List */}
        <View style={styles.ptmsList}>
          {filteredPrescriptions.length > 0 ? (
            filteredPrescriptions.map((prescription, index) => (
              <View key={prescription.id.toString()}>
                <PrescriptionCard prescription={prescription} />
                {index < filteredPrescriptions.length - 1 && <View style={styles.separator} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} allowFontScaling={false}>No prescriptions found</Text>
              <Text style={styles.emptySubtext} allowFontScaling={false}>Try adjusting your search or filter criteria</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Prescription Modal */}
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
            <Text style={styles.modalTitle} allowFontScaling={false}>Add New Prescription</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Patient Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter patient name"
                value={newPrescription.patientName}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, patientName: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>UHID/Patient ID</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter UHID or Patient ID"
                value={newPrescription.uhidPatientId}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, uhidPatientId: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Age</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter age"
                value={newPrescription.age}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, age: text }))}
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormGenderDropdown && { zIndex: 10000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Gender</Text>
              {renderDropdown(
                ["Male", "Female", "Other"], 
                newPrescription.gender, 
                (value) => setNewPrescription(prev => ({ ...prev, gender: value })),
                showFormGenderDropdown,
                setShowFormGenderDropdown
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Mobile *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+91 XXXXX XXXXX"
                value={newPrescription.mobile}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, mobile: text }))}
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormDoctorDropdown && { zIndex: 9000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Doctor</Text>
              {renderDropdown(
                doctorOptions.slice(1), 
                newPrescription.doctor, 
                (value) => setNewPrescription(prev => ({ ...prev, doctor: value })),
                showFormDoctorDropdown,
                setShowFormDoctorDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormDepartmentDropdown && { zIndex: 8000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Department</Text>
              {renderDropdown(
                departmentOptions.slice(1), 
                newPrescription.department, 
                (value) => setNewPrescription(prev => ({ ...prev, department: value })),
                showFormDepartmentDropdown,
                setShowFormDepartmentDropdown
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Prescription Date *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newPrescription.prescriptionDate}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, prescriptionDate: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Diagnosis *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter diagnosis"
                value={newPrescription.diagnosis}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, diagnosis: text }))}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Medicines</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter medicines (comma separated)"
                value={newPrescription.medicines}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, medicines: text }))}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Dosage</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 1-0-1, 1-1-0"
                value={newPrescription.dosage}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, dosage: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Duration</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 7 days, 2 weeks"
                value={newPrescription.duration}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, duration: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Instructions</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Special instructions for patient"
                value={newPrescription.instructions}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, instructions: text }))}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Follow-up Date</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD (Optional)"
                value={newPrescription.followUpDate}
                onChangeText={(text) => setNewPrescription(prev => ({ ...prev, followUpDate: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormStatusDropdown && { zIndex: 7000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Status</Text>
              {renderDropdown(
                statusOptions.slice(1), 
                newPrescription.status, 
                (value) => setNewPrescription(prev => ({ ...prev, status: value })),
                showFormStatusDropdown,
                setShowFormStatusDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormVisitTypeDropdown && { zIndex: 6000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Visit Type</Text>
              {renderDropdown(
                visitTypeOptions.slice(1), 
                newPrescription.visitType, 
                (value) => setNewPrescription(prev => ({ ...prev, visitType: value })),
                showFormVisitTypeDropdown,
                setShowFormVisitTypeDropdown
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
                onPress={handleAddPrescription}
              >
                <Text style={styles.saveFormButtonText} allowFontScaling={false}>Add Prescription</Text>
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

  // Prescription card styles
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
  prescriptionDetailsSection: {
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 6,
  },
  diagnosisText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 16,
  },
  medicineText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 16,
  },
  labelText: {
    fontWeight: "600",
    color: "#4dd0e1",
  },
  dosageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default DoctorPrescriptionPage