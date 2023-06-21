import { Developer } from '../Developer';

interface FullProduct {
  id: number;
  name: string;
  description: string;
  releaseDate: Date;
  picture: string;
  countries: string[];
  genres: string[];
  addDate: Date;
  type: string;
  ageRestriction: string;
  rating: number;
  commonRating: number;

  commonArtMark?: number;
  commonInfoMark?: number;
  size?: number;
  artMark?: number;
  infoMark?: number;

  commonActMark?: number;
  actMark?: number;
  time?: number;

  gameTypes?: string[];
  commonVisualMark?: number;
  commonStoryMark?: number;
  commonGameplayMark?: number;
  commonSoundMark?: number;
  commonSpentTime?: number;
  visualMark?: number;
  storyMark?: number;
  gameplayMark?: number;
  soundMark?: number;
  spentTime?: number;

  estimatesQuantity: number;
  reviewQuantity: number;

  reviewId: number;
  reviewBody: string;
  reviewLikes: number;
  reviewDislikes: number;
  reviewTime: Date;
  reviewEditTime: Date;
  reviewIsEdit: boolean;
  rateDate: Date;
  developers: Map<string, Developer>;
}
export type { FullProduct };
