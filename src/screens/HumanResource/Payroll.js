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
  Modal,
  Alert,
} from "react-native"
import DropdownComponent from "./DropdownComponent" // Import DropdownComponent

const { width } = Dimensions.get("window")

const Payroll = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [searchText, setSearchText] = useState("")
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [payrollData, setPayrollData] = useState([])
  const [filteredPayroll, setFilteredPayroll] = useState([])
  const [selectedPayroll, setSelectedPayroll] = useState(null)
  const [showPayrollModal, setShowPayrollModal] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [showPayslipModal, setShowPayslipModal] = useState(false)
  const [selectedPayslipData, setSelectedPayslipData] = useState(null)

  // Filter options
  const departments = [
    "All Departments",
    "Administration",
    "Academic",
    "Science",
    "Mathematics",
    "English",
    "Social Studies",
    "Physical Education",
    "Arts & Crafts",
    "Library",
    "IT Department",
    "Counseling",
    "Support Staff",
  ]

  const months = [
    "All Months",
    "January 2024",
    "February 2024",
    "March 2024",
    "April 2024",
    "May 2024",
    "June 2024",
    "July 2024",
    "August 2024",
    "September 2024",
    "October 2024",
    "November 2024",
    "December 2024",
  ]

  const paymentStatus = ["All Status", "Paid", "Pending", "Processing", "Hold"]

  // Sample payroll data
  const payrollDirectoryData = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "Dr. Rajesh Kumar",
      designation: "Principal",
      department: "Administration",
      month: "November 2024",
      basicSalary: 85000,
      allowances: {
        hra: 25500,
        da: 8500,
        medical: 5000,
        transport: 3000,
        special: 10000,
      },
      deductions: {
        pf: 10200,
        esi: 850,
        tax: 12000,
        loan: 5000,
        other: 0,
      },
      overtime: 0,
      bonus: 15000,
      netSalary: 124950,
      paymentStatus: "Paid",
      paymentDate: "2024-11-30",
      paymentMethod: "Bank Transfer",
      bankAccount: "****1234",
      workingDays: 22,
      totalDays: 22,
      leaves: 0,
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Mrs. Priya Sharma",
      designation: "Vice Principal",
      department: "Administration",
      month: "November 2024",
      basicSalary: 65000,
      allowances: {
        hra: 19500,
        da: 6500,
        medical: 4000,
        transport: 2500,
        special: 8000,
      },
      deductions: {
        pf: 7800,
        esi: 650,
        tax: 8500,
        loan: 0,
        other: 500,
      },
      overtime: 0,
      bonus: 10000,
      netSalary: 98050,
      paymentStatus: "Paid",
      paymentDate: "2024-11-30",
      paymentMethod: "Bank Transfer",
      bankAccount: "****5678",
      workingDays: 22,
      totalDays: 22,
      leaves: 0,
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Mr. Amit Patel",
      designation: "Head of Department",
      department: "Mathematics",
      month: "November 2024",
      basicSalary: 55000,
      allowances: {
        hra: 16500,
        da: 5500,
        medical: 3500,
        transport: 2000,
        special: 6000,
      },
      deductions: {
        pf: 6600,
        esi: 550,
        tax: 6500,
        loan: 3000,
        other: 0,
      },
      overtime: 2500,
      bonus: 8000,
      netSalary: 79850,
      paymentStatus: "Processing",
      paymentDate: null,
      paymentMethod: "Bank Transfer",
      bankAccount: "****9012",
      workingDays: 22,
      totalDays: 22,
      leaves: 0,
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Ms. Sunita Singh",
      designation: "Senior Teacher",
      department: "English",
      month: "November 2024",
      basicSalary: 48000,
      allowances: {
        hra: 14400,
        da: 4800,
        medical: 3000,
        transport: 1800,
        special: 5000,
      },
      deductions: {
        pf: 5760,
        esi: 480,
        tax: 5200,
        loan: 2000,
        other: 0,
      },
      overtime: 1500,
      bonus: 6000,
      netSalary: 70258,
      paymentStatus: "Pending",
      paymentDate: null,
      paymentMethod: "Bank Transfer",
      bankAccount: "****3456",
      workingDays: 20,
      totalDays: 22,
      leaves: 2,
    },
    {
      id: 5,
      employeeId: "EMP005",
      name: "Dr. Meera Joshi",
      designation: "Head of Department",
      department: "Science",
      month: "November 2024",
      basicSalary: 58000,
      allowances: {
        hra: 17400,
        da: 5800,
        medical: 3500,
        transport: 2200,
        special: 7000,
      },
      deductions: {
        pf: 6960,
        esi: 580,
        tax: 7000,
        loan: 0,
        other: 1000,
      },
      overtime: 0,
      bonus: 8500,
      netSalary: 85860,
      paymentStatus: "Hold",
      paymentDate: null,
      paymentMethod: "Bank Transfer",
      bankAccount: "****7890",
      workingDays: 22,
      totalDays: 22,
      leaves: 0,
    },
    {
      id: 6,
      employeeId: "EMP006",
      name: "Mr. Vikash Kumar",
      designation: "Teacher",
      department: "Physical Education",
      month: "November 2024",
      basicSalary: 42000,
      allowances: {
        hra: 12600,
        da: 4200,
        medical: 2500,
        transport: 1500,
        special: 4000,
      },
      deductions: {
        pf: 5040,
        esi: 420,
        tax: 4000,
        loan: 1500,
        other: 0,
      },
      overtime: 3000,
      bonus: 5000,
      netSalary: 62840,
      paymentStatus: "Paid",
      paymentDate: "2024-11-30",
      paymentMethod: "Bank Transfer",
      bankAccount: "****2468",
      workingDays: 22,
      totalDays: 22,
      leaves: 0,
    },
  ]

  useEffect(() => {
    setPayrollData(payrollDirectoryData)
    filterPayroll(payrollDirectoryData)
  }, [])

  useEffect(() => {
    filterPayroll(payrollData)
  }, [selectedDepartment, selectedMonth, selectedStatus, searchText, payrollData])

  const filterPayroll = (data) => {
    let filtered = data

    // Filter by department
    if (selectedDepartment && selectedDepartment !== "All Departments") {
      filtered = filtered.filter((payroll) => payroll.department === selectedDepartment)
    }

    // Filter by month
    if (selectedMonth && selectedMonth !== "All Months") {
      filtered = filtered.filter((payroll) => payroll.month === selectedMonth)
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "All Status") {
      filtered = filtered.filter((payroll) => payroll.paymentStatus === selectedStatus)
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (payroll) =>
          payroll.name.toLowerCase().includes(searchLower) ||
          payroll.department.toLowerCase().includes(searchLower) ||
          payroll.designation.toLowerCase().includes(searchLower) ||
          payroll.employeeId.toLowerCase().includes(searchLower),
      )
    }

    setFilteredPayroll(filtered)
  }

  const closeAllDropdowns = () => {
    setShowDepartmentDropdown(false)
    setShowMonthDropdown(false)
    setShowStatusDropdown(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      Paid: "#10b981",
      Pending: "#f59e0b",
      Processing: "#3b82f6",
      Hold: "#ef4444",
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      Paid: "check-circle",
      Pending: "clock",
      Processing: "sync",
      Hold: "pause-circle",
    }
    return icons[status] || "help-circle"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handlePayrollPress = (payroll) => {
    setSelectedPayroll(payroll)
    setShowPayrollModal(true)
  }

  const closePayrollModal = () => {
    setShowPayrollModal(false)
    setSelectedPayroll(null)
  }

  const handleExportPayroll = () => {
    Alert.alert("Export Payroll", "Choose export format:", [
      { text: "PDF", onPress: () => Alert.alert("Success", "Payroll exported as PDF") },
      { text: "Excel", onPress: () => Alert.alert("Success", "Payroll exported as Excel") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const calculateMonthlySummary = () => {
    const currentMonth = selectedMonth || "November 2024"
    const monthlyData = filteredPayroll.filter((p) => p.month === currentMonth)

    const summary = {
      totalEmployees: monthlyData.length,
      totalGrossSalary: 0,
      totalNetSalary: 0,
      totalDeductions: 0,
      departmentWise: {},
      statusWise: { Paid: 0, Pending: 0, Processing: 0, Hold: 0 },
      month: currentMonth,
    }

    monthlyData.forEach((payroll) => {
      const totalAllowances = Object.values(payroll.allowances).reduce((sum, amount) => sum + amount, 0)
      const totalDeductions = Object.values(payroll.deductions).reduce((sum, amount) => sum + amount, 0)
      const grossSalary = payroll.basicSalary + totalAllowances + payroll.overtime + payroll.bonus

      summary.totalGrossSalary += grossSalary
      summary.totalNetSalary += payroll.netSalary
      summary.totalDeductions += totalDeductions

      // Department wise summary
      if (!summary.departmentWise[payroll.department]) {
        summary.departmentWise[payroll.department] = {
          count: 0,
          totalNet: 0,
          totalGross: 0,
        }
      }
      summary.departmentWise[payroll.department].count += 1
      summary.departmentWise[payroll.department].totalNet += payroll.netSalary
      summary.departmentWise[payroll.department].totalGross += grossSalary

      // Status wise summary
      summary.statusWise[payroll.paymentStatus] += 1
    })

    return summary
  }

  const handleShowSummary = () => {
    setShowSummaryModal(true)
  }

  const handleGeneratePayslip = (payroll) => {
    setSelectedPayslipData(payroll)
    setShowPayslipModal(true)
  }

  const handleDownloadPayslip = () => {
    Alert.alert("Download Payslip", "Choose download format:", [
      { text: "PDF", onPress: () => Alert.alert("Success", "Payslip downloaded as PDF") },
      { text: "Image", onPress: () => Alert.alert("Success", "Payslip saved as Image") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleEmailPayslip = () => {
    Alert.alert("Email Payslip", `Payslip sent to ${selectedPayslipData?.email || "employee email"}`)
  }

  const PayrollCard = ({ payroll }) => (
    <TouchableOpacity style={styles.payrollCard} onPress={() => handlePayrollPress(payroll)} activeOpacity={0.7}>
      <View style={styles.payrollHeader}>
        <View style={styles.payrollInfo}>
          <View style={styles.payrollAvatar}>
            <Icon name="account-cash" size={24} color="#6366f1" />
          </View>
          <View style={styles.payrollDetails}>
            <Text style={styles.payrollName} allowFontScaling={false}>
              {payroll.name}
            </Text>
            <Text style={styles.payrollDesignation} allowFontScaling={false}>
              {payroll.designation}
            </Text>
            <Text style={styles.payrollDepartment} allowFontScaling={false}>
              {payroll.department}
            </Text>
            <Text style={styles.employeeId} allowFontScaling={false}>
              ID: {payroll.employeeId}
            </Text>
          </View>
        </View>
        <View style={styles.payrollAmount}>
          <Text style={styles.netSalary} allowFontScaling={false}>
            {formatCurrency(payroll.netSalary)}
          </Text>
          <View style={styles.statusContainer}>
            <Icon name={getStatusIcon(payroll.paymentStatus)} size={14} color={getStatusColor(payroll.paymentStatus)} />
            <Text
              style={[styles.statusText, { color: getStatusColor(payroll.paymentStatus) }]}
              allowFontScaling={false}
            >
              {payroll.paymentStatus}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.payrollFooter}>
        <View style={styles.monthInfo}>
          <Icon name="calendar" size={14} color="#6b7280" />
          <Text style={styles.monthText} allowFontScaling={false}>
            {payroll.month}
          </Text>
        </View>
        <View style={styles.attendanceInfo}>
          <Icon name="calendar-check" size={14} color="#6b7280" />
          <Text style={styles.attendanceText} allowFontScaling={false}>
            {payroll.workingDays}/{payroll.totalDays} days
          </Text>
        </View>
      </View>
      <View style={styles.payrollActions}>
        <TouchableOpacity style={styles.payslipButton} onPress={() => handleGeneratePayslip(payroll)}>
          <Icon name="file-document" size={14} color="#6366f1" />
          <Text style={styles.payslipButtonText} allowFontScaling={false}>
            Payslip
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const PayrollDetailModal = ({ payroll, visible, onClose }) => {
    if (!payroll) return null

    const totalAllowances = Object.values(payroll.allowances).reduce((sum, amount) => sum + amount, 0)
    const totalDeductions = Object.values(payroll.deductions).reduce((sum, amount) => sum + amount, 0)
    const grossSalary = payroll.basicSalary + totalAllowances + payroll.overtime + payroll.bonus

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Payroll Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Employee Info */}
            <View style={styles.modalEmployeeHeader}>
              <View style={styles.modalEmployeeAvatar}>
                <Icon name="account-cash" size={32} color="#6366f1" />
              </View>
              <View style={styles.modalEmployeeInfo}>
                <Text style={styles.modalEmployeeName} allowFontScaling={false}>
                  {payroll.name}
                </Text>
                <Text style={styles.modalEmployeeDesignation} allowFontScaling={false}>
                  {payroll.designation}
                </Text>
                <Text style={styles.modalEmployeeDepartment} allowFontScaling={false}>
                  {payroll.department}
                </Text>
                <Text style={styles.modalEmployeeId} allowFontScaling={false}>
                  Employee ID: {payroll.employeeId}
                </Text>
              </View>
              <View style={styles.modalStatusContainer}>
                <Icon
                  name={getStatusIcon(payroll.paymentStatus)}
                  size={16}
                  color={getStatusColor(payroll.paymentStatus)}
                />
                <Text
                  style={[styles.modalStatusText, { color: getStatusColor(payroll.paymentStatus) }]}
                  allowFontScaling={false}
                >
                  {payroll.paymentStatus}
                </Text>
              </View>
            </View>

            {/* Salary Summary */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Salary Summary - {payroll.month}
              </Text>
              <View style={styles.salarySummaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Gross Salary
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {formatCurrency(grossSalary)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Total Deductions
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#ef4444" }]} allowFontScaling={false}>
                    -{formatCurrency(totalDeductions)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.netSalaryRow]}>
                  <Text style={styles.netSalaryLabel} allowFontScaling={false}>
                    Net Salary
                  </Text>
                  <Text style={styles.netSalaryValue} allowFontScaling={false}>
                    {formatCurrency(payroll.netSalary)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Earnings Breakdown */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Earnings Breakdown
              </Text>
              <View style={styles.breakdownCard}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    Basic Salary
                  </Text>
                  <Text style={styles.breakdownValue} allowFontScaling={false}>
                    {formatCurrency(payroll.basicSalary)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    HRA
                  </Text>
                  <Text style={styles.breakdownValue} allowFontScaling={false}>
                    {formatCurrency(payroll.allowances.hra)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    DA
                  </Text>
                  <Text style={styles.breakdownValue} allowFontScaling={false}>
                    {formatCurrency(payroll.allowances.da)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    Medical Allowance
                  </Text>
                  <Text style={styles.breakdownValue} allowFontScaling={false}>
                    {formatCurrency(payroll.allowances.medical)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    Transport Allowance
                  </Text>
                  <Text style={styles.breakdownValue} allowFontScaling={false}>
                    {formatCurrency(payroll.allowances.transport)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    Special Allowance
                  </Text>
                  <Text style={styles.breakdownValue} allowFontScaling={false}>
                    {formatCurrency(payroll.allowances.special)}
                  </Text>
                </View>
                {payroll.overtime > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel} allowFontScaling={false}>
                      Overtime
                    </Text>
                    <Text style={styles.breakdownValue} allowFontScaling={false}>
                      {formatCurrency(payroll.overtime)}
                    </Text>
                  </View>
                )}
                {payroll.bonus > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel} allowFontScaling={false}>
                      Bonus
                    </Text>
                    <Text style={styles.breakdownValue} allowFontScaling={false}>
                      {formatCurrency(payroll.bonus)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Deductions Breakdown */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Deductions Breakdown
              </Text>
              <View style={styles.breakdownCard}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    Provident Fund
                  </Text>
                  <Text style={[styles.breakdownValue, { color: "#ef4444" }]} allowFontScaling={false}>
                    -{formatCurrency(payroll.deductions.pf)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    ESI
                  </Text>
                  <Text style={[styles.breakdownValue, { color: "#ef4444" }]} allowFontScaling={false}>
                    -{formatCurrency(payroll.deductions.esi)}
                  </Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} allowFontScaling={false}>
                    Income Tax
                  </Text>
                  <Text style={[styles.breakdownValue, { color: "#ef4444" }]} allowFontScaling={false}>
                    -{formatCurrency(payroll.deductions.tax)}
                  </Text>
                </View>
                {payroll.deductions.loan > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel} allowFontScaling={false}>
                      Loan Deduction
                    </Text>
                    <Text style={[styles.breakdownValue, { color: "#ef4444" }]} allowFontScaling={false}>
                      -{formatCurrency(payroll.deductions.loan)}
                    </Text>
                  </View>
                )}
                {payroll.deductions.other > 0 && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel} allowFontScaling={false}>
                      Other Deductions
                    </Text>
                    <Text style={[styles.breakdownValue, { color: "#ef4444" }]} allowFontScaling={false}>
                      -{formatCurrency(payroll.deductions.other)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Attendance & Payment Info */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Attendance & Payment Information
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-check" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Working Days
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {payroll.workingDays} / {payroll.totalDays}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-remove" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Leaves Taken
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {payroll.leaves} days
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="credit-card" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Payment Method
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {payroll.paymentMethod}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="bank" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Bank Account
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {payroll.bankAccount}
                    </Text>
                  </View>
                </View>
                {payroll.paymentDate && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="calendar-clock" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Payment Date
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {payroll.paymentDate}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const MonthlySummaryModal = ({ visible, onClose }) => {
    const summary = calculateMonthlySummary()

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Monthly Payroll Summary
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Summary Header */}
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryMonth} allowFontScaling={false}>
                {summary.month}
              </Text>
              <Text style={styles.summaryEmployeeCount} allowFontScaling={false}>
                {summary.totalEmployees} Employees
              </Text>
            </View>

            {/* Financial Summary */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Financial Overview
              </Text>
              <View style={styles.financialSummaryCard}>
                <View style={styles.financialItem}>
                  <View style={styles.financialIconContainer}>
                    <Icon name="cash-multiple" size={24} color="#10b981" />
                  </View>
                  <View style={styles.financialDetails}>
                    <Text style={styles.financialLabel} allowFontScaling={false}>
                      Total Gross Salary
                    </Text>
                    <Text style={styles.financialValue} allowFontScaling={false}>
                      {formatCurrency(summary.totalGrossSalary)}
                    </Text>
                  </View>
                </View>
                <View style={styles.financialItem}>
                  <View style={styles.financialIconContainer}>
                    <Icon name="cash-minus" size={24} color="#ef4444" />
                  </View>
                  <View style={styles.financialDetails}>
                    <Text style={styles.financialLabel} allowFontScaling={false}>
                      Total Deductions
                    </Text>
                    <Text style={styles.financialValue} allowFontScaling={false}>
                      {formatCurrency(summary.totalDeductions)}
                    </Text>
                  </View>
                </View>
                <View style={styles.financialItem}>
                  <View style={styles.financialIconContainer}>
                    <Icon name="cash-check" size={24} color="#6366f1" />
                  </View>
                  <View style={styles.financialDetails}>
                    <Text style={styles.financialLabel} allowFontScaling={false}>
                      Total Net Salary
                    </Text>
                    <Text style={[styles.financialValue, styles.netSalaryHighlight]} allowFontScaling={false}>
                      {formatCurrency(summary.totalNetSalary)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Department Wise Summary */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Department Wise Breakdown
              </Text>
              <View style={styles.departmentSummaryCard}>
                {Object.entries(summary.departmentWise).map(([dept, data]) => (
                  <View key={dept} style={styles.departmentSummaryItem}>
                    <View style={styles.departmentInfo}>
                      <Text style={styles.departmentName} allowFontScaling={false}>
                        {dept}
                      </Text>
                      <Text style={styles.departmentCount} allowFontScaling={false}>
                        {data.count} employees
                      </Text>
                    </View>
                    <View style={styles.departmentAmount}>
                      <Text style={styles.departmentNetSalary} allowFontScaling={false}>
                        {formatCurrency(data.totalNet)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Payment Status Summary */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Payment Status Overview
              </Text>
              <View style={styles.statusSummaryCard}>
                {Object.entries(summary.statusWise).map(([status, count]) => (
                  <View key={status} style={styles.statusSummaryItem}>
                    <View style={styles.statusIndicator}>
                      <Icon name={getStatusIcon(status)} size={20} color={getStatusColor(status)} />
                    </View>
                    <View style={styles.statusDetails}>
                      <Text style={styles.statusName} allowFontScaling={false}>
                        {status}
                      </Text>
                      <Text style={styles.statusCount} allowFontScaling={false}>
                        {count} employees
                      </Text>
                    </View>
                    <View style={styles.statusPercentage}>
                      <Text style={styles.statusPercent} allowFontScaling={false}>
                        {summary.totalEmployees > 0 ? Math.round((count / summary.totalEmployees) * 100) : 0}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const PayslipModal = ({ payroll, visible, onClose }) => {
    if (!payroll) return null

    const totalAllowances = Object.values(payroll.allowances).reduce((sum, amount) => sum + amount, 0)
    const totalDeductions = Object.values(payroll.deductions).reduce((sum, amount) => sum + amount, 0)
    const grossSalary = payroll.basicSalary + totalAllowances + payroll.overtime + payroll.bonus

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
        <View style={styles.payslipContainer}>
          <View style={styles.payslipHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.payslipTitle} allowFontScaling={false}>
              Payslip
            </Text>
            <View style={styles.payslipActions}>
              <TouchableOpacity style={styles.payslipActionButton} onPress={handleEmailPayslip}>
                <Icon name="email" size={18} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.payslipActionButton} onPress={handleDownloadPayslip}>
                <Icon name="download" size={18} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.payslipContent} showsVerticalScrollIndicator={false}>
            {/* School Header */}
            <View style={styles.payslipSchoolHeader}>
              <Text style={styles.schoolName} allowFontScaling={false}>
                ABC International School
              </Text>
              <Text style={styles.schoolAddress} allowFontScaling={false}>
                123 Education Street, City - 123456
              </Text>
              <Text style={styles.payslipSubtitle} allowFontScaling={false}>
                SALARY SLIP
              </Text>
            </View>

            {/* Employee Details */}
            <View style={styles.payslipEmployeeSection}>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Employee Name:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.name}
                </Text>
              </View>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Employee ID:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.employeeId}
                </Text>
              </View>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Designation:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.designation}
                </Text>
              </View>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Department:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.department}
                </Text>
              </View>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Pay Period:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.month}
                </Text>
              </View>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Working Days:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.workingDays}/{payroll.totalDays}
                </Text>
              </View>
            </View>

            {/* Earnings and Deductions Table */}
            <View style={styles.payslipTable}>
              <View style={styles.payslipTableHeader}>
                <Text style={styles.payslipTableTitle} allowFontScaling={false}>
                  EARNINGS
                </Text>
                <Text style={styles.payslipTableTitle} allowFontScaling={false}>
                  DEDUCTIONS
                </Text>
              </View>

              <View style={styles.payslipTableContent}>
                <View style={styles.payslipTableColumn}>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      Basic Salary
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.basicSalary)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      HRA
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.allowances.hra)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      DA
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.allowances.da)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      Medical Allowance
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.allowances.medical)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      Transport Allowance
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.allowances.transport)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      Special Allowance
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.allowances.special)}
                    </Text>
                  </View>
                  {payroll.overtime > 0 && (
                    <View style={styles.payslipTableRow}>
                      <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                        Overtime
                      </Text>
                      <Text style={styles.payslipTableValue} allowFontScaling={false}>
                        {formatCurrency(payroll.overtime)}
                      </Text>
                    </View>
                  )}
                  {payroll.bonus > 0 && (
                    <View style={styles.payslipTableRow}>
                      <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                        Bonus
                      </Text>
                      <Text style={styles.payslipTableValue} allowFontScaling={false}>
                        {formatCurrency(payroll.bonus)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.payslipTableColumn}>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      Provident Fund
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.deductions.pf)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      ESI
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.deductions.esi)}
                    </Text>
                  </View>
                  <View style={styles.payslipTableRow}>
                    <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                      Income Tax
                    </Text>
                    <Text style={styles.payslipTableValue} allowFontScaling={false}>
                      {formatCurrency(payroll.deductions.tax)}
                    </Text>
                  </View>
                  {payroll.deductions.loan > 0 && (
                    <View style={styles.payslipTableRow}>
                      <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                        Loan Deduction
                      </Text>
                      <Text style={styles.payslipTableValue} allowFontScaling={false}>
                        {formatCurrency(payroll.deductions.loan)}
                      </Text>
                    </View>
                  )}
                  {payroll.deductions.other > 0 && (
                    <View style={styles.payslipTableRow}>
                      <Text style={styles.payslipTableLabel} allowFontScaling={false}>
                        Other Deductions
                      </Text>
                      <Text style={styles.payslipTableValue} allowFontScaling={false}>
                        {formatCurrency(payroll.deductions.other)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Totals */}
              <View style={styles.payslipTotals}>
                <View style={styles.payslipTotalRow}>
                  <Text style={styles.payslipTotalLabel} allowFontScaling={false}>
                    Total Earnings
                  </Text>
                  <Text style={styles.payslipTotalValue} allowFontScaling={false}>
                    {formatCurrency(grossSalary)}
                  </Text>
                </View>
                <View style={styles.payslipTotalRow}>
                  <Text style={styles.payslipTotalLabel} allowFontScaling={false}>
                    Total Deductions
                  </Text>
                  <Text style={styles.payslipTotalValue} allowFontScaling={false}>
                    {formatCurrency(totalDeductions)}
                  </Text>
                </View>
                <View style={[styles.payslipTotalRow, styles.netSalaryTotalRow]}>
                  <Text style={styles.payslipNetLabel} allowFontScaling={false}>
                    NET SALARY
                  </Text>
                  <Text style={styles.payslipNetValue} allowFontScaling={false}>
                    {formatCurrency(payroll.netSalary)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Details */}
            <View style={styles.payslipPaymentSection}>
              <Text style={styles.payslipSectionTitle} allowFontScaling={false}>
                Payment Details
              </Text>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Payment Method:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.paymentMethod}
                </Text>
              </View>
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Bank Account:
                </Text>
                <Text style={styles.payslipValue} allowFontScaling={false}>
                  {payroll.bankAccount}
                </Text>
              </View>
              {payroll.paymentDate && (
                <View style={styles.payslipRow}>
                  <Text style={styles.payslipLabel} allowFontScaling={false}>
                    Payment Date:
                  </Text>
                  <Text style={styles.payslipValue} allowFontScaling={false}>
                    {payroll.paymentDate}
                  </Text>
                </View>
              )}
              <View style={styles.payslipRow}>
                <Text style={styles.payslipLabel} allowFontScaling={false}>
                  Status:
                </Text>
                <Text
                  style={[styles.payslipValue, { color: getStatusColor(payroll.paymentStatus) }]}
                  allowFontScaling={false}
                >
                  {payroll.paymentStatus}
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.payslipFooter}>
              <Text style={styles.payslipFooterText} allowFontScaling={false}>
                This is a computer generated payslip and does not require signature.
              </Text>
              <Text style={styles.payslipFooterText} allowFontScaling={false}>
                Generated on: {new Date().toLocaleDateString()}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              Staff Payroll
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Manage and track staff salary payments
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.summaryButton} onPress={handleShowSummary}>
              <Icon name="chart-pie" size={18} color="#6366f1" />
              {/* <Text style={styles.summaryButtonText} allowFontScaling={false}>
                Summary
              </Text> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton} onPress={handleExportPayroll}>
              <Icon name="download" size={18} color="#6366f1" />
              {/* <Text style={styles.exportButtonText} allowFontScaling={false}>
                Export
              </Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, department, or employee ID..."
            value={searchText}
            onChangeText={setSearchText}
            allowFontScaling={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Department"
              value={selectedDepartment}
              options={departments}
              isOpen={showDepartmentDropdown}
              onToggle={() => {
                setShowDepartmentDropdown(!showDepartmentDropdown)
                setShowMonthDropdown(false)
                setShowStatusDropdown(false)
              }}
              onSelect={(department) => {
                setSelectedDepartment(department)
                setShowDepartmentDropdown(false)
              }}
              placeholder="All Departments"
            />
            <DropdownComponent
              label="Month"
              value={selectedMonth}
              options={months}
              isOpen={showMonthDropdown}
              onToggle={() => {
                setShowMonthDropdown(!showMonthDropdown)
                setShowDepartmentDropdown(false)
                setShowStatusDropdown(false)
              }}
              onSelect={(month) => {
                setSelectedMonth(month)
                setShowMonthDropdown(false)
              }}
              placeholder="All Months"
            />
          </View>
          <View style={styles.statusDropdownContainer}>
            <DropdownComponent
              label="Payment Status"
              value={selectedStatus}
              options={paymentStatus}
              isOpen={showStatusDropdown}
              onToggle={() => {
                setShowStatusDropdown(!showStatusDropdown)
                setShowDepartmentDropdown(false)
                setShowMonthDropdown(false)
              }}
              onSelect={(status) => {
                setSelectedStatus(status)
                setShowStatusDropdown(false)
              }}
              placeholder="All Status"
            />
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredPayroll.length} of {payrollData.length} payroll records
          </Text>
          {(selectedDepartment || selectedMonth || selectedStatus || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedDepartment("")
                setSelectedMonth("")
                setSelectedStatus("")
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {/* Payroll List */}
          <View style={styles.payrollContainer}>
            <FlatList
              data={filteredPayroll}
              renderItem={({ item }) => <PayrollCard payroll={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon} allowFontScaling={false}>
                    💰
                  </Text>
                  <Text style={styles.emptyTitle} allowFontScaling={false}>
                    No Payroll Records Found
                  </Text>
                  <Text style={styles.emptyText} allowFontScaling={false}>
                    No payroll records match your search criteria. Try adjusting your filters.
                  </Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>

        {/* Payroll Detail Modal */}
        <PayrollDetailModal payroll={selectedPayroll} visible={showPayrollModal} onClose={closePayrollModal} />

        {/* Monthly Summary Modal */}
        <MonthlySummaryModal visible={showSummaryModal} onClose={() => setShowSummaryModal(false)} />

        {/* Payslip Modal */}
        <PayslipModal
          payroll={selectedPayslipData}
          visible={showPayslipModal}
          onClose={() => setShowPayslipModal(false)}
        />
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  exportButton: {
    backgroundColor: "#ffffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6366f1",
    gap: 6,
  },
  exportButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  statusDropdownContainer: {
    width: "48%",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  overlay: {
    flex: 1,
  },
  payrollContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  payrollCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
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
  payrollHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  payrollInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  payrollAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  payrollDetails: {
    flex: 1,
  },
  payrollName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payrollDesignation: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payrollDepartment: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  employeeId: {
    fontSize: 12,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payrollAmount: {
    alignItems: "flex-end",
  },
  netSalary: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payrollFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  monthInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  monthText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  attendanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  attendanceText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
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
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalEmployeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 20,
  },
  modalEmployeeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  modalEmployeeInfo: {
    flex: 1,
  },
  modalEmployeeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalEmployeeDesignation: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalEmployeeDepartment: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalEmployeeId: {
    fontSize: 13,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  salarySummaryCard: {
    backgroundColor: "#f8f9fb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  netSalaryRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
    paddingTop: 12,
  },
  netSalaryLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  netSalaryValue: {
    fontSize: 18,
    color: "#10b981",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  breakdownCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  breakdownValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalInfoGrid: {
    gap: 12,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  modalInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalInfoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  summaryButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  summaryButton: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6366f1",
    gap: 6,
  },
  summaryButtonText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payrollActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  payslipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  payslipButtonText: {
    color: "#6366f1",
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // Monthly Summary Styles
  summaryHeader: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 20,
  },
  summaryMonth: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryEmployeeCount: {
    fontSize: 16,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  financialSummaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    gap: 16,
  },
  financialItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  financialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8f9fb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  financialDetails: {
    flex: 1,
  },
  financialLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  financialValue: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  netSalaryHighlight: {
    color: "#10b981",
  },
  departmentSummaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  departmentSummaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  departmentCount: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  departmentAmount: {
    alignItems: "flex-end",
  },
  departmentNetSalary: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusSummaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusSummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusDetails: {
    flex: 1,
  },
  statusName: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusCount: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusPercentage: {
    alignItems: "flex-end",
  },
  statusPercent: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // Payslip Styles
  payslipContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  payslipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  payslipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipActions: {
    flexDirection: "row",
    gap: 8,
  },
  payslipActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  payslipContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  payslipSchoolHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#6366f1",
    marginBottom: 24,
  },
  schoolName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  schoolAddress: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6366f1",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipEmployeeSection: {
    backgroundColor: "#f8f9fb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  payslipRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  payslipLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipTable: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  payslipTableHeader: {
    flexDirection: "row",
    backgroundColor: "#6366f1",
    paddingVertical: 12,
  },
  payslipTableTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipTableContent: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  payslipTableColumn: {
    flex: 1,
  },
  payslipTableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  payslipTableLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    flex: 1,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipTableValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipTotals: {
    backgroundColor: "#f8f9fb",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  payslipTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  payslipTotalLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipTotalValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  netSalaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
    paddingTop: 12,
  },
  payslipNetLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipNetValue: {
    fontSize: 18,
    color: "#10b981",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipPaymentSection: {
    backgroundColor: "#f8f9fb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  payslipSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  payslipFooter: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginBottom: 40,
  },
  payslipFooterText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default Payroll
