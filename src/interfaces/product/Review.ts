interface Review {
  id: number;
  body: string;
  like: number;
  dislike: number;
  time: Date;
  name: string;
  photo: string;
  color: string;
  role: string;
  isEdit: boolean;
  editTime: Date;
}

export type { Review };
