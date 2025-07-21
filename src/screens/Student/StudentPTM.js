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
  BackHandler,
} from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';

const StudentPTM = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedPTM, setSelectedPTM] = useState(null)
  const [filteredPTMs, setFilteredPTMs] = useState([])
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 2) {
        setCurrentStep(1)
        setSelectedPTM(null)
        return true
      } else if (currentStep === 1) {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ])
        return true
      }
      return false
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => backHandler.remove()
  }, [currentStep])

  // Sample PTM data
  const ptmMeetings = [
    {
      id: 1,
      studentName: "Aarav Sharma",
      class: "10th",
      section: "A",
      rollNumber: "A001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      parentName: "Rajesh Sharma",
      parentPhone: "+91 98765 43210",
      teacherName: "Mrs. Priya Singh",
      subject: "Mathematics",
      meetingDate: "2025-01-15",
      meetingTime: "10:30 AM",
      duration: "30 minutes",
      purpose: "Academic Performance Discussion",
      status: "Scheduled",
      venue: "Classroom 10A",
      agenda: [
        "Review quarterly exam results",
        "Discuss homework completion",
        "Address learning difficulties in algebra",
        "Set improvement goals for next quarter",
      ],
      studentPerformance: {
        attendance: 92,
        currentGrade: "B+",
        behavior: "Good",
        participation: "Active",
      },
      teacherNotes: "",
      parentConcerns: "Struggling with advanced mathematics concepts",
      actionItems: [],
      scheduledBy: "Class Teacher",
      scheduledDate: "2025-01-08",
    },
    {
      id: 2,
      studentName: "Priya Patel",
      class: "10th",
      section: "B",
      rollNumber: "B015",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      parentName: "Suresh Patel",
      parentPhone: "+91 87654 32109",
      teacherName: "Mr. Amit Kumar",
      subject: "Science",
      meetingDate: "2025-01-12",
      meetingTime: "02:00 PM",
      duration: "30 minutes",
      purpose: "Behavioral Concerns",
      status: "Completed",
      venue: "Principal's Office",
      agenda: [
        "Discuss classroom behavior",
        "Review disciplinary incidents",
        "Create behavior improvement plan",
        "Set monitoring schedule",
      ],
      studentPerformance: {
        attendance: 88,
        currentGrade: "A-",
        behavior: "Needs Improvement",
        participation: "Disruptive",
      },
      teacherNotes: "Student shows improvement after discussion. Parents are cooperative.",
      parentConcerns: "Peer influence affecting behavior",
      actionItems: ["Weekly behavior reports", "Extra counseling sessions", "Parent monitoring at home"],
      scheduledBy: "Principal",
      scheduledDate: "2025-01-05",
    },
    {
      id: 3,
      studentName: "Arjun Singh",
      class: "9th",
      section: "A",
      rollNumber: "A025",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      parentName: "Vikram Singh",
      parentPhone: "+91 76543 21098",
      teacherName: "Ms. Kavya Reddy",
      subject: "English",
      meetingDate: "2025-01-18",
      meetingTime: "11:00 AM",
      duration: "45 minutes",
      purpose: "Academic Excellence Recognition",
      status: "Scheduled",
      venue: "Library Conference Room",
      agenda: [
        "Celebrate academic achievements",
        "Discuss advanced learning opportunities",
        "Plan participation in competitions",
        "Set higher academic goals",
      ],
      studentPerformance: {
        attendance: 98,
        currentGrade: "A+",
        behavior: "Excellent",
        participation: "Outstanding",
      },
      teacherNotes: "",
      parentConcerns: "Wants to ensure continued excellence",
      actionItems: [],
      scheduledBy: "Subject Teacher",
      scheduledDate: "2025-01-10",
    },
    {
      id: 4,
      studentName: "Kavya Reddy",
      class: "11th",
      section: "C",
      rollNumber: "C008",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      parentName: "Ravi Reddy",
      parentPhone: "+91 65432 10987",
      teacherName: "Dr. Rajesh Gupta",
      subject: "Physics",
      meetingDate: "2025-01-10",
      meetingTime: "09:00 AM",
      duration: "30 minutes",
      purpose: "Career Guidance",
      status: "Completed",
      venue: "Career Counseling Room",
      agenda: [
        "Discuss career interests",
        "Review subject choices for 12th grade",
        "Plan entrance exam preparation",
        "Explore scholarship opportunities",
      ],
      studentPerformance: {
        attendance: 95,
        currentGrade: "A",
        behavior: "Excellent",
        participation: "Very Good",
      },
      teacherNotes: "Student is well-prepared for engineering entrance exams. Recommended advanced physics coaching.",
      parentConcerns: "Guidance for engineering entrance preparation",
      actionItems: [
        "Enroll in advanced physics classes",
        "Join entrance exam coaching",
        "Participate in science olympiad",
      ],
      scheduledBy: "Career Counselor",
      scheduledDate: "2025-01-03",
    },
    {
      id: 5,
      studentName: "Rohit Kumar",
      class: "9th",
      section: "B",
      rollNumber: "B012",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      parentName: "Manoj Kumar",
      parentPhone: "+91 54321 09876",
      teacherName: "Mrs. Sunita Sharma",
      subject: "Hindi",
      meetingDate: "2025-01-20",
      meetingTime: "03:30 PM",
      duration: "30 minutes",
      purpose: "Attendance Issues",
      status: "Cancelled",
      venue: "Class Teacher's Office",
      agenda: [
        "Address frequent absences",
        "Understand reasons for poor attendance",
        "Create attendance improvement plan",
        "Discuss impact on academic performance",
      ],
      studentPerformance: {
        attendance: 65,
        currentGrade: "C",
        behavior: "Average",
        participation: "Poor",
      },
      teacherNotes: "",
      parentConcerns: "Family circumstances affecting attendance",
      actionItems: [],
      scheduledBy: "Class Teacher",
      scheduledDate: "2025-01-12",
    },
  ]

  const classes = ["All Classes", "9th", "10th", "11th", "12th"]
  const statusOptions = ["All Status", "Scheduled", "Completed", "Cancelled"]

  useEffect(() => {
    filterPTMs()
  }, [searchKeyword, selectedClass, selectedStatus])

  const filterPTMs = () => {
    let filtered = ptmMeetings

    if (selectedClass !== "All Classes") {
      filtered = filtered.filter((ptm) => ptm.class === selectedClass)
    }

    if (selectedStatus !== "All Status") {
      filtered = filtered.filter((ptm) => ptm.status === selectedStatus)
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((ptm) => {
        return (
          ptm.studentName.toLowerCase().includes(keyword) ||
          ptm.rollNumber.toLowerCase().includes(keyword) ||
          ptm.parentName.toLowerCase().includes(keyword) ||
          ptm.teacherName.toLowerCase().includes(keyword) ||
          ptm.subject.toLowerCase().includes(keyword) ||
          ptm.purpose.toLowerCase().includes(keyword)
        )
      })
    }

    setFilteredPTMs(filtered)
  }

  const handlePTMAction = (ptmId, action) => {
    const ptm = ptmMeetings.find((p) => p.id === ptmId)
    if (!ptm) return

    let actionText = ""
    let confirmText = ""
    switch (action) {
      case "reschedule":
        actionText = "reschedule"
        confirmText = "Reschedule"
        break
      case "cancel":
        actionText = "cancel"
        confirmText = "Cancel"
        break
      case "complete":
        actionText = "mark as completed"
        confirmText = "Complete"
        break
    }

    Alert.alert(`${confirmText} Meeting`, `Are you sure you want to ${actionText} the PTM for ${ptm.studentName}?`, [
      { text: "No", style: "cancel" },
      {
        text: confirmText,
        onPress: () => {
          Alert.alert("Success", `PTM ${actionText}d successfully!`)
        },
      },
    ])
  }

  const handlePTMClick = (ptm) => {
    setSelectedPTM(ptm)
    setCurrentStep(2)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "#6366f1"
      case "Completed":
        return "#10b981"
      case "Cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getPurposeColor = (purpose) => {
    switch (purpose) {
      case "Academic Performance Discussion":
        return "#f59e0b"
      case "Behavioral Concerns":
        return "#ef4444"
      case "Academic Excellence Recognition":
        return "#10b981"
      case "Career Guidance":
        return "#8b5cf6"
      case "Attendance Issues":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const closeDropdowns = () => {
    setShowClassDropdown(false)
    setShowStatusDropdown(false)
  }

  const PTMCard = ({ ptm }) => (
    <TouchableOpacity style={styles.ptmCard} onPress={() => handlePTMClick(ptm)}>
      <View style={styles.ptmHeader}>
        <View style={styles.studentInfo}>
          <Image source={{ uri: ptm.avatar }} style={styles.avatar} />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>
              {ptm.studentName}
            </Text>
            <Text style={styles.classInfo} allowFontScaling={false}>
              {ptm.class} - {ptm.section} • Roll: {ptm.rollNumber}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ptm.status) }]}>
          <Text style={styles.statusText} allowFontScaling={false}>
            {ptm.status}
          </Text>
        </View>
      </View>

      <View style={styles.meetingDetails}>
        <View style={styles.teacherInfo}>
          <Text style={styles.teacherName} allowFontScaling={false}>
            {ptm.teacherName}
          </Text>
          <Text style={styles.subject} allowFontScaling={false}>
            {ptm.subject}
          </Text>
        </View>
        <View style={[styles.purposeBadge, { backgroundColor: getPurposeColor(ptm.purpose) }]}>
          <Text style={styles.purposeText} allowFontScaling={false}>
            {ptm.purpose}
          </Text>
        </View>
      </View>

      <View style={styles.meetingSchedule}>
        <View style={styles.dateTimeInfo}>
          <Text style={styles.dateLabel} allowFontScaling={false}>
            📅 {formatDate(ptm.meetingDate)}
          </Text>
          <Text style={styles.timeLabel} allowFontScaling={false}>
            🕐 {ptm.meetingTime}
          </Text>
        </View>
        <Text style={styles.venue} allowFontScaling={false}>
          📍 {ptm.venue}
        </Text>
      </View>

      <View style={styles.ptmFooter}>
        <Text style={styles.duration} allowFontScaling={false}>
          Duration: {ptm.duration}
        </Text>
        {ptm.status === "Scheduled" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => handlePTMAction(ptm.id, "reschedule")}
            >
              <Text style={styles.actionButtonText} allowFontScaling={false}>
                📅
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handlePTMAction(ptm.id, "complete")}
            >
              <Text style={styles.actionButtonText} allowFontScaling={false}>
                ✓
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handlePTMAction(ptm.id, "cancel")}
            >
              <Text style={styles.actionButtonText} allowFontScaling={false}>
                ✗
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  const renderStep1 = () => (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={closeDropdowns}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Parent-Teacher Meetings
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          {filteredPTMs.length} meetings scheduled
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScrollView}>
          <View style={[styles.summaryCard, styles.scheduledCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {ptmMeetings.filter((p) => p.status === "Scheduled").length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Scheduled
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.completedCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {ptmMeetings.filter((p) => p.status === "Completed").length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Completed
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.cancelledCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {ptmMeetings.filter((p) => p.status === "Cancelled").length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Cancelled
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.totalCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {ptmMeetings.length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Total
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon} allowFontScaling={false}>
            
          </Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student, teacher, subject..."
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

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => {
                setShowClassDropdown(!showClassDropdown)
                setShowStatusDropdown(false)
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
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => {
                setShowStatusDropdown(!showStatusDropdown)
                setShowClassDropdown(false)
              }}
            >
              <Text style={styles.dropdownButtonText} allowFontScaling={false}>
                {selectedStatus}
              </Text>
              <Text style={styles.dropdownArrow} allowFontScaling={false}>
                {showStatusDropdown ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {showStatusDropdown && (
              <View style={styles.dropdownMenu}>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.dropdownMenuItem, selectedStatus === status && styles.dropdownMenuItemActive]}
                    onPress={() => {
                      setSelectedStatus(status)
                      setShowStatusDropdown(false)
                    }}
                  >
                    <Text
                      style={[styles.dropdownMenuText, selectedStatus === status && styles.dropdownMenuTextActive]}
                      allowFontScaling={false}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* PTM List */}
      <View style={styles.ptmsList}>
        {filteredPTMs.map((ptm, index) => (
          <View key={ptm.id}>
            <PTMCard ptm={ptm} />
            {index < filteredPTMs.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
        {filteredPTMs.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText} allowFontScaling={false}>
              No PTM meetings found
            </Text>
            <Text style={styles.emptySubtext} allowFontScaling={false}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )

  const renderStep2 = () => (
    <View style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.backButton}>
          <Text style={styles.backButtonText} allowFontScaling={false}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle} allowFontScaling={false}>
          PTM Details
        </Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {/* Improved Student Info Card */}
        <View style={styles.studentInfoCard}>
          <View style={styles.studentHeaderRow}>
            <View style={styles.studentAvatarContainer}>
              <Image source={{ uri: selectedPTM?.avatar }} style={styles.profileAvatar} />
            </View>
            <View style={styles.studentMainInfo}>
              <Text style={styles.studentNameLarge} allowFontScaling={false}>
                {selectedPTM?.studentName}
              </Text>
              <Text style={styles.studentClass} allowFontScaling={false}>
                Class {selectedPTM?.class} ({selectedPTM?.section})
              </Text>
              <Text style={styles.rollNumber} allowFontScaling={false}>
                Roll No: {selectedPTM?.rollNumber}
              </Text>
            </View>
            <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(selectedPTM?.status) }]}>
              <Text style={styles.statusTextLarge} allowFontScaling={false}>
                {selectedPTM?.status}
              </Text>
            </View>
          </View>

          <View style={styles.parentInfoSection}>
            <Text style={styles.parentInfoTitle} allowFontScaling={false}>
              Parent Information
            </Text>
            <Text style={styles.parentNameLarge} allowFontScaling={false}>
              {selectedPTM?.parentName}
            </Text>
            <Text style={styles.parentPhone} allowFontScaling={false}>
              <Ionicons name='call' size='12' color='black' />  {selectedPTM?.parentPhone}
            </Text>
          </View>
        </View>

        {/* Meeting Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Meeting Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Teacher
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedPTM?.teacherName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Subject
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedPTM?.subject}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Date
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {formatDate(selectedPTM?.meetingDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Time
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedPTM?.meetingTime}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Duration
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedPTM?.duration}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Venue
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedPTM?.venue}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Purpose
            </Text>
            <View style={[styles.purposeBadgeSmall, { backgroundColor: getPurposeColor(selectedPTM?.purpose) }]}>
              <Text style={styles.purposeTextSmall} allowFontScaling={false}>
                {selectedPTM?.purpose}
              </Text>
            </View>
          </View>
        </View>

        {/* Student Performance */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Student Performance
          </Text>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue} allowFontScaling={false}>
                {selectedPTM?.studentPerformance?.attendance}%
              </Text>
              <Text style={styles.performanceLabel} allowFontScaling={false}>
                Attendance
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue} allowFontScaling={false}>
                {selectedPTM?.studentPerformance?.currentGrade}
              </Text>
              <Text style={styles.performanceLabel} allowFontScaling={false}>
                Current Grade
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue} allowFontScaling={false}>
                {selectedPTM?.studentPerformance?.behavior}
              </Text>
              <Text style={styles.performanceLabel} allowFontScaling={false}>
                Behavior
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceValue} allowFontScaling={false}>
                {selectedPTM?.studentPerformance?.participation}
              </Text>
              <Text style={styles.performanceLabel} allowFontScaling={false}>
                Participation
              </Text>
            </View>
          </View>
        </View>

        {/* Meeting Agenda */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Meeting Agenda
          </Text>
          {selectedPTM?.agenda?.map((item, index) => (
            <View key={index} style={styles.agendaItem}>
              <Text style={styles.agendaBullet} allowFontScaling={false}>
                •
              </Text>
              <Text style={styles.agendaText} allowFontScaling={false}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Parent Concerns */}
        {selectedPTM?.parentConcerns && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle} allowFontScaling={false}>
              Parent Concerns
            </Text>
            <Text style={styles.concernsText} allowFontScaling={false}>
              {selectedPTM.parentConcerns}
            </Text>
          </View>
        )}

        {/* Teacher Notes */}
        {selectedPTM?.teacherNotes && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle} allowFontScaling={false}>
              Teacher Notes
            </Text>
            <Text style={styles.notesText} allowFontScaling={false}>
              {selectedPTM.teacherNotes}
            </Text>
          </View>
        )}

        {/* Action Items */}
        {selectedPTM?.actionItems && selectedPTM.actionItems.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle} allowFontScaling={false}>
              Action Items
            </Text>
            {selectedPTM.actionItems.map((item, index) => (
              <View key={index} style={styles.actionItem}>
                <Text style={styles.actionBullet} allowFontScaling={false}>
                  ✓
                </Text>
                <Text style={styles.actionText} allowFontScaling={false}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Scheduling Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Scheduling Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Scheduled By
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedPTM?.scheduledBy}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Scheduled On
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {formatDate(selectedPTM?.scheduledDate)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {selectedPTM?.status === "Scheduled" && (
          <View style={styles.actionButtonsLarge}>
            <TouchableOpacity
              style={styles.rescheduleButtonLarge}
              onPress={() => handlePTMAction(selectedPTM.id, "reschedule")}
            >
              <Text style={styles.rescheduleButtonText} allowFontScaling={false}>
                📅 Reschedule Meeting
              </Text>
            </TouchableOpacity>
            <View style={styles.secondaryButtonsRow}>
              <TouchableOpacity
                style={styles.completeButtonLarge}
                onPress={() => handlePTMAction(selectedPTM.id, "complete")}
              >
                <Text style={styles.completeButtonText} allowFontScaling={false}>
                  ✓ Complete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButtonLarge}
                onPress={() => handlePTMAction(selectedPTM.id, "cancel")}
              >
                <Text style={styles.cancelButtonText} allowFontScaling={false}>
                  ✗ Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2c5282" barStyle="light-content" />
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
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
    padding: 12,
    paddingTop: 16,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Summary Section
  summarySection: {
    marginBottom: 16,
  },
  summaryScrollView: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  summaryCard: {
    width: 100,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  scheduledCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },
  completedCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#10b981",
  },
  cancelledCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#ef4444",
  },
  totalCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#8b5cf6",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Search
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
  // Filters
  filtersContainer: {
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1,
    position: "relative",
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
  // PTM List
  ptmsList: {
    marginBottom: 20,
  },
  separator: {
    height: 8,
  },
  ptmCard: {
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
  ptmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  studentInfo: {
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
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
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
    color: "#6366f1",
    fontWeight: "500",
  },
  purposeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  purposeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "600",
  },
  meetingSchedule: {
    marginBottom: 8,
  },
  dateTimeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
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
  venue: {
    fontSize: 11,
    color: "#6b7280",
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
    gap: 6,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  rescheduleButton: {
    backgroundColor: "#f59e0b",
  },
  completeButton: {
    backgroundColor: "#10b981",
  },
  cancelButton: {
    backgroundColor: "#ef4444",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  // Empty State
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
  // Detail View
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#6366f1",
    fontWeight: "600",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    flex: 1,
  },
  detailContent: {
    flex: 1,
  },
  // Improved Student Info Card Layout
  studentInfoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  studentHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  studentAvatarContainer: {
    marginRight: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  studentMainInfo: {
    flex: 1,
  },
  studentNameLarge: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  studentClass: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignSelf: "flex-start",
  },
  statusTextLarge: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  parentInfoSection: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    // borderLeftWidth: 3,
    // borderLeftColor: "#6366f1",
  },
  parentInfoTitle: {
    fontSize: 10,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  parentNameLarge: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 4,
  },
  parentPhone: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Info Cards
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  purposeBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  purposeTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  // Performance Grid
  performanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  performanceItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: 70,
    alignItems: "center",
  },
  performanceValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    textAlign: "center",
  },
  // Agenda Items
  agendaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  agendaBullet: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "700",
    marginRight: 8,
    marginTop: 2,
  },
  agendaText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Concerns and Notes
  concernsText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 20,
  },
  notesText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 20,
  },
  // Action Items
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  actionBullet: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "700",
    marginRight: 8,
    marginTop: 2,
  },
  actionText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  // Action Buttons Large
  actionButtonsLarge: {
    gap: 12,
    marginBottom: 20,
  },
  rescheduleButtonLarge: {
    backgroundColor: "#f59e0b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rescheduleButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  completeButtonLarge: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  completeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButtonLarge: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default StudentPTM;
