import { useEffect, useState, useRef } from 'react';
import { GoChevronDown } from 'react-icons/go';
import { useNavigation } from '../hooks/use-navigation';
import { Panel } from './ui/Panel';

interface FilterDropdownProps {
  classNames: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ classNames }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setFilter } = useNavigation();
  const divEl = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('За популярністтю');

  const options = [
    { label: 'За популярністтю', value: 'popular' },
    { label: 'За датою додання', value: 'add' },
    { label: 'За датою виходу', value: 'release' },
    { label: 'За оцінкою', value: 'mark' },
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
    setValue(option.label);
    setIsOpen(false);
    setFilter(option.value);
  };

  const renderedOptions = options.map((option) => {
    return (
      <div
        key={option.value}
        className="shadow shadow-gray-700/50 hover:bg-sky-100 dark:hover:bg-slate-800 rounded cursor-pointer p-1"
        onClick={(e) => handleOptionClick(option)}
      >
        {option.label}
      </div>
    );
  });

  return (
    <div ref={divEl} className={classNames}>
      <Panel
        className="text-black dark:bg-slate-600 bg-slate-300 dark:text-slate-300 flex justify-between items-center cursor-pointer w-44 select-none"
        onClick={handleClick}
      >
        {value}
        <GoChevronDown className="text-lg" />
      </Panel>
      {isOpen && (
        <Panel className="text-black dark:bg-slate-600 bg-slate-300 dark:text-slate-300 top-full absolute w-44">
          {renderedOptions}
        </Panel>
      )}
    </div>
  );
};
export { FilterDropdown };
