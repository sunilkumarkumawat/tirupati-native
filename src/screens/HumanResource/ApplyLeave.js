"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from "react-native"

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [showLeaveTypeModal, setShowLeaveTypeModal] = useState(false)
  const [showStartDateModal, setShowStartDateModal] = useState(false)
  const [showEndDateModal, setShowEndDateModal] = useState(false)

  const leaveTypes = [
    { id: 1, name: "Sick Leave", balance: 12, color: "#ef4444" },
    { id: 2, name: "Casual Leave", balance: 15, color: "#6366f1" },
    { id: 3, name: "Emergency Leave", balance: 5, color: "#f59e0b" },
    { id: 4, name: "Maternity Leave", balance: 90, color: "#10b981" },
    { id: 5, name: "Paternity Leave", balance: 15, color: "#6366f1" },
    { id: 6, name: "Annual Leave", balance: 21, color: "#10b981" },
  ]

  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      })
    }
    return dates
  }

  const availableDates = generateDates()

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      Alert.alert("Error", "End date cannot be before start date")
      return
    }

    Alert.alert("Success", "Leave application submitted successfully!", [{ text: "OK", onPress: () => resetForm() }])
  }

  const resetForm = () => {
    setLeaveType("")
    setStartDate("")
    setEndDate("")
    setReason("")
    setContactNumber("")
    setEmergencyContact("")
  }

  const calculateLeaveDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const selectedLeaveType = leaveTypes.find((type) => type.name === leaveType)

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Apply Leave
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Submit your leave application
        </Text>
      </View>

      {/* Leave Balance Summary */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle} allowFontScaling={false}>
          Leave Balance Summary
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.balanceScroll}>
          {leaveTypes.map((type) => (
            <View key={type.id} style={[styles.balanceItem, { backgroundColor: type.color + "15" }]}>
              <View style={[styles.balanceIcon, { backgroundColor: type.color }]} />
              <Text style={styles.balanceType} allowFontScaling={false}>
                {type.name}
              </Text>
              <Text style={styles.balanceCount} allowFontScaling={false}>
                {type.balance} days
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Application Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle} allowFontScaling={false}>
          Leave Application Form
        </Text>

        {/* Leave Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Leave Type <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity 
            style={[styles.dropdown, leaveType && styles.dropdownActive]} 
            onPress={() => setShowLeaveTypeModal(true)}
          >
            <Text style={[styles.dropdownText, !leaveType && styles.placeholder]} allowFontScaling={false}>
              {leaveType || "Select leave type"}
            </Text>
            <Text style={styles.dropdownArrow} allowFontScaling={false}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Selection */}
        <View style={styles.dateRow}>
          <View style={styles.dateGroup}>
            <Text style={styles.label} allowFontScaling={false}>
              Start Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={[styles.dateInput, startDate && styles.dateInputActive]} 
              onPress={() => setShowStartDateModal(true)}
            >
              <Text style={[styles.dateText, !startDate && styles.placeholder]} allowFontScaling={false}>
                {startDate ? new Date(startDate).toLocaleDateString("en-GB") : "Select date"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateGroup}>
            <Text style={styles.label} allowFontScaling={false}>
              End Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity 
              style={[styles.dateInput, endDate && styles.dateInputActive]} 
              onPress={() => setShowEndDateModal(true)}
            >
              <Text style={[styles.dateText, !endDate && styles.placeholder]} allowFontScaling={false}>
                {endDate ? new Date(endDate).toLocaleDateString("en-GB") : "Select date"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Leave Duration */}
        {startDate && endDate && (
          <View style={styles.durationCard}>
            <Text style={styles.durationLabel} allowFontScaling={false}>
              Leave Duration
            </Text>
            <Text style={styles.durationValue} allowFontScaling={false}>
              {calculateLeaveDays()} day{calculateLeaveDays() > 1 ? "s" : ""}
            </Text>
            {selectedLeaveType && (
              <Text 
                style={[
                  styles.remainingBalance,
                  (selectedLeaveType.balance - calculateLeaveDays()) < 0 && styles.balanceWarning
                ]} 
                allowFontScaling={false}
              >
                Remaining: {selectedLeaveType.balance - calculateLeaveDays()} days
              </Text>
            )}
          </View>
        )}

        {/* Reason */}
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Reason for Leave <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.textArea, reason && styles.textAreaActive]}
            value={reason}
            onChangeText={setReason}
            placeholder="Enter reason for leave"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            allowFontScaling={false}
          />
        </View>

        {/* Contact Information */}
        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Contact Number During Leave
          </Text>
          <TextInput
            style={[styles.textInput, contactNumber && styles.textInputActive]}
            value={contactNumber}
            onChangeText={setContactNumber}
            placeholder="Enter contact number"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            allowFontScaling={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label} allowFontScaling={false}>
            Emergency Contact
          </Text>
          <TextInput
            style={[styles.textInput, emergencyContact && styles.textInputActive]}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Enter emergency contact"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            allowFontScaling={false}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText} allowFontScaling={false}>
            Submit Application
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
          <Text style={styles.resetButtonText} allowFontScaling={false}>
            Reset Form
          </Text>
        </TouchableOpacity>
      </View>

      {/* Leave Type Modal */}
      <Modal
        visible={showLeaveTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLeaveTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} allowFontScaling={false}>
                Select Leave Type
              </Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowLeaveTypeModal(false)}>
                <Text style={styles.modalCloseText} allowFontScaling={false}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {leaveTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.modalOption, leaveType === type.name && styles.modalOptionSelected]}
                  onPress={() => {
                    setLeaveType(type.name)
                    setShowLeaveTypeModal(false)
                  }}
                >
                  <View style={[styles.modalOptionIcon, { backgroundColor: type.color }]} />
                  <View style={styles.modalOptionContent}>
                    <Text style={styles.modalOptionText} allowFontScaling={false}>
                      {type.name}
                    </Text>
                    <Text style={styles.modalOptionBalance} allowFontScaling={false}>
                      {type.balance} days available
                    </Text>
                  </View>
                  {leaveType === type.name && (
                    <Text style={styles.checkmark} allowFontScaling={false}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Start Date Modal */}
      <Modal
        visible={showStartDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStartDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} allowFontScaling={false}>
                Select Start Date
              </Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowStartDateModal(false)}>
                <Text style={styles.modalCloseText} allowFontScaling={false}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {availableDates.map((dateObj, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateOption, startDate === dateObj.date && styles.dateOptionSelected]}
                  onPress={() => {
                    setStartDate(dateObj.date)
                    setShowStartDateModal(false)
                  }}
                >
                  <Text style={styles.dateOptionText} allowFontScaling={false}>
                    {dateObj.display}
                  </Text>
                  {startDate === dateObj.date && (
                    <Text style={styles.checkmark} allowFontScaling={false}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* End Date Modal */}
      <Modal
        visible={showEndDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEndDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} allowFontScaling={false}>
                Select End Date
              </Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowEndDateModal(false)}>
                <Text style={styles.modalCloseText} allowFontScaling={false}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {availableDates.map((dateObj, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateOption, endDate === dateObj.date && styles.dateOptionSelected]}
                  onPress={() => {
                    setEndDate(dateObj.date)
                    setShowEndDateModal(false)
                  }}
                >
                  <Text style={styles.dateOptionText} allowFontScaling={false}>
                    {dateObj.display}
                  </Text>
                  {endDate === dateObj.date && (
                    <Text style={styles.checkmark} allowFontScaling={false}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    includeFontPadding: false,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    includeFontPadding: false,
  },
  balanceCard: {
    backgroundColor: "#ffffff",
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
  },
  balanceScroll: {
    flexDirection: "row",
  },
  balanceItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 90,
  },
  balanceIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  balanceType: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 2,
    includeFontPadding: false,
  },
  balanceCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    includeFontPadding: false,
  },
  formCard: {
    backgroundColor: "#ffffff",
    margin: 12,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    includeFontPadding: false,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    includeFontPadding: false,
  },
  required: {
    color: "#ef4444",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  dropdownActive: {
    borderColor: "#6366f1",
    backgroundColor: "#f8fafc",
  },
  dropdownText: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
    includeFontPadding: false,
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
  },
  placeholder: {
    color: "#9ca3af",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  dateGroup: {
    flex: 1,
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  dateInputActive: {
    borderColor: "#6366f1",
    backgroundColor: "#f8fafc",
  },
  dateText: {
    fontSize: 14,
    color: "#111827",
    includeFontPadding: false,
  },
  durationCard: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  durationLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    includeFontPadding: false,
  },
  durationValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366f1",
    includeFontPadding: false,
  },
  remainingBalance: {
    fontSize: 12,
    color: "#10b981",
    marginTop: 4,
    includeFontPadding: false,
  },
  balanceWarning: {
    color: "#f59e0b",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    fontSize: 14,
    color: "#111827",
    includeFontPadding: false,
  },
  textInputActive: {
    borderColor: "#6366f1",
    backgroundColor: "#f8fafc",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    fontSize: 14,
    color: "#111827",
    height: 80,
    includeFontPadding: false,
  },
  textAreaActive: {
    borderColor: "#6366f1",
    backgroundColor: "#f8fafc",
  },
  submitButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    includeFontPadding: false,
  },
  resetButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  resetButtonText: {
    fontSize: 14,
    color: "#6b7280",
    includeFontPadding: false,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    includeFontPadding: false,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: "#6b7280",
    includeFontPadding: false,
  },
  modalBody: {
    padding: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalOptionSelected: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  modalOptionIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  modalOptionContent: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    includeFontPadding: false,
  },
  modalOptionBalance: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    includeFontPadding: false,
  },
  dateOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dateOptionSelected: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  dateOptionText: {
    fontSize: 14,
    color: "#111827",
    includeFontPadding: false,
  },
  checkmark: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
    includeFontPadding: false,
  },
})

export default ApplyLeave