import { ShortProduct } from '../ShortProduct';

interface Film extends ShortProduct {
  visualMark: number;
  storyMark: number;
  soundMark: number;
  actMark: number;
}
export type { Film };
