import { useEffect } from 'react';
import { Loading } from '../assets/Loading';
import { DeveloperCommonInfo } from '../components/developerPage/DeveloperCommonInfo';
import { useNavigation } from '../hooks/use-navigation';
import { useGetDeveloperQuery } from '../store/apis/productApis';

const DeveloperPage: React.FC = () => {
  const { currentPath } = useNavigation();
  const { data } = useGetDeveloperQuery(currentPath.split('/')[3]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-slate-300 pt-[64px]">
      <div className="min-w-[5%]"></div>
      {data ? (
        <div className="min-w-[90%] p-2 pt-5">
          <DeveloperCommonInfo developer={data} />
        </div>
      ) : (
        <svg>
          <Loading hexColor="#475569" />
        </svg>
      )}
      <div className="relative min-w-[5%]"></div>
    </div>
  );
};
export { DeveloperPage };
