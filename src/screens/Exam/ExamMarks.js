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

const ExamMarks = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedExam, setSelectedExam] = useState("")
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const [showExamDropdown, setShowExamDropdown] = useState(false)
  const [examMarks, setExamMarks] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)

  // Sample data
  const classes = ["9th", "10th", "11th", "12th"]
  const sections = ["A", "B", "C", "D"]
  const students = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Arjun Gupta"]
  const exams = ["Unit Test 1", "Unit Test 2", "Mid Term", "Final Exam", "Annual Exam"]

  // Sample exam marks data
  const examMarksData = {
    "10th-A-Rahul Sharma-Unit Test 1": {
      studentInfo: {
        name: "Rahul Sharma",
        rollNo: "2024001",
        class: "10th",
        section: "A",
        fatherName: "Mr. Suresh Sharma",
        admissionNo: "ADM/2024/001",
      },
      examInfo: {
        examName: "Unit Test 1",
        examDate: "15-02-2024",
        totalSubjects: 5,
        maxMarks: 500,
        obtainedMarks: 425,
        percentage: 85.0,
        grade: "A",
        rank: 3,
        totalStudents: 45,
      },
      subjects: [
        {
          id: 1,
          name: "Mathematics",
          maxMarks: 100,
          obtainedMarks: 92,
          grade: "A+",
          remarks: "Excellent",
          teacher: "Mr. Sharma",
        },
        {
          id: 2,
          name: "Science",
          maxMarks: 100,
          obtainedMarks: 88,
          grade: "A",
          remarks: "Very Good",
          teacher: "Ms. Patel",
        },
        {
          id: 3,
          name: "English",
          maxMarks: 100,
          obtainedMarks: 85,
          grade: "A",
          remarks: "Good",
          teacher: "Mrs. Singh",
        },
        {
          id: 4,
          name: "Hindi",
          maxMarks: 100,
          obtainedMarks: 80,
          grade: "B+",
          remarks: "Good",
          teacher: "Mr. Kumar",
        },
        {
          id: 5,
          name: "Social Studies",
          maxMarks: 100,
          obtainedMarks: 80,
          grade: "B+",
          remarks: "Good",
          teacher: "Ms. Gupta",
        },
      ],
    },
  }

  useEffect(() => {
    loadExamMarks()
  }, [selectedClass, selectedSection, selectedStudent, selectedExam])

  const loadExamMarks = () => {
    if (selectedClass && selectedSection && selectedStudent && selectedExam) {
      const key = `${selectedClass}-${selectedSection}-${selectedStudent}-${selectedExam}`
      const data = examMarksData[key]
      if (data) {
        setExamMarks(data.subjects)
        setStudentInfo(data)
      } else {
        setExamMarks([])
        setStudentInfo(null)
      }
    } else {
      setExamMarks([])
      setStudentInfo(null)
    }
  }

  const closeAllDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
    setShowStudentDropdown(false)
    setShowExamDropdown(false)
  }

  const getGradeColor = (grade) => {
    const colors = {
      "A+": "#10b981",
      A: "#059669",
      "B+": "#3b82f6",
      B: "#2563eb",
      "C+": "#f59e0b",
      C: "#d97706",
      D: "#ef4444",
      F: "#dc2626",
    }
    return colors[grade] || "#6b7280"
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return "#10b981"
    if (percentage >= 80) return "#3b82f6"
    if (percentage >= 70) return "#f59e0b"
    if (percentage >= 60) return "#f97316"
    return "#ef4444"
  }

  const SubjectCard = ({ subject }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName} allowFontScaling={false}>
            {subject.name}
          </Text>
          <Text style={styles.teacherName} allowFontScaling={false}>
            {subject.teacher}
          </Text>
        </View>
        <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(subject.grade) }]}>
          <Text style={styles.gradeText} allowFontScaling={false}>
            {subject.grade}
          </Text>
        </View>
      </View>

      <View style={styles.marksContainer}>
        <View style={styles.marksRow}>
          <View style={styles.marksItem}>
            <Text style={styles.marksLabel} allowFontScaling={false}>
              OBTAINED
            </Text>
            <Text style={styles.marksValue} allowFontScaling={false}>
              {subject.obtainedMarks}
            </Text>
          </View>
          <View style={styles.marksDivider} />
          <View style={styles.marksItem}>
            <Text style={styles.marksLabel} allowFontScaling={false}>
              MAX MARKS
            </Text>
            <Text style={styles.marksValue} allowFontScaling={false}>
              {subject.maxMarks}
            </Text>
          </View>
          <View style={styles.marksDivider} />
          <View style={styles.marksItem}>
            <Text style={styles.marksLabel} allowFontScaling={false}>
              PERCENTAGE
            </Text>
            <Text style={styles.marksValue} allowFontScaling={false}>
              {((subject.obtainedMarks / subject.maxMarks) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(subject.obtainedMarks / subject.maxMarks) * 100}%`,
                backgroundColor: getGradeColor(subject.grade),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.remarksContainer}>
        <Icon name="comment-text-outline" size={14} color="#6b7280" />
        <Text style={styles.remarksText} allowFontScaling={false}>
          {subject.remarks}
        </Text>
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
          <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
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
          </ScrollView>
        </View>
      )}
    </View>
  )

  const allOptionsSelected = selectedClass && selectedSection && selectedStudent && selectedExam

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Exam Marks
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          View student exam results and performance
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Class"
              value={selectedClass}
              options={classes}
              isOpen={showClassDropdown}
              onToggle={() => {
                setShowClassDropdown(!showClassDropdown)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
                setShowExamDropdown(false)
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
                setShowClassDropdown(false)
                setShowStudentDropdown(false)
                setShowExamDropdown(false)
              }}
              onSelect={(section) => {
                setSelectedSection(section)
                setShowSectionDropdown(false)
              }}
              placeholder="Select Section"
            />
          </View>

          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Student"
              value={selectedStudent}
              options={students}
              isOpen={showStudentDropdown}
              onToggle={() => {
                setShowStudentDropdown(!showStudentDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowExamDropdown(false)
              }}
              onSelect={(student) => {
                setSelectedStudent(student)
                setShowStudentDropdown(false)
              }}
              placeholder="Select Student"
            />
            <DropdownComponent
              label="Exam"
              value={selectedExam}
              options={exams}
              isOpen={showExamDropdown}
              onToggle={() => {
                setShowExamDropdown(!showExamDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
              }}
              onSelect={(exam) => {
                setSelectedExam(exam)
                setShowExamDropdown(false)
              }}
              placeholder="Select Exam"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {allOptionsSelected ? (
            studentInfo ? (
              <View style={styles.resultsContainer}>
                {/* Student Info Card */}
                <View style={styles.studentInfoCard}>
                  <View style={styles.studentHeader}>
                    <View style={styles.studentAvatar}>
                      <Text style={styles.avatarText} allowFontScaling={false}>
                        {studentInfo.studentInfo.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.studentDetails}>
                      <Text style={styles.studentName} allowFontScaling={false}>
                        {studentInfo.studentInfo.name}
                      </Text>
                      <Text style={styles.studentClass} allowFontScaling={false}>
                        Class {studentInfo.studentInfo.class} - {studentInfo.studentInfo.section}
                      </Text>
                      <Text style={styles.rollNumber} allowFontScaling={false}>
                        Roll No: {studentInfo.studentInfo.rollNo}
                      </Text>
                    </View>
                    <View
                      style={[styles.overallGradeBadge, { backgroundColor: getGradeColor(studentInfo.examInfo.grade) }]}
                    >
                      <Text style={styles.overallGradeText} allowFontScaling={false}>
                        {studentInfo.examInfo.grade}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Exam Summary Card */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle} allowFontScaling={false}>
                      {studentInfo.examInfo.examName} Results
                    </Text>
                    <Text style={styles.examDate} allowFontScaling={false}>
                      {studentInfo.examInfo.examDate}
                    </Text>
                  </View>

                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {studentInfo.examInfo.obtainedMarks}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Total Marks
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text
                        style={[styles.statValue, { color: getPerformanceColor(studentInfo.examInfo.percentage) }]}
                        allowFontScaling={false}
                      >
                        {studentInfo.examInfo.percentage}%
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Percentage
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {studentInfo.examInfo.rank}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Class Rank
                      </Text>
                    </View>
                  </View>

                  <View style={styles.overallProgressContainer}>
                    <View style={styles.overallProgressBar}>
                      <View
                        style={[
                          styles.overallProgressFill,
                          {
                            width: `${studentInfo.examInfo.percentage}%`,
                            backgroundColor: getPerformanceColor(studentInfo.examInfo.percentage),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText} allowFontScaling={false}>
                      {studentInfo.examInfo.obtainedMarks} / {studentInfo.examInfo.maxMarks}
                    </Text>
                  </View>
                </View>

                {/* Subject-wise Marks */}
                <View style={styles.subjectsContainer}>
                  <Text style={styles.subjectsTitle} allowFontScaling={false}>
                    Subject-wise Performance
                  </Text>
                  <FlatList
                    data={examMarks}
                    renderItem={({ item }) => <SubjectCard subject={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon} allowFontScaling={false}>
                  📊
                </Text>
                <Text style={styles.noDataTitle} allowFontScaling={false}>
                  No Marks Found
                </Text>
                <Text style={styles.noDataText} allowFontScaling={false}>
                  No exam marks available for the selected criteria.
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
                Please select Class, Section, Student, and Exam to view marks.
              </Text>

              <View style={styles.progressIndicator}>
                <View style={styles.progressSteps}>
                  <View style={[styles.progressStep, selectedClass && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedClass && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      1
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedSection && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedSection && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      2
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedStudent && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedStudent && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      3
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedExam && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedExam && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      4
                    </Text>
                  </View>
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Class
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Section
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Student
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Exam
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
  content: {
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
    width: 240,
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
  resultsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  studentInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  studentClass: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  rollNumber: {
    fontSize: 12,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  overallGradeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  overallGradeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  examDate: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  overallProgressContainer: {
    alignItems: "center",
  },
  overallProgressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    marginBottom: 8,
  },
  overallProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  subjectsContainer: {
    marginTop: 8,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  separator: {
    height: 12,
  },
  subjectCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth:1,
    borderColor:'#00000020'
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  teacherName: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  marksContainer: {
    marginBottom: 12,
  },
  marksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marksItem: {
    flex: 1,
    alignItems: "center",
  },
  marksLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  marksValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  marksDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  remarksContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 8,
    borderRadius: 6,
  },
  remarksText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default ExamMarks;
