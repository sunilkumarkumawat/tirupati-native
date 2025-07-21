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
} from "react-native"

const { width } = Dimensions.get("window")

const ExamSchedule = () => {
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [showTermDropdown, setShowTermDropdown] = useState(false)
  const [showExamDropdown, setShowExamDropdown] = useState(false)
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [examSchedule, setExamSchedule] = useState([])

  // Sample data
  const terms = ["First Term", "Second Term", "Third Term", "Final Term"]
  const exams = ["Unit Test 1", "Unit Test 2", "Mid Term", "Final Exam", "Pre-Board", "Board Exam"]
  const classes = ["9th", "10th", "11th", "12th"]
  const sections = ["A", "B", "C", "D"]

  // Sample exam schedule data with additional marks fields
  const examScheduleData = {
    "First Term-Unit Test 1-10th-A": [
      {
        id: 1,
        date: "2024-02-15",
        day: "Monday",
        time: "09:00 AM - 12:00 PM",
        subject: "Mathematics",
        duration: "3 Hours",
        room: "Room 101",
        invigilator: "Mr. Sharma",
        maxMarks: 100,
        passingMarks: 35,
        weightMarks: 20,
        instructions: "Bring calculator and geometry box",
      },
      {
        id: 2,
        date: "2024-02-16",
        day: "Tuesday",
        time: "09:00 AM - 12:00 PM",
        subject: "Science",
        duration: "3 Hours",
        room: "Room 102",
        invigilator: "Ms. Patel",
        maxMarks: 100,
        fullMarks: 100,
        passingMarks: 35,
        weightMarks: 20,
        instructions: "Practical exam will be conducted separately",
      },
      {
        id: 3,
        date: "2024-02-17",
        day: "Wednesday",
        time: "09:00 AM - 12:00 PM",
        subject: "English",
        duration: "3 Hours",
        room: "Room 103",
        invigilator: "Mrs. Singh",
        maxMarks: 100,
        fullMarks: 100,
        passingMarks: 35,
        weightMarks: 20,
        instructions: "Dictionary not allowed",
      },
      {
        id: 4,
        date: "2024-02-18",
        day: "Thursday",
        time: "09:00 AM - 12:00 PM",
        subject: "Hindi",
        duration: "3 Hours",
        room: "Room 104",
        invigilator: "Mr. Kumar",
        maxMarks: 100,
        fullMarks: 100,
        passingMarks: 35,
        weightMarks: 20,
        instructions: "Write in blue or black pen only",
      },
      {
        id: 5,
        date: "2024-02-19",
        day: "Friday",
        time: "09:00 AM - 12:00 PM",
        subject: "Social Studies",
        duration: "3 Hours",
        room: "Room 105",
        invigilator: "Ms. Gupta",
        maxMarks: 100,
        fullMarks: 100,
        passingMarks: 35,
        weightMarks: 20,
        instructions: "Maps and atlas will be provided",
      },
    ],
  }

  useEffect(() => {
    loadExamSchedule()
  }, [selectedTerm, selectedExam, selectedClass, selectedSection])

  const loadExamSchedule = () => {
    if (selectedTerm && selectedExam && selectedClass && selectedSection) {
      const key = `${selectedTerm}-${selectedExam}-${selectedClass}-${selectedSection}`
      const schedule = examScheduleData[key] || []
      setExamSchedule(schedule)
    } else {
      setExamSchedule([])
    }
  }

  const closeAllDropdowns = () => {
    setShowTermDropdown(false)
    setShowExamDropdown(false)
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
  }

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "#ef4444",
      Science: "#10b981",
      English: "#6366f1",
      Hindi: "#f59e0b",
      "Social Studies": "#8b5cf6",
      Physics: "#06b6d4",
      Chemistry: "#84cc16",
      Biology: "#f97316",
    }
    return colors[subject] || "#6b7280"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: "2-digit", month: "short", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const ExamCard = ({ exam }) => (
    <View style={styles.examCard}>
      <View style={styles.examHeader}>
        <View style={styles.dateSection}>
          <Text style={styles.examDate} allowFontScaling={false}>
            {formatDate(exam.date)}
          </Text>
          <Text style={styles.examDay} allowFontScaling={false}>
            {exam.day}
          </Text>
        </View>
        <View style={[styles.subjectBadge, { backgroundColor: getSubjectColor(exam.subject) }]}>
          <Text style={styles.subjectText} allowFontScaling={false}>
            {exam.subject}
          </Text>
        </View>
      </View>
      <View style={styles.examDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="clock-time-three-outline" size={20} color="#6b7280" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                TIME
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {exam.time}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Icon name="timer-outline" size={20} color="#6b7280" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                DURATION
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {exam.duration}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="sofa-single-outline" size={20} color="#6b7280" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                ROOM
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {exam.room}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Icon name="account" size={20} color="#6b7280" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                INVIGILATOR
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {exam.invigilator}
              </Text>
            </View>
          </View>
        </View>
        {/* Marks Information Section */}
        <View style={styles.marksSection}>
          <Text style={styles.marksSectionTitle} allowFontScaling={false}>
            📊 Marks Information
          </Text>
          <View style={styles.marksGrid}>
            <View style={styles.marksCard}>
              <Text style={styles.marksLabel} allowFontScaling={false}>
                MAX MARKS
              </Text>
              <Text style={styles.marksValue} allowFontScaling={false}>
                {exam.maxMarks}
              </Text>
            </View>
            <View style={styles.marksCard}>
              <Text style={styles.marksLabel} allowFontScaling={false}>
                PASSING MARKS
              </Text>
              <Text style={styles.marksValue} allowFontScaling={false}>
                {exam.passingMarks}
              </Text>
            </View>
            <View style={styles.marksCard}>
              <Text style={styles.marksLabel} allowFontScaling={false}>
                WEIGHT MARKS
              </Text>
              <Text style={styles.marksValue} allowFontScaling={false}>
                {exam.weightMarks}
              </Text>
            </View>
          </View>
        </View>
        {exam.instructions && (
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsLabel} allowFontScaling={false}>
              📝 Instructions:
            </Text>
            <Text style={styles.instructionsText} allowFontScaling={false}>
              {exam.instructions}
            </Text>
          </View>
        )}
      </View>
    </View>
  )

  const DropdownComponent = ({ label, value, options, isOpen, onToggle, onSelect, placeholder }) => (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.filterLabel} allowFontScaling={false}>
        {label}:
      </Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]} allowFontScaling={false}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow} allowFontScaling={false}>
          {isOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownMenu}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.dropdownMenuItem, value === option && styles.dropdownMenuItemActive]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[styles.dropdownMenuText, value === option && styles.dropdownMenuTextActive]}
                allowFontScaling={false}
              >
                {option}
              </Text>
              {value === option && (
                <Text style={styles.checkmark} allowFontScaling={false}>
                  ✓
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )

  const allOptionsSelected = selectedTerm && selectedExam && selectedClass && selectedSection

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Exam Schedule
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Select filters to view exam schedule
        </Text>
      </View>
      {/* Filters */}
      <ScrollView style={styles.filtersScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Term"
              value={selectedTerm}
              options={terms}
              isOpen={showTermDropdown}
              onToggle={() => {
                setShowTermDropdown(!showTermDropdown)
                setShowExamDropdown(false)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
              }}
              onSelect={(term) => {
                setSelectedTerm(term)
                setShowTermDropdown(false)
              }}
              placeholder="Select Term"
            />
            <DropdownComponent
              label="Exam"
              value={selectedExam}
              options={exams}
              isOpen={showExamDropdown}
              onToggle={() => {
                setShowExamDropdown(!showExamDropdown)
                setShowTermDropdown(false)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
              }}
              onSelect={(exam) => {
                setSelectedExam(exam)
                setShowExamDropdown(false)
              }}
              placeholder="Select Exam"
            />
          </View>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Class"
              value={selectedClass}
              options={classes}
              isOpen={showClassDropdown}
              onToggle={() => {
                setShowClassDropdown(!showClassDropdown)
                setShowTermDropdown(false)
                setShowExamDropdown(false)
                setShowSectionDropdown(false)
              }}
              onSelect={(classItem) => {
                setSelectedClass(classItem)
                setShowClassDropdown(false)
              }}
              placeholder="Select Class"
            />
            <DropdownComponent
              label="Section"
              value={selectedSection}
              options={sections}
              isOpen={showSectionDropdown}
              onToggle={() => {
                setShowSectionDropdown(!showSectionDropdown)
                setShowTermDropdown(false)
                setShowExamDropdown(false)
                setShowClassDropdown(false)
              }}
              onSelect={(section) => {
                setSelectedSection(section)
                setShowSectionDropdown(false)
              }}
              placeholder="Select Section"
            />
          </View>
        </View>
        {/* Exam Schedule */}
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {allOptionsSelected ? (
            examSchedule.length > 0 ? (
              <View style={styles.scheduleContainer}>
                <Text style={styles.scheduleTitle} allowFontScaling={false}>
                  {selectedTerm} - {selectedExam} Schedule
                </Text>
                <Text style={styles.scheduleSubtitle} allowFontScaling={false}>
                  Class {selectedClass} - Section {selectedSection}
                </Text>
                <FlatList
                  data={examSchedule}
                  renderItem={({ item }) => <ExamCard exam={item} />}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon} allowFontScaling={false}>
                  📅
                </Text>
                <Text style={styles.noDataTitle} allowFontScaling={false}>
                  No Exam Schedule Found
                </Text>
                <Text style={styles.noDataText} allowFontScaling={false}>
                  No exams are scheduled for the selected criteria.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon} allowFontScaling={false}>
                📋
              </Text>
              <Text style={styles.emptyTitle} allowFontScaling={false}>
                Select All Filters
              </Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                Please select Term, Exam, Class, and Section to view the exam schedule.
              </Text>
              <View style={styles.progressIndicator}>
                <View style={styles.progressSteps}>
                  <View style={[styles.progressStep, selectedTerm && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedTerm && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      1
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedExam && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedExam && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      2
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedClass && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedClass && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      3
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedSection && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedSection && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      4
                    </Text>
                  </View>
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Term
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Exam
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Class
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Section
                  </Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
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
  filtersScrollView: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
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
  overlay: {
    flex: 1,
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
    marginBottom: 32,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  progressIndicator: {
    alignItems: "center",
  },
  progressSteps: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  progressStepActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  progressStepTextActive: {
    color: "#ffffff",
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
  },
  progressLabel: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  noDataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  noDataIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  listContainer: {
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  examCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth:1,
    borderColor:'#00000020'
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dateSection: {
    flex: 1,
  },
  examDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  examDay: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  examDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // Marks section styles
  marksSection: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  marksSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  marksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  marksCard: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    minWidth: "30%",
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  marksLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  marksValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  instructionsSection: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  instructionsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  instructionsText: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default ExamSchedule;
