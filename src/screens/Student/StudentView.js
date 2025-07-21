"use client"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Alert
} from "react-native"
import { Strings } from "../../theme/Strings"

const { width } = Dimensions.get("window")

const StudentView = () => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedClass, setSelectedClass] = useState("All")
  const [selectedSection, setSelectedSection] = useState("All")
  const [filteredStudents, setFilteredStudents] = useState([])
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null)
  const token = '66|swQajga9OvTwvOecV9tRDNyEZsUOTp9MShfQjLzude6dd81f';
  const [studentData, setStudentData] = useState([]);
  const [classOptions, setClassOptions] = useState([{ label: "All", value: "All" }]);

  const fetchClassList = async () => {
    try {
      const response = await fetch(`${Strings.APP_BASE_URL}/className`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('Class List:', result);

      if (result.success) {
        const dynamicClassList = result.data.map(cls => ({
          label: cls.label,
          value: cls.value,  // use label as value so it matches student.class like "10th"
        }));
        // Add "All" as the first option
        setClassOptions([{ label: "All", value: "All" }, ...dynamicClassList]);
      }
    } catch (error) {
      console.error('Error fetching class list:', error);
    }
  };

  useEffect(() => {
    fetchClassList();  // 👈 get dynamic class list
    fetchUser();       // 👈 get students
  }, []);


// Alert.alert(JSON.stringify(classOptions));



  const fetchUser = async () => {
    try {
      const response = await fetch(`${Strings.APP_BASE_URL}/studentList`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // ✅ Add this
        },

      });

      const result = await response.json();

      console.log('student:', result);
      //Alert.alert('User Result', JSON.stringify(result));

      if (result.success) {
        setStudentData(result.data);
      }
    } catch (error) {
      console.error('Error fetch user:', error);
      Alert.alert('Error', error.message);
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);

  // Sample student data with expanded profile information
  const students = [
    {
      id: 1,
      name: "Aarav Sharma",
      class: "10th",
      section: "A",
      rollNumber: "A001",
      email: "aarav.sharma@school.edu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      parentContact: "+91 98765 43210",
      attendance: 92,
      status: "Present",
      lastActive: "2 mins ago",
      subjects: ["Math", "Science", "English", "Hindi", "Social Studies"],
      // Additional profile data
      studentId: "STU0001",
      academicYear: "2024-2025",
      emergencyContact: "+91 98765 43211",
      address: "123 Main Street, Mumbai, Maharashtra - 400001",
      cgpa: 8.5,
      rank: 15,
      parentName: "Rajesh Sharma",
      dateOfBirth: "15/03/2008",
      bloodGroup: "O+",
      admissionDate: "01/04/2020",
      feeStatus: "Paid",
      transportMode: "School Bus",
      activities: [
        {
          id: 1,
          title: "Assignment Submitted",
          description: "Mathematics - Chapter 5 Exercise",
          time: "2 hours ago",
          icon: "📚",
        },
        {
          id: 2,
          title: "Test Completed",
          description: "Science Unit Test - Score: 85/100",
          time: "1 day ago",
          icon: "🎯",
        },
        {
          id: 3,
          title: "Achievement Unlocked",
          description: "Perfect Attendance - Monthly Award",
          time: "3 days ago",
          icon: "🏆",
        },
      ],
    },
    {
      id: 2,
      name: "Priya Patel",
      class: "10th",
      section: "B",
      rollNumber: "B015",
      email: "priya.patel@school.edu",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      parentContact: "+91 87654 32109",
      attendance: 88,
      status: "Absent",
      lastActive: "1 hour ago",
      subjects: ["Math", "Science", "English", "Hindi", "Computer"],
      // Additional profile data
      studentId: "STU0002",
      academicYear: "2024-2025",
      emergencyContact: "+91 87654 32110",
      address: "456 Park Avenue, Delhi, Delhi - 110001",
      cgpa: 8.2,
      rank: 22,
      parentName: "Suresh Patel",
      dateOfBirth: "22/07/2008",
      bloodGroup: "A+",
      admissionDate: "15/04/2020",
      feeStatus: "Pending",
      transportMode: "Private",
      activities: [
        {
          id: 1,
          title: "Project Submitted",
          description: "Computer Science - Web Development",
          time: "1 day ago",
          icon: "💻",
        },
        {
          id: 2,
          title: "Quiz Completed",
          description: "English Literature - Score: 78/100",
          time: "2 days ago",
          icon: "📝",
        },
      ],
    },
    // Add similar expanded data for other students...
    {
      id: 3,
      name: "Arjun Singh",
      class: "9th",
      section: "A",
      rollNumber: "A025",
      email: "arjun.singh@school.edu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      parentContact: "+91 76543 21098",
      attendance: 95,
      status: "Present",
      lastActive: "Just now",
      subjects: ["Math", "Science", "English", "Hindi", "Art"],
      studentId: "STU0003",
      academicYear: "2024-2025",
      emergencyContact: "+91 76543 21099",
      address: "789 Garden Road, Pune, Maharashtra - 411001",
      cgpa: 9.1,
      rank: 5,
      parentName: "Vikram Singh",
      dateOfBirth: "10/11/2009",
      bloodGroup: "B+",
      admissionDate: "20/04/2021",
      feeStatus: "Paid",
      transportMode: "School Bus",
      activities: [
        {
          id: 1,
          title: "Art Competition Won",
          description: "First Prize in Inter-School Art Competition",
          time: "3 hours ago",
          icon: "🎨",
        },
        {
          id: 2,
          title: "Assignment Submitted",
          description: "Hindi - Essay Writing",
          time: "5 hours ago",
          icon: "📚",
        },
      ],
    },
    // Continue with other students with similar expanded data structure
  ]


  const classes = ["All", "9th", "10th", "11th", "12th"]
  const sections = ["All", "A", "B", "C", "D"]
  
useEffect(() => {
  if (studentData.length > 0) {
    filterStudents();
  }
}, [studentData, selectedClass, selectedSection, searchKeyword]);

  const filterStudents = () => {
    let filtered = studentData

    // Filter by class
    if (selectedClass !== "All") {
  filtered = filtered.filter((student) => student.class_name === selectedClass);
}

    // Filter by section
    if (selectedSection !== "All") {
      filtered = filtered.filter((student) => student.section === selectedSection)
    }

   // Filter by keyword (name, email, roll number, parent contact, subjects, status, class, section)
if (searchKeyword.trim()) {
  const keyword = searchKeyword.toLowerCase().trim();

  filtered = filtered.filter((student) => {
    // Defensive access (optional chaining and fallback values)
    const nameMatch = student.name?.toLowerCase().includes(keyword);
    const emailMatch = student.email?.toLowerCase().includes(keyword);
    const rollMatch = student.roll_no?.toLowerCase().includes(keyword);

    const phoneDigitsOnly = student.mobile?.replace(/\D/g, "") || "";
    const keywordDigitsOnly = keyword.replace(/\D/g, "");
    const phoneMatch =
      student.parentContact?.toLowerCase().includes(keyword) ||
      (keywordDigitsOnly && phoneDigitsOnly.includes(keywordDigitsOnly));

    const subjectMatch = Array.isArray(student.subjects)
      ? student.subjects.some((subject) =>
          subject?.toLowerCase().includes(keyword)
        )
      : false;

    const statusMatch = student.status?.toLowerCase().includes(keyword);

    const classMatch =
      student.class?.toLowerCase().includes(keyword) ||
      student.class?.replace("th", "").includes(keyword);

    const sectionMatch = student.section?.toLowerCase().includes(keyword);

    return (
      nameMatch ||
      emailMatch ||
      rollMatch ||
      phoneMatch ||
      subjectMatch ||
      statusMatch ||
      classMatch ||
      sectionMatch
    );
  });
}


    setFilteredStudents(filtered)
  }

  const handleDropdownAction = (action, student) => {
    setActiveDropdown(null)
    switch (action) {
      case "downloadIdCard":
        console.log(`Downloading ID card for ${student.name}`)
        break
      case "downloadReportCard":
        console.log(`Downloading report card for ${student.name}`)
        break
      case "downloadCertificate":
        console.log(`Downloading certificate for ${student.name}`)
        break
      case "viewTimetable":
        console.log(`Viewing timetable for ${student.name}`)
        break
      case "attendanceReport":
        console.log(`Viewing attendance report for ${student.name}`)
        break
      case "viewGrades":
        console.log(`Viewing grades for ${student.name}`)
        break
      case "contactParent":
        console.log(`Contacting parent of ${student.name}`)
        break
      case "editProfile":
        console.log(`Editing profile for ${student.name}`)
        break
      default:
        break
    }
  }

  const closeAllDropdowns = () => {
    setActiveDropdown(null)
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
  }

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return "#10b981"
    if (attendance >= 90) return "#f59e0b"
    if (attendance >= 80) return "#f97316"
    return "#ef4444"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "#10b981"
      case "Absent":
        return "#ef4444"
      case "On Leave":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const handleViewProfile = (student) => {
    setSelectedStudentDetail(student)
    setCurrentStep(2)
  }

  const StudentCard = ({ student }) => (
    <View style={styles.studentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', }} style={styles.avatar} />
          {student.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName} allowFontScaling={false}>
            {student.name}
          </Text>
          <Text style={styles.classSection} allowFontScaling={false}>
            {student.class_name} - Section {student.section_name}
          </Text>
          <Text style={styles.rollNumber} allowFontScaling={false}>
            Roll No: {student.roll_no}
          </Text>
          <Text style={styles.studentEmail} allowFontScaling={false}>
            {student.email}
          </Text>
        </View>
        {/* <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
          >
            <Text style={styles.moreText} allowFontScaling={false}>
              ⋯
            </Text>
          </TouchableOpacity>
          {activeDropdown === student.id && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("downloadIdCard", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  🆔
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  Download ID Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("downloadReportCard", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  📊
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  Download Report Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("downloadCertificate", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  📜
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  Download Certificate
                </Text>
              </TouchableOpacity>
              <View style={styles.dropdownDivider} />
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("viewTimetable", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  📅
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  View Timetable
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("attendanceReport", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  📈
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  Attendance Report
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleDropdownAction("viewGrades", student)}>
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  🎓
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  View Grades
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("contactParent", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  📞
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  Contact Parent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleDropdownAction("editProfile", student)}
              >
                <Text style={styles.dropdownIcon} allowFontScaling={false}>
                  ✏️
                </Text>
                <Text style={styles.dropdownText} allowFontScaling={false}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View> */}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.contactContainer}>
          <Text style={styles.contactIcon} allowFontScaling={false}>
            📱
          </Text>
          <Text style={styles.contactText} allowFontScaling={false}>
            {student.mobile}
          </Text>
          <Text style={styles.lastActive} allowFontScaling={false}>
            • 2 mins ago
          </Text>
        </View>
        <View style={styles.subjectsContainer}>
          <Text style={styles.subjectsLabel} allowFontScaling={false}>
            Subjects:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.subjectsList}>
              {student.subject_names &&
                student.subject_names.map((subject, index) => (
                  <View key={index} style={styles.subjectChip}>
                    <Text style={styles.subjectText} allowFontScaling={false}>
                      {subject.trim()}
                    </Text>
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.statsRow}>
          {/* <View style={styles.statItem}>
            <Text
              style={[styles.statValue, { color: getAttendanceColor(student.attendance) }]}
              allowFontScaling={false}
            >
              {student.attendance}%
            </Text>
            <Text style={styles.statLabel} allowFontScaling={false}>
              Attendance
            </Text>
          </View> */}
          <View style={styles.statDivider} />
          {/* <View style={styles.statItem}>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(student.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(student.status) }]} allowFontScaling={false}>
                {student.status}
              </Text>
            </View>
            <Text style={styles.statLabel} allowFontScaling={false}>
              Status
            </Text>
          </View> */}
        </View>
      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleViewProfile(student)}>
          <Text style={styles.actionButtonText} allowFontScaling={false}>
            View Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
          <Text style={[styles.actionButtonText, styles.primaryButtonText]} allowFontScaling={false}>
            Send Message
          </Text>
        </TouchableOpacity>
      </View>
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
          Student Profile
        </Text>
      </View>

      <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
        {/* Student Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatarContainer}>
            <Image source={{ uri: selectedStudentDetail?.avatar }} style={styles.profileAvatar} />
            {selectedStudentDetail?.isOnline && <View style={styles.profileOnlineIndicator} />}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} allowFontScaling={false}>
              {selectedStudentDetail?.name}
            </Text>
            <Text style={styles.profileClass} allowFontScaling={false}>
              Class {selectedStudentDetail?.class} - Section {selectedStudentDetail?.section}
            </Text>
            <Text style={styles.profileRoll} allowFontScaling={false}>
              Roll Number: {selectedStudentDetail?.rollNumber}
            </Text>
          </View>
          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.profileActionButton}>
              <Text style={styles.profileActionIcon} allowFontScaling={false}>
                📞
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileActionButton}>
              <Text style={styles.profileActionIcon} allowFontScaling={false}>
                💬
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Academic Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Academic Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Student ID
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.studentId || `STU${selectedStudentDetail?.id?.toString().padStart(4, "0")}`}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Class
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.class}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Section
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.section}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Roll Number
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.rollNumber}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Academic Year
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.academicYear || "2024-2025"}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Contact Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Email Address
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.email}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Parent Contact
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.parentContact}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Emergency Contact
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.emergencyContact || "+91 98765 43210"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel} allowFontScaling={false}>
              Address
            </Text>
            <Text style={styles.infoValue} allowFontScaling={false}>
              {selectedStudentDetail?.address || "123 Main Street, City, State - 123456"}
            </Text>
          </View>
        </View>

        {/* Subjects */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Enrolled Subjects
          </Text>
          <View style={styles.subjectsGrid}>
            {selectedStudentDetail?.subjects?.map((subject, index) => (
              <View key={index} style={styles.subjectCard}>
                <Text style={styles.subjectName} allowFontScaling={false}>
                  {subject}
                </Text>
                <Text style={styles.subjectGrade} allowFontScaling={false}>
                  A+
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Performance Overview
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text
                style={[styles.statValue, { color: getAttendanceColor(selectedStudentDetail?.attendance) }]}
                allowFontScaling={false}
              >
                {selectedStudentDetail?.attendance}%
              </Text>
              <Text style={styles.statLabel} allowFontScaling={false}>
                Attendance
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue} allowFontScaling={false}>
                {selectedStudentDetail?.cgpa || "8.5"}
              </Text>
              <Text style={styles.statLabel} allowFontScaling={false}>
                CGPA
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue} allowFontScaling={false}>
                {selectedStudentDetail?.rank || "15"}
              </Text>
              <Text style={styles.statLabel} allowFontScaling={false}>
                Rank
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text
                style={[styles.statValue, { color: getStatusColor(selectedStudentDetail?.status) }]}
                allowFontScaling={false}
              >
                {selectedStudentDetail?.status}
              </Text>
              <Text style={styles.statLabel} allowFontScaling={false}>
                Status
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle} allowFontScaling={false}>
            Recent Activities
          </Text>
          {selectedStudentDetail?.activities?.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText} allowFontScaling={false}>
                  {activity.icon}
                </Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle} allowFontScaling={false}>
                  {activity.title}
                </Text>
                <Text style={styles.activityDesc} allowFontScaling={false}>
                  {activity.description}
                </Text>
                <Text style={styles.activityTime} allowFontScaling={false}>
                  {activity.time}
                </Text>
              </View>
            </View>
          )) || (
              // Fallback activities if none exist
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText} allowFontScaling={false}>
                    📚
                  </Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle} allowFontScaling={false}>
                    No Recent Activities
                  </Text>
                  <Text style={styles.activityDesc} allowFontScaling={false}>
                    Check back later for updates
                  </Text>
                  <Text style={styles.activityTime} allowFontScaling={false}>
                    --
                  </Text>
                </View>
              </View>
            )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText} allowFontScaling={false}>
              📊 View Report Card
            </Text>
          </TouchableOpacity>
          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText} allowFontScaling={false}>
                📅 Timetable
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText} allowFontScaling={false}>
                📈 Attendance
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.tertiaryButton}>
            <Text style={styles.tertiaryButtonText} allowFontScaling={false}>
              ✏️ Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2c5282" barStyle="light-content" />
      {currentStep === 1 && (
        <>
          {/* Backdrop overlay for closing dropdowns */}
          {(activeDropdown || showClassDropdown || showSectionDropdown) && (
            <TouchableWithoutFeedback onPress={closeAllDropdowns}>
              <View style={styles.backdrop} />
            </TouchableWithoutFeedback>
          )}

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              Student Directory
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              {filteredStudents.length} students found
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon} allowFontScaling={false}>
                
              </Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, roll no, email, phone..."
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                placeholderTextColor="#9ca3af"
                allowFontScaling={false}
              />
              {searchKeyword.length > 0 && (
                <TouchableOpacity onPress={() => setSearchKeyword("")} style={styles.clearButton}>
                  <Text style={styles.clearButtonText} allowFontScaling={false}>
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Class and Section Filters */}
          <View style={styles.filtersContainer}>
  <View style={styles.dropdownRow}>
    {/* Class Dropdown */}
    <View style={styles.dropdownWrapper}>
      <Text style={styles.filterLabel} allowFontScaling={false}>
        Class:
      </Text>
      
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => {
          setShowClassDropdown(!showClassDropdown);
          setShowSectionDropdown(false);
          setActiveDropdown(null);
        }}
      >
        <Text style={styles.dropdownButtonText} allowFontScaling={false}>
          {selectedClass}
        </Text>
        <Text style={styles.dropdownArrow} allowFontScaling={false}>
          {showClassDropdown ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {showClassDropdown && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
            {classOptions.map((classItem) => (
              <TouchableOpacity
                key={classItem.label}
                style={[
                  styles.dropdownMenuItem,
                  selectedClass === classItem.label && styles.dropdownMenuItemActive,
                ]}
                onPress={() => {
                  setSelectedClass(classItem.label);
                  setShowClassDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownMenuText,
                    selectedClass === classItem.label && styles.dropdownMenuTextActive,
                  ]}
                  allowFontScaling={false}
                >
                  {classItem.label}
                </Text>
                {selectedClass === classItem.label && (
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

              {/* Section Dropdown */}
              {/* <View style={styles.dropdownWrapper}>
                <Text style={styles.filterLabel} allowFontScaling={false}>
                  Section:
                </Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    setShowSectionDropdown(!showSectionDropdown)
                    setShowClassDropdown(false)
                    setActiveDropdown(null)
                  }}
                >
                  <Text style={styles.dropdownButtonText} allowFontScaling={false}>
                    {selectedSection}
                  </Text>
                  <Text style={styles.dropdownArrow} allowFontScaling={false}>
                    {showSectionDropdown ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
                {showSectionDropdown && (
                  <View style={styles.dropdownMenu}>
                    {sections.map((section) => (
                      <TouchableOpacity
                        key={section}
                        style={[styles.dropdownMenuItem, selectedSection === section && styles.dropdownMenuItemActive]}
                        onPress={() => {
                          setSelectedSection(section)
                          setShowSectionDropdown(false)
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownMenuText,
                            selectedSection === section && styles.dropdownMenuTextActive,
                          ]}
                          allowFontScaling={false}
                        >
                          {section}
                        </Text>
                        {selectedSection === section && (
                          <Text style={styles.checkmark} allowFontScaling={false}>
                            ✓
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View> */}
            </View>
          </View>

          {/* Student List */}
          <FlatList
            data={filteredStudents}
            renderItem={({ item }) => <StudentCard student={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No students found
                </Text>
                <Text style={styles.emptySubtext} allowFontScaling={false}>
                  Try adjusting your search or filter criteria
                </Text>
              </View>
            )}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
          />
        </>
      )}
      {currentStep === 2 && renderStep2()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },
  clearButton: {
    padding: 4,
    
  },
  clearButtonText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  filtersContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  dropdownWrapper: {
    flex: 1,
    position: "relative",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    marginTop: 10,
  },
  dropdownButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "bold",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownMenuItemActive: {
    backgroundColor: "#f0f9ff",
  },
  dropdownMenuText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownMenuTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  studentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#6366f1",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  classSection: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
  },
  rollNumber: {
    fontSize: 11,
    color: "#f59e0b",
    fontWeight: "500",
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  moreButton: {
    padding: 4,
    position: "relative",
  },
  moreText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    minWidth: 180,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 16,
  },
  dropdownText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 4,
  },
  cardBody: {
    marginBottom: 8,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  contactText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  lastActive: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    marginLeft: 8,
  },
  subjectsContainer: {
    marginBottom: 8,
  },
  subjectsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  subjectsList: {
    flexDirection: "row",
  },
  subjectChip: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  subjectText: {
    fontSize: 11,
    color: "#0284c7",
    fontWeight: "500",
  },
  // statsRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#f8f9fa",
  //   borderRadius: 8,
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  // },
  // statItem: {
  //   flex: 1,
  //   alignItems: "center",
  // },
  // statDivider: {
  //   width: 1,
  //   height: 24,
  //   backgroundColor: "#e5e7eb",
  //   marginHorizontal: 12,
  // },
  // statValue: {
  //   fontSize: 14,
  //   fontWeight: "700",
  //   color: "#111827",
  //   marginBottom: 2,
  // },
  // statLabel: {
  //   fontSize: 11,
  //   color: "#6b7280",
  //   fontWeight: "500",
  //   textTransform: "uppercase",
  // },
  // statusContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginBottom: 2,
  // },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  primaryButton: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  primaryButtonText: {
    color: "#ffffff",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
    textAlign: "center",
  },
  // Detail View Styles
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
  // Profile Header
  profileHeader: {
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileOnlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 13,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
  },
  profileRoll: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  profileActions: {
    flexDirection: "row",
    gap: 8,
  },
  profileActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileActionIcon: {
    fontSize: 16,
  },
  // Info Cards
  infoCard: {
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
  infoCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  // Subjects Grid
  subjectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  subjectName: {
    fontSize: 12,
    color: "#0284c7",
    fontWeight: "600",
    marginBottom: 2,
  },
  subjectGrade: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "700",
  },
  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    minWidth: 70,
    alignItems: "center",
  },
  // Activity Items
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f9ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 14,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  // Action Buttons
  actionButtons: {
    gap: 12,
    marginBottom: 20,
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
  secondaryButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
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
  tertiaryButton: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tertiaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default StudentView;
