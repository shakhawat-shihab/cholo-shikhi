export type contentCreate = {
  title?: string;
  description?: string;
  isPremium: string;
  type: string;
  teacherRef: string;
  courseRef: string;
  moduleRef: string;
  content?: File | null|Blob;
  text?: string;
};

interface VideoDetails {
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

interface TextDetails {
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

interface DocumentDetails {
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

export interface ContentDetails {
  _id: string;
  title: string;
  description: string;
  type: string;
  isPremium: boolean;
  courseRef: string;
  moduleRef: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  videoContentRef: string;
  textContentRef: string;
  documentContentRef: string;
  contentPos: number;
  videoDetails?: VideoDetails;
  textDetails?: TextDetails;
  documentDetails?: DocumentDetails;
  videoContentDetails?: VideoDetails;
  textContentDetails?: TextDetails;
  documentContentDetails?: DocumentDetails;
}
