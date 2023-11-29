export type iconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & React.RefAttributes<SVGSVGElement>
>;

export type Course = {
  courseStatus?: string;
  _id: string;
  title?: string;
  description?: string;
  language?: string;
  difficulty?: string;
  teacherRef?: string;
  modulesRef?: string[];
  quizzesRef?: string[];
  assignmentsRef?: string[];
  studentsRef?: string[];
  isPendingCourse?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  ratingsRef?: string[];
  reviewsRef?: string[];
  thumbnail?: string;
};

export type courseCreate = {
  title?: string;
  description?: string;
  language?: string;
  difficulty?: string;
  learningScope?: string;
  learningOutcome?: string;
  teacherRef: string;
  thumbnail?: File | undefined;
  category: string;
};

export type category = {
  _id: string;
  title: string;
};

export type teacherCourses = {
  courseStatus: string;
  _id: string;
  title: string;
  description: string;
  teacherRef: string;
  modulesRef: string[];
  quizzesRef: string[];
  assignmentsRef: string[];
  studentsRef: string[];
  isPendingCourse: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ratingsRef: string[];
  reviewsRef: string[];
}[];

export type studentCourses = {
  courseStatus: string;
  _id: string;
  title: string;
  description: string;
  teacherRef: string;
  modulesRef: string[];
  quizzesRef: string[];
  assignmentsRef: string[];
  studentsRef: string[];
  isPendingCourse: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  ratingsRef: string[];
  reviewsRef: string[];
  courseId: string;
  completedModulesRef: string[];
  // completedModulesRef:string[],
}[];
