"use client"

import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  Linking,
  Modal,
} from "react-native"
import DropdownComponent from "./DropdownComponent" // Import DropdownComponent

const { width } = Dimensions.get("window")

const StaffDirectory = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedDesignation, setSelectedDesignation] = useState("")
  const [searchText, setSearchText] = useState("")
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false)
  const [staffData, setStaffData] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [showStaffModal, setShowStaffModal] = useState(false)

  // Sample data
  const departments = [
    "All Departments",
    "Administration",
    "Academic",
    "Science",
    "Mathematics",
    "English",
    "Social Studies",
    "Physical Education",
    "Arts & Crafts",
    "Library",
    "IT Department",
    "Counseling",
    "Support Staff",
  ]

  const designations = [
    "All Designations",
    "Principal",
    "Vice Principal",
    "Head of Department",
    "Senior Teacher",
    "Teacher",
    "Assistant Teacher",
    "Librarian",
    "Counselor",
    "Lab Assistant",
    "Administrative Officer",
    "Clerk",
    "Peon",
  ]

  // Sample staff directory data
  const staffDirectoryData = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      designation: "Principal",
      department: "Administration",
      employeeId: "EMP001",
      email: "principal@school.edu",
      phone: "+91 9876543210",
      extension: "101",
      officeRoom: "Principal's Office",
      qualification: "Ph.D. in Education, M.Ed.",
      experience: "25 years",
      subjects: [],
      classes: [],
      joiningDate: "2010-06-15",
      address: "123 Education Street, City",
      emergencyContact: "+91 9876543211",
      bloodGroup: "B+",
      dateOfBirth: "1970-03-15",
      specialization: "Educational Administration",
      achievements: ["Best Principal Award 2022", "Excellence in Education 2020"],
      isAvailable: true,
      workingHours: "8:00 AM - 4:00 PM",
    },
    {
      id: 2,
      name: "Mrs. Priya Sharma",
      designation: "Vice Principal",
      department: "Administration",
      employeeId: "EMP002",
      email: "vp@school.edu",
      phone: "+91 9876543220",
      extension: "102",
      officeRoom: "VP Office - Room 12",
      qualification: "M.Ed., B.Ed.",
      experience: "18 years",
      subjects: [],
      classes: [],
      joiningDate: "2012-04-10",
      address: "456 Academic Lane, City",
      emergencyContact: "+91 9876543221",
      bloodGroup: "A+",
      dateOfBirth: "1975-08-22",
      specialization: "Curriculum Development",
      achievements: ["Outstanding Administrator 2021"],
      isAvailable: true,
      workingHours: "8:00 AM - 4:00 PM",
    },
    {
      id: 3,
      name: "Mr. Amit Patel",
      designation: "Head of Department",
      department: "Mathematics",
      employeeId: "EMP003",
      email: "amit.math@school.edu",
      phone: "+91 9876543230",
      extension: "201",
      officeRoom: "Math Department - Room 25",
      qualification: "M.Sc. Mathematics, B.Ed.",
      experience: "15 years",
      subjects: ["Advanced Mathematics", "Calculus", "Algebra"],
      classes: ["11th A", "12th A", "12th B"],
      joiningDate: "2015-07-01",
      address: "789 Scholar Road, City",
      emergencyContact: "+91 9876543231",
      bloodGroup: "O+",
      dateOfBirth: "1980-12-05",
      specialization: "Pure Mathematics",
      achievements: ["Best Math Teacher 2023", "Innovation in Teaching 2022"],
      isAvailable: true,
      workingHours: "8:30 AM - 3:30 PM",
    },
    {
      id: 4,
      name: "Ms. Sunita Singh",
      designation: "Senior Teacher",
      department: "English",
      employeeId: "EMP004",
      email: "sunita.english@school.edu",
      phone: "+91 9876543240",
      extension: "202",
      officeRoom: "English Department - Room 18",
      qualification: "M.A. English Literature, B.Ed.",
      experience: "12 years",
      subjects: ["English Literature", "Grammar", "Creative Writing"],
      classes: ["9th A", "10th A", "10th B"],
      joiningDate: "2016-06-15",
      address: "321 Literature Avenue, City",
      emergencyContact: "+91 9876543241",
      bloodGroup: "AB+",
      dateOfBirth: "1985-04-18",
      specialization: "English Literature",
      achievements: ["Excellence in Language Teaching 2023"],
      isAvailable: true,
      workingHours: "8:30 AM - 3:30 PM",
    },
    {
      id: 5,
      name: "Dr. Meera Joshi",
      designation: "Head of Department",
      department: "Science",
      employeeId: "EMP005",
      email: "meera.science@school.edu",
      phone: "+91 9876543250",
      extension: "203",
      officeRoom: "Science Lab - Room 30",
      qualification: "Ph.D. Chemistry, M.Sc., B.Ed.",
      experience: "20 years",
      subjects: ["Chemistry", "Physics", "General Science"],
      classes: ["11th C", "12th C", "8th A"],
      joiningDate: "2011-08-20",
      address: "654 Research Park, City",
      emergencyContact: "+91 9876543251",
      bloodGroup: "B-",
      dateOfBirth: "1978-11-30",
      specialization: "Organic Chemistry",
      achievements: ["Outstanding Science Teacher 2022", "Research Excellence Award 2021"],
      isAvailable: false,
      workingHours: "8:30 AM - 3:30 PM",
    },
    {
      id: 6,
      name: "Mr. Vikash Kumar",
      designation: "Teacher",
      department: "Physical Education",
      employeeId: "EMP006",
      email: "vikash.pe@school.edu",
      phone: "+91 9876543260",
      extension: "301",
      officeRoom: "Sports Complex - Room 5",
      qualification: "M.P.Ed., B.P.Ed.",
      experience: "8 years",
      subjects: ["Physical Education", "Sports Training"],
      classes: ["All Classes"],
      joiningDate: "2018-03-10",
      address: "987 Sports Colony, City",
      emergencyContact: "+91 9876543261",
      bloodGroup: "O-",
      dateOfBirth: "1988-07-12",
      specialization: "Athletics & Football",
      achievements: ["Best Sports Coach 2023", "State Level Athletics Trainer"],
      isAvailable: true,
      workingHours: "7:00 AM - 2:00 PM",
    },
    {
      id: 7,
      name: "Mrs. Kavita Rao",
      designation: "Librarian",
      department: "Library",
      employeeId: "EMP007",
      email: "kavita.library@school.edu",
      phone: "+91 9876543270",
      extension: "401",
      officeRoom: "Central Library",
      qualification: "M.Lib.Sc., B.A.",
      experience: "10 years",
      subjects: [],
      classes: [],
      joiningDate: "2017-01-15",
      address: "147 Book Street, City",
      emergencyContact: "+91 9876543271",
      bloodGroup: "A-",
      dateOfBirth: "1982-09-25",
      specialization: "Digital Library Management",
      achievements: ["Best Librarian Award 2022"],
      isAvailable: true,
      workingHours: "8:00 AM - 4:00 PM",
    },
    {
      id: 8,
      name: "Mr. Deepak Gupta",
      designation: "Counselor",
      department: "Counseling",
      employeeId: "EMP008",
      email: "deepak.counselor@school.edu",
      phone: "+91 9876543280",
      extension: "501",
      officeRoom: "Counseling Center - Room 8",
      qualification: "M.A. Psychology, Counseling Certification",
      experience: "6 years",
      subjects: [],
      classes: [],
      joiningDate: "2019-09-01",
      address: "258 Wellness Road, City",
      emergencyContact: "+91 9876543281",
      bloodGroup: "AB-",
      dateOfBirth: "1986-02-14",
      specialization: "Child Psychology",
      achievements: ["Excellence in Student Counseling 2023"],
      isAvailable: true,
      workingHours: "9:00 AM - 5:00 PM",
    },
  ]

  useEffect(() => {
    setStaffData(staffDirectoryData)
    filterStaff(staffDirectoryData)
  }, [])

  useEffect(() => {
    filterStaff(staffData)
  }, [selectedDepartment, selectedDesignation, searchText, staffData])

  const filterStaff = (data) => {
    let filtered = data

    // Filter by department
    if (selectedDepartment && selectedDepartment !== "All Departments") {
      filtered = filtered.filter((staff) => staff.department === selectedDepartment)
    }

    // Filter by designation
    if (selectedDesignation && selectedDesignation !== "All Designations") {
      filtered = filtered.filter((staff) => staff.designation === selectedDesignation)
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchLower) ||
          staff.department.toLowerCase().includes(searchLower) ||
          staff.designation.toLowerCase().includes(searchLower) ||
          staff.subjects.some((subject) => subject.toLowerCase().includes(searchLower)) ||
          staff.employeeId.toLowerCase().includes(searchLower),
      )
    }

    setFilteredStaff(filtered)
  }

  const closeAllDropdowns = () => {
    setShowDepartmentDropdown(false)
    setShowDesignationDropdown(false)
  }

  const getDepartmentColor = (department) => {
    const colors = {
      Administration: "#ef4444",
      Academic: "#3b82f6",
      Science: "#10b981",
      Mathematics: "#f59e0b",
      English: "#8b5cf6",
      "Social Studies": "#06b6d4",
      "Physical Education": "#f97316",
      "Arts & Crafts": "#ec4899",
      Library: "#84cc16",
      "IT Department": "#6366f1",
      Counseling: "#14b8a6",
      "Support Staff": "#6b7280",
    }
    return colors[department] || "#6b7280"
  }

  const getDesignationIcon = (designation) => {
    const icons = {
      Principal: "account-star",
      "Vice Principal": "account-supervisor",
      "Head of Department": "account-tie",
      "Senior Teacher": "school",
      Teacher: "teach",
      "Assistant Teacher": "account-school",
      Librarian: "book-open-variant",
      Counselor: "account-heart",
      "Lab Assistant": "flask",
      "Administrative Officer": "briefcase",
      Clerk: "file-document",
      Peon: "account-wrench",
    }
    return icons[designation] || "account"
  }

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`)
  }

  const handleStaffPress = (staff) => {
    setSelectedStaff(staff)
    setShowStaffModal(true)
  }

  const closeStaffModal = () => {
    setShowStaffModal(false)
    setSelectedStaff(null)
  }

  const StaffCard = ({ staff }) => (
    <TouchableOpacity style={styles.staffCard} onPress={() => handleStaffPress(staff)} activeOpacity={0.7}>
      <View style={styles.staffHeader}>
        <View style={styles.staffInfo}>
          <View style={[styles.staffAvatar, { backgroundColor: getDepartmentColor(staff.department) }]}>
            <Icon name={getDesignationIcon(staff.designation)} size={24} color="#ffffff" />
          </View>
          <View style={styles.staffDetails}>
            <Text style={styles.staffName} allowFontScaling={false}>
              {staff.name}
            </Text>
            <Text style={styles.staffDesignation} allowFontScaling={false}>
              {staff.designation}
            </Text>
            <Text style={styles.staffDepartment} allowFontScaling={false}>
              {staff.department}
            </Text>
            <Text style={styles.employeeId} allowFontScaling={false}>
              ID: {staff.employeeId}
            </Text>
          </View>
        </View>
        <View style={styles.availabilityContainer}>
          <View style={[styles.availabilityDot, { backgroundColor: staff.isAvailable ? "#10b981" : "#ef4444" }]} />
          <Text style={styles.availabilityText} allowFontScaling={false}>
            {staff.isAvailable ? "Available" : "Busy"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const StaffDetailModal = ({ staff, visible, onClose }) => {
    if (!staff) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Staff Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Staff Profile Header */}
            <View style={styles.modalStaffHeader}>
              <View style={[styles.modalStaffAvatar, { backgroundColor: getDepartmentColor(staff.department) }]}>
                <Icon name={getDesignationIcon(staff.designation)} size={32} color="#ffffff" />
              </View>
              <View style={styles.modalStaffInfo}>
                <Text style={styles.modalStaffName} allowFontScaling={false}>
                  {staff.name}
                </Text>
                <Text style={styles.modalStaffDesignation} allowFontScaling={false}>
                  {staff.designation}
                </Text>
                <Text style={styles.modalStaffDepartment} allowFontScaling={false}>
                  {staff.department}
                </Text>
                <Text style={styles.modalEmployeeId} allowFontScaling={false}>
                  Employee ID: {staff.employeeId}
                </Text>
              </View>
              <View style={styles.modalAvailabilityContainer}>
                <View
                  style={[styles.availabilityDot, { backgroundColor: staff.isAvailable ? "#10b981" : "#ef4444" }]}
                />
                <Text style={styles.availabilityText} allowFontScaling={false}>
                  {staff.isAvailable ? "Available" : "Busy"}
                </Text>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Contact Information
              </Text>
              <View style={styles.modalContactGrid}>
                <TouchableOpacity style={styles.modalContactItem} onPress={() => handleCall(staff.phone)}>
                  <Icon name="phone" size={18} color="#10b981" />
                  <View style={styles.modalContactText}>
                    <Text style={styles.modalContactLabel} allowFontScaling={false}>
                      Phone
                    </Text>
                    <Text style={styles.modalContactValue} allowFontScaling={false}>
                      {staff.phone}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalContactItem} onPress={() => handleEmail(staff.email)}>
                  <Icon name="email" size={18} color="#3b82f6" />
                  <View style={styles.modalContactText}>
                    <Text style={styles.modalContactLabel} allowFontScaling={false}>
                      Email
                    </Text>
                    <Text style={styles.modalContactValue} allowFontScaling={false}>
                      {staff.email}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.modalContactItem}>
                  <Icon name="phone-classic" size={18} color="#f59e0b" />
                  <View style={styles.modalContactText}>
                    <Text style={styles.modalContactLabel} allowFontScaling={false}>
                      Extension
                    </Text>
                    <Text style={styles.modalContactValue} allowFontScaling={false}>
                      {staff.extension}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalContactItem}>
                  <Icon name="map-marker" size={18} color="#8b5cf6" />
                  <View style={styles.modalContactText}>
                    <Text style={styles.modalContactLabel} allowFontScaling={false}>
                      Office
                    </Text>
                    <Text style={styles.modalContactValue} allowFontScaling={false}>
                      {staff.officeRoom}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Professional Information */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Professional Information
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="school" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Qualification
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.qualification}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="calendar" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Experience
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.experience}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="clock" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Working Hours
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.workingHours}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-plus" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Joining Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.joiningDate}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="star" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Specialization
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.specialization}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Subjects & Classes */}
            {(staff.subjects.length > 0 || staff.classes.length > 0) && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Teaching Details
                </Text>

                {staff.subjects.length > 0 && (
                  <View style={styles.modalSubSection}>
                    <Text style={styles.modalSubSectionTitle} allowFontScaling={false}>
                      Subjects
                    </Text>
                    <View style={styles.modalBadgesList}>
                      {staff.subjects.map((subject, index) => (
                        <View key={index} style={styles.modalSubjectBadge}>
                          <Text style={styles.modalSubjectText} allowFontScaling={false}>
                            {subject}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {staff.classes.length > 0 && (
                  <View style={styles.modalSubSection}>
                    <Text style={styles.modalSubSectionTitle} allowFontScaling={false}>
                      Classes
                    </Text>
                    <View style={styles.modalBadgesList}>
                      {staff.classes.map((className, index) => (
                        <View key={index} style={styles.modalClassBadge}>
                          <Text style={styles.modalClassText} allowFontScaling={false}>
                            {className}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Achievements */}
            {staff.achievements.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Achievements & Awards
                </Text>
                <View style={styles.modalAchievementsList}>
                  {staff.achievements.map((achievement, index) => (
                    <View key={index} style={styles.modalAchievementItem}>
                      <Icon name="trophy" size={16} color="#f59e0b" />
                      <Text style={styles.modalAchievementText} allowFontScaling={false}>
                        {achievement}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Personal Information */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Personal Information
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="cake" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Date of Birth
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.dateOfBirth}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="water" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Blood Group
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.bloodGroup}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="phone-alert" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Emergency Contact
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.emergencyContact}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoItem}>
                  <Icon name="home" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Address
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {staff.address}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Staff Directory
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Find and connect with school staff members
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, department, or subject..."
            value={searchText}
            onChangeText={setSearchText}
            allowFontScaling={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Department"
              value={selectedDepartment}
              options={departments}
              isOpen={showDepartmentDropdown}
              onToggle={() => {
                setShowDepartmentDropdown(!showDepartmentDropdown)
                setShowDesignationDropdown(false)
              }}
              onSelect={(department) => {
                setSelectedDepartment(department)
                setShowDepartmentDropdown(false)
              }}
              placeholder="All Departments"
            />
            <DropdownComponent
              label="Designation"
              value={selectedDesignation}
              options={designations}
              isOpen={showDesignationDropdown}
              onToggle={() => {
                setShowDesignationDropdown(!showDesignationDropdown)
                setShowDepartmentDropdown(false)
              }}
              onSelect={(designation) => {
                setSelectedDesignation(designation)
                setShowDesignationDropdown(false)
              }}
              placeholder="All Designations"
            />
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredStaff.length} of {staffData.length} staff members
          </Text>
          {(selectedDepartment || selectedDesignation || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedDepartment("")
                setSelectedDesignation("")
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {/* Staff List */}
          <View style={styles.staffContainer}>
            <FlatList
              data={filteredStaff}
              renderItem={({ item }) => <StaffCard staff={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon} allowFontScaling={false}>
                    👥
                  </Text>
                  <Text style={styles.emptyTitle} allowFontScaling={false}>
                    No Staff Found
                  </Text>
                  <Text style={styles.emptyText} allowFontScaling={false}>
                    No staff members match your search criteria. Try adjusting your filters.
                  </Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
        {/* Staff Detail Modal */}
        <StaffDetailModal staff={selectedStaff} visible={showStaffModal} onClose={closeStaffModal} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dropdownWrapper: {
    flex: 1,
    position: "relative",
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  placeholderText: {
    color: "#9ca3af",
    fontWeight: "400",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    minHeight: 44,
  },
  dropdownMenuItemActive: {
    backgroundColor: "#f0f9ff",
  },
  dropdownMenuText: {
    fontSize: 14,
    color: "#374151",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownMenuTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  overlay: {
    flex: 1,
  },
  staffContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  staffCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  staffHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  staffInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  staffAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  staffDesignation: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  staffDepartment: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  employeeId: {
    fontSize: 12,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  contactSection: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  contactText: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 6,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  subjectsSection: {
    marginBottom: 12,
  },
  classesSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  subjectsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  subjectBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 11,
    color: "#3730a3",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  classesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  classBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  classText: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  additionalInfo: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
    flex: 1,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  achievementsSection: {
    backgroundColor: "#fefce8",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde047",
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 12,
    color: "#92400e",
    marginLeft: 6,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalStaffHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 20,
  },
  modalStaffAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  modalStaffInfo: {
    flex: 1,
  },
  modalStaffName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalStaffDesignation: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalStaffDepartment: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalEmployeeId: {
    fontSize: 13,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalAvailabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalContactGrid: {
    gap: 12,
  },
  modalContactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  modalContactText: {
    marginLeft: 12,
    flex: 1,
  },
  modalContactLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalContactValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalInfoGrid: {
    gap: 12,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  modalInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalInfoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalSubSection: {
    marginBottom: 16,
  },
  modalSubSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalBadgesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalSubjectBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalSubjectText: {
    fontSize: 12,
    color: "#3730a3",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalClassBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalClassText: {
    fontSize: 12,
    color: "#166534",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalAchievementsList: {
    gap: 8,
  },
  modalAchievementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefce8",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fde047",
  },
  modalAchievementText: {
    fontSize: 13,
    color: "#92400e",
    marginLeft: 12,
    fontWeight: "500",
    flex: 1,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default StaffDirectory
