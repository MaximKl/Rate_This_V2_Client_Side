interface UserProfile {
  id: number;
  username: string;
  avatar: string;
  token: string;
  role: 'DEFAULT' | 'ADMIN' | 'PREMIUM';
  friendsApproveCount: number;
}

export type { UserProfile };
