export type reviewCreate = {
  review: string;
  studentRef: string;
  courseRef: string;
};

export interface ReviewRating {
  _id: string;
  courseRef?: string;
  userName: string;
  userImage?: string;
  createdAt?: string;
  review?: string;
  rating?: number;
  ratingId?: string;
  studentRef?: string;
}
