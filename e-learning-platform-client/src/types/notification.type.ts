interface TeacherInfo {
  image?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}

interface CourseInfo {
  title?: string;
  teacherImage?: string;
  teacherUserName?: string;
  teacherFirstName?: string;
  teacherLastName?: string;
}

interface StudentInfo {
  userName?: string;
  firstName?: string;
  lastName?: string;
}

interface SubscriptionInfo {
  courses: string[];
}

export interface AdminNotification {
  _id: string;
  createdAt: string;
  isSeen: string;
  teacherInfo?: TeacherInfo;
  studentInfo?: StudentInfo;
  type: "teacherRequest" | "courseRequest" | "enrollmentRequest";
  courseInfo?: CourseInfo;
  subscriptionInfo?: SubscriptionInfo;
}

interface singleNotification {
  content: string;
  isSeen: boolean;
  time: string;
}

export interface GeneralNotification {
  _id: string;
  userRef: string;
  notifications: singleNotification[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
