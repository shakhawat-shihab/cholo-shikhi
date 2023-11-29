export type quizCreate = {
  title?: string;
  teacherRef: string;
  courseRef: string;
  moduleRef: string;
  passMarkPercentage: number;
  durationInMinute: number;
};

export interface Quiz {
  _id: string;
  title: string;
  isPublishByTeacher: boolean;
  courseRef: string;
  teacherRef: string;
  questionsRef: string[]; // You may need to replace this with the actual type of questionsRef
  passMarkPercentage: number;
  durationInMinute: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Question {
  _id: string;
  quizRef: string;
  question: string;
  options: string[];
  correctAns: number[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizQuestion {
  _id: string;
  questions: Question[];
  title: string;
}
