import { ShortProduct } from '../ShortProduct';

interface Book extends ShortProduct {
  storyMark: number;
  artMark: number;
  infoMark: number;
}

export type { Book };
