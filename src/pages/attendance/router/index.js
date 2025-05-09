import Attendance from "src/pages/attendance/pages/Attendance.vue";
import ClassAttendance from "src/pages/attendance/pages/ClassAttendance.vue";
import Student from "src/pages/attendance/pages/Student.vue";
import Justification from "../pages/Justification.vue";

const attendanceRoutes = [
  {
    path: "/class/:classe/discipline/:discipline/attendances",
    name: "class-attendances",
    component: ClassAttendance,
    meta: {title: 'Class attendances'}
  },
  {
    path: "/class/:classe/discipline/:discipline/attendance/:attendance",
    name: "create-attendance",
    component: Attendance,
    meta: {title: 'Attendances'}
  },
  {
    path: "/student/:id/attendances",
    name:  "student-attendances",
    component: Student,
    meta: {title: 'Student attendances'}
  },
  {
    path: "/student/:id/attendance/:attendanceId/justification",
    name:  "justication-attendance",
    component: Justification,
    meta: {title: 'Justification attendance'}
  },
];

export default attendanceRoutes;

