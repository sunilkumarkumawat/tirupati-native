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

const CoCurricularGrade = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const [showTermDropdown, setShowTermDropdown] = useState(false)
  const [coCurricularData, setCoCurricularData] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)

  // Sample data
  const classes = ["9th", "10th", "11th", "12th"]
  const sections = ["A", "B", "C", "D"]
  const students = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Arjun Gupta"]
  const terms = ["First Term", "Second Term", "Third Term", "Annual"]

  // Sample co-curricular data
  const coCurricularGradeData = {
    "10th-A-Rahul Sharma-First Term": {
      studentInfo: {
        name: "Rahul Sharma",
        rollNo: "2024001",
        class: "10th",
        section: "A",
        fatherName: "Mr. Suresh Sharma",
        admissionNo: "ADM/2024/001",
      },
      termInfo: {
        term: "First Term",
        academicYear: "2024-25",
        evaluationDate: "15-03-2024",
        overallGrade: "A",
        totalActivities: 8,
        excellentCount: 5,
        goodCount: 2,
        satisfactoryCount: 1,
      },
      activities: [
        {
          id: 1,
          category: "Sports & Games",
          activity: "Football",
          grade: "A",
          points: 9,
          maxPoints: 10,
          teacher: "Mr. Sports Coach",
          remarks: "Excellent team player with good leadership skills",
          participation: "Regular",
          achievement: "School Team Captain",
        },
        {
          id: 2,
          category: "Cultural Activities",
          activity: "Music - Vocal",
          grade: "A+",
          points: 10,
          maxPoints: 10,
          teacher: "Ms. Music Teacher",
          remarks: "Outstanding vocal performance in annual function",
          participation: "Active",
          achievement: "First Prize in Inter-School Competition",
        },
        {
          id: 3,
          category: "Literary Activities",
          activity: "Debate",
          grade: "A",
          points: 8,
          maxPoints: 10,
          teacher: "Mr. English Teacher",
          remarks: "Good speaking skills and logical arguments",
          participation: "Regular",
          achievement: "Participated in District Level",
        },
        {
          id: 4,
          category: "Art & Craft",
          activity: "Drawing & Painting",
          grade: "B+",
          points: 7,
          maxPoints: 10,
          teacher: "Ms. Art Teacher",
          remarks: "Shows creativity but needs more practice",
          participation: "Regular",
          achievement: "Class Exhibition",
        },
        {
          id: 5,
          category: "Social Service",
          activity: "Community Service",
          grade: "A",
          points: 9,
          maxPoints: 10,
          teacher: "Ms. Social Studies",
          remarks: "Actively participates in social awareness programs",
          participation: "Active",
          achievement: "Volunteer Certificate",
        },
        {
          id: 6,
          category: "Science Activities",
          activity: "Science Fair",
          grade: "A+",
          points: 10,
          maxPoints: 10,
          teacher: "Mr. Science Teacher",
          remarks: "Innovative project on renewable energy",
          participation: "Active",
          achievement: "Best Project Award",
        },
        {
          id: 7,
          category: "Leadership",
          activity: "Class Monitor",
          grade: "A",
          points: 8,
          maxPoints: 10,
          teacher: "Class Teacher",
          remarks: "Good leadership and organizational skills",
          participation: "Regular",
          achievement: "Student Council Member",
        },
        {
          id: 8,
          category: "Technology",
          activity: "Computer Programming",
          grade: "B+",
          points: 7,
          maxPoints: 10,
          teacher: "Mr. Computer Teacher",
          remarks: "Good understanding but needs more practice",
          participation: "Regular",
          achievement: "Coding Competition Participant",
        },
      ],
    },
  }

  useEffect(() => {
    loadCoCurricularData()
  }, [selectedClass, selectedSection, selectedStudent, selectedTerm])

  const loadCoCurricularData = () => {
    if (selectedClass && selectedSection && selectedStudent && selectedTerm) {
      const key = `${selectedClass}-${selectedSection}-${selectedStudent}-${selectedTerm}`
      const data = coCurricularGradeData[key]
      if (data) {
        setCoCurricularData(data.activities)
        setStudentInfo(data)
      } else {
        setCoCurricularData([])
        setStudentInfo(null)
      }
    } else {
      setCoCurricularData([])
      setStudentInfo(null)
    }
  }

  const closeAllDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
    setShowStudentDropdown(false)
    setShowTermDropdown(false)
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

  const getCategoryIcon = (category) => {
    const icons = {
      "Sports & Games": "soccer",
      "Cultural Activities": "music",
      "Literary Activities": "book-open-variant",
      "Art & Craft": "palette",
      "Social Service": "hand-heart",
      "Science Activities": "flask",
      Leadership: "account-star",
      Technology: "laptop",
    }
    return icons[category] || "star"
  }

  const getCategoryColor = (category) => {
    const colors = {
      "Sports & Games": "#ef4444",
      "Cultural Activities": "#8b5cf6",
      "Literary Activities": "#3b82f6",
      "Art & Craft": "#f59e0b",
      "Social Service": "#10b981",
      "Science Activities": "#06b6d4",
      Leadership: "#f97316",
      Technology: "#6366f1",
    }
    return colors[category] || "#6b7280"
  }

  const ActivityCard = ({ activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <View style={styles.activityInfo}>
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(activity.category) }]}>
              <Icon name={getCategoryIcon(activity.category)} size={16} color="#ffffff" />
            </View>
            <View style={styles.categoryText}>
              <Text style={styles.categoryName} allowFontScaling={false}>
                {activity.category}
              </Text>
              <Text style={styles.activityName} allowFontScaling={false}>
                {activity.activity}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(activity.grade) }]}>
          <Text style={styles.gradeText} allowFontScaling={false}>
            {activity.grade}
          </Text>
        </View>
      </View>

      <View style={styles.activityDetails}>
        <View style={styles.pointsContainer}>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel} allowFontScaling={false}>
              POINTS EARNED
            </Text>
            <Text style={styles.pointsValue} allowFontScaling={false}>
              {activity.points} / {activity.maxPoints}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(activity.points / activity.maxPoints) * 100}%`,
                    backgroundColor: getGradeColor(activity.grade),
                  },
                ]}
              />
            </View>
            <Text style={styles.percentageText} allowFontScaling={false}>
              {Math.round((activity.points / activity.maxPoints) * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="account-tie" size={14} color="#6b7280" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                TEACHER
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {activity.teacher}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-check" size={14} color="#6b7280" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                PARTICIPATION
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {activity.participation}
              </Text>
            </View>
          </View>
        </View>

        {activity.achievement && (
          <View style={styles.achievementContainer}>
            <Icon name="trophy" size={14} color="#f59e0b" />
            <Text style={styles.achievementText} allowFontScaling={false}>
              {activity.achievement}
            </Text>
          </View>
        )}

        <View style={styles.remarksContainer}>
          <Icon name="comment-text-outline" size={14} color="#6b7280" />
          <Text style={styles.remarksText} allowFontScaling={false}>
            {activity.remarks}
          </Text>
        </View>
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

  const allOptionsSelected = selectedClass && selectedSection && selectedStudent && selectedTerm

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Co-Curricular Grades
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          View student co-curricular activities performance
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
                setShowTermDropdown(false)
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
                setShowTermDropdown(false)
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
                setShowTermDropdown(false)
              }}
              onSelect={(student) => {
                setSelectedStudent(student)
                setShowStudentDropdown(false)
              }}
              placeholder="Select Student"
            />
            <DropdownComponent
              label="Term"
              value={selectedTerm}
              options={terms}
              isOpen={showTermDropdown}
              onToggle={() => {
                setShowTermDropdown(!showTermDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
              }}
              onSelect={(term) => {
                setSelectedTerm(term)
                setShowTermDropdown(false)
              }}
              placeholder="Select Term"
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
                      style={[
                        styles.overallGradeBadge,
                        { backgroundColor: getGradeColor(studentInfo.termInfo.overallGrade) },
                      ]}
                    >
                      <Text style={styles.overallGradeText} allowFontScaling={false}>
                        {studentInfo.termInfo.overallGrade}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Term Summary Card */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle} allowFontScaling={false}>
                      {studentInfo.termInfo.term} Performance
                    </Text>
                    <Text style={styles.evaluationDate} allowFontScaling={false}>
                      {studentInfo.termInfo.evaluationDate}
                    </Text>
                  </View>

                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {studentInfo.termInfo.totalActivities}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Total Activities
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: "#10b981" }]} allowFontScaling={false}>
                        {studentInfo.termInfo.excellentCount}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Excellent (A+/A)
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: "#3b82f6" }]} allowFontScaling={false}>
                        {studentInfo.termInfo.goodCount}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Good (B+/B)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.performanceIndicator}>
                    <Text style={styles.performanceLabel} allowFontScaling={false}>
                      Overall Performance
                    </Text>
                    <View style={styles.performanceBar}>
                      <View
                        style={[
                          styles.performanceFill,
                          {
                            width: `${(studentInfo.termInfo.excellentCount / studentInfo.termInfo.totalActivities) * 100}%`,
                            backgroundColor: "#10b981",
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Activities List */}
                <View style={styles.activitiesContainer}>
                  <Text style={styles.activitiesTitle} allowFontScaling={false}>
                    Activity-wise Performance
                  </Text>
                  <FlatList
                    data={coCurricularData}
                    renderItem={({ item }) => <ActivityCard activity={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon} allowFontScaling={false}>
                  🎭
                </Text>
                <Text style={styles.noDataTitle} allowFontScaling={false}>
                  No Co-Curricular Data Found
                </Text>
                <Text style={styles.noDataText} allowFontScaling={false}>
                  No co-curricular activities data available for the selected criteria.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon} allowFontScaling={false}>
                🎨
              </Text>
              <Text style={styles.emptyTitle} allowFontScaling={false}>
                Select All Filters
              </Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                Please select Class, Section, Student, and Term to view co-curricular grades.
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
                  <View style={[styles.progressStep, selectedTerm && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedTerm && styles.progressStepTextActive]}
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
                    Term
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
  evaluationDate: {
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
  performanceIndicator: {
    alignItems: "center",
  },
  performanceLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  performanceBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  performanceFill: {
    height: "100%",
    borderRadius: 4,
  },
  activitiesContainer: {
    marginTop: 8,
  },
  activitiesTitle: {
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
  activityCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth:1,
    borderColor:'#00000020'
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  activityInfo: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  activityName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
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
  activityDetails: {
    gap: 12,
  },
  pointsContainer: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  pointsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pointsLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  achievementContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 6,
  },
  achievementText: {
    fontSize: 12,
    color: "#92400e",
    marginLeft: 6,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  remarksContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8f9fb",
    padding: 8,
    borderRadius: 6,
  },
  remarksText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default CoCurricularGrade;
