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

const StudentLeaveManagement = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [filteredLeaves, setFilteredLeaves] = useState([])
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 2) {
        setCurrentStep(1)
        setSelectedLeave(null)
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

  // Sample leave data
  const leaveRequests = [
    {
      id: 1,
      studentName: "Aarav Sharma",
      class: "10th",
      section: "A",
      rollNumber: "A001",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      parentName: "Rajesh Sharma",
      parentPhone: "+91 98765 43210",
      leaveType: "Sick Leave",
      fromDate: "2025-01-10",
      toDate: "2025-01-12",
      totalDays: 3,
      reason: "High fever and doctor advised rest for 3 days",
      status: "Pending",
      appliedDate: "2025-01-09",
      appliedTime: "10:30 AM",
      documents: ["medical_certificate.pdf"],
      teacherRemarks: "",
      approvedBy: "",
      approvedDate: "",
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
      leaveType: "Family Function",
      fromDate: "2025-01-15",
      toDate: "2025-01-16",
      totalDays: 2,
      reason: "Sister's wedding ceremony in hometown",
      status: "Approved",
      appliedDate: "2025-01-05",
      appliedTime: "02:15 PM",
      documents: ["invitation_card.jpg"],
      teacherRemarks: "Approved for family function",
      approvedBy: "Mrs. Sharma",
      approvedDate: "2025-01-06",
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
      leaveType: "Medical Appointment",
      fromDate: "2025-01-08",
      toDate: "2025-01-08",
      totalDays: 1,
      reason: "Dental appointment scheduled at 2 PM",
      status: "Rejected",
      appliedDate: "2025-01-07",
      appliedTime: "09:45 AM",
      documents: [],
      teacherRemarks: "Please reschedule during non-school hours",
      approvedBy: "Mr. Kumar",
      approvedDate: "2025-01-07",
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
      leaveType: "Emergency",
      fromDate: "2025-01-11",
      toDate: "2025-01-13",
      totalDays: 3,
      reason: "Grandmother hospitalized, need to travel urgently",
      status: "Approved",
      appliedDate: "2025-01-11",
      appliedTime: "07:20 AM",
      documents: ["hospital_admission.pdf"],
      teacherRemarks: "Emergency leave approved",
      approvedBy: "Principal",
      approvedDate: "2025-01-11",
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
      leaveType: "Sports Competition",
      fromDate: "2025-01-20",
      toDate: "2025-01-22",
      totalDays: 3,
      reason: "Selected for district level basketball tournament",
      status: "Pending",
      appliedDate: "2025-01-08",
      appliedTime: "04:30 PM",
      documents: ["selection_letter.pdf"],
      teacherRemarks: "",
      approvedBy: "",
      approvedDate: "",
    },
  ]

  const classes = ["All Classes", "9th", "10th", "11th", "12th"]
  const statusOptions = ["All Status", "Pending", "Approved", "Rejected"]
  const leaveTypes = [
    "Sick Leave",
    "Family Function",
    "Medical Appointment",
    "Emergency",
    "Sports Competition",
    "Other",
  ]

  useEffect(() => {
    filterLeaves()
  }, [searchKeyword, selectedClass, selectedStatus])

  const filterLeaves = () => {
    let filtered = leaveRequests

    if (selectedClass !== "All Classes") {
      filtered = filtered.filter((leave) => leave.class === selectedClass)
    }

    if (selectedStatus !== "All Status") {
      filtered = filtered.filter((leave) => leave.status === selectedStatus)
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim()
      filtered = filtered.filter((leave) => {
        return (
          leave.studentName.toLowerCase().includes(keyword) ||
          leave.rollNumber.toLowerCase().includes(keyword) ||
          leave.parentName.toLowerCase().includes(keyword) ||
          leave.leaveType.toLowerCase().includes(keyword) ||
          leave.reason.toLowerCase().includes(keyword)
        )
      })
    }

    setFilteredLeaves(filtered)
  }

  const handleLeaveAction = (leaveId, action) => {
    const leave = leaveRequests.find((l) => l.id === leaveId)
    if (!leave) return

    const actionText = action === "approve" ? "approve" : "reject"
    Alert.alert(
      `${action === "approve" ? "Approve" : "Reject"} Leave`,
      `Are you sure you want to ${actionText} leave request for ${leave.studentName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "approve" ? "Approve" : "Reject",
          onPress: () => {
            Alert.alert("Success", `Leave request ${action === "approve" ? "approved" : "rejected"} successfully!`)
          },
        },
      ],
    )
  }

  const handleLeaveClick = (leave) => {
    setSelectedLeave(leave)
    setCurrentStep(2)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#10b981"
      case "Rejected":
        return "#ef4444"
      case "Pending":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Sick Leave":
        return "#ef4444"
      case "Family Function":
        return "#8b5cf6"
      case "Medical Appointment":
        return "#06b6d4"
      case "Emergency":
        return "#dc2626"
      case "Sports Competition":
        return "#10b981"
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

  const LeaveCard = ({ leave }) => (
    <TouchableOpacity style={styles.leaveCard} onPress={() => handleLeaveClick(leave)}>
      <View style={styles.leaveHeader}>
        <View style={styles.studentInfo}>
          <Image source={{ uri: leave.avatar }} style={styles.avatar} />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>
              {leave.studentName}
            </Text>
            <Text style={styles.classInfo} allowFontScaling={false}>
              {leave.class} - {leave.section} • Roll: {leave.rollNumber}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(leave.status) }]}>
          <Text style={styles.statusText} allowFontScaling={false}>
            {leave.status}
          </Text>
        </View>
      </View>

      <View style={styles.leaveDetails}>
        <View style={[styles.leaveTypeBadge, { backgroundColor: getLeaveTypeColor(leave.leaveType) }]}>
          <Text style={styles.leaveTypeText} allowFontScaling={false}>
            {leave.leaveType}
          </Text>
        </View>
        <Text style={styles.leaveDuration} allowFontScaling={false}>
          {leave.totalDays} day{leave.totalDays > 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.leaveDates}>
        <Text style={styles.dateLabel} allowFontScaling={false}>
          From: {formatDate(leave.fromDate)}
        </Text>
        <Text style={styles.dateLabel} allowFontScaling={false}>
          To: {formatDate(leave.toDate)}
        </Text>
      </View>

      <Text style={styles.leaveReason} allowFontScaling={false} numberOfLines={2}>
        {leave.reason}
      </Text>

      <View style={styles.leaveFooter}>
        <Text style={styles.appliedDate} allowFontScaling={false}>
          Applied: {formatDate(leave.appliedDate)} at {leave.appliedTime}
        </Text>
        {leave.status === "Pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleLeaveAction(leave.id, "approve")}
            >
              <Text style={styles.actionButtonText} allowFontScaling={false}>
                ✓
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleLeaveAction(leave.id, "reject")}
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
          Leave Management
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          {filteredLeaves.length} leave requests
        </Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryScrollView}>
          <View style={[styles.summaryCard, styles.pendingCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {leaveRequests.filter((l) => l.status === "Pending").length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Pending
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.approvedCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {leaveRequests.filter((l) => l.status === "Approved").length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Approved
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.rejectedCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {leaveRequests.filter((l) => l.status === "Rejected").length}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Rejected
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.totalCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {leaveRequests.length}
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
            placeholder="Search by student, roll no, type, reason..."
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

      {/* Leave Requests List */}
      <View style={styles.leavesList}>
        {filteredLeaves.map((leave, index) => (
          <View key={leave.id}>
            <LeaveCard leave={leave} />
            {index < filteredLeaves.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
        {filteredLeaves.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText} allowFontScaling={false}>
              No leave requests found
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
          Leave Details
        </Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {/* Student Info Card - Improved Layout */}
        <View style={styles.studentInfoCard}>
          <View style={styles.studentHeaderRow}>
            <View style={styles.studentAvatarContainer}>
              <Image source={{ uri: selectedLeave?.avatar }} style={styles.profileAvatar} />
            </View>
            <View style={styles.studentMainInfo}>
              <Text style={styles.studentNameLarge} allowFontScaling={false}>
                {selectedLeave?.studentName}
              </Text>
              <Text style={styles.studentClass} allowFontScaling={false}>
                Class {selectedLeave?.class} ({selectedLeave?.section})
              </Text>
              <Text style={styles.rollNumber} allowFontScaling={false}>
                Roll No: {selectedLeave?.rollNumber}
              </Text>
            </View>
            <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(selectedLeave?.status) }]}>
              <Text style={styles.statusTextLarge} allowFontScaling={false}>
                {selectedLeave?.status}
              </Text>
            </View>
          </View>

          <View style={styles.parentInfoSection}>
            <Text style={styles.parentInfoTitle} allowFontScaling={false}>
              Parent Information
            </Text>
            <Text style={styles.parentNameLarge} allowFontScaling={false}>
              {selectedLeave?.parentName}
            </Text>
            <Text style={styles.parentPhone} allowFontScaling={false}>
            <Ionicons name='call' size='12' color='black' /> {selectedLeave?.parentPhone}
            </Text>
          </View>
        </View>

        {/* Leave Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Leave Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Leave Type
            </Text>
            <View
              style={[styles.leaveTypeBadgeSmall, { backgroundColor: getLeaveTypeColor(selectedLeave?.leaveType) }]}
            >
              <Text style={styles.leaveTypeTextSmall} allowFontScaling={false}>
                {selectedLeave?.leaveType}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              From Date
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {formatDate(selectedLeave?.fromDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              To Date
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {formatDate(selectedLeave?.toDate)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Total Days
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedLeave?.totalDays} day{selectedLeave?.totalDays > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Applied On
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {formatDate(selectedLeave?.appliedDate)} at {selectedLeave?.appliedTime}
            </Text>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Reason for Leave
          </Text>
          <Text style={styles.reasonText} allowFontScaling={false}>
            {selectedLeave?.reason}
          </Text>
        </View>

        {/* Documents */}
        {selectedLeave?.documents && selectedLeave.documents.length > 0 && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle} allowFontScaling={false}>
              Attached Documents
            </Text>
            {selectedLeave.documents.map((doc, index) => (
              <TouchableOpacity key={index} style={styles.documentItem}>
                <Text style={styles.documentIcon} allowFontScaling={false}>
                  <Ionicons name='link' size='20' color='black' />
                </Text>
                <Text style={styles.documentName} allowFontScaling={false}>
                  {doc}
                </Text>
                <Text style={styles.downloadIcon} allowFontScaling={false}>
                  
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Approval Information */}
        {selectedLeave?.status !== "Pending" && (
          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle} allowFontScaling={false}>
              Approval Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} allowFontScaling={false}>
                Status
              </Text>
              <View style={[styles.statusBadgeSmall, { backgroundColor: getStatusColor(selectedLeave?.status) }]}>
                <Text style={styles.statusTextSmall} allowFontScaling={false}>
                  {selectedLeave?.status}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} allowFontScaling={false}>
                Approved By
              </Text>
              <Text style={styles.infoValue} allowFontScaling={false}>
                {selectedLeave?.approvedBy}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel} allowFontScaling={false}>
                Approved On
              </Text>
              <Text style={styles.infoValue} allowFontScaling={false}>
                {formatDate(selectedLeave?.approvedDate)}
              </Text>
            </View>
            {selectedLeave?.teacherRemarks && (
              <View style={styles.remarksSection}>
                <Text style={styles.remarksLabel} allowFontScaling={false}>
                  Teacher Remarks:
                </Text>
                <Text style={styles.remarksText} allowFontScaling={false}>
                  {selectedLeave.teacherRemarks}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        {selectedLeave?.status === "Pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.approveButtonLarge}
              onPress={() => handleLeaveAction(selectedLeave.id, "approve")}
            >
              <Text style={styles.approveButtonText} allowFontScaling={false}>
                ✓ Approve Leave
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButtonLarge}
              onPress={() => handleLeaveAction(selectedLeave.id, "reject")}
            >
              <Text style={styles.rejectButtonText} allowFontScaling={false}>
                ✗ Reject Leave
              </Text>
            </TouchableOpacity>
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
  pendingCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#f59e0b",
  },
  approvedCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#10b981",
  },
  rejectedCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#ef4444",
  },
  totalCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
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
  // Leave List
  leavesList: {
    marginBottom: 20,
  },
  separator: {
    height: 8,
  },
  leaveCard: {
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
  leaveHeader: {
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
  leaveDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  leaveTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  leaveTypeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  leaveDuration: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
  leaveDates: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  leaveReason: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 8,
  },
  leaveFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appliedDate: {
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
  approveButton: {
    backgroundColor: "#10b981",
  },
  rejectButton: {
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
    fontSize: 10 ,
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
  leaveTypeBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  leaveTypeTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTextSmall: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  reasonText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 20,
  },
  // Documents
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  documentIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  documentName: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  downloadIcon: {
    fontSize: 16,
  },
  // Remarks
  remarksSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  remarksLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  remarksText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 18,
  },
  // Action Buttons Large
  approveButtonLarge: {
    backgroundColor: "#10b981",
    padding: 12,
    
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  approveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectButtonLarge: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rejectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default StudentLeaveManagement
