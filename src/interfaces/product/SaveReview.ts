interface SaveReview {
  id: number;

  body: string;

  like: number;

  dislike: number;

  time: Date;

  userId: number;

  productId: number;
}
export type { SaveReview };
