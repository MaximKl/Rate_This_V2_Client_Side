import { ProductInfo } from '../components/profilePage/ProductInfo';
import { UserInfo } from '../components/profilePage/UserInfo';
import { useEffect } from 'react';

const ProfilePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex h-[100%]  w-full  pb-[48px] pt-[64px]">
      <div className="max-h-[100%] w-[25%] bg-slate-500 px-1">
        <div className="scrollbar2 h-full w-full overflow-y-auto">
          <UserInfo />
        </div>
      </div>
      <div className="h-[100%] w-[75%] ">
        <ProductInfo />
      </div>
    </div>
  );
};

export { ProfilePage };
