import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../ui/Panel';
import { useNavigation } from '../../hooks/use-navigation';
interface ReviewDropdownProps {
  isUserReview: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  username: string;
  isUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  isDelete?: React.Dispatch<React.SetStateAction<boolean>>;
  isAdminDelete?: React.Dispatch<React.SetStateAction<boolean>>;
  isReport?: React.Dispatch<React.SetStateAction<boolean>>;
  isAlreadyReported?: boolean;
}

const ReviewDropdown: React.FC<ReviewDropdownProps> = ({
  isUserReview,
  setIsOpen,
  isOpen,
  isUpdate,
  isDelete,
  isAdminDelete,
  username,
  isAlreadyReported,
  isReport,
}) => {
  const { navigate, basePath, user, isAuthorized } = useNavigation();
  const divEl = useRef<HTMLInputElement | null>(null);

  const options = () => {
    if (isUserReview) {
      return [
        { label: 'Перейти до профілю', value: 'redirect' },
        { label: 'Редагувати', value: 'edit' },
        { label: 'Видалити', value: 'delete' },
      ];
    }

    if (user && user.role === 'ADMIN') {
      return [
        { label: 'Перейти до профілю', value: 'redirect' },
        { label: 'Поскаржитись', value: 'report' },
        { label: 'Видалити', value: 'adminDelete' },
      ];
    }

    if (isAuthorized && !isAlreadyReported) {
      return [
        { label: 'Перейти до профілю', value: 'redirect' },
        { label: 'Поскаржитись', value: 'report' },
      ];
    } else {
      return [{ label: 'Перейти до профілю', value: 'redirect' }];
    }
  };

  useEffect(() => {
    const handler = (event: MouseEvent | null) => {
      if (!divEl.current) {
        return;
      }
      if (!divEl.current.contains(event?.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handler, true);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  const handleOptionClick = (option: { label: string; value: string }) => {
    setIsOpen(false);
    option.value === 'redirect' && navigate(`/${basePath}/profile/${username}`);
    option.value === 'edit' && user && isUpdate && isUpdate(true);
    option.value === 'delete' && user && isDelete && isDelete(true);
    option.value === 'adminDelete' &&
      user &&
      isAdminDelete &&
      isAdminDelete(true);
    option.value === 'report' && user && isReport && isReport(true);
  };

  const chooseOption = (option: { label: string; value: string }) => {
    return (
      <div
        className="cursor-pointer rounded p-1 shadow shadow-gray-700/50 hover:bg-sky-100 dark:hover:bg-slate-800"
        onClick={() => handleOptionClick(option)}
      >
        {option.label}
      </div>
    );
  };

  const renderedOptions = options().map((option) => {
    return (
      <div key={option.value}>
        {option.value === 'redirect' ? (
          <Link to={`/${basePath}/profile/${username}`} key={option.value}>
            {chooseOption(option)}
          </Link>
        ) : (
          <>{chooseOption(option)}</>
        )}
      </div>
    );
  });

  return (
    <>
      {isOpen && (
        <div ref={divEl} className="absolute right-24 -top-1">
          <Panel className="absolute top-full min-w-[191px] rounded bg-slate-300 text-black dark:bg-slate-600 dark:text-slate-300">
            {renderedOptions}
          </Panel>
        </div>
      )}
    </>
  );
};

export { ReviewDropdown };
