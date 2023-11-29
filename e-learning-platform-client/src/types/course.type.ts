interface CategoryRef {
  _id: string;
  title: string;
  __v: number;
}

interface UserDetails {
  _id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  firstName: string;
  lastName: string;
  phone: string;
  teacherRef: string;
  notificationRef: string;
  image: string;
}

export type CourseDetails = {
  _id: string;
  categoryRef: CategoryRef;
  rating: number | null;
  userDetails: UserDetails;
  title: string;
  createdAt: string;
  description: string;
  price: number | null;
  modulesRef: string[];
  studentsCount: number;
  reviewsCount: number;
  thumbnail: string;
  learningScope: string;
  learningOutcome: string;
  language?: string;
  courseStatus: string;
};
