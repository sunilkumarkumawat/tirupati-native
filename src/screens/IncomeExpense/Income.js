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
// DropdownComponent is no longer imported as per request

const { width } = Dimensions.get("window")

const Income = () => {
  // Removed filter states as per request
  const [searchText, setSearchText] = useState("")
  const [incomeData, setIncomeData] = useState([])
  const [filteredIncome, setFilteredIncome] = useState([])
  const [selectedIncome, setSelectedIncome] = useState(null)
  const [showIncomeDetailModal, setShowIncomeDetailModal] = useState(false)
  const [showCreateIncomeModal, setShowCreateIncomeModal] = useState(false)

  // New income form states (remain as TextInput for static input)
  const [newIncomeDate, setNewIncomeDate] = useState("")
  const [newIncomeType, setNewIncomeType] = useState("")
  const [newIncomeSource, setNewIncomeSource] = useState("")
  const [newIncomeAmount, setNewIncomeAmount] = useState("")
  const [newIncomeStatus, setNewIncomeStatus] = useState("")
  const [newIncomePaymentMethod, setNewIncomePaymentMethod] = useState("")
  const [newIncomeReferenceId, setNewIncomeReferenceId] = useState("")
  const [newIncomeDescription, setNewIncomeDescription] = useState("")

  // Sample income data (remains the same)
  const incomeDirectoryData = [
    {
      id: 1,
      date: "2024-11-15",
      type: "Tuition Fees",
      source: "Student ID: S001",
      amount: 50000,
      status: "Received",
      paymentMethod: "Online Payment",
      referenceId: "INV2024-001",
      description: "Term 1 tuition fees for John Doe",
      month: "November",
      year: "2024",
    },
    {
      id: 2,
      date: "2024-11-10",
      type: "Donation",
      source: "Alumni Association",
      amount: 150000,
      status: "Received",
      paymentMethod: "Bank Transfer",
      referenceId: "DON2024-005",
      description: "Donation for school library renovation",
      month: "November",
      year: "2024",
    },
    {
      id: 3,
      date: "2024-10-28",
      type: "Grant",
      source: "Education Ministry",
      amount: 250000,
      status: "Pending",
      paymentMethod: "Bank Transfer",
      referenceId: "GRT2024-002",
      description: "Grant for STEM program development",
      month: "October",
      year: "2024",
    },
    {
      id: 4,
      date: "2024-11-05",
      type: "Event Revenue",
      source: "Annual Sports Day",
      amount: 35000,
      status: "Received",
      paymentMethod: "Cash",
      referenceId: "EVT2024-003",
      description: "Revenue from ticket sales and stalls at Sports Day",
      month: "November",
      year: "2024",
    },
    {
      id: 5,
      date: "2024-11-01",
      type: "Book Sales",
      source: "School Bookstore",
      amount: 12000,
      status: "Received",
      paymentMethod: "Online Payment",
      referenceId: "BKS2024-010",
      description: "Sales of textbooks for November",
      month: "November",
      year: "2024",
    },
    {
      id: 6,
      date: "2024-09-20",
      type: "Tuition Fees",
      source: "Student ID: S005",
      amount: 50000,
      status: "Refunded",
      paymentMethod: "Bank Transfer",
      referenceId: "INV2024-005",
      description: "Refunded fees for withdrawn student Jane Doe",
      month: "September",
      year: "2024",
    },
    {
      id: 7,
      date: "2023-12-01",
      type: "Donation",
      source: "Parent Committee",
      amount: 75000,
      status: "Received",
      paymentMethod: "Cash",
      referenceId: "DON2023-012",
      description: "Donation for school annual function",
      month: "December",
      year: "2023",
    },
  ]

  useEffect(() => {
    setIncomeData(incomeDirectoryData)
    filterIncome(incomeDirectoryData) // Initial filter to show all or apply search if present
  }, [])

  useEffect(() => {
    filterIncome(incomeData) // Re-filter when search text or incomeData changes
  }, [searchText, incomeData])

  const filterIncome = (data) => {
    let filtered = data

    // Only filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (income) =>
          income.source.toLowerCase().includes(searchLower) ||
          income.type.toLowerCase().includes(searchLower) ||
          income.description.toLowerCase().includes(searchLower) ||
          income.referenceId.toLowerCase().includes(searchLower),
      )
    }

    setFilteredIncome(filtered)
  }

  // Removed closeAllDropdowns as there are no dropdowns

  const getStatusColor = (status) => {
    const colors = {
      Received: "#10b981", // Green
      Pending: "#f59e0b", // Amber
      Refunded: "#ef4444", // Red
    }
    return colors[status] || "#6b7280" // Gray
  }

  const getStatusIcon = (status) => {
    const icons = {
      Received: "check-circle",
      Pending: "clock",
      Refunded: "arrow-left-circle",
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

  const handleIncomePress = (income) => {
    setSelectedIncome(income)
    setShowIncomeDetailModal(true)
  }

  const closeIncomeDetailModal = () => {
    setShowIncomeDetailModal(false)
    setSelectedIncome(null)
  }

  const handleAddIncome = () => {
    setShowCreateIncomeModal(true)
  }

  const closeCreateIncomeModal = () => {
    setShowCreateIncomeModal(false)
    // Reset form fields
    setNewIncomeDate("")
    setNewIncomeType("")
    setNewIncomeSource("")
    setNewIncomeAmount("")
    setNewIncomeStatus("")
    setNewIncomePaymentMethod("")
    setNewIncomeReferenceId("")
    setNewIncomeDescription("")
  }

  const handleSaveNewIncome = () => {
    if (
      !newIncomeDate ||
      !newIncomeType ||
      !newIncomeSource ||
      !newIncomeAmount ||
      !newIncomeStatus ||
      !newIncomePaymentMethod
    ) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    const newEntry = {
      id: incomeData.length + 1, // Simple ID generation
      date: newIncomeDate,
      type: newIncomeType,
      source: newIncomeSource,
      amount: Number(newIncomeAmount),
      status: newIncomeStatus,
      paymentMethod: newIncomePaymentMethod,
      referenceId: newIncomeReferenceId,
      description: newIncomeDescription,
      month: new Date(newIncomeDate).toLocaleString("en-US", { month: "long" }),
      year: new Date(newIncomeDate).getFullYear().toString(),
    }

    setIncomeData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New income entry created successfully!")
    closeCreateIncomeModal()
  }

  const IncomeCard = ({ income }) => (
    <TouchableOpacity style={styles.incomeCard} onPress={() => handleIncomePress(income)} activeOpacity={0.7}>
      <View style={styles.incomeHeader}>
        <View style={styles.incomeInfo}>
          <View style={styles.incomeIconContainer}>
            <Icon name="cash-multiple" size={24} color="#6366f1" />
          </View>
          <View style={styles.incomeDetails}>
            <Text style={styles.incomeType} allowFontScaling={false}>
              {income.type}
            </Text>
            <Text style={styles.incomeSource} allowFontScaling={false}>
              {income.source}
            </Text>
            <Text style={styles.incomeDate} allowFontScaling={false}>
              {formatDate(income.date)}
            </Text>
          </View>
        </View>
        <View style={styles.incomeAmountContainer}>
          <Text style={styles.incomeAmount} allowFontScaling={false}>
            {formatCurrency(income.amount)}
          </Text>
          <View style={styles.statusContainer}>
            <Icon name={getStatusIcon(income.status)} size={14} color={getStatusColor(income.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(income.status) }]} allowFontScaling={false}>
              {income.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const IncomeDetailModal = ({ income, visible, onClose }) => {
    if (!income) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Income Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Income Summary */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Income Overview
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Amount
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {formatCurrency(income.amount)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Type
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {income.type}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Source
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {income.source}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Status
                  </Text>
                  <View style={styles.statusContainer}>
                    <Icon name={getStatusIcon(income.status)} size={16} color={getStatusColor(income.status)} />
                    <Text
                      style={[styles.statusText, { color: getStatusColor(income.status) }]}
                      allowFontScaling={false}
                    >
                      {income.status}
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
                      {formatDate(income.date)}
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
                      {income.paymentMethod}
                    </Text>
                  </View>
                </View>
                {income.referenceId && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="identifier" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Reference ID
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {income.referenceId}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            {income.description && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Description
                </Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText} allowFontScaling={false}>
                    {income.description}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateIncomeModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Add New Income
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
                value={newIncomeDate}
                onChangeText={setNewIncomeDate}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Income Type <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Tuition Fees, Donation"
                value={newIncomeType}
                onChangeText={setNewIncomeType}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Source <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Student ID: S001, Alumni Association"
                value={newIncomeSource}
                onChangeText={setNewIncomeSource}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Amount <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 50000"
                value={newIncomeAmount}
                onChangeText={setNewIncomeAmount}
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
                placeholder="e.g., Received, Pending, Refunded"
                value={newIncomeStatus}
                onChangeText={setNewIncomeStatus}
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
                value={newIncomePaymentMethod}
                onChangeText={setNewIncomePaymentMethod}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Reference ID (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., INV2024-001"
                value={newIncomeReferenceId}
                onChangeText={setNewIncomeReferenceId}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Description (Optional)
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Brief description of the income..."
                value={newIncomeDescription}
                onChangeText={setNewIncomeDescription}
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
                  Add Income
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
              School Income
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Track and manage school revenue
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.addButtonText} allowFontScaling={false}>
              Add Income
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
            placeholder="Search by source, type, or reference ID..."
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
            Showing {filteredIncome.length} of {incomeData.length} income records
          </Text>
          {searchText && ( // Only show clear filters if search text is present
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

        {/* Income List */}
        <View style={styles.incomeListContainer}>
          <FlatList
            data={filteredIncome}
            renderItem={({ item }) => <IncomeCard income={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  💸
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Income Records Found
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No income records match your search criteria.
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Income Detail Modal */}
      <IncomeDetailModal income={selectedIncome} visible={showIncomeDetailModal} onClose={closeIncomeDetailModal} />
      {/* Create Income Modal */}
      <CreateIncomeModal
        visible={showCreateIncomeModal}
        onClose={closeCreateIncomeModal}
        onSave={handleSaveNewIncome}
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
  // Removed filtersContainer styles
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
  incomeListContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  incomeCard: {
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
  incomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  incomeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  incomeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  incomeDetails: {
    flex: 1,
  },
  incomeType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incomeSource: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incomeDate: {
    fontSize: 13,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  incomeAmountContainer: {
    alignItems: "flex-end",
  },
  incomeAmount: {
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
  // Modal Styles (reused from previous components)
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
    padding: 20, // Slightly more padding
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      // Add subtle shadow for depth
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
    paddingVertical: 10, // Slightly more vertical padding
    borderBottomWidth: 1, // Add a subtle separator
    borderBottomColor: "#f3f4f6",
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  modalInfoGrid: {
    gap: 12,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 14, // Slightly more padding
    borderRadius: 10, // Slightly more rounded corners
    borderWidth: 1, // Add a subtle border
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
    padding: 18, // Slightly more padding
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      // Add subtle shadow for depth
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

export default Income
