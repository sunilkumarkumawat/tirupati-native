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

const TeacherComment = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false)
  const [comments, setComments] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)
  const [newComment, setNewComment] = useState("")
  const [showAddComment, setShowAddComment] = useState(false)

  // Sample data
  const classes = ["9th", "10th", "11th", "12th"]
  const sections = ["A", "B", "C", "D"]
  const students = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Arjun Gupta"]
  const subjects = ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Physics", "Chemistry"]

  // Sample teacher comments data
  const teacherCommentsData = {
    "10th-A-Rahul Sharma-Mathematics": {
      studentInfo: {
        name: "Rahul Sharma",
        rollNo: "2024001",
        class: "10th",
        section: "A",
        fatherName: "Mr. Suresh Sharma",
        admissionNo: "ADM/2024/001",
        profileImage: null,
      },
      subjectInfo: {
        subject: "Mathematics",
        teacher: "Mr. Rajesh Sharma",
        teacherId: "T001",
      },
      comments: [
        {
          id: 1,
          date: "2024-02-15",
          time: "10:30 AM",
          type: "Academic",
          priority: "High",
          comment:
            "Rahul shows excellent problem-solving skills in algebra. He consistently scores above 90% in tests and helps other students during group activities.",
          teacher: "Mr. Rajesh Sharma",
          status: "Active",
        },
        {
          id: 2,
          date: "2024-02-10",
          time: "02:15 PM",
          type: "Behavior",
          priority: "Medium",
          comment:
            "Very attentive in class and asks thoughtful questions. Shows leadership qualities during group discussions.",
          teacher: "Mr. Rajesh Sharma",
          status: "Active",
        },
        {
          id: 3,
          date: "2024-02-05",
          time: "11:45 AM",
          type: "Assignment",
          priority: "Low",
          comment:
            "Submitted geometry assignment on time with neat presentation. All solutions are correct with proper working shown.",
          teacher: "Mr. Rajesh Sharma",
          status: "Active",
        },
        {
          id: 4,
          date: "2024-01-28",
          time: "09:20 AM",
          type: "Improvement",
          priority: "Medium",
          comment:
            "Needs to work on speed in solving trigonometry problems. Accuracy is good but time management can be improved.",
          teacher: "Mr. Rajesh Sharma",
          status: "Active",
        },
      ],
    },
  }

  useEffect(() => {
    loadComments()
  }, [selectedClass, selectedSection, selectedStudent, selectedSubject])

  const loadComments = () => {
    if (selectedClass && selectedSection && selectedStudent && selectedSubject) {
      const key = `${selectedClass}-${selectedSection}-${selectedStudent}-${selectedSubject}`
      const data = teacherCommentsData[key]
      if (data) {
        setComments(data.comments)
        setStudentInfo(data)
      } else {
        setComments([])
        setStudentInfo(null)
      }
    } else {
      setComments([])
      setStudentInfo(null)
    }
  }

  const closeAllDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
    setShowStudentDropdown(false)
    setShowSubjectDropdown(false)
  }

  const getCommentTypeColor = (type) => {
    const colors = {
      Academic: "#10b981",
      Behavior: "#3b82f6",
      Assignment: "#f59e0b",
      Improvement: "#ef4444",
      Achievement: "#8b5cf6",
      Attendance: "#06b6d4",
    }
    return colors[type] || "#6b7280"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      High: "#ef4444",
      Medium: "#f59e0b",
      Low: "#10b981",
    }
    return colors[priority] || "#6b7280"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: "2-digit", month: "short", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        type: "Academic",
        priority: "Medium",
        comment: newComment.trim(),
        teacher: studentInfo?.subjectInfo?.teacher || "Teacher",
        status: "Active",
      }
      setComments([comment, ...comments])
      setNewComment("")
      setShowAddComment(false)
      Alert.alert("Success", "Comment added successfully!")
    }
  }

  const CommentCard = ({ comment }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.commentMeta}>
          <View style={styles.commentDate}>
            <Icon name="calendar" size={14} color="#6b7280" />
            <Text style={styles.dateText} allowFontScaling={false}>
              {formatDate(comment.date)}
            </Text>
            <Text style={styles.timeText} allowFontScaling={false}>
              {comment.time}
            </Text>
          </View>
          <View style={styles.commentBadges}>
            <View style={[styles.typeBadge, { backgroundColor: getCommentTypeColor(comment.type) }]}>
              <Text style={styles.badgeText} allowFontScaling={false}>
                {comment.type}
              </Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(comment.priority) }]}>
              <Text style={styles.badgeText} allowFontScaling={false}>
                {comment.priority}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.commentContent}>
        <Text style={styles.commentText} allowFontScaling={false}>
          {comment.comment}
        </Text>
      </View>

      <View style={styles.commentFooter}>
        <View style={styles.teacherInfo}>
          <Icon name="account-tie" size={16} color="#6b7280" />
          <Text style={styles.teacherName} allowFontScaling={false}>
            {comment.teacher}
          </Text>
        </View>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="pencil" size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-variant" size={16} color="#6b7280" />
          </TouchableOpacity>
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

  const allOptionsSelected = selectedClass && selectedSection && selectedStudent && selectedSubject

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Teacher Comments
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          View and manage student feedback
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
                setShowSubjectDropdown(false)
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
                setShowSubjectDropdown(false)
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
                setShowSubjectDropdown(false)
              }}
              onSelect={(student) => {
                setSelectedStudent(student)
                setShowStudentDropdown(false)
              }}
              placeholder="Select Student"
            />
            <DropdownComponent
              label="Subject"
              value={selectedSubject}
              options={subjects}
              isOpen={showSubjectDropdown}
              onToggle={() => {
                setShowSubjectDropdown(!showSubjectDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
              }}
              onSelect={(subject) => {
                setSelectedSubject(subject)
                setShowSubjectDropdown(false)
              }}
              placeholder="Select Subject"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {allOptionsSelected ? (
            studentInfo ? (
              <View style={styles.commentsContainer}>
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
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName} allowFontScaling={false}>
                        {studentInfo.subjectInfo.subject}
                      </Text>
                      <Text style={styles.teacherNameSmall} allowFontScaling={false}>
                        {studentInfo.subjectInfo.teacher}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Add Comment Button */}
                <TouchableOpacity style={styles.addCommentButton} onPress={() => setShowAddComment(!showAddComment)}>
                  <Icon name="plus-circle" size={20} color="#ffffff" />
                  <Text style={styles.addCommentText} allowFontScaling={false}>
                    Add New Comment
                  </Text>
                </TouchableOpacity>

                {/* Add Comment Form */}
                {showAddComment && (
                  <View style={styles.addCommentForm}>
                    <Text style={styles.formTitle} allowFontScaling={false}>
                      Add New Comment
                    </Text>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Enter your comment here..."
                      value={newComment}
                      onChangeText={setNewComment}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      allowFontScaling={false}
                    />
                    <View style={styles.formActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setShowAddComment(false)
                          setNewComment("")
                        }}
                      >
                        <Text style={styles.cancelButtonText} allowFontScaling={false}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
                        <Text style={styles.submitButtonText} allowFontScaling={false}>
                          Add Comment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Comments Summary */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle} allowFontScaling={false}>
                      Comments Summary
                    </Text>
                    <Text style={styles.totalComments} allowFontScaling={false}>
                      {comments.length} Total
                    </Text>
                  </View>
                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {comments.filter((c) => c.type === "Academic").length}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Academic
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {comments.filter((c) => c.type === "Behavior").length}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Behavior
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {comments.filter((c) => c.priority === "High").length}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        High Priority
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Comments List */}
                <View style={styles.commentsListContainer}>
                  <Text style={styles.commentsListTitle} allowFontScaling={false}>
                    Recent Comments
                  </Text>
                  <FlatList
                    data={comments}
                    renderItem={({ item }) => <CommentCard comment={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon} allowFontScaling={false}>
                  💬
                </Text>
                <Text style={styles.noDataTitle} allowFontScaling={false}>
                  No Comments Found
                </Text>
                <Text style={styles.noDataText} allowFontScaling={false}>
                  No teacher comments available for the selected criteria.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon} allowFontScaling={false}>
                📝
              </Text>
              <Text style={styles.emptyTitle} allowFontScaling={false}>
                Select All Filters
              </Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                Please select Class, Section, Student, and Subject to view comments.
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
                  <View style={[styles.progressStep, selectedSubject && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedSubject && styles.progressStepTextActive]}
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
                    Subject
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
  commentsContainer: {
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
  subjectInfo: {
    alignItems: "flex-end",
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  teacherNameSmall: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  addCommentButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  addCommentText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  addCommentForm: {
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
  commentInput: {
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
    backgroundColor: "#10b981",
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
  totalComments: {
    fontSize: 12,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  commentsListContainer: {
    marginTop: 8,
  },
  commentsListTitle: {
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
  commentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
    borderWidth:1,
    borderColor:'#00000020'
  },
  commentHeader: {
    marginBottom: 12,
  },
  commentMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  commentDate: {
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
  commentBadges: {
    flexDirection: "row",
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityBadge: {
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
  commentContent: {
    marginBottom: 12,
  },
  commentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teacherInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  teacherName: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  commentActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#f9fafb",
  },
})

export default TeacherComment;
