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

const TransactionReport = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDateRange, setSelectedDateRange] = useState("This Month")

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (currentStep === 2) {
        setCurrentStep(1)
        setSelectedTransaction(null)
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
  const transactionCategories = [
    "All",
    "Fee Collection",
    "Teacher Salaries",
    "Inventory Sales",
    "Expenses",
    "Other Income",
  ]

  const dateRanges = ["Today", "This Week", "This Month", "Last Month", "Custom"]

  const financialSummary = {
    totalIncome: 2450000,
    totalExpenses: 1680000,
    netProfit: 770000,
    totalTransactions: 47,
  }

  // Monthly trend data for bar chart
  const monthlyData = [
    { month: "Oct", income: 180000, expense: 120000 },
    { month: "Nov", income: 220000, expense: 140000 },
    { month: "Dec", income: 245000, expense: 168000 },
  ]

  // Aggregated monthly transactions
  const transactions = [
    {
      id: 1,
      transactionId: "FC-JAN-2025",
      date: "January 2025",
      category: "Fee Collection",
      type: "Income",
      amount: 2850000,
      status: "Completed",
      description: "Monthly Fee Collection",
      details: "485 students • Avg: ₹5,876 per student",
      breakdown: {
        tuitionFee: 2100000,
        transportFee: 450000,
        hostelFee: 300000,
      },
      paymentModes: {
        online: 70,
        cash: 20,
        cheque: 10,
      },
    },
    {
      id: 2,
      transactionId: "SAL-JAN-2025",
      date: "January 2025",
      category: "Teacher Salaries",
      type: "Expense",
      amount: 1250000,
      status: "Completed",
      description: "Monthly Teacher Salaries",
      details: "28 teachers • Avg: ₹44,643 per teacher",
      breakdown: {
        basicSalary: 900000,
        allowances: 250000,
        bonus: 100000,
      },
      paymentModes: {
        bankTransfer: 100,
      },
    },
    {
      id: 3,
      transactionId: "INV-JAN-2025",
      date: "January 2025",
      category: "Inventory Sales",
      type: "Income",
      amount: 185000,
      status: "Completed",
      description: "Monthly Inventory Sales",
      details: "Books, Uniforms & Supplies",
      breakdown: {
        uniforms: 95000,
        books: 65000,
        supplies: 25000,
      },
      paymentModes: {
        cash: 60,
        online: 40,
      },
    },
    {
      id: 4,
      transactionId: "EXP-JAN-2025",
      date: "January 2025",
      category: "Expenses",
      type: "Expense",
      amount: 320000,
      status: "Completed",
      description: "Monthly Operational Expenses",
      details: "Utilities, Maintenance & Admin",
      breakdown: {
        electricity: 120000,
        maintenance: 100000,
        supplies: 60000,
        others: 40000,
      },
      paymentModes: {
        online: 80,
        cheque: 20,
      },
    },
    {
      id: 5,
      transactionId: "OTH-JAN-2025",
      date: "January 2025",
      category: "Other Income",
      type: "Income",
      amount: 75000,
      status: "Completed",
      description: "Other Income Sources",
      details: "Hall Rental, Events & Misc",
      breakdown: {
        hallRental: 45000,
        events: 20000,
        miscellaneous: 10000,
      },
      paymentModes: {
        cash: 50,
        online: 50,
      },
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

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction)
    setCurrentStep(2)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(Math.abs(amount))
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

  const getCategoryColor = (category) => {
    switch (category) {
      case "Fee Collection":
        return "#10b981"
      case "Teacher Salaries":
        return "#ef4444"
      case "Inventory Sales":
        return "#6366f1"
      case "Expenses":
        return "#f59e0b"
      case "Other Income":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  // Simple Donut Chart Component
  const DonutChart = () => {
    const total = financialSummary.totalIncome + financialSummary.totalExpenses
    const incomePercentage = (financialSummary.totalIncome / total) * 100
    return (
      <View style={styles.donutContainer}>
        <View style={styles.donutChart}>
          <View style={styles.donutCenter}>
            <Text style={styles.donutCenterText} allowFontScaling={false}>
              ₹{formatCurrency(financialSummary.netProfit)}
            </Text>
            <Text style={styles.donutCenterLabel} allowFontScaling={false}>
              Net Profit
            </Text>
          </View>
        </View>
        <View style={styles.donutLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10b981" }]} />
            <Text style={styles.legendText} allowFontScaling={false}>
              Income {incomePercentage.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.legendText} allowFontScaling={false}>
              Expense {(100 - incomePercentage).toFixed(0)}%
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // Simple Bar Chart Component
  const BarChart = () => {
    const maxValue = Math.max(...monthlyData.map((d) => Math.max(d.income, d.expense)))
    return (
      <View style={styles.barChartContainer}>
        <Text style={styles.chartTitle} allowFontScaling={false}>
          3-Month Trend
        </Text>
        <View style={styles.barChart}>
          {monthlyData.map((data, index) => (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barContainer}>
                <View style={[styles.bar, styles.incomeBar, { height: (data.income / maxValue) * 40 }]} />
                <View style={[styles.bar, styles.expenseBar, { height: (data.expense / maxValue) * 40 }]} />
              </View>
              <Text style={styles.barLabel} allowFontScaling={false}>
                {data.month}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      !searchText ||
      transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.details.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const renderStep1 = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Monthly Financial Report
        </Text>
        <Text style={styles.headerDate} allowFontScaling={false}>
          {selectedDateRange}
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, styles.incomeCard]}>
          <Text style={styles.metricValue} allowFontScaling={false}>
            ₹{formatCurrency(financialSummary.totalIncome)}
          </Text>
          <Text style={styles.metricLabel} allowFontScaling={false}>
            Total Income
          </Text>
          <Text style={styles.metricChange} allowFontScaling={false}>
            +12.5%
          </Text>
        </View>
        <View style={[styles.metricCard, styles.expenseCard]}>
          <Text style={styles.metricValue} allowFontScaling={false}>
            ₹{formatCurrency(financialSummary.totalExpenses)}
          </Text>
          <Text style={styles.metricLabel} allowFontScaling={false}>
            Total Expenses
          </Text>
          <Text style={styles.metricChange} allowFontScaling={false}>
            +8.3%
          </Text>
        </View>
        <View style={[styles.metricCard, styles.profitCard]}>
          <Text style={styles.metricValue} allowFontScaling={false}>
            ₹{formatCurrency(financialSummary.netProfit)}
          </Text>
          <Text style={styles.metricLabel} allowFontScaling={false}>
            Net Profit
          </Text>
          <Text style={styles.metricChange} allowFontScaling={false}>
            +18.7%
          </Text>
        </View>
      </View>

      {/* Charts Section */}
      <View style={styles.chartsSection}>
        <DonutChart />
        <BarChart />
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search collections..."
            value={searchText}
            onChangeText={setSearchText}
            allowFontScaling={false}
          />
          <Text style={styles.searchIcon} allowFontScaling={false}>
          
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowCategoryModal(true)}>
          <Text style={styles.filterButtonText} allowFontScaling={false}>
            {selectedCategory}
          </Text>
          <Text style={styles.dropdownArrow} allowFontScaling={false}>
            ▼
          </Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Collections List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
            onPress={() => handleTransactionClick(transaction)}
          >
            <View style={styles.transactionLeft}>
              <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(transaction.category) }]} />
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc} allowFontScaling={false}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDetails} allowFontScaling={false}>
                  {transaction.details}
                </Text>
                <Text style={styles.transactionDate} allowFontScaling={false}>
                  {transaction.date}
                </Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[styles.transactionAmount, { color: transaction.type === "Income" ? "#10b981" : "#ef4444" }]}
                allowFontScaling={false}
              >
                {transaction.type === "Income" ? "+" : "-"}₹{formatCurrency(transaction.amount)}
              </Text>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(transaction.status) }]} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <DropdownModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        data={transactionCategories}
        onSelect={setSelectedCategory}
        title="Select Category"
      />
    </View>
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
        {/* Transaction Summary */}
        <View style={styles.detailSummary}>
          <Text style={styles.transactionIdLarge} allowFontScaling={false}>
            {selectedTransaction?.transactionId}
          </Text>
          <Text style={styles.transactionDescLarge} allowFontScaling={false}>
            {selectedTransaction?.description}
          </Text>
          <Text
            style={[
              styles.transactionAmountLarge,
              { color: selectedTransaction?.type === "Income" ? "#10b981" : "#ef4444" },
            ]}
            allowFontScaling={false}
          >
            {selectedTransaction?.type === "Income" ? "+" : "-"}₹{formatCurrency(selectedTransaction?.amount || 0)}
          </Text>
          <Text style={styles.transactionDetailsLarge} allowFontScaling={false}>
            {selectedTransaction?.details}
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(selectedTransaction?.category) }]}>
              <Text style={styles.categoryTagText} allowFontScaling={false}>
                {selectedTransaction?.category}
              </Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: getStatusColor(selectedTransaction?.status) }]}>
              <Text style={styles.statusTagText} allowFontScaling={false}>
                {selectedTransaction?.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Breakdown Details */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle} allowFontScaling={false}>
            Amount Breakdown
          </Text>
          {selectedTransaction?.breakdown &&
            Object.entries(selectedTransaction.breakdown).map(([key, value], index) => (
              <View key={index} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel} allowFontScaling={false}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Text style={styles.breakdownValue} allowFontScaling={false}>
                  ₹{formatCurrency(value)}
                </Text>
              </View>
            ))}
        </View>

        {/* Payment Mode Distribution */}
        <View style={styles.paymentModeCard}>
          <Text style={styles.paymentModeTitle} allowFontScaling={false}>
            Payment Mode Distribution
          </Text>
          {selectedTransaction?.paymentModes &&
            Object.entries(selectedTransaction.paymentModes).map(([mode, percentage], index) => (
              <View key={index} style={styles.paymentModeRow}>
                <Text style={styles.paymentModeLabel} allowFontScaling={false}>
                  {mode.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <View style={styles.paymentModeBar}>
                  <View style={[styles.paymentModeProgress, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.paymentModePercentage} allowFontScaling={false}>
                  {percentage}%
                </Text>
              </View>
            ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText} allowFontScaling={false}>
              Download Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText} allowFontScaling={false}>
              Export Data
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
    paddingBottom: 5,
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
  // Metrics
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  incomeCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#10b981",
  },
  expenseCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#ef4444",
  },
  profitCard: {
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  metricChange: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "600",
  },
  // Charts
  chartsSection: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  // Donut Chart
  donutContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  donutChart: {
    alignItems: "center",
    marginBottom: 8,
  },
  donutCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#10b981",
  },
  donutCenterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  donutCenterLabel: {
    fontSize: 8,
    color: "#6b7280",
    fontWeight: "500",
  },
  donutLegend: {
    gap: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Bar Chart
  barChartContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  barChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 50,
  },
  barGroup: {
    alignItems: "center",
    gap: 4,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  incomeBar: {
    backgroundColor: "#10b981",
  },
  expenseBar: {
    backgroundColor: "#ef4444",
  },
  barLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  // Filters
  filtersRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
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
  filterButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    elevation: 2,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  filterButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  // Transactions
  transactionsList: {
    flex: 1,
    marginBottom: 20,
  },
  transactionItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionDetails: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  transactionRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  detailSummary: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  transactionIdLarge: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  transactionDescLarge: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  transactionAmountLarge: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  transactionDetailsLarge: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 12,
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryTagText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusTagText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  // Breakdown Card
  breakdownCard: {
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
  // Payment Mode Card
  paymentModeCard: {
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
  paymentModeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  paymentModeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  paymentModeLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    width: 80,
  },
  paymentModeBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  paymentModeProgress: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  paymentModePercentage: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    width: 40,
    textAlign: "right",
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

export default TransactionReport;
