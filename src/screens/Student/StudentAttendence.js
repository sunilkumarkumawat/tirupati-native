"use client"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native"

const { width } = Dimensions.get("window")

const StudentAttendance = () => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedClass, setSelectedClass] = useState("All")
  const [selectedSection, setSelectedSection] = useState("All")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [selectedStudentReport, setSelectedStudentReport] = useState(null)

  // Sample student data with attendance records
  const students = [
    {
      id: 1,
      name: "Aarav Sharma",
      class: "10th",
      section: "A",
      rollNumber: "A001",
      email: "aarav.sharma@school.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      parentContact: "+91 98765 43210",
      attendanceHistory: {
        "2024-01-15": "Present",
        "2024-01-16": "Present",
        "2024-01-17": "Absent",
        "2024-01-18": "Present",
        "2024-01-19": "Present",
      },
      monthlyStats: {
        totalDays: 20,
        presentDays: 18,
        absentDays: 2,
        percentage: 90,
      },
    },
    {
      id: 2,
      name: "Priya Patel",
      class: "10th",
      section: "B",
      rollNumber: "B015",
      email: "priya.patel@school.edu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      parentContact: "+91 87654 32109",
      attendanceHistory: {
        "2024-01-15": "Present",
        "2024-01-16": "Absent",
        "2024-01-17": "Present",
        "2024-01-18": "Present",
        "2024-01-19": "Absent",
      },
      monthlyStats: {
        totalDays: 20,
        presentDays: 15,
        absentDays: 5,
        percentage: 75,
      },
    },
    {
      id: 3,
      name: "Arjun Singh",
      class: "9th",
      section: "A",
      rollNumber: "A025",
      email: "arjun.singh@school.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      parentContact: "+91 76543 21098",
      attendanceHistory: {
        "2024-01-15": "Present",
        "2024-01-16": "Present",
        "2024-01-17": "Present",
        "2024-01-18": "Present",
        "2024-01-19": "Present",
      },
      monthlyStats: {
        totalDays: 20,
        presentDays: 19,
        absentDays: 1,
        percentage: 95,
      },
    },
    {
      id: 4,
      name: "Kavya Reddy",
      class: "11th",
      section: "C",
      rollNumber: "C008",
      email: "kavya.reddy@school.edu",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      parentContact: "+91 65432 10987",
      attendanceHistory: {
        "2024-01-15": "Present",
        "2024-01-16": "Present",
        "2024-01-17": "Late",
        "2024-01-18": "Present",
        "2024-01-19": "Present",
      },
      monthlyStats: {
        totalDays: 20,
        presentDays: 17,
        absentDays: 2,
        percentage: 85,
      },
    },
    {
      id: 5,
      name: "Rohit Kumar",
      class: "9th",
      section: "B",
      rollNumber: "B012",
      email: "rohit.kumar@school.edu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      parentContact: "+91 54321 09876",
      attendanceHistory: {
        "2024-01-15": "Absent",
        "2024-01-16": "Present",
        "2024-01-17": "Absent",
        "2024-01-18": "Present",
        "2024-01-19": "Present",
      },
      monthlyStats: {
        totalDays: 20,
        presentDays: 12,
        absentDays: 8,
        percentage: 60,
      },
    },
  ]

  const classes = ["All", "9th", "10th", "11th", "12th"]
  const sections = ["All", "A", "B", "C", "D"]
  const attendanceOptions = ["Present", "Absent", "Late", "Half Day", "Excused"]

  useEffect(() => {
    filterStudents()
    initializeAttendanceData()
  }, [searchKeyword, selectedClass, selectedSection])

  const initializeAttendanceData = () => {
    const initialData = {}
    students.forEach((student) => {
      initialData[student.id] = student.attendanceHistory[selectedDate] || "Not Marked"
    })
    setAttendanceData(initialData)
  }

  const filterStudents = () => {
    let filtered = students
    if (selectedClass !== "All") {
      filtered = filtered.filter((student) => student.class === selectedClass)
    }
    if (selectedSection !== "All") {
      filtered = filtered.filter((student) => student.section === selectedSection)
    }
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((student) => {
        return (
          student.name.toLowerCase().includes(keyword) ||
          student.rollNumber.toLowerCase().includes(keyword) ||
          student.email.toLowerCase().includes(keyword)
        )
      })
    }
    setFilteredStudents(filtered)
  }

  const markAttendance = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const saveAttendance = () => {
    Alert.alert("Save Attendance", `Save attendance for ${selectedDate}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: () => {
          Alert.alert("Success", "Attendance saved successfully!")
        },
      },
    ])
  }

  const getAttendanceColor = (status) => {
    switch (status) {
      case "Present":
        return "#10b981"
      case "Absent":
        return "#ef4444"
      case "Late":
        return "#f59e0b"
      case "Half Day":
        return "#06b6d4"
      case "Excused":
        return "#8b5cf6"
      case "Not Marked":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const getAttendancePercentageColor = (percentage) => {
    if (percentage >= 90) return "#10b981"
    if (percentage >= 75) return "#f59e0b"
    if (percentage >= 60) return "#f97316"
    return "#ef4444"
  }

  const calculateAttendanceTotals = () => {
    const totals = {
      Present: 0,
      Absent: 0,
      Late: 0,
      "Half Day": 0,
      Excused: 0,
      "Not Marked": 0,
    }
    filteredStudents.forEach((student) => {
      const status = attendanceData[student.id] || "Not Marked"
      totals[status] = (totals[status] || 0) + 1
    })
    return totals
  }

  const showStudentReport = (student) => {
    setSelectedStudentReport(student)
    setReportModalVisible(true)
  }

  const closeDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
  }

  const AttendanceCard = ({ student }) => (
    <View style={styles.attendanceCard}>
      <View style={styles.studentHeader}>
        <View style={styles.studentBasicInfo}>
          <Image source={{ uri: student.avatar }} style={styles.avatar} />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>
              {student.name}
            </Text>
            <Text style={styles.classInfo} allowFontScaling={false}>
              {student.class} - {student.section}
            </Text>
            <Text style={styles.rollNumber} allowFontScaling={false}>
              Roll: {student.rollNumber}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.reportButton} onPress={() => showStudentReport(student)}>
          <Text style={styles.reportButtonText} allowFontScaling={false}>
            📊
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text
            style={[styles.statValue, { color: getAttendancePercentageColor(student.monthlyStats.percentage) }]}
            allowFontScaling={false}
          >
            {student.monthlyStats.percentage}%
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Monthly
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue} allowFontScaling={false}>
            {student.monthlyStats.presentDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Present
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue} allowFontScaling={false}>
            {student.monthlyStats.absentDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Absent
          </Text>
        </View>
      </View>
    </View>
  )

  const StudentReportModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={reportModalVisible}
      onRequestClose={() => setReportModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Attendance Report
            </Text>
            <TouchableOpacity onPress={() => setReportModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText} allowFontScaling={false}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
          {selectedStudentReport && (
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.reportStudentInfo}>
                <Image source={{ uri: selectedStudentReport.avatar }} style={styles.reportAvatar} />
                <View>
                  <Text style={styles.reportStudentName} allowFontScaling={false}>
                    {selectedStudentReport.name}
                  </Text>
                  <Text style={styles.reportClassInfo} allowFontScaling={false}>
                    {selectedStudentReport.class} - Section {selectedStudentReport.section}
                  </Text>
                  <Text style={styles.reportRollNumber} allowFontScaling={false}>
                    Roll: {selectedStudentReport.rollNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.reportStats}>
                <View style={styles.reportStatCard}>
                  <Text style={styles.reportStatValue} allowFontScaling={false}>
                    {selectedStudentReport.monthlyStats.percentage}%
                  </Text>
                  <Text style={styles.reportStatLabel} allowFontScaling={false}>
                    Attendance Rate
                  </Text>
                </View>
                <View style={styles.reportStatCard}>
                  <Text style={styles.reportStatValue} allowFontScaling={false}>
                    {selectedStudentReport.monthlyStats.presentDays}
                  </Text>
                  <Text style={styles.reportStatLabel} allowFontScaling={false}>
                    Days Present
                  </Text>
                </View>
                <View style={styles.reportStatCard}>
                  <Text style={styles.reportStatValue} allowFontScaling={false}>
                    {selectedStudentReport.monthlyStats.absentDays}
                  </Text>
                  <Text style={styles.reportStatLabel} allowFontScaling={false}>
                    Days Absent
                  </Text>
                </View>
              </View>
              <View style={styles.attendanceHistory}>
                <Text style={styles.historyTitle} allowFontScaling={false}>
                  Recent Attendance
                </Text>
                {Object.entries(selectedStudentReport.attendanceHistory).map(([date, status]) => (
                  <View key={date} style={styles.historyItem}>
                    <Text style={styles.historyDate} allowFontScaling={false}>
                      {date}
                    </Text>
                    <View style={[styles.historyStatus, { backgroundColor: getAttendanceColor(status) }]}>
                      <Text style={styles.historyStatusText} allowFontScaling={false}>
                        {status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2c5282" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Attendance Report
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          {filteredStudents.length} students • {selectedDate}
        </Text>
      </View>

      {/* Main Content - Single ScrollView */}
      <ScrollView
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={closeDropdowns}
      >
        {/* Date Selector */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel} allowFontScaling={false}>
            Select Date:
          </Text>
          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.dateButtonText} allowFontScaling={false}>
              {selectedDate}
            </Text>
            <Text style={styles.dateArrow} allowFontScaling={false}>
              📅
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon} allowFontScaling={false}>
              🔍
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              placeholderTextColor="#9ca3af"
              allowFontScaling={false}
            />
            {searchKeyword.length > 0 && (
              <TouchableOpacity onPress={() => setSearchKeyword("")} style={styles.clearButton}>
                <Text style={styles.clearButtonText} allowFontScaling={false}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Class and Section Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.filterLabel} allowFontScaling={false}>
                Class:
              </Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowClassDropdown(!showClassDropdown)
                  setShowSectionDropdown(false)
                }}
              >
                <Text style={styles.dropdownButtonText} allowFontScaling={false}>
                  {selectedClass}
                </Text>
                <Text style={styles.dropdownArrow} allowFontScaling={false}>
                  {showClassDropdown ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
              {showClassDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                    {classes.map((classItem) => (
                      <TouchableOpacity
                        key={classItem}
                        style={[styles.dropdownMenuItem, selectedClass === classItem && styles.dropdownMenuItemActive]}
                        onPress={() => {
                          setSelectedClass(classItem)
                          setShowClassDropdown(false)
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownMenuText,
                            selectedClass === classItem && styles.dropdownMenuTextActive,
                          ]}
                          allowFontScaling={false}
                        >
                          {classItem}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.filterLabel} allowFontScaling={false}>
                Section:
              </Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowSectionDropdown(!showSectionDropdown)
                  setShowClassDropdown(false)
                }}
              >
                <Text style={styles.dropdownButtonText} allowFontScaling={false}>
                  {selectedSection}
                </Text>
                <Text style={styles.dropdownArrow} allowFontScaling={false}>
                  {showSectionDropdown ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
              {showSectionDropdown && (
                <View style={styles.dropdownMenu}>
                  <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                    {sections.map((section) => (
                      <TouchableOpacity
                        key={section}
                        style={[styles.dropdownMenuItem, selectedSection === section && styles.dropdownMenuItemActive]}
                        onPress={() => {
                          setSelectedSection(section)
                          setShowSectionDropdown(false)
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownMenuText,
                            selectedSection === section && styles.dropdownMenuTextActive,
                          ]}
                          allowFontScaling={false}
                        >
                          {section}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Attendance Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle} allowFontScaling={false}>
            Today's Summary
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.summaryScrollView}
          >
            {Object.entries(calculateAttendanceTotals()).map(([status, count]) => (
              <View key={status} style={[styles.summaryCard, { borderLeftColor: getAttendanceColor(status) }]}>
                <Text style={[styles.summaryCount, { color: getAttendanceColor(status) }]} allowFontScaling={false}>
                  {count}
                </Text>
                <Text style={styles.summaryLabel} allowFontScaling={false}>
                  {status}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Student List */}
        <View style={styles.listContainer}>
          {filteredStudents.map((student, index) => (
            <View key={student.id}>
              <AttendanceCard student={student} />
              {index < filteredStudents.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        {/* Bottom padding for save button */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Save Button - Fixed at bottom */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
          <Text style={styles.saveButtonText} allowFontScaling={false}>
            Save Attendance
          </Text>
        </TouchableOpacity>
      </View>

      <StudentReportModal />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  mainScrollView: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginRight: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#374151",
    marginRight: 8,
    fontWeight: "500",
  },
  dateArrow: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  filtersContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1,
    position: "relative",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  dropdownButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "bold",
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
    maxHeight: 150,
    zIndex: 1000,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropdownScrollView: {
    maxHeight: 150,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownMenuItemActive: {
    backgroundColor: "#f0f9ff",
  },
  dropdownMenuText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownMenuTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  separator: {
    height: 8,
  },
  bottomPadding: {
    height: 80,
  },
  attendanceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  studentBasicInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  classInfo: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: 11,
    color: "#f59e0b",
    fontWeight: "500",
  },
  reportButton: {
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  reportButtonText: {
    fontSize: 16,
  },
  statsSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  saveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  saveButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  modalBody: {
    padding: 16,
  },
  reportStudentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  reportAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reportStudentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  reportClassInfo: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
  },
  reportRollNumber: {
    fontSize: 12,
    color: "#f59e0b",
    fontWeight: "500",
  },
  reportStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  reportStatCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 2,
  },
  reportStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  reportStatLabel: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  attendanceHistory: {
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  historyDate: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  historyStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
  summaryContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  summaryScrollView: {
    paddingRight: 12,
  },
  summaryCard: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 60,
    alignItems: "center",
    borderLeftWidth: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  summaryCount: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
})

export default StudentAttendance;