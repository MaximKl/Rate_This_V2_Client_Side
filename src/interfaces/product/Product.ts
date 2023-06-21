import { Developer } from './Developer';
import { IdAndName } from './addProduct/IdAndName';

interface Product {
  id: number;
  name: string;
  ageRestriction: string;
  estimatesQuantity: number;
  reviewQuantity: number;
  picture: string;
  type: string;
  rating: number;
  releaseDate: Date;
  description?: string;
  countries?: IdAndName[];
  genres?: IdAndName[];
  addDate?: Date;
  developers?: Map<string, Developer[]>;
  time?: number;
  visualMark?: number;
  storyMark?: number;
  soundMark?: number;
  actMark?: number;
  gameplayMark?: number;
  spentTime?: number;
  artMark?: number;
  infoMark?: number;
  size?: number;
  gameTypes?: IdAndName[];
}

export type { Product };
