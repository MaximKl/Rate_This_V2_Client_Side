import { Product } from './Product';

interface UniqueDeveloper {
  id: number;
  name: string;
  photo: string;
  description: string;
  birthday: Date;
  country: string;
  projects: Map<string, Product[]>;
}

export type { UniqueDeveloper };
