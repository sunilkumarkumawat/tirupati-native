"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from "react-native"

const ApproveLeaveRequest = () => {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [adminComments, setAdminComments] = useState("")

  const filterOptions = ["All", "Pending", "Approved", "Rejected"]

  const leaveRequests = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "Sarah Johnson",
      department: "Mathematics",
      position: "Senior Teacher",
      leaveType: "Sick Leave",
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      days: 3,
      reason: "Fever and flu symptoms, doctor recommended rest",
      appliedDate: "2024-07-12",
      status: "Pending",
      contactNumber: "+91 9876543210",
      emergencyContact: "+91 9876543211",
      remainingBalance: 9,
      totalBalance: 12,
      priority: "Normal",
      documents: ["Medical Certificate"]
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Michael Chen",
      department: "Science",
      position: "Assistant Teacher",
      leaveType: "Annual Leave",
      startDate: "2024-07-20",
      endDate: "2024-07-25",
      days: 6,
      reason: "Family vacation planned for summer break",
      appliedDate: "2024-07-10",
      status: "Approved",
      contactNumber: "+91 9876543212",
      emergencyContact: "+91 9876543213",
      remainingBalance: 15,
      totalBalance: 21,
      priority: "Normal",
      documents: []
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Priya Sharma",
      department: "English",
      position: "Head Teacher",
      leaveType: "Emergency Leave",
      startDate: "2024-07-13",
      endDate: "2024-07-13",
      days: 1,
      reason: "Family emergency - hospitalization",
      appliedDate: "2024-07-13",
      status: "Pending",
      contactNumber: "+91 9876543214",
      emergencyContact: "+91 9876543215",
      remainingBalance: 4,
      totalBalance: 5,
      priority: "High",
      documents: []
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "David Wilson",
      department: "Physical Education",
      position: "Sports Teacher",
      leaveType: "Casual Leave",
      startDate: "2024-07-18",
      endDate: "2024-07-19",
      days: 2,
      reason: "Personal work and appointment",
      appliedDate: "2024-07-11",
      status: "Rejected",
      contactNumber: "+91 9876543216",
      emergencyContact: "+91 9876543217",
      remainingBalance: 15,
      totalBalance: 15,
      priority: "Normal",
      documents: []
    }
  ]

  const filteredRequests = leaveRequests.filter(request => {
    const matchesFilter = selectedFilter === "All" || request.status === selectedFilter
    const matchesSearch = request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f59e0b"
      case "Approved": return "#10b981"
      case "Rejected": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#ef4444"
      case "Normal": return "#6366f1"
      default: return "#6b7280"
    }
  }

  const handleApprove = (request) => {
    Alert.alert(
      "Approve Leave Request",
      `Are you sure you want to approve ${request.name}'s leave request?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          onPress: () => {
            Alert.alert("Success", "Leave request approved successfully!")
            setShowDetailModal(false)
          }
        }
      ]
    )
  }

  const handleReject = (request) => {
    if (!adminComments.trim()) {
      Alert.alert("Error", "Please provide comments for rejection")
      return
    }
    Alert.alert(
      "Reject Leave Request",
      `Are you sure you want to reject ${request.name}'s leave request?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "Leave request rejected successfully!")
            setShowDetailModal(false)
            setAdminComments("")
          }
        }
      ]
    )
  }

  const openDetailModal = (request) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  const renderLeaveRequestItem = ({ item }) => (
    <TouchableOpacity style={styles.requestCard} onPress={() => openDetailModal(item)}>
      <View style={styles.requestHeader}>
        <View style={styles.requestInfo}>
          <Text style={styles.employeeName} allowFontScaling={false}>
            {item.name}
          </Text>
          <Text style={styles.employeeDetails} allowFontScaling={false}>
            {item.employeeId} • {item.department}
          </Text>
        </View>
        <View style={styles.requestStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "20" }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]} allowFontScaling={false}>
              {item.status}
            </Text>
          </View>
          {item.priority === "High" && (
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + "20" }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]} allowFontScaling={false}>
                High
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel} allowFontScaling={false}>Leave Type:</Text>
          <Text style={styles.detailValue} allowFontScaling={false}>{item.leaveType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel} allowFontScaling={false}>Duration:</Text>
          <Text style={styles.detailValue} allowFontScaling={false}>
            {new Date(item.startDate).toLocaleDateString("en-GB")} - {new Date(item.endDate).toLocaleDateString("en-GB")} ({item.days} days)
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel} allowFontScaling={false}>Applied:</Text>
          <Text style={styles.detailValue} allowFontScaling={false}>
            {new Date(item.appliedDate).toLocaleDateString("en-GB")}
          </Text>
        </View>
      </View>
      
      <Text style={styles.reasonText} allowFontScaling={false} numberOfLines={2}>
        {item.reason}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Approve Leave Requests
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Review and manage staff leave applications
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon} allowFontScaling={false}></Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, department, or ID"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            allowFontScaling={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <Text style={styles.clearButtonText} allowFontScaling={false}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText} allowFontScaling={false}>
            {selectedFilter}
          </Text>
          <Text style={styles.filterArrow} allowFontScaling={false}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber} allowFontScaling={false}>
            {leaveRequests.filter(r => r.status === "Pending").length}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber} allowFontScaling={false}>
            {leaveRequests.filter(r => r.status === "Approved").length}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>Approved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber} allowFontScaling={false}>
            {leaveRequests.filter(r => r.status === "Rejected").length}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>Rejected</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber} allowFontScaling={false}>
            {leaveRequests.length}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>Total</Text>
        </View>
      </View>

      {/* Leave Requests List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderLeaveRequestItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.requestsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.requestsListContent}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} allowFontScaling={false}>
                Filter by Status
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.modalCloseText} allowFontScaling={false}>✕</Text>
              </TouchableOpacity>
            </View>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.filterOption, selectedFilter === option && styles.filterOptionSelected]}
                onPress={() => {
                  setSelectedFilter(option)
                  setShowFilterModal(false)
                }}
              >
                <Text style={styles.filterOptionText} allowFontScaling={false}>
                  {option}
                </Text>
                {selectedFilter === option && (
                  <Text style={styles.checkmark} allowFontScaling={false}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            {selectedRequest && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle} allowFontScaling={false}>
                    Leave Request Details
                  </Text>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Text style={styles.modalCloseText} allowFontScaling={false}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailModalBody}>
                  {/* Employee Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle} allowFontScaling={false}>Employee Information</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Name:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.name}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Employee ID:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.employeeId}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Department:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.department}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Position:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.position}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Leave Details */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle} allowFontScaling={false}>Leave Details</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Leave Type:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.leaveType}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Duration:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.days} days</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Start Date:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>
                          {new Date(selectedRequest.startDate).toLocaleDateString("en-GB")}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>End Date:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>
                          {new Date(selectedRequest.endDate).toLocaleDateString("en-GB")}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Applied Date:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>
                          {new Date(selectedRequest.appliedDate).toLocaleDateString("en-GB")}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Remaining Balance:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>
                          {selectedRequest.remainingBalance}/{selectedRequest.totalBalance} days
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Reason */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle} allowFontScaling={false}>Reason</Text>
                    <Text style={styles.reasonDetailText} allowFontScaling={false}>
                      {selectedRequest.reason}
                    </Text>
                  </View>

                  {/* Contact Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle} allowFontScaling={false}>Contact Information</Text>
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Contact Number:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.contactNumber}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel} allowFontScaling={false}>Emergency Contact:</Text>
                        <Text style={styles.infoValue} allowFontScaling={false}>{selectedRequest.emergencyContact}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Admin Comments */}
                  {selectedRequest.status === "Pending" && (
                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle} allowFontScaling={false}>Admin Comments</Text>
                      <TextInput
                        style={styles.commentsInput}
                        placeholder="Add comments (required for rejection)"
                        placeholderTextColor="#9ca3af"
                        value={adminComments}
                        onChangeText={setAdminComments}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        allowFontScaling={false}
                      />
                    </View>
                  )}

                  {/* Action Buttons */}
                  {selectedRequest.status === "Pending" && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.rejectButton} 
                        onPress={() => handleReject(selectedRequest)}
                      >
                        <Text style={styles.rejectButtonText} allowFontScaling={false}>
                          Reject
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.approveButton} 
                        onPress={() => handleApprove(selectedRequest)}
                      >
                        <Text style={styles.approveButtonText} allowFontScaling={false}>
                          Approve
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  searchFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    fontSize: 16,
    color: "#6b7280",
    marginRight: 8,
    includeFontPadding: false,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 12,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#6b7280",
    includeFontPadding: false,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    includeFontPadding: false,
  },
  filterArrow: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    includeFontPadding: false,
  },
  requestsList: {
    flex: 1,
    marginTop: 12,
  },
  requestsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  requestCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    includeFontPadding: false,
  },
  employeeDetails: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    includeFontPadding: false,
  },
  requestStatus: {
    flexDirection: "row",
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    includeFontPadding: false,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "600",
    includeFontPadding: false,
  },
  requestDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    width: 80,
    includeFontPadding: false,
  },
  detailValue: {
    fontSize: 12,
    color: "#111827",
    flex: 1,
    includeFontPadding: false,
  },
  reasonText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    includeFontPadding: false,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  filterModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  detailModalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
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
  modalCloseText: {
    fontSize: 18,
    color: "#6b7280",
    includeFontPadding: false,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  filterOptionSelected: {
    backgroundColor: "#f8fafc",
  },
  filterOptionText: {
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
  detailModalBody: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
  },
  infoGrid: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
  },
  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
    width: 140,
    includeFontPadding: false,
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    flex: 1,
    fontWeight: "500",
    includeFontPadding: false,
  },
  reasonDetailText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    includeFontPadding: false,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    fontSize: 14,
    color: "#111827",
    height: 80,
    textAlignVertical: "top",
    includeFontPadding: false,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    includeFontPadding: false,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    includeFontPadding: false,
  },
})

export default ApproveLeaveRequest