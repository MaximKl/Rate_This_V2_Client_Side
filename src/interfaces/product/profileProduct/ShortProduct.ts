interface ShortProduct {
  id: number;
  name: string;
  releaseDate: Date;
  picture: string;
  countries: string[];
  genres: string[];
  type: string;
  ageRestriction: string;
  commonRating: number;
  rating: number;
  rateDate: Date;
}

export type { ShortProduct };
