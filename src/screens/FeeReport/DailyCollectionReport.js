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

const DailyCollectionReport = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [selectedClass, setSelectedClass] = useState("All Classes")
  const [selectedDate, setSelectedDate] = useState("Today")
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("All Modes")

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 2) {
        setCurrentStep(1)
        setSelectedCollection(null)
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
  const dateRanges = ["Today", "Yesterday", "This Week", "Last Week", "Custom"]
  const paymentModes = ["All Modes", "Cash", "Online", "Cheque", "Bank Transfer"]

  const dailySummary = {
    totalCollected: 485000,
    totalStudents: 127,
    averagePerStudent: 3819,
    pendingAmount: 65000,
    cashCollection: 145000,
    onlineCollection: 285000,
    chequeCollection: 55000,
  }

  // Daily collections data
  const collections = [
    {
      id: 1,
      receiptNo: "DC-001-2025",
      studentName: "Aarav Sharma",
      class: "5th",
      section: "A",
      rollNo: "05A001",
      feeType: "Monthly Fee",
      amount: 5500,
      paymentMode: "Online",
      time: "09:15 AM",
      status: "Completed",
      parentName: "Rajesh Sharma",
      parentPhone: "9876543210",
      feeBreakdown: {
        tuitionFee: 3500,
        transportFee: 1200,
        examFee: 800,
      },
      lateFee: 0,
      discount: 0,
      transactionId: "TXN123456789",
    },
    {
      id: 2,
      receiptNo: "DC-002-2025",
      studentName: "Priya Patel",
      class: "3rd",
      section: "B",
      rollNo: "03B015",
      feeType: "Monthly Fee",
      amount: 4200,
      paymentMode: "Cash",
      time: "10:30 AM",
      status: "Completed",
      parentName: "Suresh Patel",
      parentPhone: "9876543211",
      feeBreakdown: {
        tuitionFee: 2800,
        transportFee: 1000,
        examFee: 400,
      },
      lateFee: 200,
      discount: 0,
      transactionId: "CASH001",
    },
    {
      id: 3,
      receiptNo: "DC-003-2025",
      studentName: "Arjun Singh",
      class: "7th",
      section: "A",
      rollNo: "07A008",
      feeType: "Monthly Fee",
      amount: 6800,
      paymentMode: "Cheque",
      time: "11:45 AM",
      status: "Pending",
      parentName: "Vikram Singh",
      parentPhone: "9876543212",
      feeBreakdown: {
        tuitionFee: 4500,
        transportFee: 1500,
        examFee: 800,
      },
      lateFee: 0,
      discount: 500,
      transactionId: "CHQ789012",
    },
    {
      id: 4,
      receiptNo: "DC-004-2025",
      studentName: "Sneha Gupta",
      class: "2nd",
      section: "C",
      rollNo: "02C022",
      feeType: "Monthly Fee",
      amount: 3800,
      paymentMode: "Online",
      time: "02:20 PM",
      status: "Completed",
      parentName: "Amit Gupta",
      parentPhone: "9876543213",
      feeBreakdown: {
        tuitionFee: 2500,
        transportFee: 900,
        examFee: 400,
      },
      lateFee: 0,
      discount: 200,
      transactionId: "TXN987654321",
    },
    {
      id: 5,
      receiptNo: "DC-005-2025",
      studentName: "Rohit Kumar",
      class: "9th",
      section: "A",
      rollNo: "09A012",
      feeType: "Monthly Fee",
      amount: 7500,
      paymentMode: "Bank Transfer",
      time: "03:15 PM",
      status: "Completed",
      parentName: "Manoj Kumar",
      parentPhone: "9876543214",
      feeBreakdown: {
        tuitionFee: 5000,
        transportFee: 1800,
        examFee: 700,
      },
      lateFee: 0,
      discount: 0,
      transactionId: "BT456789123",
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
  const [showDateModal, setShowDateModal] = useState(false)
  const [showPaymentModeModal, setShowPaymentModeModal] = useState(false)

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection)
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
      case "Completed":
        return "#10b981"
      case "Pending":
        return "#f59e0b"
      case "Failed":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getPaymentModeColor = (mode) => {
    switch (mode) {
      case "Cash":
        return "#10b981"
      case "Online":
        return "#6366f1"
      case "Cheque":
        return "#f59e0b"
      case "Bank Transfer":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  // Filter collections
  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      !searchText ||
      collection.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
      collection.receiptNo.toLowerCase().includes(searchText.toLowerCase()) ||
      collection.parentName.toLowerCase().includes(searchText.toLowerCase())
    const matchesClass = selectedClass === "All Classes" || collection.class === selectedClass
    const matchesPaymentMode = selectedPaymentMode === "All Modes" || collection.paymentMode === selectedPaymentMode
    return matchesSearch && matchesClass && matchesPaymentMode
  })

  const renderStep1 = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Daily Collection Report
        </Text>
        <Text style={styles.headerDate} allowFontScaling={false}>
          {selectedDate} - Jan 7, 2025
        </Text>
      </View>

      {/* Summary Cards - Horizontal Scroll */}
      <View style={styles.summarySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryScrollContainer}
        >
          <View style={[styles.summaryCard, styles.totalCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {formatCurrency(dailySummary.totalCollected)}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Total Collected
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              +15.2%
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.studentsCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {dailySummary.totalStudents}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Students Paid
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              +8.5%
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.avgCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {formatCurrency(dailySummary.averagePerStudent)}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Avg per Student
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              +6.3%
            </Text>
          </View>
          <View style={[styles.summaryCard, styles.pendingCard]}>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              {formatCurrency(dailySummary.pendingAmount)}
            </Text>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              Pending Amount
            </Text>
            <Text style={styles.summaryChange} allowFontScaling={false}>
              -12.1%
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Payment Mode Breakdown */}
      <View style={styles.paymentBreakdown}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          Payment Mode Breakdown
        </Text>
        <View style={styles.paymentModeRow}>
          <View style={styles.paymentModeItem}>
            <View style={[styles.paymentModeDot, { backgroundColor: "#10b981" }]} />
            <Text style={styles.paymentModeText} allowFontScaling={false}>
              Cash: {formatCurrency(dailySummary.cashCollection)}
            </Text>
          </View>
          <View style={styles.paymentModeItem}>
            <View style={[styles.paymentModeDot, { backgroundColor: "#6366f1" }]} />
            <Text style={styles.paymentModeText} allowFontScaling={false}>
              Online: {formatCurrency(dailySummary.onlineCollection)}
            </Text>
          </View>
        </View>
        <View style={styles.paymentModeRow}>
          <View style={styles.paymentModeItem}>
            <View style={[styles.paymentModeDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={styles.paymentModeText} allowFontScaling={false}>
              Cheque: {formatCurrency(dailySummary.chequeCollection)}
            </Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <View style={styles.filtersRow}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by student name, receipt..."
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
          <TouchableOpacity style={styles.filterDropdown} onPress={() => setShowDateModal(true)}>
            <Text style={styles.filterText} allowFontScaling={false}>
              {selectedDate}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterDropdown} onPress={() => setShowPaymentModeModal(true)}>
            <Text style={styles.filterText} allowFontScaling={false}>
              {selectedPaymentMode}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Collections List - Remove ScrollView wrapper */}
      <View style={styles.collectionsList}>
        {filteredCollections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={styles.collectionCard}
            onPress={() => handleCollectionClick(collection)}
          >
            <View style={styles.collectionHeader}>
              <Text style={styles.receiptNo} allowFontScaling={false}>
                Receipt No - {collection.receiptNo}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(collection.status) }]}>
                <Text style={styles.statusText} allowFontScaling={false}>
                  {collection.status}
                </Text>
              </View>
            </View>
            <Text style={styles.studentName} allowFontScaling={false}>
              {collection.studentName}
            </Text>
            <Text style={styles.classInfo} allowFontScaling={false}>
              Class {collection.class} ({collection.section}) - Roll No: {collection.rollNo}
            </Text>
            <View style={styles.collectionFooter}>
              <View style={styles.collectionLeft}>
                <Text style={styles.feeType} allowFontScaling={false}>
                  {collection.feeType}
                </Text>
                <Text style={styles.collectionTime} allowFontScaling={false}>
                  Time: {collection.time}
                </Text>
              </View>
              <View style={styles.collectionRight}>
                <Text style={styles.collectionAmount} allowFontScaling={false}>
                  {formatCurrency(collection.amount)}
                </Text>
                <View
                  style={[styles.paymentModeBadge, { backgroundColor: getPaymentModeColor(collection.paymentMode) }]}
                >
                  <Text style={styles.paymentModeLabel} allowFontScaling={false}>
                    {collection.paymentMode}
                  </Text>
                </View>
              </View>
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
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        data={dateRanges}
        onSelect={setSelectedDate}
        title="Select Date Range"
      />
      <DropdownModal
        visible={showPaymentModeModal}
        onClose={() => setShowPaymentModeModal(false)}
        data={paymentModes}
        onSelect={setSelectedPaymentMode}
        title="Select Payment Mode"
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
          Collection Details
        </Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {/* Student Info Card */}
        <View style={styles.studentInfoCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {selectedCollection?.studentName?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentNameLarge} allowFontScaling={false}>
              {selectedCollection?.studentName}
            </Text>
            <Text style={styles.studentClass} allowFontScaling={false}>
              Class {selectedCollection?.class} ({selectedCollection?.section}) - Roll: {selectedCollection?.rollNo}
            </Text>
          </View>
          <Text style={styles.callIcon} allowFontScaling={false}>
            📞
          </Text>
        </View>

        {/* Receipt Details */}
        <View style={styles.receiptDetailsCard}>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              RECEIPT NO
            </Text>
            <Text style={styles.receiptDetailValue} allowFontScaling={false}>
              {selectedCollection?.receiptNo}
            </Text>
          </View>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              PARENT NAME
            </Text>
            <Text style={styles.receiptDetailValue} allowFontScaling={false}>
              {selectedCollection?.parentName}
            </Text>
          </View>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              PARENT PHONE
            </Text>
            <Text style={styles.receiptDetailValue} allowFontScaling={false}>
              {selectedCollection?.parentPhone}
            </Text>
          </View>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              PAYMENT MODE
            </Text>
            <Text style={styles.receiptDetailValue} allowFontScaling={false}>
              {selectedCollection?.paymentMode}
            </Text>
          </View>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              TRANSACTION ID
            </Text>
            <Text style={styles.receiptDetailValue} allowFontScaling={false}>
              {selectedCollection?.transactionId}
            </Text>
          </View>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              TIME
            </Text>
            <Text style={styles.receiptDetailValue} allowFontScaling={false}>
              {selectedCollection?.time}
            </Text>
          </View>
          <View style={styles.receiptDetailRow}>
            <Text style={styles.receiptDetailLabel} allowFontScaling={false}>
              STATUS
            </Text>
            <View style={[styles.statusTag, { backgroundColor: getStatusColor(selectedCollection?.status) }]}>
              <Text style={styles.statusTagText} allowFontScaling={false}>
                {selectedCollection?.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Fee Breakdown */}
        <View style={styles.feeBreakdownCard}>
          <Text style={styles.breakdownTitle} allowFontScaling={false}>
            Fee Breakdown
          </Text>
          {selectedCollection?.feeBreakdown &&
            Object.entries(selectedCollection.feeBreakdown).map(([key, value], index) => (
              <View key={index} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel} allowFontScaling={false}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Text style={styles.breakdownValue} allowFontScaling={false}>
                  {formatCurrency(value)}
                </Text>
              </View>
            ))}
          {selectedCollection?.lateFee > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel} allowFontScaling={false}>
                Late Fee
              </Text>
              <Text style={styles.breakdownValue} allowFontScaling={false}>
                {formatCurrency(selectedCollection.lateFee)}
              </Text>
            </View>
          )}
          {selectedCollection?.discount > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel} allowFontScaling={false}>
                Discount
              </Text>
              <Text style={[styles.breakdownValue, { color: "#10b981" }]} allowFontScaling={false}>
                -{formatCurrency(selectedCollection.discount)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel} allowFontScaling={false}>
              Total Amount
            </Text>
            <Text style={styles.totalValue} allowFontScaling={false}>
              {formatCurrency(selectedCollection?.amount)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText} allowFontScaling={false}>
              Download Receipt
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText} allowFontScaling={false}>
              Send SMS
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
    width: 140,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  totalCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#10b981",
  },
  studentsCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },
  avgCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#f59e0b",
  },
  pendingCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#ef4444",
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
    fontSize: 11,
    color: "#10b981",
    fontWeight: "600",
  },
  // Payment Breakdown
  paymentBreakdown: {
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
  paymentModeRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 4,
  },
  paymentModeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentModeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paymentModeText: {
    fontSize: 11,
    color: "#6b7280",
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
  // Collections List
  collectionsList: {
    marginBottom: 20,
  },
  collectionCard: {
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
    borderLeftColor: "#10b981",
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  receiptNo: {
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusText: {
    color: "white",
    fontSize: 8,
    fontWeight: "700",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  classInfo: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 8,
  },
  collectionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  collectionLeft: {
    flex: 1,
  },
  feeType: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 2,
  },
  collectionTime: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  collectionRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  collectionAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  paymentModeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paymentModeLabel: {
    color: "white",
    fontSize: 10,
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
    backgroundColor: "#e0e7ff",
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
    backgroundColor: "#f97316",
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
  },
  callIcon: {
    fontSize: 20,
    marginLeft: 12,
  },
  // Receipt Details Card
  receiptDetailsCard: {
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
  receiptDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  receiptDetailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  receiptDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
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
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 14,
    color: "#6366f1",
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
  secondaryButton: {
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

export default DailyCollectionReport;
