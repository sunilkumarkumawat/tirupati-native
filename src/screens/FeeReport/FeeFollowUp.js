"use client"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
  Alert,
  BackHandler,
} from "react-native"

const FeeFollowUp = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedDueRange, setSelectedDueRange] = useState("All Ranges")

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 2) {
        setCurrentStep(1)
        setSelectedStudent(null)
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

  // Sample data
  const classes = ["All Classes", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]
  const statusOptions = ["All Status", "Overdue", "Due Soon", "Contacted", "Pending"]
  const dueRanges = ["All Ranges", "0-30 Days", "31-60 Days", "61-90 Days", "90+ Days"]

  const followUpSummary = {
    totalOverdue: 125,
    totalAmount: 2850000,
    contacted: 45,
    pending: 80,
    avgDueAmount: 22800,
    criticalCases: 15,
  }

  // Fee follow-up data
  const followUpStudents = [
    {
      id: 1,
      studentName: "Aarav Sharma",
      class: "5th",
      section: "A",
      rollNo: "05A001",
      parentName: "Rajesh Sharma",
      parentPhone: "9876543210",
      dueAmount: 15500,
      daysOverdue: 45,
      lastPayment: "Nov 15, 2024",
      status: "Overdue",
      lastContact: "Dec 20, 2024",
      contactMethod: "Phone Call",
      feeBreakdown: {
        tuitionFee: 10000,
        transportFee: 3000,
        examFee: 1500,
        lateFee: 1000,
      },
      paymentHistory: [
        { date: "Nov 15, 2024", amount: 12000, method: "Online" },
        { date: "Oct 10, 2024", amount: 12000, method: "Cash" },
      ],
      followUpNotes: [
        { date: "Dec 20, 2024", note: "Parent promised to pay by month end", method: "Phone Call" },
        { date: "Dec 10, 2024", note: "SMS sent regarding overdue fees", method: "SMS" },
      ],
    },
    {
      id: 2,
      studentName: "Priya Patel",
      class: "3rd",
      section: "B",
      rollNo: "03B015",
      parentName: "Suresh Patel",
      parentPhone: "9876543211",
      dueAmount: 8200,
      daysOverdue: 25,
      lastPayment: "Dec 5, 2024",
      status: "Due Soon",
      lastContact: "Dec 22, 2024",
      contactMethod: "WhatsApp",
      feeBreakdown: {
        tuitionFee: 6000,
        transportFee: 1500,
        examFee: 700,
      },
      paymentHistory: [
        { date: "Dec 5, 2024", amount: 8000, method: "Online" },
        { date: "Nov 1, 2024", amount: 8000, method: "Cheque" },
      ],
      followUpNotes: [{ date: "Dec 22, 2024", note: "Parent acknowledged, will pay this week", method: "WhatsApp" }],
    },
    {
      id: 3,
      studentName: "Arjun Singh",
      class: "7th",
      section: "A",
      rollNo: "07A008",
      parentName: "Vikram Singh",
      parentPhone: "9876543212",
      dueAmount: 22800,
      daysOverdue: 75,
      lastPayment: "Oct 20, 2024",
      status: "Overdue",
      lastContact: "Dec 18, 2024",
      contactMethod: "Visit",
      feeBreakdown: {
        tuitionFee: 15000,
        transportFee: 4000,
        examFee: 2000,
        lateFee: 1800,
      },
      paymentHistory: [
        { date: "Oct 20, 2024", amount: 18000, method: "Cash" },
        { date: "Sep 15, 2024", amount: 18000, method: "Online" },
      ],
      followUpNotes: [
        { date: "Dec 18, 2024", note: "Parent visited school, requested payment plan", method: "Visit" },
        { date: "Dec 5, 2024", note: "Multiple calls - no response", method: "Phone Call" },
      ],
    },
    {
      id: 4,
      studentName: "Sneha Gupta",
      class: "2nd",
      section: "C",
      rollNo: "02C022",
      parentName: "Amit Gupta",
      parentPhone: "9876543213",
      dueAmount: 6500,
      daysOverdue: 15,
      lastPayment: "Dec 10, 2024",
      status: "Contacted",
      lastContact: "Dec 25, 2024",
      contactMethod: "SMS",
      feeBreakdown: {
        tuitionFee: 5000,
        transportFee: 1200,
        examFee: 300,
      },
      paymentHistory: [
        { date: "Dec 10, 2024", amount: 6500, method: "Online" },
        { date: "Nov 8, 2024", amount: 6500, method: "Cash" },
      ],
      followUpNotes: [{ date: "Dec 25, 2024", note: "Reminder SMS sent", method: "SMS" }],
    },
    {
      id: 5,
      studentName: "Rohit Kumar",
      class: "9th",
      section: "A",
      rollNo: "09A012",
      parentName: "Manoj Kumar",
      parentPhone: "9876543214",
      dueAmount: 28500,
      daysOverdue: 95,
      lastPayment: "Sep 25, 2024",
      status: "Overdue",
      lastContact: "Dec 15, 2024",
      contactMethod: "Email",
      feeBreakdown: {
        tuitionFee: 20000,
        transportFee: 5000,
        examFee: 2000,
        lateFee: 1500,
      },
      paymentHistory: [
        { date: "Sep 25, 2024", amount: 25000, method: "Cheque" },
        { date: "Aug 20, 2024", amount: 25000, method: "Online" },
      ],
      followUpNotes: [
        { date: "Dec 15, 2024", note: "Email sent with payment options", method: "Email" },
        { date: "Dec 1, 2024", note: "Parent meeting scheduled", method: "Phone Call" },
      ],
    },
  ]

  const DropdownModal = ({ visible, onClose, data, onSelect, title }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle} allowFontScaling={false}>
            {title}
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item)
                  onClose()
                }}
              >
                <Text style={styles.modalItemText} allowFontScaling={false}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText} allowFontScaling={false}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const [showClassModal, setShowClassModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDueRangeModal, setShowDueRangeModal] = useState(false)

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
    setCurrentStep(2)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Overdue":
        return "#ef4444"
      case "Due Soon":
        return "#f59e0b"
      case "Contacted":
        return "#6366f1"
      case "Pending":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getDuePriorityColor = (days) => {
    if (days >= 90) return "#ef4444"
    if (days >= 60) return "#f59e0b"
    if (days >= 30) return "#f59e0b"
    return "#10b981"
  }

  const getContactMethodIcon = (method) => {
    switch (method) {
      case "Phone Call":
        return "📞"
      case "WhatsApp":
        return "💬"
      case "SMS":
        return "📱"
      case "Email":
        return "📧"
      case "Visit":
        return "🏫"
      default:
        return "📋"
    }
  }

  // Filter students
  const filteredStudents = followUpStudents.filter((student) => {
    const matchesSearch =
      !searchText ||
      student.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchText.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchText.toLowerCase())
    const matchesClass = selectedClass === "All Classes" || student.class === selectedClass
    const matchesStatus = selectedStatus === "All Status" || student.status === selectedStatus
    const matchesDueRange =
      selectedDueRange === "All Ranges" ||
      (selectedDueRange === "0-30 Days" && student.daysOverdue <= 30) ||
      (selectedDueRange === "31-60 Days" && student.daysOverdue > 30 && student.daysOverdue <= 60) ||
      (selectedDueRange === "61-90 Days" && student.daysOverdue > 60 && student.daysOverdue <= 90) ||
      (selectedDueRange === "90+ Days" && student.daysOverdue > 90)
    return matchesSearch && matchesClass && matchesStatus && matchesDueRange
  })

  const renderStep1 = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Fee Follow-Up
        </Text>
        <Text style={styles.headerDate} allowFontScaling={false}>
          Updated: Jan 7, 2025
        </Text>
      </View>

      {/* Summary Cards - Horizontal Scroll */}
      <View style={styles.summarySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryScrollContainer}
        >
          <View style={[styles.summaryCard, styles.overdueCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {followUpSummary.totalOverdue}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Total Overdue
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              Students
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.amountCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {formatCurrency(followUpSummary.totalAmount)}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Total Amount
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              Outstanding
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.contactedCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {followUpSummary.contacted}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Contacted
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              This Week
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.pendingCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {followUpSummary.pending}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Pending
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              Follow-up
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.criticalCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {followUpSummary.criticalCases}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Critical Cases
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              90+ Days
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          Quick Actions
        </Text>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon} allowFontScaling={false}>
              📞
            </Text>
            <Text style={styles.actionButtonText} allowFontScaling={false}>
              Bulk Call
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon} allowFontScaling={false}>
              📱
            </Text>
            <Text style={styles.actionButtonText} allowFontScaling={false}>
              Send SMS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon} allowFontScaling={false}>
              📧
            </Text>
            <Text style={styles.actionButtonText} allowFontScaling={false}>
              Email All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon} allowFontScaling={false}>
              📊
            </Text>
            <Text style={styles.actionButtonText} allowFontScaling={false}>
              Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filtersRow}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search student, parent, roll no..."
              value={searchText}
              onChangeText={setSearchText}
              allowFontScaling={false}
            />
            <Text style={styles.searchIcon} allowFontScaling={false}>
              🔍
            </Text>
          </View>
        </View>
        <View style={styles.filtersRow}>
          <TouchableOpacity style={styles.filterDropdown} onPress={() => setShowClassModal(true)}>
            <Text style={styles.filterText} allowFontScaling={false}>
              {selectedClass}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterDropdown} onPress={() => setShowStatusModal(true)}>
            <Text style={styles.filterText} allowFontScaling={false}>
              {selectedStatus}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterDropdown} onPress={() => setShowDueRangeModal(true)}>
            <Text style={styles.filterText} allowFontScaling={false}>
              {selectedDueRange}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Students List */}
      <View style={styles.studentsList}>
        {filteredStudents.map((student) => (
          <TouchableOpacity key={student.id} style={styles.studentCard} onPress={() => handleStudentClick(student)}>
            <View style={styles.studentHeader}>
              <View style={styles.studentBasicInfo}>
                <Text style={styles.studentName} allowFontScaling={false}>
                  {student.studentName}
                </Text>
                <Text style={styles.classInfo} allowFontScaling={false}>
                  Class {student.class} ({student.section}) - {student.rollNo}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(student.status) }]}>
                <Text style={styles.statusText} allowFontScaling={false}>
                  {student.status}
                </Text>
              </View>
            </View>

            <View style={styles.studentDetails}>
              <View style={styles.parentInfo}>
                <Text style={styles.parentName} allowFontScaling={false}>
                  {student.parentName}
                </Text>
                <Text style={styles.parentPhone} allowFontScaling={false}>
                  📞 {student.parentPhone}
                </Text>
              </View>

              <View style={styles.dueInfo}>
                <Text style={styles.dueAmount} allowFontScaling={false}>
                  {formatCurrency(student.dueAmount)}
                </Text>
                <View style={styles.dueDetails}>
                  <Text
                    style={[styles.daysOverdue, { color: getDuePriorityColor(student.daysOverdue) }]}
                    allowFontScaling={false}
                  >
                    {student.daysOverdue} days overdue
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.studentFooter}>
              <View style={styles.lastContact}>
                <Text style={styles.contactMethod} allowFontScaling={false}>
                  {getContactMethodIcon(student.contactMethod)} Last: {student.lastContact}
                </Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText} allowFontScaling={false}>
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modals */}
      <DropdownModal
        visible={showClassModal}
        onClose={() => setShowClassModal(false)}
        data={classes}
        onSelect={setSelectedClass}
        title="Select Class"
      />
      <DropdownModal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        data={statusOptions}
        onSelect={setSelectedStatus}
        title="Select Status"
      />
      <DropdownModal
        visible={showDueRangeModal}
        onClose={() => setShowDueRangeModal(false)}
        data={dueRanges}
        onSelect={setSelectedDueRange}
        title="Select Due Range"
      />
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
          Follow-Up Details
        </Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {/* Student Info Card */}
        <View style={styles.studentInfoCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {selectedStudent?.studentName?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentNameLarge} allowFontScaling={false}>
              {selectedStudent?.studentName}
            </Text>
            <Text style={styles.studentClass} allowFontScaling={false}>
              Class {selectedStudent?.class} ({selectedStudent?.section}) - Roll: {selectedStudent?.rollNo}
            </Text>
            <Text style={styles.parentNameLarge} allowFontScaling={false}>
              Parent: {selectedStudent?.parentName}
            </Text>
          </View>
          <View style={styles.contactIcons}>
            <Text style={styles.callIcon} allowFontScaling={false}>
              📞
            </Text>
            <Text style={styles.whatsappIcon} allowFontScaling={false}>
              💬
            </Text>
          </View>
        </View>

        {/* Due Amount Summary */}
        <View style={styles.dueAmountCard}>
          <View style={styles.dueAmountHeader}>
            <Text style={styles.dueAmountTitle} allowFontScaling={false}>
              Outstanding Amount
            </Text>
            <View
              style={[styles.priorityBadge, { backgroundColor: getDuePriorityColor(selectedStudent?.daysOverdue) }]}
            >
              <Text style={styles.priorityText} allowFontScaling={false}>
                {selectedStudent?.daysOverdue} Days
              </Text>
            </View>
          </View>
          <Text style={styles.dueAmountLarge} allowFontScaling={false}>
            {formatCurrency(selectedStudent?.dueAmount)}
          </Text>
          <Text style={styles.lastPaymentInfo} allowFontScaling={false}>
            Last Payment: {selectedStudent?.lastPayment}
          </Text>
        </View>

        {/* Fee Breakdown */}
        <View style={styles.feeBreakdownCard}>
          <Text style={styles.breakdownTitle} allowFontScaling={false}>
            Fee Breakdown
          </Text>
          {selectedStudent?.feeBreakdown &&
            Object.entries(selectedStudent.feeBreakdown).map(([key, value], index) => (
              <View key={index} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel} allowFontScaling={false}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Text style={styles.breakdownValue} allowFontScaling={false}>
                  {formatCurrency(value)}
                </Text>
              </View>
            ))}
        </View>

        {/* Follow-up History */}
        <View style={styles.followUpHistoryCard}>
          <Text style={styles.historyTitle} allowFontScaling={false}>
            Follow-up History
          </Text>
          {selectedStudent?.followUpNotes?.map((note, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate} allowFontScaling={false}>
                  {note.date}
                </Text>
                <View style={styles.historyMethod}>
                  <Text style={styles.historyMethodIcon} allowFontScaling={false}>
                    {getContactMethodIcon(note.method)}
                  </Text>
                  <Text style={styles.historyMethodText} allowFontScaling={false}>
                    {note.method}
                  </Text>
                </View>
              </View>
              <Text style={styles.historyNote} allowFontScaling={false}>
                {note.note}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment History */}
        <View style={styles.paymentHistoryCard}>
          <Text style={styles.historyTitle} allowFontScaling={false}>
            Recent Payments
          </Text>
          {selectedStudent?.paymentHistory?.map((payment, index) => (
            <View key={index} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentDate} allowFontScaling={false}>
                  {payment.date}
                </Text>
                <Text style={styles.paymentMethod} allowFontScaling={false}>
                  via {payment.method}
                </Text>
              </View>
              <Text style={styles.paymentAmount} allowFontScaling={false}>
                {formatCurrency(payment.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText} allowFontScaling={false}>
              📞 Call Parent
            </Text>
          </TouchableOpacity>
          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText} allowFontScaling={false}>
                💬 WhatsApp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText} allowFontScaling={false}>
                📱 SMS
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText} allowFontScaling={false}>
              📝 Add Follow-up Note
            </Text>
          </TouchableOpacity>
        </View>
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
  headerDate: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Summary Section
  summarySection: {
    marginBottom: 16,
  },
  summaryScrollContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  summaryCard: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  overdueCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#ef4444",
  },
  amountCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#f59e0b",
  },
  contactedCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#10b981",
  },
  pendingCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },
  criticalCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#dc2626",
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
    marginBottom: 2,
  },
  summaryChange: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "500",
  },
  // Quick Actions
  quickActions: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
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
  actionButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionButtonIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  actionButtonText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  // Filters Section
  filtersSection: {
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flex: 1,
    position: "relative",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    paddingRight: 50,
    fontSize: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    position: "absolute",
    right: 16,
    top: 16,
    fontSize: 16,
  },
  filterDropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "bold",
  },
  // Students List
  studentsList: {
    marginBottom: 20,
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#ef4444",
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  studentBasicInfo: {
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
  studentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 2,
  },
  parentPhone: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  dueInfo: {
    alignItems: "flex-end",
  },
  dueAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: 2,
  },
  dueDetails: {
    alignItems: "flex-end",
  },
  daysOverdue: {
    fontSize: 11,
    fontWeight: "600",
  },
  studentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastContact: {
    flex: 1,
  },
  contactMethod: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  contactButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
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
  // Student Info Card
  studentInfoCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  studentInfo: {
    flex: 1,
  },
  studentNameLarge: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  studentClass: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  parentNameLarge: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  contactIcons: {
    flexDirection: "row",
    gap: 8,
  },
  callIcon: {
    fontSize: 20,
  },
  whatsappIcon: {
    fontSize: 20,
  },
  // Due Amount Card
  dueAmountCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },
  dueAmountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dueAmountTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  dueAmountLarge: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: 4,
  },
  lastPaymentInfo: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Fee Breakdown Card
  feeBreakdownCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  breakdownLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  // Follow-up History Card
  followUpHistoryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  historyItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  historyMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  historyMethodIcon: {
    fontSize: 12,
  },
  historyMethodText: {
    fontSize: 11,
    color: "#6366f1",
    fontWeight: "600",
  },
  historyNote: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 18,
  },
  // Payment History Card
  paymentHistoryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 2,
  },
  paymentMethod: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  paymentAmount: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "700",
  },
  // Action Buttons
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  secondaryButtonText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
  tertiaryButton: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tertiaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    width: "80%",
    maxHeight: "60%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#111827",
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    borderRadius: 6,
    marginBottom: 2,
  },
  modalItemText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#6366f1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  closeButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
})

export default FeeFollowUp;
