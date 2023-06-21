import { useNavigation } from '../hooks/use-navigation';
import { MenuDropdown } from './MenuDropdown';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Authorization } from './Authorization';
import { Link } from 'react-router-dom';
import { Settings } from './Settings';

const Header: React.FC = () => {
  const {
    service,
    navigate,
    currentPath,
    basePath,
    user,
    isAuthorized,
    unauthorizeUser,
  } = useNavigation();
  const [openAuth, setOpenAuth] = useState(false);
  const [isUserOptionsOpen, setIsUserOptionsOpen] = useState(false);
  const divEl = useRef<HTMLInputElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handler = (event: MouseEvent | null) => {
      if (!divEl.current) {
        return;
      }
      if (!divEl.current.contains(event?.target as Node)) {
        setIsUserOptionsOpen(false);
      }
    };
    document.addEventListener('click', handler, true);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  const options = [
    {
      value: 'profile',
      label: 'Профіль',
    },
    {
      value: 'chat',
      label: 'Листування',
    },
  ];

  const authWidth =
    'min-w-[70px] max-w-[70px] sm:max-w-[110px] sm:min-w-[110px] lg:min-w-[180px]  lg:max-w-[180px]';

  const handleAuth = () => {
    openAuth ? setOpenAuth(false) : setOpenAuth(true);
  };

  const handleUserOptions = () => {
    isUserOptionsOpen
      ? setIsUserOptionsOpen(false)
      : setIsUserOptionsOpen(true);
  };

  const handleOptionClick = (option: { label: string; value: string }) => {
    navigate(
      `/${basePath}/${
        option.value === 'chat' ? 'chat' : `${option.value}/${user?.username}`
      }`
    );
  };

  const renderedOptions = options.map((option) => {
    return (
      <div key={option.value} className="p-1 ">
        <Link
          to={`/${basePath}/${
            option.value === 'chat'
              ? 'chat'
              : `${option.value}/${user?.username}`
          } `}
        >
          <div
            className="cursor-pointer overflow-hidden text-ellipsis rounded-lg p-1 text-center shadow shadow-zinc-900/70 hover:bg-sky-200 dark:hover:bg-blue-900"
            onClick={() => {
              handleOptionClick(option);
            }}
          >
            {option.label}
          </div>
        </Link>
      </div>
    );
  });

  const settings = (
    <div className="p-1 pb-2">
      <div
        className="max-h-[34px] cursor-pointer truncate rounded-lg p-1 shadow shadow-zinc-900/70 hover:bg-sky-200 dark:hover:bg-blue-900"
        onClick={() => {
          setIsSettingsOpen(true);
        }}
      >
        Налаштування
      </div>
    </div>
  );

  const addProduct = (
    <div className="p-1 pb-2">
      <Link to={`/${basePath}/add-product`}>
        <div
          className="max-h-[34px] cursor-pointer truncate rounded-lg p-1 shadow shadow-zinc-900/70 hover:bg-sky-200 dark:hover:bg-blue-900"
          onClick={() => {
            navigate(`/${basePath}/add-product`);
          }}
        >
          Додати продукт
        </div>
      </Link>
    </div>
  );

  const exit = (
    <div className="p-1 pb-2">
      <div
        className="max-h-[34px] cursor-pointer rounded-lg p-1 shadow shadow-zinc-900/70 hover:bg-sky-200 dark:hover:bg-blue-900"
        onClick={() => {
          unauthorizeUser();
        }}
      >
        Вихід
      </div>
    </div>
  );

  const authWindow = <Authorization isOpen={setOpenAuth} />;
  const userAvatar = (
    <div
      className="background mr-2 hidden max-h-[32px] min-h-[32px] min-w-[32px] max-w-[32px] rounded-full bg-cover bg-center sm:block"
      style={{ backgroundImage: `url(data:image/jpeg;base64,${user?.avatar}` }}
    ></div>
  );

  var headerText = '';
  var mainHeaderClasses =
    'bg-gradient-to-r from-teal-800 via-green-800 to-slate-800';
  var logoBack =
    'animate-logo bg-gradient-to-r from-slate-800 via-black to-slate-800 hover:bg-gradient-to-r hover:from-slate-700 hover:via-black hover:to-slate-700';
  if (service === 'main') {
    headerText = 'Ласкаво просимо!';
  }
  if (service === 'profile') {
    headerText = 'Профіль ' + currentPath.split('/')[3];
    mainHeaderClasses = 'bg-gradient-to-r from-orange-600 to-slate-800';
  }
  if (service === 'game') {
    headerText = 'Ігровий сервіс';
    mainHeaderClasses = 'bg-gradient-to-r from-rose-600 to-slate-800';
  }
  if (service === 'book') {
    headerText = 'Книжковий сервіс';
    mainHeaderClasses = 'bg-gradient-to-r from-emerald-600 to-slate-800';
  }
  if (service === 'film') {
    headerText = 'Фільмовий сервіс';
    mainHeaderClasses = 'bg-gradient-to-r from-blue-700 to-slate-800';
  }
  if (service === 'chat') {
    headerText = 'Листування';
    mainHeaderClasses = 'bg-gradient-to-r from-violet-800 to-slate-800';
  }
  if (service === 'add') {
    headerText = 'Додайте продукт';
    mainHeaderClasses = 'bg-gradient-to-r from-gray-700 to-slate-800';
  }
  if (service === 'developer') {
    headerText = 'Творець';
    mainHeaderClasses =
      'bg-gradient-to-r from-blue-600 via-sky-800 to-yellow-500';
  }
  const logoClassnames = classNames(
    'text-slate-200 font-bold underline decoration-2 rounded-t-lg px-4 text-center text-xs md:text-base  cursor-pointer',
    logoBack
  );
  const headerClassNames = classNames(
    'w-full fixed z-30 top-0 flex p-[8px] h-[64px] contrast-[1.15] brightness-[1.15] border-2 border-y-slate-800 border-x-slate-700 shadow-lg shadow-slate-800/40',
    mainHeaderClasses
  );
  return (
    <>
      {openAuth && authWindow}
      {isSettingsOpen && (
        <Settings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      )}
      <div className={headerClassNames}>
        <div className=" relative w-[10%] min-w-[35px] flex-initial  md:min-w-[55px] ">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <a href={`/${basePath}`}>
              <div className={logoClassnames}>
                Rate
                <br />
                This
              </div>
            </a>
          </div>
        </div>

        <div className="relative w-[20%] min-w-[160px] flex-initial whitespace-nowrap md:min-w-[180px]">
          <div className="absolute top-1/2 left-1/2 min-w-[110px] -translate-x-1/2 -translate-y-1/2 transform">
            <MenuDropdown
              classNames={'opacity-90 text-[12px] sm:text-base'}
              service={service}
              navigate={navigate}
              basePath={basePath}
            ></MenuDropdown>
          </div>
        </div>
        <div className="relative hidden w-full min-w-[25rem] whitespace-nowrap md:block">
          <div className=" select-none overflow-hidden text-ellipsis text-center text-4xl font-bold uppercase tracking-wide text-slate-200">
            <span>{headerText}</span>
          </div>
        </div>

        <div className="flex w-[30%] justify-center md:min-w-[6.5rem]">
          <div
            ref={divEl}
            className={`relative p-0 px-[5px] ${authWidth} flex justify-center bg-gradient-to-r from-blue-500 to-blue-700 py-1.5 text-[12px] text-slate-200  ${
              isAuthorized
                ? 'lg: sm:px-3  sm:text-xl lg:pl-1 lg:pr-3 lg:text-xl'
                : 'sm:px-3 sm:text-xl lg:px-6 lg:text-2xl'
            } cursor-pointer select-none opacity-90 shadow-lg shadow-slate-800/40 duration-300 hover:opacity-100 hover:brightness-[1.05] sm:px-3 sm:text-xl lg:px-6 lg:text-2xl`}
            onClick={(e) => {
              isAuthorized ? handleUserOptions() : handleAuth();
            }}
          >
            {isAuthorized ? (
              <>
                {user?.friendsApproveCount !== 0 && (
                  <h1
                    title={`Заявок у друзі - ${user?.friendsApproveCount}`}
                    className="absolute top-0 right-0 rounded-full bg-slate-300 px-2 text-sm font-semibold text-slate-800"
                  >
                    {user?.friendsApproveCount}
                  </h1>
                )}
                {userAvatar}
                <h1
                  title={`${user?.username}`}
                  className="overflow-hidden text-ellipsis text-center"
                >
                  {user?.username!}
                </h1>
                {isUserOptionsOpen && (
                  <div
                    className={`absolute ${
                      user!.role === 'ADMIN' ? 'mt-[135px]' : 'mt-[111px]'
                    } border-none pt-[45px] text-center font-semibold sm:pt-0 sm:text-[14px] lg:text-lg ${authWidth} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg shadow-slate-800/40`}
                  >
                    {renderedOptions}
                    {user!.role === 'ADMIN' && addProduct}
                    {settings}
                    {exit}
                  </div>
                )}
              </>
            ) : (
              <h1 className="overflow-hidden text-ellipsis">Увійти</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { Header };
