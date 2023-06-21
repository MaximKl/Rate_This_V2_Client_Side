import { UserAuthorizationProfile } from './user/UserAuthorizationProfile';
import { UserProfile } from './user/UserProfile';

interface ContextValue {
  currentPath: string;
  navigate(to: string): void;
  basePath: string;
  service: string;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  headerValue: string;
  setHeaderValue: React.Dispatch<React.SetStateAction<string>>;
  user?: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
  isAuthorized: boolean;
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  authorization(user: UserAuthorizationProfile): void;
  response?: string | number;
  setResponse: React.Dispatch<React.SetStateAction<number | string>>;
  unauthorizeUser(): void;
  refetchUser(): void;
  chatValidation: number;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | undefined>>;
  socket: WebSocket | undefined;
}

export type { ContextValue };
