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
} from "react-native"

const { width } = Dimensions.get("window")

const StaffAttendanceReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("January 2024")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [searchText, setSearchText] = useState("")
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredAttendance, setFilteredAttendance] = useState([])
  const [viewMode, setViewMode] = useState("summary") // summary, detailed

  // Sample data
  const months = [
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

  const attendanceStatuses = ["All Status", "Present", "Absent", "Late", "Half Day", "Leave", "Holiday"]

  // Sample attendance data
  const staffAttendanceData = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      designation: "Principal",
      department: "Administration",
      employeeId: "EMP001",
      totalDays: 22,
      presentDays: 21,
      absentDays: 0,
      lateDays: 1,
      halfDays: 0,
      leaveDays: 0,
      attendancePercentage: 95.5,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-14", status: "Late", timeIn: "08:30", timeOut: "16:00" },
        { date: "2024-01-13", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-12", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-11", status: "Present", timeIn: "08:00", timeOut: "16:00" },
      ],
    },
    {
      id: 2,
      name: "Mrs. Priya Sharma",
      designation: "Vice Principal",
      department: "Administration",
      employeeId: "EMP002",
      totalDays: 22,
      presentDays: 20,
      absentDays: 1,
      lateDays: 0,
      halfDays: 1,
      leaveDays: 0,
      attendancePercentage: 90.9,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-14", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-13", status: "Half Day", timeIn: "08:00", timeOut: "12:00" },
        { date: "2024-01-12", status: "Absent", timeIn: "-", timeOut: "-" },
        { date: "2024-01-11", status: "Present", timeIn: "08:00", timeOut: "16:00" },
      ],
    },
    {
      id: 3,
      name: "Mr. Amit Patel",
      designation: "Head of Department",
      department: "Mathematics",
      employeeId: "EMP003",
      totalDays: 22,
      presentDays: 22,
      absentDays: 0,
      lateDays: 0,
      halfDays: 0,
      leaveDays: 0,
      attendancePercentage: 100.0,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-14", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-13", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-12", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-11", status: "Present", timeIn: "08:30", timeOut: "15:30" },
      ],
    },
    {
      id: 4,
      name: "Ms. Sunita Singh",
      designation: "Senior Teacher",
      department: "English",
      employeeId: "EMP004",
      totalDays: 22,
      presentDays: 19,
      absentDays: 2,
      lateDays: 1,
      halfDays: 0,
      leaveDays: 0,
      attendancePercentage: 86.4,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-14", status: "Absent", timeIn: "-", timeOut: "-" },
        { date: "2024-01-13", status: "Late", timeIn: "09:00", timeOut: "15:30" },
        { date: "2024-01-12", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-11", status: "Absent", timeIn: "-", timeOut: "-" },
      ],
    },
    {
      id: 5,
      name: "Dr. Meera Joshi",
      designation: "Head of Department",
      department: "Science",
      employeeId: "EMP005",
      totalDays: 22,
      presentDays: 20,
      absentDays: 0,
      lateDays: 0,
      halfDays: 0,
      leaveDays: 2,
      attendancePercentage: 90.9,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-14", status: "Present", timeIn: "08:30", timeOut: "15:30" },
        { date: "2024-01-13", status: "Leave", timeIn: "-", timeOut: "-" },
        { date: "2024-01-12", status: "Leave", timeIn: "-", timeOut: "-" },
        { date: "2024-01-11", status: "Present", timeIn: "08:30", timeOut: "15:30" },
      ],
    },
    {
      id: 6,
      name: "Mr. Vikash Kumar",
      designation: "Teacher",
      department: "Physical Education",
      employeeId: "EMP006",
      totalDays: 22,
      presentDays: 21,
      absentDays: 1,
      lateDays: 0,
      halfDays: 0,
      leaveDays: 0,
      attendancePercentage: 95.5,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "07:00", timeOut: "14:00" },
        { date: "2024-01-14", status: "Present", timeIn: "07:00", timeOut: "14:00" },
        { date: "2024-01-13", status: "Present", timeIn: "07:00", timeOut: "14:00" },
        { date: "2024-01-12", status: "Absent", timeIn: "-", timeOut: "-" },
        { date: "2024-01-11", status: "Present", timeIn: "07:00", timeOut: "14:00" },
      ],
    },
    {
      id: 7,
      name: "Mrs. Kavita Rao",
      designation: "Librarian",
      department: "Library",
      employeeId: "EMP007",
      totalDays: 22,
      presentDays: 22,
      absentDays: 0,
      lateDays: 0,
      halfDays: 0,
      leaveDays: 0,
      attendancePercentage: 100.0,
      recentAttendance: [
        { date: "2024-01-15", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-14", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-13", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-12", status: "Present", timeIn: "08:00", timeOut: "16:00" },
        { date: "2024-01-11", status: "Present", timeIn: "08:00", timeOut: "16:00" },
      ],
    },
    {
      id: 8,
      name: "Mr. Deepak Gupta",
      designation: "Counselor",
      department: "Counseling",
      employeeId: "EMP008",
      totalDays: 22,
      presentDays: 18,
      absentDays: 2,
      lateDays: 2,
      halfDays: 0,
      leaveDays: 0,
      attendancePercentage: 81.8,
      recentAttendance: [
        { date: "2024-01-15", status: "Late", timeIn: "09:30", timeOut: "17:00" },
        { date: "2024-01-14", status: "Present", timeIn: "09:00", timeOut: "17:00" },
        { date: "2024-01-13", status: "Absent", timeIn: "-", timeOut: "-" },
        { date: "2024-01-12", status: "Late", timeIn: "09:15", timeOut: "17:00" },
        { date: "2024-01-11", status: "Absent", timeIn: "-", timeOut: "-" },
      ],
    },
  ]

  useEffect(() => {
    setAttendanceData(staffAttendanceData)
    filterAttendance(staffAttendanceData)
  }, [])

  useEffect(() => {
    filterAttendance(attendanceData)
  }, [selectedDepartment, selectedStatus, searchText, attendanceData])

  const filterAttendance = (data) => {
    let filtered = data

    // Filter by department
    if (selectedDepartment && selectedDepartment !== "All Departments") {
      filtered = filtered.filter((staff) => staff.department === selectedDepartment)
    }

    // Filter by status (based on attendance percentage)
    if (selectedStatus && selectedStatus !== "All Status") {
      if (selectedStatus === "Present") {
        filtered = filtered.filter((staff) => staff.attendancePercentage >= 95)
      } else if (selectedStatus === "Absent") {
        filtered = filtered.filter((staff) => staff.absentDays > 2)
      } else if (selectedStatus === "Late") {
        filtered = filtered.filter((staff) => staff.lateDays > 0)
      }
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchLower) ||
          staff.department.toLowerCase().includes(searchLower) ||
          staff.designation.toLowerCase().includes(searchLower) ||
          staff.employeeId.toLowerCase().includes(searchLower),
      )
    }

    setFilteredAttendance(filtered)
  }

  const closeAllDropdowns = () => {
    setShowMonthDropdown(false)
    setShowDepartmentDropdown(false)
    setShowStatusDropdown(false)
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 95) return "#10b981"
    if (percentage >= 85) return "#f59e0b"
    if (percentage >= 75) return "#f97316"
    return "#ef4444"
  }

  const getStatusColor = (status) => {
    const colors = {
      Present: "#10b981",
      Absent: "#ef4444",
      Late: "#f59e0b",
      "Half Day": "#8b5cf6",
      Leave: "#06b6d4",
      Holiday: "#6b7280",
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      Present: "check-circle",
      Absent: "close-circle",
      Late: "clock-alert",
      "Half Day": "clock-outline",
      Leave: "calendar-remove",
      Holiday: "calendar-blank",
    }
    return icons[status] || "help-circle"
  }

  const getDepartmentColor = (department) => {
    const colors = {
      Administration: "#ef4444",
      Academic: "#3b82f6",
      Science: "#10b981",
      Mathematics: "#f59e0b",
      English: "#8b5cf6",
      "Social Studies": "#06b6d4",
      "Physical Education": "#f97316",
      "Arts & Crafts": "#ec4899",
      Library: "#84cc16",
      "IT Department": "#6366f1",
      Counseling: "#14b8a6",
      "Support Staff": "#6b7280",
    }
    return colors[department] || "#6b7280"
  }

  const AttendanceSummaryCard = ({ staff }) => (
    <View style={styles.attendanceCard}>
      <View style={styles.staffHeader}>
        <View style={[styles.staffAvatar, { backgroundColor: getDepartmentColor(staff.department) }]}>
          <Icon name="account" size={24} color="#ffffff" />
        </View>
        <View style={styles.staffInfo}>
          <Text style={styles.staffName} allowFontScaling={false}>
            {staff.name}
          </Text>
          <Text style={styles.staffDesignation} allowFontScaling={false}>
            {staff.designation}
          </Text>
          <Text style={styles.staffDepartment} allowFontScaling={false}>
            {staff.department} • ID: {staff.employeeId}
          </Text>
        </View>
        <View style={styles.attendancePercentage}>
          <Text
            style={[styles.percentageText, { color: getAttendanceColor(staff.attendancePercentage) }]}
            allowFontScaling={false}
          >
            {staff.attendancePercentage}%
          </Text>
        </View>
      </View>

      <View style={styles.attendanceStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue} allowFontScaling={false}>
            {staff.presentDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Present
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#ef4444" }]} allowFontScaling={false}>
            {staff.absentDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Absent
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#f59e0b" }]} allowFontScaling={false}>
            {staff.lateDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Late
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#8b5cf6" }]} allowFontScaling={false}>
            {staff.halfDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Half Day
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: "#06b6d4" }]} allowFontScaling={false}>
            {staff.leaveDays}
          </Text>
          <Text style={styles.statLabel} allowFontScaling={false}>
            Leave
          </Text>
        </View>
      </View>

      <View style={styles.recentAttendance}>
        <Text style={styles.recentTitle} allowFontScaling={false}>
          Recent Attendance:
        </Text>
        <View style={styles.recentList}>
          {staff.recentAttendance.slice(0, 5).map((record, index) => (
            <View key={index} style={styles.recentItem}>
              <Text style={styles.recentDate} allowFontScaling={false}>
                {record.date.split("-")[2]}/{record.date.split("-")[1]}
              </Text>
              <View style={styles.statusContainer}>
                <Icon name={getStatusIcon(record.status)} size={12} color={getStatusColor(record.status)} />
                <Text style={[styles.statusText, { color: getStatusColor(record.status) }]} allowFontScaling={false}>
                  {record.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )

  const AttendanceDetailCard = ({ staff }) => (
    <View style={styles.attendanceCard}>
      <View style={styles.staffHeader}>
        <View style={[styles.staffAvatar, { backgroundColor: getDepartmentColor(staff.department) }]}>
          <Icon name="account" size={24} color="#ffffff" />
        </View>
        <View style={styles.staffInfo}>
          <Text style={styles.staffName} allowFontScaling={false}>
            {staff.name}
          </Text>
          <Text style={styles.staffDesignation} allowFontScaling={false}>
            {staff.designation}
          </Text>
          <Text style={styles.staffDepartment} allowFontScaling={false}>
            {staff.department} • ID: {staff.employeeId}
          </Text>
        </View>
        <View style={styles.attendancePercentage}>
          <Text
            style={[styles.percentageText, { color: getAttendanceColor(staff.attendancePercentage) }]}
            allowFontScaling={false}
          >
            {staff.attendancePercentage}%
          </Text>
        </View>
      </View>

      <View style={styles.detailedAttendance}>
        <Text style={styles.detailedTitle} allowFontScaling={false}>
          Daily Attendance Records:
        </Text>
        <ScrollView style={styles.detailedScrollView} showsVerticalScrollIndicator={true}>
          {staff.recentAttendance.map((record, index) => (
            <View key={index} style={styles.detailedItem}>
              <View style={styles.detailedDate}>
                <Text style={styles.detailedDateText} allowFontScaling={false}>
                  {record.date}
                </Text>
              </View>
              <View style={styles.detailedStatus}>
                <Icon name={getStatusIcon(record.status)} size={16} color={getStatusColor(record.status)} />
                <Text
                  style={[styles.detailedStatusText, { color: getStatusColor(record.status) }]}
                  allowFontScaling={false}
                >
                  {record.status}
                </Text>
              </View>
              <View style={styles.detailedTime}>
                <Text style={styles.timeText} allowFontScaling={false}>
                  In: {record.timeIn}
                </Text>
                <Text style={styles.timeText} allowFontScaling={false}>
                  Out: {record.timeOut}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )

  const DropdownComponent = ({ label, value, options, isOpen, onToggle, onSelect, placeholder }) => (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.filterLabel} allowFontScaling={false}>
        {label}:
      </Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
        <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]} allowFontScaling={false}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow} allowFontScaling={false}>
          {isOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.dropdownMenuItem, value === option && styles.dropdownMenuItemActive]}
                onPress={() => onSelect(option)}
              >
                <Text
                  style={[styles.dropdownMenuText, value === option && styles.dropdownMenuTextActive]}
                  allowFontScaling={false}
                >
                  {option}
                </Text>
                {value === option && (
                  <Text style={styles.checkmark} allowFontScaling={false}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  )

  const OverallStats = () => {
    const totalStaff = filteredAttendance.length
    const totalPresent = filteredAttendance.reduce((sum, staff) => sum + staff.presentDays, 0)
    const totalAbsent = filteredAttendance.reduce((sum, staff) => sum + staff.absentDays, 0)
    const totalLate = filteredAttendance.reduce((sum, staff) => sum + staff.lateDays, 0)

    return (
      <View style={styles.overallStats}>
        <Text style={styles.overallTitle} allowFontScaling={false}>
          Overall Statistics
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue} allowFontScaling={false}>
              {totalStaff}
            </Text>
            <Text style={styles.statsLabel} allowFontScaling={false}>
              Total Staff
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsValue, { color: "#10b981" }]} allowFontScaling={false}>
              {totalPresent}
            </Text>
            <Text style={styles.statsLabel} allowFontScaling={false}>
              Total Present
            </Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={[styles.statsValue, { color: "#ef4444" }]} allowFontScaling={false}>
              {totalAbsent}
            </Text>
            <Text style={styles.statsLabel} allowFontScaling={false}>
              Total Absent
            </Text>
          </View>
          {/* <View style={styles.statsItem}>
            <Text style={[styles.statsValue, { color: "#f59e0b" }]} allowFontScaling={false}>
              {totalLate}
            </Text>
            <Text style={styles.statsLabel} allowFontScaling={false}>
              Total Late
            </Text>
          </View> */}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Staff Attendance Report
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Monitor and track staff attendance records
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, department, or ID..."
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
              placeholder="Select Month"
            />
          </View>
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
              label="Status"
              value={selectedStatus}
              options={attendanceStatuses}
              isOpen={showStatusDropdown}
              onToggle={() => {
                setShowStatusDropdown(!showStatusDropdown)
                setShowMonthDropdown(false)
                setShowDepartmentDropdown(false)
              }}
              onSelect={(status) => {
                setSelectedStatus(status)
                setShowStatusDropdown(false)
              }}
              placeholder="All Status"
            />
          </View>
        </View>

        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === "summary" && styles.viewModeButtonActive]}
            onPress={() => setViewMode("summary")}
          >
            <Icon name="view-dashboard" size={16} color={viewMode === "summary" ? "#ffffff" : "#6b7280"} />
            <Text
              style={[styles.viewModeText, viewMode === "summary" && styles.viewModeTextActive]}
              allowFontScaling={false}
            >
              Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === "detailed" && styles.viewModeButtonActive]}
            onPress={() => setViewMode("detailed")}
          >
            <Icon name="view-list" size={16} color={viewMode === "detailed" ? "#ffffff" : "#6b7280"} />
            <Text
              style={[styles.viewModeText, viewMode === "detailed" && styles.viewModeTextActive]}
              allowFontScaling={false}
            >
              Detailed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overall Statistics */}
        <OverallStats />

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredAttendance.length} of {attendanceData.length} staff members
          </Text>
          {(selectedDepartment || selectedStatus || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedDepartment("")
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
          {/* Attendance List */}
          <View style={styles.attendanceContainer}>
            <FlatList
              data={filteredAttendance}
              renderItem={({ item }) =>
                viewMode === "summary" ? <AttendanceSummaryCard staff={item} /> : <AttendanceDetailCard staff={item} />
              }
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon} allowFontScaling={false}>
                    📊
                  </Text>
                  <Text style={styles.emptyTitle} allowFontScaling={false}>
                    No Attendance Records Found
                  </Text>
                  <Text style={styles.emptyText} allowFontScaling={false}>
                    No attendance records match your search criteria. Try adjusting your filters.
                  </Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
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
  dropdownWrapper: {
    flex: 1,
    position: "relative",
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
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
  dropdownButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  placeholderText: {
    color: "#9ca3af",
    fontWeight: "400",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    minHeight: 44,
  },
  dropdownMenuItemActive: {
    backgroundColor: "#f0f9ff",
  },
  dropdownMenuText: {
    fontSize: 14,
    color: "#374151",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownMenuTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  viewModeContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  viewModeButtonActive: {
    backgroundColor: "#6366f1",
  },
  viewModeText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  viewModeTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  overallStats: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
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
  overallTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statsLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
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
  attendanceContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  attendanceCard: {
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
  staffHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  staffAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  staffDesignation: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  staffDepartment: {
    fontSize: 13,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  attendancePercentage: {
    alignItems: "center",
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  attendanceStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  recentAttendance: {
    marginTop: 4,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  recentList: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recentItem: {
    alignItems: "center",
    flex: 1,
  },
  recentDate: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailedAttendance: {
    marginTop: 4,
  },
  detailedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  detailedDate: {
    flex: 2,
  },
  detailedDateText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailedStatus: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailedStatusText: {
    fontSize: 12,
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  detailedTime: {
    flex: 1.5,
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 11,
    color: "#6b7280",
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
  detailedScrollView: {
    maxHeight: 200,
    backgroundColor: "#f8f9fb",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
})

export default StaffAttendanceReport
