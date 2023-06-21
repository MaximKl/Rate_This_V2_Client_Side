import { createContext, useState, useEffect } from 'react';
import { ContextValue } from '../interfaces/ContextValue';
import { UserProfile } from '../interfaces/user/UserProfile';
import {
  useAuthorizationMutation,
  useLazyExitQuery,
  useLazyValidateQuery,
  useValidateQuery,
} from '../store/apis/authorizationApis';
import { UserAuthorizationProfile } from '../interfaces/user/UserAuthorizationProfile';

interface Props {
  children?: React.ReactNode;
}

const NavigationContext = createContext<ContextValue | null>(null);

const NavigationProvider: React.FC<Props> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    `${window.location.pathname}${window.location.search}`
  );
  const [filter, setFilter] = useState('');
  let service = '';
  const basePath = 'RateThis';
  const [headerValue, setHeaderValue] = useState('');
  const [user, setUser] = useState<UserProfile>();
  const [authorizeError, setAuthorizeError] = useState<string | number>(0);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorize, authResponse] = useAuthorizationMutation();
  const [exitTrigger] = useLazyExitQuery();
  const { data } = useValidateQuery();
  const [validateUser, validationResponse] = useLazyValidateQuery();
  const [chatValidation, setChatValidation] = useState(-1);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    if (data) {
      setUser(data);
      setIsAuthorized(true);
    }
  }, [data]);

  useEffect(() => {
    if (
      !validationResponse.isError &&
      !validationResponse.isFetching &&
      !validationResponse.isLoading &&
      !validationResponse.isUninitialized &&
      validationResponse.isSuccess
    ) {
      setUser(validationResponse.data);
      setIsAuthorized(true);
      setChatValidation(1);
    }
    if (
      validationResponse.isError &&
      !validationResponse.isFetching &&
      !validationResponse.isLoading &&
      !validationResponse.isUninitialized &&
      !validationResponse.isSuccess
    ) {
      user && setUser(undefined);
      isAuthorized && setIsAuthorized(false);
      authorizeError !== 0 && setAuthorizeError(0);
      chatValidation && setChatValidation(0);
    }
  }, [validationResponse]);

  useEffect(() => {
    if (!currentPath.startsWith(`/${basePath}/chat`) && socket) socket.close();
  }, [currentPath]);

  const unauthorizeUser = () => {
    exitTrigger(user!);
    setUser(undefined);
    setIsAuthorized(false);
    setAuthorizeError(0);
  };

  useEffect(() => {
    if (authResponse.isSuccess) {
      setAuthorizeError(200);
      setIsAuthorized(true);
      authResponse.data && setUser({ ...authResponse.data! });
    } else {
      if (authResponse.error) {
        if ('status' in authResponse.error!) {
          const errorCode: string | number = authResponse.error.status;
          setAuthorizeError(errorCode);
        }
      }
    }
  }, [authResponse.data, authResponse]);

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const navigate = (to: string): void => {
    // window.history.pushState({}, "", to);
    setCurrentPath(to);
  };

  const authorization = (user: UserAuthorizationProfile) => {
    authorize(user);
  };

  const refetchUser = () => {
    validateUser();
  };

  if (currentPath === `/${basePath}` || `/${basePath}/` === currentPath) {
    service = 'main';
  }
  if (currentPath.startsWith(`/${basePath}/profile/`)) {
    service = 'profile';
  }
  if (currentPath.startsWith(`/${basePath}/games`)) {
    service = 'game';
  }
  if (currentPath.startsWith(`/${basePath}/books`)) {
    service = 'book';
  }
  if (currentPath.startsWith(`/${basePath}/films`)) {
    service = 'film';
  }
  if (currentPath.startsWith(`/${basePath}/chat`)) {
    service = 'chat';
  }
  if (currentPath.startsWith(`/${basePath}/add-product`)) {
    service = 'add';
  }
  if (currentPath.startsWith(`/${basePath}/developer`)) {
    service = 'developer';
  }
  if (service.length === 0) {
    service = 'error';
  }

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        navigate,
        basePath,
        service,
        filter,
        setFilter,
        headerValue,
        setHeaderValue,
        user,
        setUser,
        isAuthorized,
        setIsAuthorized,
        authorization,
        response: authorizeError,
        setResponse: setAuthorizeError,
        unauthorizeUser,
        refetchUser,
        chatValidation,
        setSocket,
        socket,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export { NavigationProvider, NavigationContext };
