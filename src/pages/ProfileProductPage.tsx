import { useEffect } from 'react';
import { useNavigation } from '../hooks/use-navigation';
import { useGetFullUserProductQuery } from '../store/apis/userApis';
import { Loading } from '../assets/Loading';
import { ProfileProductInfo } from '../components/profileProduct/ProfileProductInfo';
import { ProfileProductUserInfo } from '../components/profileProduct/ProfileProductUserInfo';
import { Pathes } from '../store/Pathes';

const ProfileProductPage: React.FC = () => {
  const { currentPath } = useNavigation();
  const { data, error } = useGetFullUserProductQuery({
    nick: currentPath.split('/')[3],
    productType: `${currentPath.split('/')[4]}s`,
    productId: currentPath.split('/')[5],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (error) {
      Pathes.getErrorCode(error) === 404 &&
        window.location.replace(
          `/RateThis/profile/${currentPath.split('/')[3]}`
        );
    }
  }, [error]);

  return (
    <div className="h-fit pt-[64px] xl:h-[100%]">
      <div className="flex h-[100%] flex-col items-center xl:flex-row xl:items-start">
        <div className="profileProductScrollbar relative h-full w-full bg-slate-300 py-6 xl:w-[60%] xl:overflow-y-auto">
          {data ? (
            <ProfileProductInfo product={data} />
          ) : (
            <svg>
              <Loading hexColor="#475569" />
            </svg>
          )}
        </div>
        <div className="profileReviewScrollbar relative h-full w-full bg-slate-700 py-6 xl:w-[40%] xl:overflow-y-auto">
          {data ? (
            <ProfileProductUserInfo product={data} />
          ) : (
            <svg>
              <Loading hexColor="#475569" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProfileProductPage };
