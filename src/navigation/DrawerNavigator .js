import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/DashboardScreen';
import Test from '../Test/Test';
import CustomDrawerContent from './CustomDrawerContent'; // ✅ Make sure this path is correct
import StudentAttendence from '../screens/Student/StudentAttendence';
import StudentView from '../screens/Student/StudentView';
import ExamSchedule from '../screens/Exam/ExamSchedule';
import UserView from '../screens/User/UserView';
import NoticeBoard from '../screens/Communicate/NoticeBoard';
import ProfileView from '../screens/Profile/ProfileView';
import Homework from '../screens/HomeworkClasswork/Homework';
import ClassWork from '../screens/HomeworkClasswork/Classwork';
import FeeStatement from '../screens/FeeReport/FeeStatement';
import CurrentBalance from '../screens/FeeReport/CurrentBalance';
import BalanceFeeReport from '../screens/FeeReport/BalanceFeeReport';
import TransactionReport from '../screens/FeeReport/TransactionReport';
import Setting from '../common/Setting';
import { useTheme } from '../theme/ThemeContext';
import DailyCollectionReport from '../screens/FeeReport/DailyCollectionReport';
import FeeFollowUp from '../screens/FeeReport/FeeFollowUp';
import MarkStudentAttendence from '../screens/Student/MarkStudentAttendence';
import StudentLeaveManagement from '../screens/Student/StudentLeaveManagement';
import StudentPTM from '../screens/Student/StudentPTM';
import ExamMarks from '../screens/Exam/ExamMarks';
import TeacherComment from '../screens/Exam/TeacherComment';
import CoCurricularGrade from '../screens/Exam/CoCurricularGrade';
import PrimaryEvaluation from '../screens/Exam/PrimaryEvaluation';
import DisciplinaryReport from '../screens/Disciplinary/DisciplinaryReport';
import StaffDirectory from '../screens/HumanResource/StaffDirectory';
import StaffAttendanceReport from '../screens/HumanResource/StaffAttendenceReport';
import ApplyLeave from '../screens/HumanResource/ApplyLeave';
import ApproveLeaveRequest from '../screens/HumanResource/ApproveLeaveRequest';
import StaffPayroll from '../screens/HumanResource/Payroll';
import Payroll from '../screens/HumanResource/Payroll';
import Task from '../screens/HumanResource/Task';
import TeacherTimetable from '../screens/Academics/TeacherTimetable';
import DailyClassTimetable from '../screens/Academics/DailyClassTimetable';
import Income from '../screens/IncomeExpense/Income';
import Expense from '../screens/IncomeExpense/Expense';
import AdmissionEnquiry from '../screens/FrontOffice/AdmissionEnquiry';
import VisitorBook from '../screens/FrontOffice/VisitorBook';
import Complain from '../screens/FrontOffice/complain';
import GatePass from '../screens/FrontOffice/GatePass';
import SubDashBoardScreen from '../screens/SubDashBoardScreen';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const DrawerNavigator = () => {
  const { themeColor } = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: '#fff',
          width: width * 0.75,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: themeColor, // 🟢 use dynamic color
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 5, padding: 4 }}
            onPress={() => navigation.openDrawer()}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                ☰
              </Text>
            </View>
          </TouchableOpacity>
        ),

        headerRight: () => (
          <View style={styles.headerRight}>
            <View style={[styles.searchContainer, { width: showSearch ? 150 : 40 }  ]}>
              <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                <Icon
                  name="search"
                  size={18}
                  color="#9CA3AF"
                  style={styles.searchIcon}
                />
              </TouchableOpacity>

              {showSearch && (
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <Icon name="notifications" size={20} color="#6B7280" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AD</Text>
              </View>
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Test" component={Test} />
      <Drawer.Screen name="StudentAttendence" component={StudentAttendence} />
      <Drawer.Screen name="StudentView" component={StudentView} />
      <Drawer.Screen name="UserView" component={UserView} />
      <Drawer.Screen name="ExamSchedule" component={ExamSchedule} />
      <Drawer.Screen name="NoticeBoard" component={NoticeBoard} />
      <Drawer.Screen name="ProfileView" component={ProfileView} />
      <Drawer.Screen name="Homework" component={Homework} />
      <Drawer.Screen name="Classwork" component={ClassWork} />
      <Drawer.Screen name="FeeStatement" component={FeeStatement} />
      <Drawer.Screen name="CurrentBalance" component={CurrentBalance} />
      <Drawer.Screen name="BalanceFeeReport" component={BalanceFeeReport} />
      <Drawer.Screen name="TransactionReport" component={TransactionReport} />
      <Drawer.Screen
        name="DailyCollectionReport"
        component={DailyCollectionReport}
      />
      <Drawer.Screen name="FeeFollowUp" component={FeeFollowUp} />
      <Drawer.Screen
        name="MarkStudentAttendence"
        component={MarkStudentAttendence}
      />
      <Drawer.Screen
        name="StudentLeaveManagement"
        component={StudentLeaveManagement}
      />
      <Drawer.Screen name="StudentPTM" component={StudentPTM} />
      <Drawer.Screen name="ExamMarks" component={ExamMarks} />
      <Drawer.Screen name="TeacherComment" component={TeacherComment} />
      <Drawer.Screen name="CoCurricularGrade" component={CoCurricularGrade} />
      <Drawer.Screen name="PrimaryEvaluation" component={PrimaryEvaluation} />
      <Drawer.Screen name="DisciplinaryReport" component={DisciplinaryReport} />
      <Drawer.Screen name="StaffDirectory" component={StaffDirectory} />
      <Drawer.Screen
        name="StaffAttendanceReport"
        component={StaffAttendanceReport}
      />
      <Drawer.Screen name="ApplyLeave" component={ApplyLeave} />
      <Drawer.Screen
        name="ApproveLeaveRequest"
        component={ApproveLeaveRequest}
      />
      <Drawer.Screen name="Payroll" component={Payroll} />
      <Drawer.Screen name="Task" component={Task} />
      <Drawer.Screen name="TeacherTimetable" component={TeacherTimetable} />
      <Drawer.Screen
        name="DailyClassTimetable"
        component={DailyClassTimetable}
      />
      <Drawer.Screen name="Income" component={Income} />
      <Drawer.Screen name="Expense" component={Expense} />
      <Drawer.Screen name="AdmissionEnquiry" component={AdmissionEnquiry} />
      <Drawer.Screen name="VisitorBook" component={VisitorBook} />
      <Drawer.Screen name="Complain" component={Complain} />
      <Drawer.Screen name="GatePass" component={GatePass} />
      <Drawer.Screen name="SubDashBoard" component={SubDashBoardScreen} />

      <Drawer.Screen name="Setting" component={Setting} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 10,
   
  },
  // searchIcon: {
  //   marginRight: 8,
  // },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    padding: 0,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;
