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
  BackHandler, // Add this import
} from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';

const FeeStatement = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTab, setSelectedTab] = useState("paid")
  const [searchText, setSearchText] = useState("")
  const [selectedRecord, setSelectedRecord] = useState(null) // New state for selected record

  // Add this useEffect after all useState declarations
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 4) {
        // If in detailed view, go back to step 2
        handleBackFromDetail()
        return true
      } else if (currentStep === 2) {
        // If in step 2, go back to step 1
        setCurrentStep(1)
        return true
      } else if (currentStep === 1) {
        // If in step 1, show exit confirmation
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
  const students = ["lakh asda", "John Doe", "Jane Smith", "Ali Khan"]

  const paidRecords = [
    {
      id: 1,
      receiptNo: "234",
      period: "November-December",
      date: "17-06-2025",
      amount: 1800,
      status: "Paid",
      admissionNumber: "PNGWing/45454",
      mobileNumber: "2222044545",
      guardianName: "Guardian Name",
      guardianPhone: "1234567890",
      paymentMode: "Online",
      feeGroup: "Transport-test1, Hostel-2, 5th class fee",
      feeCode: "Day -0012, T.P.S, H.S.F",
      description: "November-December",
    },
    {
      id: 2,
      receiptNo: "229",
      period: "October-October",
      date: "16-06-2025",
      amount: 341,
      status: "Paid",
      admissionNumber: "PNGWing/45454",
      mobileNumber: "2222044545",
      guardianName: "Guardian Name",
      guardianPhone: "1234567890",
      paymentMode: "Online",
      feeGroup: "Transport-test1, Hostel-2",
      feeCode: "Day -0012, T.P.S",
      description: "October-October",
    },
    {
      id: 3,
      receiptNo: "204",
      period: "July-October",
      date: "02-06-2025",
      amount: 500,
      status: "Paid",
      admissionNumber: "PNGWing/45454",
      mobileNumber: "2222044545",
      guardianName: "Guardian Name",
      guardianPhone: "1234567890",
      paymentMode: "Online",
      feeGroup: "Transport-test1, 5th class fee",
      feeCode: "Day -0012, H.S.F",
      description: "July-October",
    },
  ]

  const unpaidData = {
    totalUnpaid: 3892,
    dueFees: 513,
    totalAmount: 4405,
    dueFeeBreakdown: [
      { name: "Day -0012", amount: 200 },
      { name: "T.P.S", amount: 290 },
      { name: "H.S.F", amount: 23 },
    ],
    decemberFees: [
      { name: "Hostel-2", amount: 23 },
      { name: "5th class fee", amount: 200 },
    ],
  }

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
  const [showStudentModal, setShowStudentModal] = useState(false)

  const handleNext = () => {
    if (selectedClass && selectedSection && selectedStudent) {
      setCurrentStep(2)
    } else {
      Alert.alert("Error", "Please select class, section, and student")
    }
  }

  // New function to handle record click
  const handleRecordClick = (record) => {
    setSelectedRecord(record)
    setCurrentStep(4) // New step for detailed view
  }

  // New function to go back from detailed view
  const handleBackFromDetail = () => {
    setSelectedRecord(null)
    setCurrentStep(2)
  }

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

      <Text style={styles.label} allowFontScaling={false}>
        Student
      </Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setShowStudentModal(true)}>
        <Text style={[styles.dropdownText, !selectedStudent && styles.placeholder]} allowFontScaling={false}>
          {selectedStudent || "Select"}
        </Text>
        <Text style={styles.dropdownArrow} allowFontScaling={false}>
          ▼
        </Text>
      </TouchableOpacity>

      {selectedClass && selectedSection && selectedStudent ? (
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
      <DropdownModal
        visible={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        data={students}
        onSelect={setSelectedStudent}
        title="Select Student"
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
        Student
      </Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={styles.dropdownText} allowFontScaling={false}>
          {selectedStudent}
        </Text>
        <Text style={styles.dropdownArrow} allowFontScaling={false}>
          ▼
        </Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "paid" && styles.activeTab]}
          onPress={() => setSelectedTab("paid")}
        >
          <Text style={[styles.tabText, selectedTab === "paid" && styles.activeTabText]} allowFontScaling={false}>
            Paid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "unpaid" && styles.activeTab]}
          onPress={() => setSelectedTab("unpaid")}
        >
          <Text style={[styles.tabText, selectedTab === "unpaid" && styles.activeTabText]} allowFontScaling={false}>
            Unpaid
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "paid" && (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by month name, receipt no."
              value={searchText}
              onChangeText={setSearchText}
              allowFontScaling={false}
            />
            <Text style={styles.searchIcon} allowFontScaling={false}>
              🔍
            </Text>
          </View>

          <ScrollView style={styles.recordsList}>
            {paidRecords
              .filter((record) => {
                if (!searchText) return true
                const searchLower = searchText.toLowerCase()
                return (
                  record.period.toLowerCase().includes(searchLower) ||
                  record.receiptNo.toLowerCase().includes(searchLower)
                )
              })
              .map((record) => (
                <TouchableOpacity key={record.id} style={styles.recordCard} onPress={() => handleRecordClick(record)}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.receiptNo} allowFontScaling={false}>
                      Receipt No - {record.receiptNo}
                    </Text>
                    <Text style={styles.moreIcon} allowFontScaling={false}>
                      ⋯
                    </Text>
                  </View>
                  <Text style={styles.recordPeriod} allowFontScaling={false}>
                    {record.period}
                  </Text>
                  <Text style={styles.recordDate} allowFontScaling={false}>
                    Date - {record.date}
                  </Text>
                  <View style={styles.recordFooter}>
                    <Text style={styles.recordAmount} allowFontScaling={false}>
                      Paid Amount - INR {record.amount}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText} allowFontScaling={false}>
                        Paid
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </>
      )}
    </View>
  )

  const renderStep3 = () => (
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
        Student
      </Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={styles.dropdownText} allowFontScaling={false}>
          {selectedStudent}
        </Text>
        <Text style={styles.dropdownArrow} allowFontScaling={false}>
          ▼
        </Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "paid" && styles.activeTab]}
          onPress={() => setSelectedTab("paid")}
        >
          <Text style={[styles.tabText, selectedTab === "paid" && styles.activeTabText]} allowFontScaling={false}>
            Paid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "unpaid" && styles.activeTab]}
          onPress={() => setSelectedTab("unpaid")}
        >
          <Text style={[styles.tabText, selectedTab === "unpaid" && styles.activeTabText]} allowFontScaling={false}>
            Unpaid
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.unpaidContent}>
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel} allowFontScaling={false}>
              Total
            </Text>
            <Text style={styles.whatsappIcon} allowFontScaling={false}>
              💬
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel} allowFontScaling={false}>
              Unpaid
            </Text>
            <Text style={styles.totalValue} allowFontScaling={false}>
              {unpaidData.totalUnpaid}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel} allowFontScaling={false}>
              Due Fees
            </Text>
            <Text style={styles.totalValue} allowFontScaling={false}>
              {unpaidData.dueFees}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelBold} allowFontScaling={false}>
              Amount to be Paid
            </Text>
            <Text style={styles.totalValueBold} allowFontScaling={false}>
              INR {unpaidData.totalAmount}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              Due Fees
            </Text>
          </View>
          {unpaidData.dueFeeBreakdown.map((item, index) => (
            <View key={index} style={styles.feeRow}>
              <Text style={styles.feeLabel} allowFontScaling={false}>
                {item.name}
              </Text>
              <Text style={styles.feeAmount} allowFontScaling={false}>
                {item.amount}
              </Text>
            </View>
          ))}
          <View style={styles.totalFeeRow}>
            <Text style={styles.totalFeeLabel} allowFontScaling={false}>
              Total
            </Text>
            <Text style={styles.totalFeeAmount} allowFontScaling={false}>
              INR {unpaidData.dueFees}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              December
            </Text>
          </View>
          {unpaidData.decemberFees.map((item, index) => (
            <View key={index} style={styles.feeRow}>
              <Text style={styles.feeLabel} allowFontScaling={false}>
                {item.name}
              </Text>
              <Text style={styles.feeAmount} allowFontScaling={false}>
                {item.amount}
              </Text>
            </View>
          ))}
          <View style={styles.totalFeeRow}>
            <Text style={styles.totalFeeLabel} allowFontScaling={false}>
              Total
            </Text>
            <Text style={styles.totalFeeAmount} allowFontScaling={false}>
              INR {unpaidData.decemberFees.reduce((sum, item) => sum + item.amount, 0)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )

  // New detailed fee statement view
  const renderDetailedFeeStatement = () => (
    <View style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={handleBackFromDetail} style={styles.backButton}>
          <Text style={styles.backButtonText} allowFontScaling={false}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle} allowFontScaling={false}>
          FEE STATEMENT
        </Text>
      </View>

      <ScrollView style={styles.detailContent}>
        {/* Student Info Section */}
        <View style={styles.studentInfoCard}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {selectedStudent?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName} allowFontScaling={false}>
              {selectedStudent}
            </Text>
            <Text style={styles.studentClass} allowFontScaling={false}>
              Class - {selectedClass} ({selectedSection})
            </Text>
          </View>
          <Text style={styles.callIcon} allowFontScaling={false}>
            <Ionicons name='call' size='20' color='black' />
          </Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                ADMISSION NUMBER
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedRecord?.admissionNumber}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                MOBILE NUMBER
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedRecord?.mobileNumber}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                GUARDIAN NAME
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedRecord?.guardianName}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                GUARDIAN PHONE
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedRecord?.guardianPhone}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                STATUS
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {selectedRecord?.status}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                DOWNLOAD RECEIPT
              </Text>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadButtonText} allowFontScaling={false}>
                  Download ↓
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentDetailsCard}>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabel} allowFontScaling={false}>
              DATE
            </Text>
            <Text style={styles.paymentDetailValue} allowFontScaling={false}>
              {selectedRecord?.date}
            </Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabel} allowFontScaling={false}>
              RECEIPT NO
            </Text>
            <Text style={styles.paymentDetailValue} allowFontScaling={false}>
              {selectedRecord?.receiptNo}
            </Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabel} allowFontScaling={false}>
              PAYMENT MODE
            </Text>
            <Text style={styles.paymentDetailValue} allowFontScaling={false}>
              {selectedRecord?.paymentMode}
            </Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabel} allowFontScaling={false}>
              FEE GROUP
            </Text>
            <Text style={styles.paymentDetailValue} allowFontScaling={false}>
              {selectedRecord?.feeGroup}
            </Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabel} allowFontScaling={false}>
              FEE CODE
            </Text>
            <Text style={styles.paymentDetailValue} allowFontScaling={false}>
              {selectedRecord?.feeCode}
            </Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabel} allowFontScaling={false}>
              DESCRIPTION
            </Text>
            <Text style={styles.paymentDetailValue} allowFontScaling={false}>
              {selectedRecord?.description}
            </Text>
          </View>
          <View style={styles.paymentDetailRow}>
            <Text style={styles.paymentDetailLabelBold} allowFontScaling={false}>
              PAID AMOUNT
            </Text>
            <Text style={styles.paymentDetailValueBold} allowFontScaling={false}>
              INR {selectedRecord?.amount}
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
        {currentStep === 2 && selectedTab === "paid" && renderStep2()}
        {currentStep === 2 && selectedTab === "unpaid" && renderStep3()}
        {currentStep === 4 && renderDetailedFeeStatement()}
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
    paddingBottom: 80,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    marginTop: 10,
  },
  dropdown: {
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
  smallDropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 3,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noData: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "white",
    marginHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  noDataText: {
    fontSize: 15,
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
    fontSize: 14,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 3,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    padding: 9,
    alignItems: "center",
    borderRadius: 6,
    marginHorizontal: 1,
  },
  activeTab: {
    backgroundColor: "#6366f1",
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
    fontWeight: "700",
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
  recordsList: {
    marginBottom: 20, // Add some bottom margin instead
  },
  recordCard: {
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
  recordHeader: {
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
  moreIcon: {
    fontSize: 13,
    color: "#666",
  },
  recordPeriod: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  recordFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recordAmount: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusText: {
    color: "white",
    fontSize: 8,
    fontWeight: "700",
  },
  unpaidContent: {
    flex: 1,
  },
  totalCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  totalLabelBold: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "600",
  },
  totalValueBold: {
    fontSize: 13,
    color: "#ef4444",
    fontWeight: "700",
  },
  whatsappIcon: {
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  feeLabel: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  feeAmount: {
    fontSize: 11,
    color: "#111827",
    fontWeight: "600",
  },
  totalFeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
  },
  totalFeeLabel: {
    fontSize: 11,
    color: "#111827",
    fontWeight: "700",
  },
  totalFeeAmount: {
    fontSize: 11,
    color: "#6366f1",
    fontWeight: "700",
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
  // New styles for detailed view
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
  paymentDetailsCard: {
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
  paymentDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  paymentDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  paymentDetailLabelBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  paymentDetailValueBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  callIcon: {
    fontSize: 20,
    color: "#10b981",
    marginLeft: 12,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 3,
  },
})

export default FeeStatement;
