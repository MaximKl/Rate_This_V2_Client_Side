import { IdAndName } from './IdAndName';

interface DeveloperForUpdate {
  id: number;
  name: string;
  photo: string;
  description: string;
  birthday: Date;
  country: IdAndName;
  roles: IdAndName[];
}

export type { DeveloperForUpdate };
