import { useEffect, useState, useRef } from 'react';
import { GoChevronDown } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { Panel } from './ui/Panel';

interface MenuDropdownProps {
  basePath: string;
  navigate(to: string): void;
  service: string;
  classNames: string;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  basePath,
  navigate,
  service,
  classNames,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef<HTMLInputElement | null>(null);
  let value: string | null = null;

  const options = [
    { label: 'Книги', value: 'books' },
    { label: 'Відеоігри', value: 'games' },
    { label: 'Фільми', value: 'films' },
  ];

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

  const handleClick = () => {
    setIsOpen((currentIsOpen) => !currentIsOpen);
  };

  const handleOptionClick = (option: { label: string; value: string }) => {
    value = option.label;
    setIsOpen(false);
    navigate(`/${basePath}/${option.value}`);
  };

  const renderedOptions = options.map((option) => {
    return (
      <Link to={`/${basePath}/${option.value}`} key={option.value}>
        <div
          className="shadow  shadow-gray-700/50 hover:bg-sky-100 dark:hover:bg-slate-800 rounded cursor-pointer p-1"
          onClick={() => handleOptionClick(option)}
        >
          {option.label}
        </div>
      </Link>
    );
  });

  if (service === 'game') {
    value = 'Відеоігри';
  }
  if (service === 'book') {
    value = 'Книги';
  }
  if (service === 'film') {
    value = 'Фільми';
  }

  return (
    <div ref={divEl} className={classNames}>
      <Panel
        className="text-black dark:bg-slate-600 bg-slate-300 dark:text-slate-300 flex justify-between items-center cursor-pointer w-44 select-none"
        onClick={handleClick}
      >
        {value || 'Обрати категорію'}
        <GoChevronDown className="text-lg" />
      </Panel>
      {isOpen && (
        <Panel className="text-black dark:bg-slate-600 bg-slate-300 dark:text-slate-300 top-full absolute w-44">
          {' '}
          {renderedOptions}
        </Panel>
      )}
    </div>
  );
};
export { MenuDropdown };
