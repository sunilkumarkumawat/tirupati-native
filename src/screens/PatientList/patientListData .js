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

const patientListData = [
  {
    id: 1,
    patientName: "Aarav Sharma",
    uhidPatientId: "UHID001",
    age: 25,
    gender: "Male",
    mobile: "+91 98765 43210",
    email: "aarav.sharma@email.com",
    address: "123 Main St, Mumbai, Maharashtra",
    bloodGroup: "B+",
    emergencyContact: "+91 98765 43211",
    registrationDate: "2025-01-15",
    lastVisit: "2025-01-20",
    status: "Active",
    patientType: "Regular",
    idProof: "Aadhar",
    idNumber: "1234 5678 9012",
    category: "General",
    doctor: "Dr. Priya Singh",
    department: "Cardiology",
    wardNumber: "Ward A",
    bedNumber: "A-101",
  },
  {
    id: 2,
    patientName: "Priya Patel",
    uhidPatientId: "UHID002",
    age: 30,
    gender: "Female",
    mobile: "+91 87654 32109",
    email: "priya.patel@email.com",
    address: "456 Oak Ave, Delhi, Delhi",
    bloodGroup: "A+",
    emergencyContact: "+91 87654 32110",
    registrationDate: "2025-01-12",
    lastVisit: "2025-01-18",
    status: "Active",
    patientType: "VIP",
    idProof: "PAN Card",
    idNumber: "ABCDE1234F",
    category: "Private",
    doctor: "Dr. Amit Kumar",
    department: "Gynecology",
    wardNumber: "Ward B",
    bedNumber: "B-205",
  },
  {
    id: 3,
    patientName: "Arjun Singh",
    uhidPatientId: "UHID003",
    age: 40,
    gender: "Male",
    mobile: "+91 76543 21098",
    email: "arjun.singh@email.com",
    address: "789 Pine Ln, Bangalore, Karnataka",
    bloodGroup: "O+",
    emergencyContact: "+91 76543 21099",
    registrationDate: "2025-01-18",
    lastVisit: "2025-01-22",
    status: "Active",
    patientType: "Emergency",
    idProof: "Driving License",
    idNumber: "DL1234567890",
    category: "Emergency",
    doctor: "Dr. Kavya Reddy",
    department: "Orthopedics",
    wardNumber: "ICU",
    bedNumber: "ICU-5",
  },
  {
    id: 4,
    patientName: "Kavya Reddy",
    uhidPatientId: "UHID004",
    age: 35,
    gender: "Female",
    mobile: "+91 65432 10987",
    email: "kavya.reddy@email.com",
    address: "101 Elm Rd, Chennai, Tamil Nadu",
    bloodGroup: "AB+",
    emergencyContact: "+91 65432 10988",
    registrationDate: "2025-01-10",
    lastVisit: "2025-01-14",
    status: "Inactive",
    patientType: "Regular",
    idProof: "Voter ID",
    idNumber: "VID1234567890",
    category: "Insurance",
    doctor: "Dr. Rajesh Gupta",
    department: "Dermatology",
    wardNumber: "Ward C",
    bedNumber: "C-310",
  },
  {
    id: 5,
    patientName: "Rohit Kumar",
    uhidPatientId: "UHID005",
    age: 50,
    gender: "Male",
    mobile: "+91 54321 09876",
    email: "rohit.kumar@email.com",
    address: "222 Birch Blvd, Pune, Maharashtra",
    bloodGroup: "O-",
    emergencyContact: "+91 54321 09877",
    registrationDate: "2025-01-20",
    lastVisit: "2025-01-23",
    status: "Active",
    patientType: "Senior",
    idProof: "Passport",
    idNumber: "P1234567",
    category: "Senior Citizen",
    doctor: "Dr. Sunita Sharma",
    department: "Neurology",
    wardNumber: "Ward A",
    bedNumber: "A-205",
  },
]

const statusOptions = ["All Status", "Active", "Inactive", "Discharged", "Transferred"]
const genderOptions = ["All Genders", "Male", "Female", "Other"]
const patientTypeOptions = ["All Patient Types", "Regular", "VIP", "Emergency", "Senior"]
const bloodGroupOptions = ["All Blood Groups", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const categoryOptions = ["All Categories", "General", "Private", "Emergency", "Insurance", "Senior Citizen"]
const idProofOptions = ["All ID Proof", "Aadhar", "PAN Card", "Driving License", "Voter ID", "Passport"]
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

const PatientListPage = () => {
  const [patients, setPatients] = useState(patientListData)
  const [filters, setFilters] = useState({
    patientName: "",
    uhidPatientId: "",
    mobile: "",
    email: "",
    bloodGroup: "All Blood Groups",
    status: "All Status",
    gender: "All Genders",
    patientType: "All Patient Types",
    category: "All Categories",
    idProof: "All ID Proof",
    department: "All Departments",
    fromDate: "",
    toDate: "",
  })
  const [filteredPatients, setFilteredPatients] = useState(patientListData)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  
  // Add patient form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    uhidPatientId: "",
    age: "",
    gender: "Male",
    mobile: "",
    email: "",
    address: "",
    bloodGroup: "A+",
    emergencyContact: "",
    registrationDate: "",
    status: "Active",
    patientType: "Regular",
    idProof: "Aadhar",
    idNumber: "",
    category: "General",
    doctor: "",
    department: "Cardiology",
    wardNumber: "",
    bedNumber: "",
  })

  // Dropdown states for filters
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showPatientTypeDropdown, setShowPatientTypeDropdown] = useState(false)
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showIdProofDropdown, setShowIdProofDropdown] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)

  // Dropdown states for form
  const [showFormGenderDropdown, setShowFormGenderDropdown] = useState(false)
  const [showFormStatusDropdown, setShowFormStatusDropdown] = useState(false)
  const [showFormPatientTypeDropdown, setShowFormPatientTypeDropdown] = useState(false)
  const [showFormBloodGroupDropdown, setShowFormBloodGroupDropdown] = useState(false)
  const [showFormCategoryDropdown, setShowFormCategoryDropdown] = useState(false)
  const [showFormIdProofDropdown, setShowFormIdProofDropdown] = useState(false)
  const [showFormDepartmentDropdown, setShowFormDepartmentDropdown] = useState(false)

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
          patient.email.toLowerCase().includes(keyword) ||
          patient.bloodGroup.toLowerCase().includes(keyword) ||
          patient.status.toLowerCase().includes(keyword) ||
          patient.patientType.toLowerCase().includes(keyword) ||
          patient.category.toLowerCase().includes(keyword) ||
          patient.doctor.toLowerCase().includes(keyword) ||
          patient.department.toLowerCase().includes(keyword)
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
    if (filters.email) {
      filtered = filtered.filter((patient) => 
        patient.email.toLowerCase().includes(filters.email.toLowerCase())
      )
    }
    if (filters.status !== "All Status") {
      filtered = filtered.filter((patient) => patient.status === filters.status)
    }
    if (filters.gender !== "All Genders") {
      filtered = filtered.filter((patient) => patient.gender === filters.gender)
    }
    if (filters.patientType !== "All Patient Types") {
      filtered = filtered.filter((patient) => patient.patientType === filters.patientType)
    }
    if (filters.bloodGroup !== "All Blood Groups") {
      filtered = filtered.filter((patient) => patient.bloodGroup === filters.bloodGroup)
    }
    if (filters.category !== "All Categories") {
      filtered = filtered.filter((patient) => patient.category === filters.category)
    }
    if (filters.idProof !== "All ID Proof") {
      filtered = filtered.filter((patient) => patient.idProof === filters.idProof)
    }
    if (filters.department !== "All Departments") {
      filtered = filtered.filter((patient) => patient.department === filters.department)
    }
    if (filters.fromDate) {
      filtered = filtered.filter((patient) => patient.registrationDate >= filters.fromDate)
    }
    if (filters.toDate) {
      filtered = filtered.filter((patient) => patient.registrationDate <= filters.toDate)
    }

    setFilteredPatients(filtered)
  }

  const clearFilters = () => {
    setFilters({
      patientName: "",
      uhidPatientId: "",
      mobile: "",
      email: "",
      bloodGroup: "All Blood Groups",
      status: "All Status",
      gender: "All Genders",
      patientType: "All Patient Types",
      category: "All Categories",
      idProof: "All ID Proof",
      department: "All Departments",
      fromDate: "",
      toDate: "",
    })
    setSearchKeyword("")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981"
      case "Inactive":
        return "#6b7280"
      case "Discharged":
        return "#6366f1"
      case "Transferred":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getPatientTypeColor = (type) => {
    switch (type) {
      case "VIP":
        return "#8b5cf6"
      case "Emergency":
        return "#ef4444"
      case "Senior":
        return "#f59e0b"
      case "Regular":
        return "#4dd0e1"
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

  // Generate UHID
  const generateUHID = () => {
    const nextId = Math.max(...patients.map(p => p.id)) + 1
    return `UHID${String(nextId).padStart(3, '0')}`
  }

  // Handle add patient
  const handleAddPatient = () => {
    if (!newPatient.patientName || !newPatient.mobile || !newPatient.registrationDate || !newPatient.age) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    const patient = {
      id: Math.max(...patients.map(p => p.id)) + 1,
      ...newPatient,
      uhidPatientId: newPatient.uhidPatientId || generateUHID(),
      age: parseInt(newPatient.age) || 0,
      lastVisit: newPatient.registrationDate, // Set last visit to registration date initially
    }

    setPatients(prev => [...prev, patient])
    setNewPatient({
      patientName: "",
      uhidPatientId: "",
      age: "",
      gender: "Male",
      mobile: "",
      email: "",
      address: "",
      bloodGroup: "A+",
      emergencyContact: "",
      registrationDate: "",
      status: "Active",
      patientType: "Regular",
      idProof: "Aadhar",
      idNumber: "",
      category: "General",
      doctor: "",
      department: "Cardiology",
    })
    setShowAddForm(false)
    Alert.alert("Success", "Patient added successfully!")
  }

  const closeAllDropdowns = () => {
    setShowStatusDropdown(false)
    setShowGenderDropdown(false)
    setShowPatientTypeDropdown(false)
    setShowBloodGroupDropdown(false)
    setShowCategoryDropdown(false)
    setShowIdProofDropdown(false)
    setShowDepartmentDropdown(false)
    setShowFormGenderDropdown(false)
    setShowFormStatusDropdown(false)
    setShowFormPatientTypeDropdown(false)
    setShowFormBloodGroupDropdown(false)
    setShowFormCategoryDropdown(false)
    setShowFormIdProofDropdown(false)
    setShowFormDepartmentDropdown(false)
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
          <Text style={styles.teacherName} allowFontScaling={false}>{patient.doctor || "No Doctor Assigned"}</Text>
          <Text style={styles.subject} allowFontScaling={false}>{patient.department} • {patient.category}</Text>
        </View>
        <View style={[styles.purposeBadge, { backgroundColor: getPatientTypeColor(patient.patientType) }]}>
          <Text style={styles.purposeText} allowFontScaling={false}>{patient.patientType}</Text>
        </View>
      </View>
      
      <View style={styles.patientDetailsSection}>
        <View style={styles.contactRow}>
          <Text style={styles.contactText} allowFontScaling={false}>
            <Text style={styles.labelText}>📞 </Text>{patient.mobile}
          </Text>
          <Text style={styles.contactText} allowFontScaling={false}>
            <Text style={styles.labelText}>🩸 </Text>{patient.bloodGroup}
          </Text>
        </View>
        <Text style={styles.emailText} allowFontScaling={false}>
          <Text style={styles.labelText}>📧 </Text>{patient.email}
        </Text>
        <Text style={styles.addressText} allowFontScaling={false}>
          <Text style={styles.labelText}>📍 </Text>{patient.address}
        </Text>
        <View style={styles.wardBedRow}>
          <Text style={styles.detailText} allowFontScaling={false}>
            <Text style={styles.labelText}>🏥 </Text>{patient.wardNumber}
          </Text>
          <Text style={styles.detailText} allowFontScaling={false}>
            <Text style={styles.labelText}>🛏️ </Text>{patient.bedNumber}
          </Text>
        </View>
        <View style={styles.idProofRow}>
          <Text style={styles.detailText} allowFontScaling={false}>ID: {patient.idProof}</Text>
          <Text style={styles.detailText} allowFontScaling={false}>No: {patient.idNumber}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusDetailText} allowFontScaling={false}>
            <Text style={styles.labelText}>Status: </Text>
            <Text style={[styles.statusValue, { color: getStatusColor(patient.status) }]}>
              {patient.status}
            </Text>
          </Text>
        </View>
      </View>
      
      <View style={styles.meetingSchedule}>
        <View style={styles.dateTimeInfo}>
          <Text style={styles.dateLabel} allowFontScaling={false}>📅 Reg: {formatDate(patient.registrationDate)}</Text>
          <Text style={styles.timeLabel} allowFontScaling={false}>🔄 Last: {formatDate(patient.lastVisit)}</Text>
        </View>
      </View>
      
      <View style={styles.ptmFooter}>
        <Text style={styles.duration} allowFontScaling={false}>
          Emergency: {patient.emergencyContact}
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
          val !== "All Patient Types" &&
          val !== "All Blood Groups" &&
          val !== "All Categories" &&
          val !== "All ID Proof" &&
          val !== "All Departments") ||
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
                placeholder="Search by patient, UHID, mobile, email..."
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

                {/* Email Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Email</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Enter email address"
                    value={filters.email}
                    onChangeText={(text) => handleFilterChange("email", text)}
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
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

                {/* Patient Type Filter */}
                <View style={[styles.filterSection, showPatientTypeDropdown && { zIndex: 8000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Patient Type</Text>
                  {renderDropdown(
                    patientTypeOptions, 
                    filters.patientType, 
                    (value) => handleFilterChange("patientType", value),
                    showPatientTypeDropdown,
                    setShowPatientTypeDropdown
                  )}
                </View>

                {/* Blood Group Filter */}
                <View style={[styles.filterSection, showBloodGroupDropdown && { zIndex: 7000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Blood Group</Text>
                  {renderDropdown(
                    bloodGroupOptions, 
                    filters.bloodGroup, 
                    (value) => handleFilterChange("bloodGroup", value),
                    showBloodGroupDropdown,
                    setShowBloodGroupDropdown
                  )}
                </View>

                {/* Category Filter */}
                <View style={[styles.filterSection, showCategoryDropdown && { zIndex: 6000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Category</Text>
                  {renderDropdown(
                    categoryOptions, 
                    filters.category, 
                    (value) => handleFilterChange("category", value),
                    showCategoryDropdown,
                    setShowCategoryDropdown
                  )}
                </View>

                {/* ID Proof Filter */}
                <View style={[styles.filterSection, showIdProofDropdown && { zIndex: 5000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>ID Proof</Text>
                  {renderDropdown(
                    idProofOptions, 
                    filters.idProof, 
                    (value) => handleFilterChange("idProof", value),
                    showIdProofDropdown,
                    setShowIdProofDropdown
                  )}
                </View>

                {/* Department Filter */}
                <View style={[styles.filterSection, showDepartmentDropdown && { zIndex: 4000 }]}>
                  <Text style={styles.filterLabel} allowFontScaling={false}>Department</Text>
                  {renderDropdown(
                    departmentOptions, 
                    filters.department, 
                    (value) => handleFilterChange("department", value),
                    showDepartmentDropdown,
                    setShowDepartmentDropdown
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
              <Text style={styles.formLabel} allowFontScaling={false}>Email</Text>
              <TextInput
                style={styles.formInput}
                placeholder="patient@email.com"
                value={newPatient.email}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, email: text }))}
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Address</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter complete address"
                value={newPatient.address}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, address: text }))}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormBloodGroupDropdown && { zIndex: 9000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Blood Group</Text>
              {renderDropdown(
                bloodGroupOptions.slice(1), 
                newPatient.bloodGroup, 
                (value) => setNewPatient(prev => ({ ...prev, bloodGroup: value })),
                showFormBloodGroupDropdown,
                setShowFormBloodGroupDropdown
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Emergency Contact</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+91 XXXXX XXXXX"
                value={newPatient.emergencyContact}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, emergencyContact: text }))}
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Registration Date *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newPatient.registrationDate}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, registrationDate: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormStatusDropdown && { zIndex: 8000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Status</Text>
              {renderDropdown(
                statusOptions.slice(1), 
                newPatient.status, 
                (value) => setNewPatient(prev => ({ ...prev, status: value })),
                showFormStatusDropdown,
                setShowFormStatusDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormPatientTypeDropdown && { zIndex: 7000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Patient Type</Text>
              {renderDropdown(
                patientTypeOptions.slice(1), 
                newPatient.patientType, 
                (value) => setNewPatient(prev => ({ ...prev, patientType: value })),
                showFormPatientTypeDropdown,
                setShowFormPatientTypeDropdown
              )}
            </View>

            <View style={[styles.formSection, showFormIdProofDropdown && { zIndex: 6000 }]}>
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
              <Text style={styles.formLabel} allowFontScaling={false}>ID Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter ID number"
                value={newPatient.idNumber}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, idNumber: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormCategoryDropdown && { zIndex: 5000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Category</Text>
              {renderDropdown(
                categoryOptions.slice(1), 
                newPatient.category, 
                (value) => setNewPatient(prev => ({ ...prev, category: value })),
                showFormCategoryDropdown,
                setShowFormCategoryDropdown
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Assigned Doctor</Text>
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
              <Text style={styles.formLabel} allowFontScaling={false}>Ward Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter ward number"
                value={newPatient.wardNumber}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, wardNumber: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>Bed Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter bed number"
                value={newPatient.bedNumber}
                onChangeText={(text) => setNewPatient(prev => ({ ...prev, bedNumber: text }))}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
            </View>

            <View style={[styles.formSection, showFormDepartmentDropdown && { zIndex: 4000 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>Department</Text>
              {renderDropdown(
                departmentOptions.slice(1), 
                newPatient.department, 
                (value) => setNewPatient(prev => ({ ...prev, department: value })),
                showFormDepartmentDropdown,
                setShowFormDepartmentDropdown
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
  patientDetailsSection: {
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 6,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  emailText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 16,
    fontWeight: "500",
  },
  labelText: {
    fontWeight: "600",
    color: "#4dd0e1",
  },
  wardBedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  idProofRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statusRow: {
    marginTop: 4,
  },
  statusDetailText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusValue: {
    fontWeight: "700",
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

export default PatientListPage