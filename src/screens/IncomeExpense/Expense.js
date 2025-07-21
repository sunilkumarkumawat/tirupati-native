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

const { width } = Dimensions.get("window")

const Expense = () => {
  const [searchText, setSearchText] = useState("")
  const [expenseData, setExpenseData] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [showExpenseDetailModal, setShowExpenseDetailModal] = useState(false)
  const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false)

  // New expense form states
  const [newExpenseDate, setNewExpenseDate] = useState("")
  const [newExpenseCategory, setNewExpenseCategory] = useState("")
  const [newExpenseVendor, setNewExpenseVendor] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState("")
  const [newExpenseStatus, setNewExpenseStatus] = useState("")
  const [newExpensePaymentMethod, setNewExpensePaymentMethod] = useState("")
  const [newExpenseReferenceId, setNewExpenseReferenceId] = useState("")
  const [newExpenseDescription, setNewExpenseDescription] = useState("")

  // Sample expense data
  const expenseDirectoryData = [
    {
      id: 1,
      date: "2024-11-15",
      category: "Utilities",
      vendor: "Electricity Board",
      amount: 15000,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      referenceId: "BILL-ELEC-NOV24",
      description: "Monthly electricity bill for school premises",
      month: "November",
      year: "2024",
    },
    {
      id: 2,
      date: "2024-11-10",
      category: "Supplies",
      vendor: "Stationery Mart",
      amount: 3500,
      status: "Pending",
      paymentMethod: "Cash",
      referenceId: "PO-STAT-001",
      description: "Purchase of classroom stationery and art supplies",
      month: "November",
      year: "2024",
    },
    {
      id: 3,
      date: "2024-10-28",
      category: "Maintenance",
      vendor: "ABC Plumbing Services",
      amount: 8000,
      status: "Paid",
      paymentMethod: "Online Payment",
      referenceId: "SRV-PLUMB-003",
      description: "Repair of plumbing system in science lab",
      month: "October",
      year: "2024",
    },
    {
      id: 4,
      date: "2024-11-05",
      category: "Salaries",
      vendor: "Staff Payroll",
      amount: 1200000,
      status: "Paid",
      paymentMethod: "Bank Transfer",
      referenceId: "PAY-NOV-24",
      description: "Monthly salaries for all teaching and non-teaching staff",
      month: "November",
      year: "2024",
    },
    {
      id: 5,
      date: "2024-11-01",
      category: "Transportation",
      vendor: "School Bus Service",
      amount: 25000,
      status: "Pending",
      paymentMethod: "Cheque",
      referenceId: "TRANS-NOV-001",
      description: "Monthly payment for student bus transportation",
      month: "November",
      year: "2024",
    },
    {
      id: 6,
      date: "2024-09-20",
      category: "Events",
      vendor: "Event Management Co.",
      amount: 50000,
      status: "Reimbursed",
      paymentMethod: "Cash",
      referenceId: "EVT-ANNUAL-001",
      description: "Expenses for Annual Day cultural program",
      month: "September",
      year: "2024",
    },
    {
      id: 7,
      date: "2023-12-01",
      category: "Technology",
      vendor: "Tech Solutions Inc.",
      amount: 45000,
      status: "Paid",
      paymentMethod: "Online Payment",
      referenceId: "IT-SOFT-002",
      description: "Annual license renewal for school management software",
      month: "December",
      year: "2023",
    },
  ]

  useEffect(() => {
    setExpenseData(expenseDirectoryData)
    filterExpenses(expenseDirectoryData)
  }, [])

  useEffect(() => {
    filterExpenses(expenseData)
  }, [searchText, expenseData])

  const filterExpenses = (data) => {
    let filtered = data

    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (expense) =>
          expense.vendor.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower) ||
          expense.description.toLowerCase().includes(searchLower) ||
          expense.referenceId.toLowerCase().includes(searchLower),
      )
    }

    setFilteredExpenses(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      Paid: "#10b981", // Green
      Pending: "#f59e0b", // Amber
      Reimbursed: "#3b82f6", // Blue
    }
    return colors[status] || "#6b7280" // Gray
  }

  const getStatusIcon = (status) => {
    const icons = {
      Paid: "check-circle",
      Pending: "clock",
      Reimbursed: "cash-refund",
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleExpensePress = (expense) => {
    setSelectedExpense(expense)
    setShowExpenseDetailModal(true)
  }

  const closeExpenseDetailModal = () => {
    setShowExpenseDetailModal(false)
    setSelectedExpense(null)
  }

  const handleAddExpense = () => {
    setShowCreateExpenseModal(true)
  }

  const closeCreateExpenseModal = () => {
    setShowCreateExpenseModal(false)
    // Reset form fields
    setNewExpenseDate("")
    setNewExpenseCategory("")
    setNewExpenseVendor("")
    setNewExpenseAmount("")
    setNewExpenseStatus("")
    setNewExpensePaymentMethod("")
    setNewExpenseReferenceId("")
    setNewExpenseDescription("")
  }

  const handleSaveNewExpense = () => {
    if (
      !newExpenseDate ||
      !newExpenseCategory ||
      !newExpenseVendor ||
      !newExpenseAmount ||
      !newExpenseStatus ||
      !newExpensePaymentMethod
    ) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    const newEntry = {
      id: expenseData.length + 1, // Simple ID generation
      date: newExpenseDate,
      category: newExpenseCategory,
      vendor: newExpenseVendor,
      amount: Number(newExpenseAmount),
      status: newExpenseStatus,
      paymentMethod: newExpensePaymentMethod,
      referenceId: newExpenseReferenceId,
      description: newExpenseDescription,
      month: new Date(newExpenseDate).toLocaleString("en-US", { month: "long" }),
      year: new Date(newExpenseDate).getFullYear().toString(),
    }

    setExpenseData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New expense entry created successfully!")
    closeCreateExpenseModal()
  }

  const ExpenseCard = ({ expense }) => (
    <TouchableOpacity style={styles.expenseCard} onPress={() => handleExpensePress(expense)} activeOpacity={0.7}>
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <View style={styles.expenseIconContainer}>
            <Icon name="cash-minus" size={24} color="#ef4444" />
          </View>
          <View style={styles.expenseDetails}>
            <Text style={styles.expenseCategory} allowFontScaling={false}>
              {expense.category}
            </Text>
            <Text style={styles.expenseVendor} allowFontScaling={false}>
              {expense.vendor}
            </Text>
            <Text style={styles.expenseDate} allowFontScaling={false}>
              {formatDate(expense.date)}
            </Text>
          </View>
        </View>
        <View style={styles.expenseAmountContainer}>
          <Text style={styles.expenseAmount} allowFontScaling={false}>
            {formatCurrency(expense.amount)}
          </Text>
          <View style={styles.statusContainer}>
            <Icon name={getStatusIcon(expense.status)} size={14} color={getStatusColor(expense.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(expense.status) }]} allowFontScaling={false}>
              {expense.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const ExpenseDetailModal = ({ expense, visible, onClose }) => {
    if (!expense) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Expense Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Expense Summary */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Expense Overview
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Amount
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {formatCurrency(expense.amount)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Category
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {expense.category}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Vendor
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {expense.vendor}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Status
                  </Text>
                  <View style={styles.statusContainer}>
                    <Icon name={getStatusIcon(expense.status)} size={16} color={getStatusColor(expense.status)} />
                    <Text
                      style={[styles.statusText, { color: getStatusColor(expense.status) }]}
                      allowFontScaling={false}
                    >
                      {expense.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Transaction Details */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Transaction Details
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDate(expense.date)}
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
                      {expense.paymentMethod}
                    </Text>
                  </View>
                </View>
                {expense.referenceId && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="identifier" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Reference ID
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {expense.referenceId}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            {expense.description && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Description
                </Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText} allowFontScaling={false}>
                    {expense.description}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateExpenseModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Add New Expense
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Date <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newExpenseDate}
                onChangeText={setNewExpenseDate}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Expense Category <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Utilities, Supplies, Salaries"
                value={newExpenseCategory}
                onChangeText={setNewExpenseCategory}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Vendor <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Electricity Board, Stationery Mart"
                value={newExpenseVendor}
                onChangeText={setNewExpenseVendor}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Amount <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 15000"
                value={newExpenseAmount}
                onChangeText={setNewExpenseAmount}
                keyboardType="numeric"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Status <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Paid, Pending, Reimbursed"
                value={newExpenseStatus}
                onChangeText={setNewExpenseStatus}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Payment Method <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Online Payment, Cash, Bank Transfer"
                value={newExpensePaymentMethod}
                onChangeText={setNewExpensePaymentMethod}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Reference ID (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., BILL-ELEC-NOV24"
                value={newExpenseReferenceId}
                onChangeText={setNewExpenseReferenceId}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Description (Optional)
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Brief description of the expense..."
                value={newExpenseDescription}
                onChangeText={setNewExpenseDescription}
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText} allowFontScaling={false}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText} allowFontScaling={false}>
                  Add Expense
                </Text>
              </TouchableOpacity>
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
              School Expenses
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Track and manage school expenditures
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.addButtonText} allowFontScaling={false}>
              Add Expense
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by vendor, category, or reference ID..."
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

        {/* Results Summary (now only reflects search) */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredExpenses.length} of {expenseData.length} expense records
          </Text>
          {searchText && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Search
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Expense List */}
        <View style={styles.expenseListContainer}>
          <FlatList
            data={filteredExpenses}
            renderItem={({ item }) => <ExpenseCard expense={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  💸
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Expense Records Found
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No expense records match your search criteria.
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Expense Detail Modal */}
      <ExpenseDetailModal
        expense={selectedExpense}
        visible={showExpenseDetailModal}
        onClose={closeExpenseDetailModal}
      />
      {/* Create Expense Modal */}
      <CreateExpenseModal
        visible={showCreateExpenseModal}
        onClose={closeCreateExpenseModal}
        onSave={handleSaveNewExpense}
      />
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
  addButton: {
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
  addButtonText: {
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
  expenseListContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  expenseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth:1,
    borderColor:'#00000020'
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.08,
    //     shadowRadius: 8,
    //   },
    //   android: {
    //     elevation: 2,
    //   },
    // }),
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expenseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expenseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ffebeb", // Light red for expenses
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  expenseVendor: {
    fontSize: 14,
    color: "#ef4444", // Red for vendor/source
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  expenseDate: {
    fontSize: 13,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ef4444", // Red for expense amount
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
  // Modal Styles (reused and adapted from Income.jsx)
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
  summaryCard: {
    backgroundColor: "#f8f9fb",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  summaryRowLast: {
    borderBottomWidth: 0,
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
  modalInfoGrid: {
    gap: 12,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
  descriptionCard: {
    backgroundColor: "#f8f9fb",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  descriptionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  formSection: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  requiredIndicator: {
    color: "#ef4444",
  },
  formInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default Expense
