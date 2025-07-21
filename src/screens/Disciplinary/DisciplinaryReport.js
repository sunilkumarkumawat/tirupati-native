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
  Alert,
} from "react-native"

const { width } = Dimensions.get("window")

const DisciplinaryReport = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const [disciplinaryData, setDisciplinaryData] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [showAddIncident, setShowAddIncident] = useState(false)
  const [newIncident, setNewIncident] = useState("")

  // Sample data
  const classes = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"]
  const sections = ["A", "B", "C", "D"]
  const students = ["Rohit Sharma", "Ananya Patel", "Vikash Kumar", "Priya Singh", "Arjun Gupta"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Sample disciplinary data
  const disciplinaryReportData = {
    "8th-A-Rohit Sharma-March": {
      studentInfo: {
        name: "Rohit Sharma",
        rollNo: "2024001",
        class: "8th",
        section: "A",
        fatherName: "Mr. Rajesh Sharma",
        motherName: "Mrs. Sunita Sharma",
        admissionNo: "SCH/2024/001",
        guardianPhone: "+91 9876543210",
      },
      monthInfo: {
        month: "March",
        academicYear: "2024-25",
        totalIncidents: 3,
        resolvedIncidents: 2,
        pendingIncidents: 1,
        behaviorScore: 6.5,
        maxBehaviorScore: 10,
        improvementNeeded: true,
      },
      incidents: [
        {
          id: 1,
          date: "2024-03-15",
          time: "10:30 AM",
          type: "Behavioral",
          severity: "Medium",
          category: "Classroom Disruption",
          description:
            "Talking loudly during class and disturbing other students while teacher was explaining mathematics concepts.",
          location: "Classroom 8A",
          reportedBy: "Ms. Mathematics Teacher",
          witnessedBy: ["John Doe", "Jane Smith"],
          actionTaken: "Verbal Warning",
          status: "Resolved",
          followUpDate: "2024-03-20",
          parentNotified: true,
          counselingRequired: false,
        },
        {
          id: 2,
          date: "2024-03-22",
          time: "02:15 PM",
          type: "Academic",
          severity: "Low",
          category: "Assignment Issues",
          description:
            "Failed to submit homework for three consecutive days without valid reason. Shows lack of responsibility.",
          location: "Classroom 8A",
          reportedBy: "Mr. English Teacher",
          witnessedBy: [],
          actionTaken: "Extra Assignment",
          status: "Resolved",
          followUpDate: "2024-03-25",
          parentNotified: true,
          counselingRequired: false,
        },
        {
          id: 3,
          date: "2024-03-28",
          time: "11:45 AM",
          type: "Behavioral",
          severity: "High",
          category: "Aggressive Behavior",
          description:
            "Got into an argument with classmate during lunch break. Raised voice and showed aggressive body language.",
          location: "School Cafeteria",
          reportedBy: "Lunch Supervisor",
          witnessedBy: ["Cafeteria Staff", "Other Students"],
          actionTaken: "Detention",
          status: "Under Review",
          followUpDate: "2024-04-02",
          parentNotified: true,
          counselingRequired: true,
        },
      ],
      behavioralAssessment: [
        {
          aspect: "Respect for Teachers",
          score: 7,
          maxScore: 10,
          remarks: "Generally respectful but occasional lapses",
        },
        { aspect: "Peer Interaction", score: 6, maxScore: 10, remarks: "Needs improvement in conflict resolution" },
        { aspect: "Following Rules", score: 6, maxScore: 10, remarks: "Sometimes ignores classroom rules" },
        { aspect: "Academic Responsibility", score: 7, maxScore: 10, remarks: "Good potential but inconsistent" },
        { aspect: "Self-Control", score: 5, maxScore: 10, remarks: "Struggles with emotional regulation" },
      ],
      recommendedActions: [
        "Regular counseling sessions with school counselor",
        "Anger management workshops",
        "Peer mediation training",
        "Parent-teacher conference scheduled",
        "Behavioral contract implementation",
      ],
      counselorRemarks:
        "Rohit shows good academic potential but needs support in developing better social skills and emotional regulation. Regular counseling sessions recommended.",
      principalRemarks:
        "Student requires close monitoring and structured support system. Parents' cooperation is essential for improvement.",
    },
  }

  useEffect(() => {
    loadDisciplinaryData()
  }, [selectedClass, selectedSection, selectedStudent, selectedMonth])

  const loadDisciplinaryData = () => {
    if (selectedClass && selectedSection && selectedStudent && selectedMonth) {
      const key = `${selectedClass}-${selectedSection}-${selectedStudent}-${selectedMonth}`
      const data = disciplinaryReportData[key]
      if (data) {
        setDisciplinaryData(data.incidents)
        setStudentInfo(data)
      } else {
        setDisciplinaryData([])
        setStudentInfo(null)
      }
    } else {
      setDisciplinaryData([])
      setStudentInfo(null)
    }
  }

  const closeAllDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
    setShowStudentDropdown(false)
    setShowMonthDropdown(false)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      Low: "#10b981",
      Medium: "#f59e0b",
      High: "#ef4444",
      Critical: "#dc2626",
    }
    return colors[severity] || "#6b7280"
  }

  const getTypeColor = (type) => {
    const colors = {
      Behavioral: "#8b5cf6",
      Academic: "#3b82f6",
      Attendance: "#06b6d4",
      Safety: "#ef4444",
      Property: "#f97316",
    }
    return colors[type] || "#6b7280"
  }

  const getStatusColor = (status) => {
    const colors = {
      Resolved: "#10b981",
      "Under Review": "#f59e0b",
      Pending: "#ef4444",
      Escalated: "#dc2626",
    }
    return colors[status] || "#6b7280"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: "2-digit", month: "short", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const handleAddIncident = () => {
    if (newIncident.trim()) {
      const incident = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        type: "Behavioral",
        severity: "Medium",
        category: "General",
        description: newIncident.trim(),
        location: "School Premises",
        reportedBy: "Teacher",
        witnessedBy: [],
        actionTaken: "Under Review",
        status: "Pending",
        followUpDate: "",
        parentNotified: false,
        counselingRequired: false,
      }
      setDisciplinaryData([incident, ...disciplinaryData])
      setNewIncident("")
      setShowAddIncident(false)
      Alert.alert("Success", "Incident reported successfully!")
    }
  }

  const IncidentCard = ({ incident }) => (
    <View style={styles.incidentCard}>
      <View style={styles.incidentHeader}>
        <View style={styles.incidentMeta}>
          <View style={styles.incidentDate}>
            <Icon name="calendar" size={14} color="#6b7280" />
            <Text style={styles.dateText} allowFontScaling={false}>
              {formatDate(incident.date)}
            </Text>
            <Text style={styles.timeText} allowFontScaling={false}>
              {incident.time}
            </Text>
          </View>
          <View style={styles.incidentBadges}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(incident.type) }]}>
              <Text style={styles.badgeText} allowFontScaling={false}>
                {incident.type}
              </Text>
            </View>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incident.severity) }]}>
              <Text style={styles.badgeText} allowFontScaling={false}>
                {incident.severity}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.incidentContent}>
        <Text style={styles.categoryText} allowFontScaling={false}>
          {incident.category}
        </Text>
        <Text style={styles.descriptionText} allowFontScaling={false}>
          {incident.description}
        </Text>
      </View>

      <View style={styles.incidentDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="map-marker" size={12} color="#6b7280" />
            <Text style={styles.detailText} allowFontScaling={false}>
              {incident.location}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="account" size={12} color="#6b7280" />
            <Text style={styles.detailText} allowFontScaling={false}>
              {incident.reportedBy}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.incidentFooter}>
        <View style={styles.actionInfo}>
          <Text style={styles.actionLabel} allowFontScaling={false}>
            Action Taken:
          </Text>
          <Text style={styles.actionText} allowFontScaling={false}>
            {incident.actionTaken}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(incident.status) }]}>
          <Text style={styles.statusText} allowFontScaling={false}>
            {incident.status}
          </Text>
        </View>
      </View>

      {incident.parentNotified && (
        <View style={styles.notificationBanner}>
          <Icon name="phone" size={12} color="#10b981" />
          <Text style={styles.notificationText} allowFontScaling={false}>
            Parents Notified
          </Text>
        </View>
      )}
    </View>
  )

  const BehavioralAssessmentCard = ({ assessment }) => (
    <View style={styles.assessmentCard}>
      <View style={styles.assessmentHeader}>
        <Icon name="chart-line" size={18} color="#6366f1" />
        <Text style={styles.assessmentTitle} allowFontScaling={false}>
          Behavioral Assessment
        </Text>
      </View>
      <View style={styles.assessmentGrid}>
        {assessment.map((item, index) => (
          <View key={index} style={styles.assessmentItem}>
            <View style={styles.assessmentItemHeader}>
              <Text style={styles.aspectName} allowFontScaling={false}>
                {item.aspect}
              </Text>
              <Text style={styles.scoreText} allowFontScaling={false}>
                {item.score}/{item.maxScore}
              </Text>
            </View>
            <View style={styles.scoreBarContainer}>
              <View style={styles.scoreBar}>
                <View
                  style={[
                    styles.scoreFill,
                    {
                      width: `${(item.score / item.maxScore) * 100}%`,
                      backgroundColor: item.score >= 7 ? "#10b981" : item.score >= 5 ? "#f59e0b" : "#ef4444",
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.assessmentRemarks} allowFontScaling={false}>
              {item.remarks}
            </Text>
          </View>
        ))}
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

  const allOptionsSelected = selectedClass && selectedSection && selectedStudent && selectedMonth

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Disciplinary Report
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Track student behavior and disciplinary actions
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
                setShowMonthDropdown(false)
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
                setShowMonthDropdown(false)
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
                setShowMonthDropdown(false)
              }}
              onSelect={(student) => {
                setSelectedStudent(student)
                setShowStudentDropdown(false)
              }}
              placeholder="Select Student"
            />
            <DropdownComponent
              label="Month"
              value={selectedMonth}
              options={months}
              isOpen={showMonthDropdown}
              onToggle={() => {
                setShowMonthDropdown(!showMonthDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
              }}
              onSelect={(month) => {
                setSelectedMonth(month)
                setShowMonthDropdown(false)
              }}
              placeholder="Select Month"
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
                      <Text style={styles.guardianInfo} allowFontScaling={false}>
                        Guardian: {studentInfo.studentInfo.guardianPhone}
                      </Text>
                    </View>
                    <View style={styles.behaviorScoreContainer}>
                      <Text style={styles.behaviorScoreLabel} allowFontScaling={false}>
                        Behavior Score
                      </Text>
                      <Text
                        style={[
                          styles.behaviorScoreValue,
                          {
                            color:
                              studentInfo.monthInfo.behaviorScore >= 8
                                ? "#10b981"
                                : studentInfo.monthInfo.behaviorScore >= 6
                                  ? "#f59e0b"
                                  : "#ef4444",
                          },
                        ]}
                        allowFontScaling={false}
                      >
                        {studentInfo.monthInfo.behaviorScore}/10
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Monthly Summary Card */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle} allowFontScaling={false}>
                      {studentInfo.monthInfo.month} Summary
                    </Text>
                    {studentInfo.monthInfo.improvementNeeded && (
                      <View style={styles.warningBadge}>
                        <Icon name="alert" size={12} color="#ffffff" />
                        <Text style={styles.warningText} allowFontScaling={false}>
                          Needs Attention
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {studentInfo.monthInfo.totalIncidents}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Total Incidents
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: "#10b981" }]} allowFontScaling={false}>
                        {studentInfo.monthInfo.resolvedIncidents}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Resolved
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: "#ef4444" }]} allowFontScaling={false}>
                        {studentInfo.monthInfo.pendingIncidents}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Pending
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Add Incident Button */}
                <TouchableOpacity style={styles.addIncidentButton} onPress={() => setShowAddIncident(!showAddIncident)}>
                  <Icon name="plus-circle" size={18} color="#ffffff" />
                  <Text style={styles.addIncidentText} allowFontScaling={false}>
                    Report New Incident
                  </Text>
                </TouchableOpacity>

                {/* Add Incident Form */}
                {showAddIncident && (
                  <View style={styles.addIncidentForm}>
                    <Text style={styles.formTitle} allowFontScaling={false}>
                      Report New Incident
                    </Text>
                    <TextInput
                      style={styles.incidentInput}
                      placeholder="Describe the incident in detail..."
                      value={newIncident}
                      onChangeText={setNewIncident}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      allowFontScaling={false}
                    />
                    <View style={styles.formActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setShowAddIncident(false)
                          setNewIncident("")
                        }}
                      >
                        <Text style={styles.cancelButtonText} allowFontScaling={false}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.submitButton} onPress={handleAddIncident}>
                        <Text style={styles.submitButtonText} allowFontScaling={false}>
                          Report Incident
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Behavioral Assessment */}
                {studentInfo.behavioralAssessment && (
                  <BehavioralAssessmentCard assessment={studentInfo.behavioralAssessment} />
                )}

                {/* Incidents List */}
                <View style={styles.incidentsContainer}>
                  <Text style={styles.incidentsTitle} allowFontScaling={false}>
                    Incident Reports
                  </Text>
                  <FlatList
                    data={disciplinaryData}
                    renderItem={({ item }) => <IncidentCard incident={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>

                {/* Recommended Actions */}
                {studentInfo.recommendedActions && (
                  <View style={styles.actionsCard}>
                    <View style={styles.actionsHeader}>
                      <Icon name="lightbulb-on" size={18} color="#f59e0b" />
                      <Text style={styles.actionsTitle} allowFontScaling={false}>
                        Recommended Actions
                      </Text>
                    </View>
                    <View style={styles.actionsList}>
                      {studentInfo.recommendedActions.map((action, index) => (
                        <View key={index} style={styles.actionItem}>
                          <Icon name="check-circle" size={14} color="#10b981" />
                          <Text style={styles.actionText} allowFontScaling={false}>
                            {action}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Counselor & Principal Remarks */}
                <View style={styles.remarksSection}>
                  <View style={styles.counselorRemarksCard}>
                    <View style={styles.remarksHeader}>
                      <Icon name="account-heart" size={16} color="#8b5cf6" />
                      <Text style={styles.remarksHeaderText} allowFontScaling={false}>
                        Counselor's Assessment
                      </Text>
                    </View>
                    <Text style={styles.remarksContent} allowFontScaling={false}>
                      {studentInfo.counselorRemarks}
                    </Text>
                  </View>

                  <View style={styles.principalRemarksCard}>
                    <View style={styles.remarksHeader}>
                      <Icon name="school" size={16} color="#ef4444" />
                      <Text style={styles.remarksHeaderText} allowFontScaling={false}>
                        Principal's Remarks
                      </Text>
                    </View>
                    <Text style={styles.remarksContent} allowFontScaling={false}>
                      {studentInfo.principalRemarks}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon} allowFontScaling={false}>
                  📋
                </Text>
                <Text style={styles.noDataTitle} allowFontScaling={false}>
                  No Disciplinary Records Found
                </Text>
                <Text style={styles.noDataText} allowFontScaling={false}>
                  No disciplinary incidents recorded for the selected criteria.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon} allowFontScaling={false}>
                ⚖️
              </Text>
              <Text style={styles.emptyTitle} allowFontScaling={false}>
                Select All Filters
              </Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                Please select Class, Section, Student, and Month to view disciplinary report.
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
                  <View style={[styles.progressStep, selectedMonth && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedMonth && styles.progressStepTextActive]}
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
                    Month
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
    backgroundColor: "#ef4444",
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
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  guardianInfo: {
    fontSize: 12,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  behaviorScoreContainer: {
    alignItems: "center",
  },
  behaviorScoreLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  behaviorScoreValue: {
    fontSize: 18,
    fontWeight: "bold",
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
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  addIncidentButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#ef4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addIncidentText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  addIncidentForm: {
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
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incidentInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#374151",
    backgroundColor: "#f9fafb",
    minHeight: 100,
    marginBottom: 12,
    includeFontPadding: false,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  submitButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  submitButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  assessmentCard: {
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
  assessmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  assessmentGrid: {
    gap: 12,
  },
  assessmentItem: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  assessmentItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  aspectName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  scoreBarContainer: {
    marginBottom: 8,
  },
  scoreBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
  },
  scoreFill: {
    height: "100%",
    borderRadius: 3,
  },
  assessmentRemarks: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incidentsContainer: {
    marginTop: 8,
  },
  incidentsTitle: {
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
  incidentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    borderWidth:1,
    borderColor:'#00000020'
  },
  incidentHeader: {
    marginBottom: 12,
  },
  incidentMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  incidentDate: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 6,
    marginRight: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incidentBadges: {
    flexDirection: "row",
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incidentContent: {
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  descriptionText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incidentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incidentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  actionText: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  notificationText: {
    fontSize: 11,
    color: "#15803d",
    fontWeight: "500",
    marginLeft: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  actionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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
  actionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  actionsList: {
    gap: 8,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fefce8",
    padding: 10,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 13,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  remarksSection: {
    marginTop: 12,
    gap: 12,
  },
  counselorRemarksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8b5cf6",
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
  principalRemarksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
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
  remarksHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  remarksHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  remarksContent: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default DisciplinaryReport
