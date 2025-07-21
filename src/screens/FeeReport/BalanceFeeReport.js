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
import Ionicons from 'react-native-vector-icons/Ionicons';

const BalanceFeeReport = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 3) {
        setCurrentStep(2)
        setSelectedStudent(null)
        return true
      } else if (currentStep === 2) {
        setCurrentStep(1)
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
  const classes = ["1st", "2nd", "3rd", "4th", "5th"]
  const sections = ["A", "B", "C", "D"]

  // const balanceData = [
  //   {
  //     label: "Total Balance",
  //     value: 104203,
  //   },
  //   {
  //     label: "Paid Fees",
  //     value: 0,
  //   },
  //   {
  //     label: "Net Payable Fees",
  //     value: 104203,
  //   },
  //   {
  //     label: "Assigned Fees",
  //     value: 104203,
  //   },
  // ]

  const students = [
    {
      id: 1,
      admissionNumber: "NLET/2322211992",
      rollNumber: "3",
      name: "New Student",
      class: "1st",
      section: "A",
      fatherName: "Test",
      guardianPhone: "1234567890",
      fatherPhone: "1234567890",
      motherPhone: "",
      balanceFee: 17000,
      assignedFees: 17000,
      discountAssigned: 0,
      netPayableFees: 17000,
      paidFees: 0,
      paidDiscount: 0,
      additionalDiscount: 0,
      fine: 0,
    },
    {
      id: 2,
      admissionNumber: "NLET/2322211993",
      rollNumber: "4",
      name: "Test",
      class: "1st",
      section: "A",
      fatherName: "n/a",
      guardianPhone: "1234567890",
      fatherPhone: "1234567890",
      motherPhone: "",
      balanceFee: 13000,
      assignedFees: 13000,
      discountAssigned: 0,
      netPayableFees: 13000,
      paidFees: 0,
      paidDiscount: 0,
      additionalDiscount: 0,
      fine: 0,
    },
    {
      id: 3,
      admissionNumber: "NLET/2322211994",
      rollNumber: "5",
      name: "Test Student",
      class: "1st",
      section: "A",
      fatherName: "n/a",
      guardianPhone: "1234567890",
      fatherPhone: "1234567890",
      motherPhone: "",
      balanceFee: 17000,
      assignedFees: 17000,
      discountAssigned: 0,
      netPayableFees: 17000,
      paidFees: 0,
      paidDiscount: 0,
      additionalDiscount: 0,
      fine: 0,
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
  const [showSectionModal, setShowSectionModal] = useState(false)

  const handleNext = () => {
    if (selectedClass && selectedSection) {
      setCurrentStep(2)
    } else {
      Alert.alert("Error", "Please select class and section")
    }
  }

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
    setCurrentStep(3)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount)
  }

  // Filter students based on search text
  const filteredStudents = students.filter((student) => {
    if (!searchText) return true
    const searchLower = searchText.toLowerCase()
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.admissionNumber.toLowerCase().includes(searchLower) ||
      student.fatherName.toLowerCase().includes(searchLower) ||
      student.rollNumber.toLowerCase().includes(searchLower)
    )
  })

  const renderStep1 = () => (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Class
          </Text>
          <TouchableOpacity style={styles.smallDropdown} onPress={() => setShowClassModal(true)}>
            <Text style={[styles.dropdownText, !selectedClass && styles.placeholder]} allowFontScaling={false}>
              {selectedClass || "Select"}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Section
          </Text>
          <TouchableOpacity style={styles.smallDropdown} onPress={() => setShowSectionModal(true)}>
            <Text style={[styles.dropdownText, !selectedSection && styles.placeholder]} allowFontScaling={false}>
              {selectedSection || "Select"}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedClass && selectedSection ? (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText} allowFontScaling={false}>
            Next
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.noData}>
          <Text style={styles.noDataText} allowFontScaling={false}>
            No data found
          </Text>
        </View>
      )}

      <DropdownModal
        visible={showClassModal}
        onClose={() => setShowClassModal(false)}
        data={classes}
        onSelect={setSelectedClass}
        title="Select Class"
      />
      <DropdownModal
        visible={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        data={sections}
        onSelect={setSelectedSection}
        title="Select Section"
      />
    </View>
  )

  const renderStep2 = () => (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Class
          </Text>
          <TouchableOpacity style={styles.smallDropdown}>
            <Text style={styles.dropdownText} allowFontScaling={false}>
              {selectedClass}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Section
          </Text>
          <TouchableOpacity style={styles.smallDropdown}>
            <Text style={styles.dropdownText} allowFontScaling={false}>
              {selectedSection}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label} allowFontScaling={false}>
        Search
      </Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, admission no, class(..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <Text style={styles.searchIcon} allowFontScaling={false}>
          🔍
        </Text>
      </View>

      {/* Horizontal Scrollable Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.summaryScrollView}
        contentContainerStyle={styles.summaryScrollContent}
      >
        {/* {balanceData.map((item, index) => (
          <View key={index} style={styles.summaryCard}>
            <Text style={styles.summaryLabel} allowFontScaling={false}>
              {item.label}
            </Text>
            <Text style={styles.summaryValue} allowFontScaling={false}>
              INR {formatCurrency(item.value)}
            </Text>
          </View>
        ))} */}
      </ScrollView>

      {/* Students List */}
      <ScrollView style={styles.studentsList}>
        {filteredStudents.map((student) => (
          <TouchableOpacity key={student.id} style={styles.studentCard} onPress={() => handleStudentClick(student)}>
            <View style={styles.studentHeader}>
              <View style={styles.admissionNumberBadge}>
                <Text style={styles.admissionNumberText} allowFontScaling={false}>
                  Admission Number - {student.admissionNumber}
                </Text>
              </View>
              <Text style={styles.moreIcon} allowFontScaling={false}>
                ⋯
              </Text>
            </View>

            <View style={styles.studentInfo}>
              <View style={styles.studentDetails}>
                <Text style={styles.studentName} allowFontScaling={false}>
                  {student.name}
                </Text>
                <Text style={styles.studentClass} allowFontScaling={false}>
                  Class - {student.class} ({student.section})
                </Text>
                <Text style={styles.fatherName} allowFontScaling={false}>
                  Father Name - {student.fatherName}
                </Text>
              </View>
              <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel} allowFontScaling={false}>
                  Balance Fee
                </Text>
                <View style={styles.balanceBadge}>
                  <Text style={styles.balanceAmount} allowFontScaling={false}>
                    INR {formatCurrency(student.balanceFee)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {filteredStudents.length === 0 && (
          <View style={styles.noData}>
            <Text style={styles.noDataText} allowFontScaling={false}>
              No students found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )

  const renderStep3 = () => (
    <View style={styles.container}>
      <View style={styles.feeReportHeader}>
        <TouchableOpacity onPress={() => setCurrentStep(2)} style={styles.backButton}>
          <Text style={styles.backButtonText} allowFontScaling={false}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.feeReportTitle} allowFontScaling={false}>
          Fee Report
        </Text>
      </View>

      <ScrollView style={styles.feeReportContent}>
        {/* Student Info Section */}
        <View style={styles.studentInfoCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {selectedStudent?.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentInfoDetails}>
            <Text style={styles.studentName} allowFontScaling={false}>
              {selectedStudent?.name}
            </Text>
            <Text style={styles.studentClass} allowFontScaling={false}>
              Class - {selectedStudent?.class} ({selectedStudent?.section})
            </Text>
          </View>
          <Text style={styles.callIcon} allowFontScaling={false}>
            <Ionicons name='call' size='20' color='black' />
          </Text>
        </View>

        {/* Student Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                ADMISSION NUMBER
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedStudent?.admissionNumber}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                ROLL NUMBER
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedStudent?.rollNumber}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                FATHER NAME
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedStudent?.fatherName}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                GUARDIAN PHONE
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedStudent?.guardianPhone}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                FATHER PHONE
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedStudent?.fatherPhone}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                MOTHER PHONE
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedStudent?.motherPhone || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* Fee Breakdown */}
        <View style={styles.feeBreakdownCard}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel} allowFontScaling={false}>
              ASSIGNED FEES TILL TODAY(+)
            </Text>
            <Text style={styles.feeValue} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.assignedFees || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel} allowFontScaling={false}>
              DISCOUNT ASSIGNED(-)
            </Text>
            <Text style={styles.feeValue} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.discountAssigned || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabelBold} allowFontScaling={false}>
              NET PAYABLE FEES
            </Text>
            <Text style={styles.feeValueBold} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.netPayableFees || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel} allowFontScaling={false}>
              PAID FEES(-)
            </Text>
            <Text style={styles.feeValue} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.paidFees || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel} allowFontScaling={false}>
              PAID DISCOUNT(-)
            </Text>
            <Text style={styles.feeValue} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.paidDiscount || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel} allowFontScaling={false}>
              ADDITIONAL DISCOUNT(-)
            </Text>
            <Text style={styles.feeValue} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.additionalDiscount || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel} allowFontScaling={false}>
              FINE(+)
            </Text>
            <Text style={styles.feeValue} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.fine || 0)}
            </Text>
          </View>
          <View style={styles.feeRowFinal}>
            <Text style={styles.feeLabelFinal} allowFontScaling={false}>
              BALANCE
            </Text>
            <Text style={styles.feeValueFinal} allowFontScaling={false}>
              INR {formatCurrency(selectedStudent?.balanceFee || 0)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2c5282" barStyle="light-content" />
      <ScrollView style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  content: {
    flex: 1,
  },
  container: {
    padding: 12,
    paddingTop: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallDropdown: {
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
  dropdownText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  placeholder: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "bold",
  },
  noData: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "white",
    marginHorizontal: 12,
    paddingVertical: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  noDataText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#6366f1",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 12,
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
  summaryScrollView: {
    marginBottom: 12,
  },
  summaryScrollContent: {
    paddingRight: 12,
  },
  summaryCard: {
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    minWidth: 120,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 14,
  },
  summaryValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
  studentsList: {
    flex: 1,
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  admissionNumberBadge: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },
  admissionNumberText: {
    fontSize: 11,
    color: "#0369a1",
    fontWeight: "600",
  },
  moreIcon: {
    fontSize: 18,
    color: "#666",
  },
  studentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
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
  fatherName: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  balanceSection: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  balanceBadge: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  balanceAmount: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  // Fee Report Styles
  feeReportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
  },
  backButtonText: {
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "600",
  },
  feeReportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  feeReportContent: {
    flex: 1,
  },
  studentInfoCard: {
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  studentInfoDetails: {
    flex: 1,
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
  detailsGrid: {
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
  detailRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
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
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  feeRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  feeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  feeLabelBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  feeLabelFinal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "right",
  },
  feeValueBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textAlign: "right",
  },
  feeValueFinal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
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
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: "600",
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 3,
  },
  studentInfoDetails: {
    flex: 1,
  },
  callIcon: {
    fontSize: 20,
    color: "#10b981",
    marginLeft: 12,
  },
})

export default BalanceFeeReport;
