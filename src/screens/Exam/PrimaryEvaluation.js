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
} from "react-native"

const { width } = Dimensions.get("window")

const PrimaryEvaluation = () => {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showSectionDropdown, setShowSectionDropdown] = useState(false)
  const [showStudentDropdown, setShowStudentDropdown] = useState(false)
  const [showTermDropdown, setShowTermDropdown] = useState(false)
  const [evaluationData, setEvaluationData] = useState([])
  const [studentInfo, setStudentInfo] = useState(null)

  
  // Sample data for primary classes
  const classes = ["1st", "2nd", "3rd", "4th", "5th"]
  const sections = ["A", "B", "C", "D"]
  const students = ["Aarav Sharma", "Diya Patel", "Arjun Kumar", "Kavya Singh", "Rohan Gupta"]
  const terms = ["First Term", "Second Term", "Third Term", "Annual"]

  // Sample primary evaluation data - expanded with more combinations
  const primaryEvaluationData = {
    "3rd-A-Aarav Sharma-First Term": {
      studentInfo: {
        name: "Aarav Sharma",
        rollNo: "2024001",
        class: "3rd",
        section: "A",
        fatherName: "Mr. Rajesh Sharma",
        motherName: "Mrs. Priya Sharma",
        admissionNo: "PRI/2024/001",
        dateOfBirth: "15-08-2015",
      },
      termInfo: {
        term: "First Term",
        academicYear: "2024-25",
        evaluationDate: "20-03-2024",
        overallGrade: "A",
        totalSubjects: 6,
        workingDays: 85,
        presentDays: 82,
        attendancePercentage: 96.5,
      },
      subjects: [
        {
          id: 1,
          name: "English",
          skills: [
            { skill: "Reading", grade: "A", description: "Reads fluently with good comprehension" },
            { skill: "Writing", grade: "A", description: "Writes neatly with proper grammar" },
            { skill: "Speaking", grade: "A+", description: "Speaks confidently and clearly" },
            { skill: "Listening", grade: "A", description: "Follows instructions well" },
          ],
          overallGrade: "A",
          teacher: "Ms. English Teacher",
          remarks: "Excellent progress in all language skills. Shows great enthusiasm in reading activities.",
        },
        {
          id: 2,
          name: "Mathematics",
          skills: [
            { skill: "Number Recognition", grade: "A+", description: "Identifies numbers up to 1000 easily" },
            { skill: "Basic Operations", grade: "A", description: "Performs addition and subtraction well" },
            { skill: "Problem Solving", grade: "B+", description: "Shows good logical thinking" },
            { skill: "Measurement", grade: "A", description: "Understands basic units of measurement" },
          ],
          overallGrade: "A",
          teacher: "Mr. Math Teacher",
          remarks: "Strong foundation in mathematics. Needs more practice in word problems.",
        },
        {
          id: 3,
          name: "Science",
          skills: [
            { skill: "Observation", grade: "A", description: "Makes careful observations during experiments" },
            { skill: "Questioning", grade: "A+", description: "Asks thoughtful questions about nature" },
            { skill: "Recording", grade: "B+", description: "Records findings with some guidance" },
            { skill: "Understanding", grade: "A", description: "Grasps scientific concepts well" },
          ],
          overallGrade: "A",
          teacher: "Ms. Science Teacher",
          remarks: "Shows natural curiosity about the world. Enjoys hands-on activities and experiments.",
        },
        {
          id: 4,
          name: "Social Studies",
          skills: [
            { skill: "Map Skills", grade: "B+", description: "Learning to read simple maps" },
            { skill: "Historical Awareness", grade: "A", description: "Shows interest in past events" },
            { skill: "Cultural Understanding", grade: "A", description: "Respects different cultures and traditions" },
            { skill: "Civic Sense", grade: "A+", description: "Demonstrates good citizenship qualities" },
          ],
          overallGrade: "A",
          teacher: "Mr. Social Teacher",
          remarks: "Good understanding of community and environment. Shows leadership qualities.",
        },
        {
          id: 5,
          name: "Hindi",
          skills: [
            { skill: "Reading", grade: "A", description: "Reads Hindi text with good pronunciation" },
            { skill: "Writing", grade: "B+", description: "Forms letters correctly, improving speed" },
            { skill: "Vocabulary", grade: "A", description: "Good collection of Hindi words" },
            { skill: "Comprehension", grade: "A", description: "Understands stories and poems well" },
          ],
          overallGrade: "A",
          teacher: "Mrs. Hindi Teacher",
          remarks: "Making steady progress in Hindi language skills. Shows interest in Hindi literature.",
        },
        {
          id: 6,
          name: "Art & Craft",
          skills: [
            { skill: "Creativity", grade: "A+", description: "Shows excellent creative expression" },
            { skill: "Fine Motor Skills", grade: "A", description: "Good hand-eye coordination" },
            { skill: "Color Sense", grade: "A", description: "Uses colors effectively in artwork" },
            { skill: "Following Instructions", grade: "A", description: "Follows craft instructions well" },
          ],
          overallGrade: "A+",
          teacher: "Ms. Art Teacher",
          remarks: "Exceptional artistic abilities. Creates beautiful and imaginative artwork.",
        },
      ],
      behavioralSkills: [
        { skill: "Discipline", grade: "A", description: "Follows school rules and maintains good behavior" },
        { skill: "Cooperation", grade: "A+", description: "Works well with classmates and teachers" },
        { skill: "Initiative", grade: "A", description: "Takes initiative in classroom activities" },
        { skill: "Responsibility", grade: "A", description: "Takes care of personal belongings and duties" },
        { skill: "Punctuality", grade: "A+", description: "Always arrives on time for school and classes" },
      ],
      teacherRemarks:
        "Aarav is a bright and enthusiastic student who shows excellent academic progress. He is well-behaved, cooperative, and shows leadership qualities. Continue to encourage his curiosity and creativity.",
      principalRemarks:
        "A promising student with good academic foundation and excellent behavior. Keep up the good work!",
    },
    "2nd-B-Diya Patel-Second Term": {
      studentInfo: {
        name: "Diya Patel",
        rollNo: "2024002",
        class: "2nd",
        section: "B",
        fatherName: "Mr. Amit Patel",
        motherName: "Mrs. Neha Patel",
        admissionNo: "PRI/2024/002",
        dateOfBirth: "22-05-2016",
      },
      termInfo: {
        term: "Second Term",
        academicYear: "2024-25",
        evaluationDate: "15-07-2024",
        overallGrade: "A+",
        totalSubjects: 5,
        workingDays: 90,
        presentDays: 88,
        attendancePercentage: 97.8,
      },
      subjects: [
        {
          id: 1,
          name: "English",
          skills: [
            { skill: "Reading", grade: "A+", description: "Excellent reading skills with perfect pronunciation" },
            { skill: "Writing", grade: "A", description: "Beautiful handwriting and creative stories" },
            { skill: "Speaking", grade: "A+", description: "Very confident speaker with rich vocabulary" },
            { skill: "Listening", grade: "A+", description: "Excellent listening and comprehension skills" },
          ],
          overallGrade: "A+",
          teacher: "Ms. Sarah Johnson",
          remarks: "Outstanding performance in English. Shows exceptional language skills for her age.",
        },
        {
          id: 2,
          name: "Mathematics",
          skills: [
            { skill: "Number Recognition", grade: "A+", description: "Perfect number recognition up to 500" },
            {
              skill: "Basic Operations",
              grade: "A+",
              description: "Excellent in addition, subtraction, and multiplication",
            },
            {
              skill: "Problem Solving",
              grade: "A",
              description: "Great logical thinking and problem-solving approach",
            },
            { skill: "Patterns", grade: "A+", description: "Identifies and creates complex patterns easily" },
          ],
          overallGrade: "A+",
          teacher: "Mr. Ravi Kumar",
          remarks: "Exceptional mathematical abilities. Shows advanced understanding of concepts.",
        },
        {
          id: 3,
          name: "Science",
          skills: [
            { skill: "Observation", grade: "A+", description: "Makes detailed and accurate observations" },
            { skill: "Questioning", grade: "A+", description: "Asks very insightful scientific questions" },
            { skill: "Experimentation", grade: "A", description: "Enjoys conducting simple experiments" },
            { skill: "Understanding", grade: "A+", description: "Excellent grasp of scientific concepts" },
          ],
          overallGrade: "A+",
          teacher: "Dr. Meera Sharma",
          remarks: "Shows exceptional scientific temperament and curiosity about natural phenomena.",
        },
        {
          id: 4,
          name: "Hindi",
          skills: [
            { skill: "Reading", grade: "A", description: "Good Hindi reading with proper pronunciation" },
            { skill: "Writing", grade: "A", description: "Neat Hindi writing with correct spellings" },
            { skill: "Speaking", grade: "A+", description: "Fluent Hindi speaker with good expression" },
            { skill: "Poetry", grade: "A", description: "Enjoys reciting Hindi poems with emotion" },
          ],
          overallGrade: "A",
          teacher: "Mrs. Sunita Gupta",
          remarks: "Very good progress in Hindi language. Shows appreciation for Hindi literature.",
        },
        {
          id: 5,
          name: "Art & Music",
          skills: [
            { skill: "Drawing", grade: "A+", description: "Creates beautiful and detailed drawings" },
            { skill: "Coloring", grade: "A+", description: "Excellent color combination and shading" },
            { skill: "Singing", grade: "A", description: "Sweet voice with good rhythm sense" },
            { skill: "Creativity", grade: "A+", description: "Highly creative in all artistic activities" },
          ],
          overallGrade: "A+",
          teacher: "Ms. Kavita Rao",
          remarks: "Exceptional artistic talents. Shows great potential in creative fields.",
        },
      ],
      behavioralSkills: [
        { skill: "Discipline", grade: "A+", description: "Exemplary behavior and follows all rules" },
        { skill: "Helpfulness", grade: "A+", description: "Always ready to help classmates and teachers" },
        { skill: "Leadership", grade: "A", description: "Shows natural leadership qualities" },
        { skill: "Sharing", grade: "A+", description: "Shares toys and materials willingly" },
        { skill: "Respect", grade: "A+", description: "Shows great respect for elders and peers" },
      ],
      teacherRemarks:
        "Diya is an exceptional student with outstanding academic performance and exemplary behavior. She is a role model for other students and shows great potential in all areas.",
      principalRemarks:
        "An outstanding student who excels in academics and demonstrates excellent character. We are proud to have her in our school.",
    },
    "4th-C-Arjun Kumar-Third Term": {
      studentInfo: {
        name: "Arjun Kumar",
        rollNo: "2024003",
        class: "4th",
        section: "C",
        fatherName: "Mr. Suresh Kumar",
        motherName: "Mrs. Rekha Kumar",
        admissionNo: "PRI/2024/003",
        dateOfBirth: "10-12-2014",
      },
      termInfo: {
        term: "Third Term",
        academicYear: "2024-25",
        evaluationDate: "10-11-2024",
        overallGrade: "B+",
        totalSubjects: 7,
        workingDays: 88,
        presentDays: 84,
        attendancePercentage: 95.5,
      },
      subjects: [
        {
          id: 1,
          name: "English",
          skills: [
            { skill: "Reading", grade: "B+", description: "Good reading skills, improving fluency" },
            { skill: "Writing", grade: "B", description: "Neat handwriting, working on grammar" },
            { skill: "Speaking", grade: "A", description: "Confident speaker with good vocabulary" },
            { skill: "Comprehension", grade: "B+", description: "Good understanding of stories and texts" },
          ],
          overallGrade: "B+",
          teacher: "Ms. Priya Sharma",
          remarks: "Steady improvement in English skills. Needs more practice in written work.",
        },
        {
          id: 2,
          name: "Mathematics",
          skills: [
            { skill: "Arithmetic", grade: "A", description: "Strong in basic mathematical operations" },
            { skill: "Geometry", grade: "B+", description: "Good understanding of shapes and measurements" },
            { skill: "Problem Solving", grade: "B", description: "Working on complex word problems" },
            { skill: "Mental Math", grade: "A", description: "Excellent mental calculation skills" },
          ],
          overallGrade: "B+",
          teacher: "Mr. Rajesh Verma",
          remarks: "Good mathematical foundation. Shows particular strength in mental calculations.",
        },
        {
          id: 3,
          name: "Science",
          skills: [
            { skill: "Theory", grade: "B+", description: "Good grasp of scientific concepts" },
            { skill: "Practical", grade: "A", description: "Enjoys hands-on experiments and activities" },
            { skill: "Observation", grade: "A", description: "Makes careful and detailed observations" },
            { skill: "Recording", grade: "B", description: "Learning to record findings systematically" },
          ],
          overallGrade: "B+",
          teacher: "Dr. Anita Singh",
          remarks: "Shows good interest in science. Particularly enjoys practical work and experiments.",
        },
        {
          id: 4,
          name: "Social Studies",
          skills: [
            { skill: "Geography", grade: "B+", description: "Good knowledge of maps and places" },
            { skill: "History", grade: "A", description: "Shows great interest in historical events" },
            { skill: "Civics", grade: "B+", description: "Understanding of basic civic responsibilities" },
            { skill: "Current Affairs", grade: "A", description: "Well aware of current events" },
          ],
          overallGrade: "B+",
          teacher: "Mr. Deepak Joshi",
          remarks: "Good overall performance. Shows particular interest in history and current affairs.",
        },
        {
          id: 5,
          name: "Hindi",
          skills: [
            { skill: "Reading", grade: "A", description: "Fluent Hindi reader with good pronunciation" },
            { skill: "Writing", grade: "B+", description: "Good handwriting, improving spelling" },
            { skill: "Grammar", grade: "B", description: "Working on Hindi grammar rules" },
            { skill: "Literature", grade: "A", description: "Enjoys Hindi stories and poems" },
          ],
          overallGrade: "B+",
          teacher: "Mrs. Geeta Sharma",
          remarks: "Good progress in Hindi. Shows appreciation for Hindi literature and poetry.",
        },
        {
          id: 6,
          name: "Computer Science",
          skills: [
            { skill: "Basic Operations", grade: "A", description: "Good understanding of computer basics" },
            { skill: "Typing", grade: "B+", description: "Improving typing speed and accuracy" },
            { skill: "Drawing", grade: "A", description: "Creates good digital artwork" },
            { skill: "Problem Solving", grade: "B+", description: "Learning logical thinking through coding" },
          ],
          overallGrade: "B+",
          teacher: "Mr. Vikash Tech",
          remarks: "Shows good aptitude for technology. Enjoys computer-based learning activities.",
        },
        {
          id: 7,
          name: "Physical Education",
          skills: [
            { skill: "Sports", grade: "A+", description: "Excellent in various sports activities" },
            { skill: "Fitness", grade: "A", description: "Good physical fitness and stamina" },
            { skill: "Team Work", grade: "A", description: "Great team player and sportsman spirit" },
            { skill: "Leadership", grade: "A", description: "Shows leadership in sports activities" },
          ],
          overallGrade: "A",
          teacher: "Coach Ramesh",
          remarks: "Outstanding performance in sports. Shows great potential in athletics.",
        },
      ],
      behavioralSkills: [
        { skill: "Discipline", grade: "B+", description: "Generally well-behaved, occasional reminders needed" },
        { skill: "Cooperation", grade: "A", description: "Works well with others in group activities" },
        { skill: "Honesty", grade: "A", description: "Always truthful and trustworthy" },
        { skill: "Perseverance", grade: "A", description: "Never gives up when facing challenges" },
        { skill: "Respect", grade: "A", description: "Shows respect for teachers and classmates" },
      ],
      teacherRemarks:
        "Arjun is a hardworking student who shows consistent improvement. He has a particular talent for sports and shows good character. With continued effort, he can achieve even better results.",
      principalRemarks:
        "A dedicated student with good potential. His sporting abilities are commendable. Continue working hard in academics.",
    },
  }

  useEffect(() => {
    loadEvaluationData()
  }, [selectedClass, selectedSection, selectedStudent, selectedTerm])

  const loadEvaluationData = () => {
    if (selectedClass && selectedSection && selectedStudent && selectedTerm) {
      const key = `${selectedClass}-${selectedSection}-${selectedStudent}-${selectedTerm}`
      const data = primaryEvaluationData[key]
      if (data) {
        setEvaluationData(data.subjects)
        setStudentInfo(data)
      } else {
        // Show default "no data" state when combination doesn't exist
        setEvaluationData([])
        setStudentInfo(null)
      }
    } else {
      // Clear data when not all filters are selected
      setEvaluationData([])
      setStudentInfo(null)
    }
  }

  const closeAllDropdowns = () => {
    setShowClassDropdown(false)
    setShowSectionDropdown(false)
    setShowStudentDropdown(false)
    setShowTermDropdown(false)
  }

  const getGradeColor = (grade) => {
    const colors = {
      "A+": "#10b981",
      A: "#059669",
      "B+": "#3b82f6",
      B: "#2563eb",
      "C+": "#f59e0b",
      C: "#d97706",
      "Needs Improvement": "#ef4444",
    }
    return colors[grade] || "#6b7280"
  }

  const getSubjectIcon = (subject) => {
    const icons = {
      English: "book-open-variant",
      Mathematics: "calculator",
      Science: "flask",
      "Social Studies": "earth",
      Hindi: "translate",
      "Art & Craft": "palette",
      "Physical Education": "run",
      Music: "music",
    }
    return icons[subject] || "book"
  }

  const getSubjectColor = (subject) => {
    const colors = {
      English: "#3b82f6",
      Mathematics: "#ef4444",
      Science: "#10b981",
      "Social Studies": "#f59e0b",
      Hindi: "#8b5cf6",
      "Art & Craft": "#f97316",
      "Physical Education": "#06b6d4",
      Music: "#ec4899",
    }
    return colors[subject] || "#6b7280"
  }

  const SubjectCard = ({ subject }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectHeader}>
        <View style={styles.subjectInfo}>
          <View style={[styles.subjectIcon, { backgroundColor: getSubjectColor(subject.name) }]}>
            <Icon name={getSubjectIcon(subject.name)} size={20} color="#ffffff" />
          </View>
          <View style={styles.subjectDetails}>
            <Text style={styles.subjectName} allowFontScaling={false}>
              {subject.name}
            </Text>
            <Text style={styles.teacherName} allowFontScaling={false}>
              {subject.teacher}
            </Text>
          </View>
        </View>
        <View style={[styles.overallGradeBadge, { backgroundColor: getGradeColor(subject.overallGrade) }]}>
          <Text style={styles.overallGradeText} allowFontScaling={false}>
            {subject.overallGrade}
          </Text>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={styles.skillsTitle} allowFontScaling={false}>
          Skills Assessment
        </Text>
        <View style={styles.skillsGrid}>
          {subject.skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName} allowFontScaling={false}>
                  {skill.skill}
                </Text>
                <View style={[styles.skillGradeBadge, { backgroundColor: getGradeColor(skill.grade) }]}>
                  <Text style={styles.skillGradeText} allowFontScaling={false}>
                    {skill.grade}
                  </Text>
                </View>
              </View>
              <Text style={styles.skillDescription} allowFontScaling={false}>
                {skill.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.remarksContainer}>
        <Icon name="comment-text-outline" size={16} color="#6b7280" />
        <Text style={styles.remarksText} allowFontScaling={false}>
          {subject.remarks}
        </Text>
      </View>
    </View>
  )

  const BehavioralSkillsCard = ({ skills }) => (
    <View style={styles.behavioralCard}>
      <View style={styles.behavioralHeader}>
        <Icon name="account-heart" size={20} color="#8b5cf6" />
        <Text style={styles.behavioralTitle} allowFontScaling={false}>
          Behavioral & Social Skills
        </Text>
      </View>
      <View style={styles.behavioralGrid}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.behavioralItem}>
            <View style={styles.behavioralItemHeader}>
              <Text style={styles.behavioralSkillName} allowFontScaling={false}>
                {skill.skill}
              </Text>
              <View style={[styles.behavioralGradeBadge, { backgroundColor: getGradeColor(skill.grade) }]}>
                <Text style={styles.behavioralGradeText} allowFontScaling={false}>
                  {skill.grade}
                </Text>
              </View>
            </View>
            <Text style={styles.behavioralDescription} allowFontScaling={false}>
              {skill.description}
            </Text>
          </View>
        ))}
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

  const allOptionsSelected = selectedClass && selectedSection && selectedStudent && selectedTerm

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          Primary Evaluation
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          Comprehensive assessment for primary students
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Class"
              value={selectedClass}
              options={classes}
              isOpen={showClassDropdown}
              onToggle={() => {
                setShowClassDropdown(!showClassDropdown)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
                setShowTermDropdown(false)
              }}
              onSelect={(classItem) => {
                setSelectedClass(classItem)
                setShowClassDropdown(false)
              }}
              placeholder="Select Class"
            />
            <DropdownComponent
              label="Section"
              value={selectedSection}
              options={sections}
              isOpen={showSectionDropdown}
              onToggle={() => {
                setShowSectionDropdown(!showSectionDropdown)
                setShowClassDropdown(false)
                setShowStudentDropdown(false)
                setShowTermDropdown(false)
              }}
              onSelect={(section) => {
                setSelectedSection(section)
                setShowSectionDropdown(false)
              }}
              placeholder="Select Section"
            />
          </View>

          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Student"
              value={selectedStudent}
              options={students}
              isOpen={showStudentDropdown}
              onToggle={() => {
                setShowStudentDropdown(!showStudentDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowTermDropdown(false)
              }}
              onSelect={(student) => {
                setSelectedStudent(student)
                setShowStudentDropdown(false)
              }}
              placeholder="Select Student"
            />
            <DropdownComponent
              label="Term"
              value={selectedTerm}
              options={terms}
              isOpen={showTermDropdown}
              onToggle={() => {
                setShowTermDropdown(!showTermDropdown)
                setShowClassDropdown(false)
                setShowSectionDropdown(false)
                setShowStudentDropdown(false)
              }}
              onSelect={(term) => {
                setSelectedTerm(term)
                setShowTermDropdown(false)
              }}
              placeholder="Select Term"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {allOptionsSelected ? (
            studentInfo ? (
              <View style={styles.resultsContainer}>
                {/* Student Info Card */}
                <View style={styles.studentInfoCard}>
                  <View style={styles.studentHeader}>
                    <View style={styles.studentAvatar}>
                      <Text style={styles.avatarText} allowFontScaling={false}>
                        {studentInfo.studentInfo.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.studentDetails}>
                      <Text style={styles.studentName} allowFontScaling={false}>
                        {studentInfo.studentInfo.name}
                      </Text>
                      <Text style={styles.studentClass} allowFontScaling={false}>
                        Class {studentInfo.studentInfo.class} - {studentInfo.studentInfo.section}
                      </Text>
                      <Text style={styles.rollNumber} allowFontScaling={false}>
                        Roll No: {studentInfo.studentInfo.rollNo}
                      </Text>
                      <Text style={styles.parentInfo} allowFontScaling={false}>
                        Father: {studentInfo.studentInfo.fatherName}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.overallGradeBadge,
                        { backgroundColor: getGradeColor(studentInfo.termInfo.overallGrade) },
                      ]}
                    >
                      <Text style={styles.overallGradeText} allowFontScaling={false}>
                        {studentInfo.termInfo.overallGrade}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Term Summary Card */}
                <View style={styles.summaryCard}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle} allowFontScaling={false}>
                      {studentInfo.termInfo.term} Report Card
                    </Text>
                    <Text style={styles.evaluationDate} allowFontScaling={false}>
                      {studentInfo.termInfo.evaluationDate}
                    </Text>
                  </View>

                  <View style={styles.summaryStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {studentInfo.termInfo.totalSubjects}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Subjects
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={[styles.statValue, { color: "#10b981" }]} allowFontScaling={false}>
                        {studentInfo.termInfo.attendancePercentage}%
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Attendance
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue} allowFontScaling={false}>
                        {studentInfo.termInfo.presentDays}/{studentInfo.termInfo.workingDays}
                      </Text>
                      <Text style={styles.statLabel} allowFontScaling={false}>
                        Days Present
                      </Text>
                    </View>
                  </View>

                  <View style={styles.attendanceIndicator}>
                    <Text style={styles.attendanceLabel} allowFontScaling={false}>
                      Attendance Progress
                    </Text>
                    <View style={styles.attendanceBar}>
                      <View
                        style={[
                          styles.attendanceFill,
                          {
                            width: `${studentInfo.termInfo.attendancePercentage}%`,
                            backgroundColor: studentInfo.termInfo.attendancePercentage >= 90 ? "#10b981" : "#f59e0b",
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                {/* Subject-wise Evaluation */}
                <View style={styles.subjectsContainer}>
                  <Text style={styles.subjectsTitle} allowFontScaling={false}>
                    Subject-wise Assessment
                  </Text>
                  <FlatList
                    data={evaluationData}
                    renderItem={({ item }) => <SubjectCard subject={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                </View>

                {/* Behavioral Skills */}
                {studentInfo.behavioralSkills && <BehavioralSkillsCard skills={studentInfo.behavioralSkills} />}

                {/* Teacher & Principal Remarks */}
                <View style={styles.remarksSection}>
                  <View style={styles.teacherRemarksCard}>
                    <View style={styles.remarksHeader}>
                      <Icon name="account-tie" size={18} color="#3b82f6" />
                      <Text style={styles.remarksHeaderText} allowFontScaling={false}>
                        Class Teacher's Remarks
                      </Text>
                    </View>
                    <Text style={styles.remarksContent} allowFontScaling={false}>
                      {studentInfo.teacherRemarks}
                    </Text>
                  </View>

                  <View style={styles.principalRemarksCard}>
                    <View style={styles.remarksHeader}>
                      <Icon name="school" size={18} color="#8b5cf6" />
                      <Text style={styles.remarksHeaderText} allowFontScaling={false}>
                        Principal's Remarks
                      </Text>
                    </View>
                    <Text style={styles.remarksContent} allowFontScaling={false}>
                      {studentInfo.principalRemarks}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataIcon} allowFontScaling={false}>
                  📚
                </Text>
                <Text style={styles.noDataTitle} allowFontScaling={false}>
                  No Evaluation Found
                </Text>
                <Text style={styles.noDataText} allowFontScaling={false}>
                  No evaluation data available for the selected criteria.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon} allowFontScaling={false}>
                🎓
              </Text>
              <Text style={styles.emptyTitle} allowFontScaling={false}>
                Select All Filters
              </Text>
              <Text style={styles.emptyText} allowFontScaling={false}>
                Please select Class, Section, Student, and Term to view primary evaluation.
              </Text>

              <View style={styles.progressIndicator}>
                <View style={styles.progressSteps}>
                  <View style={[styles.progressStep, selectedClass && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedClass && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      1
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedSection && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedSection && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      2
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedStudent && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedStudent && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      3
                    </Text>
                  </View>
                  <View style={styles.progressLine} />
                  <View style={[styles.progressStep, selectedTerm && styles.progressStepActive]}>
                    <Text
                      style={[styles.progressStepText, selectedTerm && styles.progressStepTextActive]}
                      allowFontScaling={false}
                    >
                      4
                    </Text>
                  </View>
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Class
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Section
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Student
                  </Text>
                  <Text style={styles.progressLabel} allowFontScaling={false}>
                    Term
                  </Text>
                </View>
              </View>
            </View>
          )}
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
  filtersContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
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
  overlay: {
    flex: 1,
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
    marginBottom: 32,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  progressIndicator: {
    alignItems: "center",
  },
  progressSteps: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  progressStepActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  progressStepText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  progressStepTextActive: {
    color: "#ffffff",
  },
  progressLine: {
    width: 24,
    height: 2,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
  },
  progressLabel: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  noDataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  noDataIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  noDataText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  resultsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  studentInfoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  studentClass: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  rollNumber: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  parentInfo: {
    fontSize: 12,
    color: "#9ca3af",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  overallGradeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  overallGradeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  evaluationDate: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  attendanceIndicator: {
    alignItems: "center",
  },
  attendanceLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  attendanceBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
  },
  attendanceFill: {
    height: "100%",
    borderRadius: 4,
  },
  subjectsContainer: {
    marginTop: 8,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  separator: {
    height: 12,
  },
  subjectCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth:1,
    borderColor:'#00000020'
  
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subjectDetails: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  teacherName: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  skillsContainer: {
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  skillsGrid: {
    gap: 8,
  },
  skillItem: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  skillName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  skillGradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  skillGradeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  skillDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  remarksContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  remarksText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  behavioralCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
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
  behavioralHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  behavioralTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  behavioralGrid: {
    gap: 8,
  },
  behavioralItem: {
    backgroundColor: "#fef7ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#8b5cf6",
  },
  behavioralItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  behavioralSkillName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  behavioralGradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  behavioralGradeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  behavioralDescription: {
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  remarksSection: {
    marginTop: 12,
    gap: 12,
  },
  teacherRemarksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
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
  principalRemarksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8b5cf6",
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
  remarksHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  remarksHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  remarksContent: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default PrimaryEvaluation;


