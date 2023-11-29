export interface teacherCreate {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  facebookUrl?: string;
  twitterUrl?: string;
  education: string;
  resume: File;
}

interface TeacherRequestUserDetails {
  _id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  teacherRef?: string;
  image?: string;
}

interface TeacherRequestTeacherDetails {
  _id: string;
  userRef: string;
  coursesRef: string[];
  resume: string;
  education: string;
  experience: any[]; // You may need to define a more specific type for experience
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TeacherRequest {
  _id: string;
  email: string;
  role: string;
  isDisabled: boolean;
  createdAt: string;
  userDetails: TeacherRequestUserDetails;
  teacherDetails: TeacherRequestTeacherDetails;
}

export interface TeacherRequestsInfo {
  total: number;
  count: number;
  page: number;
  limit: number;
  requests: TeacherRequest[];
}
