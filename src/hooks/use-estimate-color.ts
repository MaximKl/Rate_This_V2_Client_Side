import classNames from 'classnames';

const useEstimateColor = () => {
  const chooseColor = (estimate: number): string => {
    if (estimate <= 15) return 'text-red-700';
    if (estimate <= 30 && estimate >= 16) return 'text-orange-700';
    if (estimate <= 45 && estimate >= 31) return 'text-amber-700';
    if (estimate <= 60 && estimate >= 46) return 'text-yellow-700';
    if (estimate <= 75 && estimate >= 61) return 'text-lime-700';
    if (estimate <= 90 && estimate >= 76) return 'text-emerald-700';
    if (estimate <= 100 && estimate >= 91) return 'text-green-700';
    return '';
  };
  const chooseBackground = (rating: number): string => {
    return classNames(
      'absolute text-xs sm:text-base rounded-b shadow shadow-slate-800/20 brightness-[1.2] top-0 p-0.5 left-0 font-bold',
      {
        'bg-red-600': rating <= 15,
        'bg-orange-600': rating <= 30 && rating >= 16,
        'bg-amber-600': rating <= 45 && rating >= 31,
        'bg-yellow-600': rating <= 60 && rating >= 46,
        'bg-lime-600': rating <= 75 && rating >= 61,
        'bg-emerald-600': rating <= 90 && rating >= 76,
        'bg-green-600': rating <= 100 && rating >= 91,
      }
    );
  };
  return { chooseColor, chooseBackground };
};
export { useEstimateColor };
