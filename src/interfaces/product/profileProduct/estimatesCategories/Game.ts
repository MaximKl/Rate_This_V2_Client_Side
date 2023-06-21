import { ShortProduct } from '../ShortProduct';

interface Game extends ShortProduct {
  visualMark: number;
  storyMark: number;
  gameplayMark: number;
  soundMark: number;
  spentTime: number;
}
export type { Game };
