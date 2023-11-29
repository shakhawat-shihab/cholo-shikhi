export type moduleCreate = {
  title?: string;
  description?: string;
  isPremium: string;
  teacherRef: string;
  courseRef: string;
};

export interface Module {
  _id?: string;
  title?: string;
  createdAt?: string;
  modulePos?: number;
  description?: string;
  // isRunning: true;
  // isCompleted: true;
  // isLocked: string;
}

interface TextContentDetails {
  _id: string;
  text: string;
  isPremium: boolean;
  courseRef: string;
  moduleRef: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DocumentContentDetails {
  _id: string;
  fileUrl: string;
  isPremium: boolean;
  courseRef: string;
  moduleRef: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VideoContentDetails {
  _id: string;
  videoUrl: string;
  isPremium: boolean;
  courseRef: string;
  moduleRef: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ModuleContent {
  _id: string;
  title: string;
  description: string;
  type: "document" | "text" | "video";
  isPremium: boolean;
  contentPos: number;
  documentContentDetails?: DocumentContentDetails;
  textContentDetails?: TextContentDetails;
  videoContentDetails?: VideoContentDetails;
  isRunning?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
}

interface ModuleQuiz {
  _id: string;
  title: string;
  durationInMinute: number;
  isPublishByTeacher: boolean;
  courseRef: string;
  teacherRef: string;
  questionsRef: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  passMarkPercentage: number;
  moduleRef: string;
  quizPos: number;
}

interface ModuleAssignment {
  _id: string;
  title: string;
  description: string;
  courseRef: string;
  teacherRef: string;
  isPublishByTeacher: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  moduleRef: string;
  documentUrl: string;
  durationInDay: number;
  passMarkPercentage: number;
  total: number;
  assignmentPos: number;
}

export interface ModuleDetails {
  _id: string;
  contents: ModuleContent[];
  title: string;
  createdAt: string;
  modulePos: number;
  description: string;
  quizzes: ModuleQuiz[];
  assignments: ModuleAssignment[];
  isRunning?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
}
