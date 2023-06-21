interface ProductForSave {
  id: number;
  name: string;
  description: string;
  releaseDate: Date;
  picture: string;
  ageRestriction: string;
  type: string;
  size: string;
  genres: number[];
  countries: number[];
  gameTypes: number[];
  developers: [string, number[]][];
}

export type { ProductForSave };
