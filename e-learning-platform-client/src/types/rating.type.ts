export interface ratingCreate{
    rating:number;
    studentRef:string,
    courseRef:string
}

interface Rating {
  _id: string;
  rating: number;
  __v: number;
}

export interface ReviewDetails {
  _id: string;
  courseRef: string;
  studentRef: string;
  ratingRef: Rating;
  createdAt: string;
  updatedAt: string;
  __v: number;
  review: string;
}

