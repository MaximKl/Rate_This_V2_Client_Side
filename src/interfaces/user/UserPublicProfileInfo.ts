interface UserPublicProfileInfo {
  id: number;
  nick: string;
  description: string;
  regDate: Date;
  birthday: Date;
  report: number;
  image: string;
  role: string;
  color: string;
  friendQuantity: number;
}

export type { UserPublicProfileInfo };
