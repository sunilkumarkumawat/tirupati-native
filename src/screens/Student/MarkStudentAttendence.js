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
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native"

const MarkStudentAttendence = () => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedClass, setSelectedClass] = useState("10th")
  const [selectedSection, setSelectedSection] = useState("A")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [attendanceData, setAttendanceData] = useState({})
  const [selectAll, setSelectAll] = useState("Present")

  // Sample student data
  const students = [
    {
      id: 1,
      name: "Aarav Sharma",
      class: "10th",
      section: "A",
      rollNumber: "A001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Priya Patel",
      class: "10th",
      section: "A",
      rollNumber: "A002",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Arjun Singh",
      class: "10th",
      section: "A",
      rollNumber: "A003",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Kavya Reddy",
      class: "10th",
      section: "A",
      rollNumber: "A004",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Rohit Kumar",
      class: "10th",
      section: "A",
      rollNumber: "A005",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "Sneha Gupta",
      class: "10th",
      section: "B",
      rollNumber: "B001",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 7,
      name: "Vikram Joshi",
      class: "10th",
      section: "B",
      rollNumber: "B002",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 8,
      name: "Ananya Das",
      class: "9th",
      section: "A",
      rollNumber: "A001",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
  ]

  const classes = ["9th", "10th", "11th", "12th"]
  const sections = ["A", "B", "C", "D"]
  const attendanceOptions = [
    { value: "Present", color: "#10b981", icon: "✓" },
    { value: "Absent", color: "#ef4444", icon: "✗" },
    { value: "Late", color: "#f59e0b", icon: "⏰" },
    { value: "Half Day", color: "#06b6d4", icon: "◐" },
  ]

  useEffect(() => {
    filterStudents()
    initializeAttendanceData()
  }, [selectedClass, selectedSection, searchKeyword])

  const initializeAttendanceData = () => {
    const initialData = {}
    const filtered = getFilteredStudents()
    filtered.forEach((student) => {
      initialData[student.id] = "Present"
    })
    setAttendanceData(initialData)
  }

  const getFilteredStudents = () => {
    let filtered = students.filter((student) => student.class === selectedClass && student.section === selectedSection)

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((student) => {
        return student.name.toLowerCase().includes(keyword) || student.rollNumber.toLowerCase().includes(keyword)
      })
    }

    return filtered
  }

  const filterStudents = () => {
    setFilteredStudents(getFilteredStudents())
  }

  const markAttendance = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }))
  }

  const markAllAttendance = (status) => {
    const newData = {}
    filteredStudents.forEach((student) => {
      newData[student.id] = status
    })
    setAttendanceData((prev) => ({ ...prev, ...newData }))
    setSelectAll(status)
  }

  const saveAttendance = () => {
    const attendanceCount = {
      Present: 0,
      Absent: 0,
      Late: 0,
      "Half Day": 0,
    }

    filteredStudents.forEach((student) => {
      const status = attendanceData[student.id] || "Present"
      attendanceCount[status]++
    })

    const summary = Object.entries(attendanceCount)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => `${count} ${status}`)
      .join(", ")

    Alert.alert(
      "Save Attendance",
      `Save attendance for ${selectedDate}?\n\nClass: ${selectedClass}-${selectedSection}\nSummary: ${summary}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: () => {
            Alert.alert("Success", "Attendance saved successfully!")
          },
        },
      ],
    )
  }

  const getAttendanceColor = (status) => {
    const option = attendanceOptions.find((opt) => opt.value === status)
    return option ? option.color : "#6b7280"
  }

  const getAttendanceIcon = (status) => {
    const option = attendanceOptions.find((opt) => opt.value === status)
    return option ? option.icon : "?"
  }

  const getAttendanceSummary = () => {
    const summary = { Present: 0, Absent: 0, Late: 0, "Half Day": 0 }
    filteredStudents.forEach((student) => {
      const status = attendanceData[student.id] || "Present"
      summary[status]++
    })
    return summary
  }

  const closeDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
  }

  const StudentAttendanceCard = ({ student }) => {
    const currentStatus = attendanceData[student.id] || "Present"

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentInfo}>
          <Image source={{ uri: student.avatar }} style={styles.avatar} />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>
              {student.name}
            </Text>
            <Text style={styles.rollNumber} allowFontScaling={false}>
              Roll: {student.rollNumber}
            </Text>
          </View>
        </View>
        <View style={styles.attendanceButtons}>
          {attendanceOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.attendanceButton,
                {
                  backgroundColor: currentStatus === option.value ? option.color : "#f8f9fa",
                  borderColor: option.color,
                },
              ]}
              onPress={() => markAttendance(student.id, option.value)}
            >
              <Text
                style={[
                  styles.attendanceButtonText,
                  {
                    color: currentStatus === option.value ? "#ffffff" : option.color,
                  },
                ]}
                allowFontScaling={false}
              >
                {option.icon}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const summary = getAttendanceSummary()

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2c5282" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Mark Attendance
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          {selectedDate} • Class {selectedClass}-{selectedSection}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={closeDropdowns}
      >
        {/* Date and Class Selection */}
        <View style={styles.selectionContainer}>
          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel} allowFontScaling={false}>
              Date:
            </Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText} allowFontScaling={false}>
                {selectedDate}
              </Text>
              <Text style={styles.dateIcon} allowFontScaling={false}>
                📅
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.classSelectionRow}>
            <View style={styles.dropdownWrapper}>
              <Text style={styles.sectionLabel} allowFontScaling={false}>
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
                        style={[styles.dropdownMenuText, selectedClass === classItem && styles.dropdownMenuTextActive]}
                        allowFontScaling={false}
                      >
                        {classItem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.dropdownWrapper}>
              <Text style={styles.sectionLabel} allowFontScaling={false}>
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
                        style={[styles.dropdownMenuText, selectedSection === section && styles.dropdownMenuTextActive]}
                        allowFontScaling={false}
                      >
                        {section}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon} allowFontScaling={false}>
              🔍
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or roll number..."
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Quick Mark All:
          </Text>
          <View style={styles.quickActionsRow}>
            {attendanceOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.quickActionButton, { borderColor: option.color }]}
                onPress={() => markAllAttendance(option.value)}
              >
                <Text style={[styles.quickActionIcon, { color: option.color }]} allowFontScaling={false}>
                  {option.icon}
                </Text>
                <Text style={[styles.quickActionText, { color: option.color }]} allowFontScaling={false}>
                  {option.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Summary ({filteredStudents.length} students):
          </Text>
          <View style={styles.summaryRow}>
            {Object.entries(summary).map(([status, count]) => (
              <View key={status} style={[styles.summaryCard, { borderLeftColor: getAttendanceColor(status) }]}>
                <Text style={[styles.summaryCount, { color: getAttendanceColor(status) }]} allowFontScaling={false}>
                  {count}
                </Text>
                <Text style={styles.summaryLabel} allowFontScaling={false}>
                  {status}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Student List */}
        <View style={styles.studentsList}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            Students:
          </Text>
          {filteredStudents.map((student, index) => (
            <View key={student.id}>
              <StudentAttendanceCard student={student} />
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
            💾 Save Attendance
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
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
  container: {
    flex: 1,
    padding: 12,
  },
  selectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginRight: 12,
    minWidth: 60,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#374151",
    marginRight: 8,
    fontWeight: "500",
  },
  dateIcon: {
    fontSize: 14,
  },
  classSelectionRow: {
    flexDirection: "row",
    gap: 12,
  },
  dropdownWrapper: {
    flex: 1,
    position: "relative",
  },
  dropdownButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    maxHeight: 120,
    zIndex: 1000,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  searchContainer: {
    marginBottom: 12,
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
  quickActionsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  quickActionIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    borderLeftWidth: 2,
  },
  summaryCount: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
  },
  studentsList: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  attendanceButtons: {
    flexDirection: "row",
    gap: 6,
  },
  attendanceButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  attendanceButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 8,
  },
  bottomPadding: {
    height: 80,
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
})

export default MarkStudentAttendence;
