import { useEffect, useState } from 'react';
import { Loading } from '../../assets/Loading';
import { useNavigation } from '../../hooks/use-navigation';
import { useLazyGetUserProductsQuery } from '../../store/apis/userApis';
import { ProductTable } from './ProductTable';

const Games: React.FC = () => {
  const { currentPath } = useNavigation();
  const [getData, response] = useLazyGetUserProductsQuery();

  useEffect(() => {
    getData({
      nick: currentPath.split('/')[3],
      productType: 'games',
    });
  }, []);

  useEffect(() => {
    getData({
      nick: currentPath.split('/')[3],
      productType: 'games',
    });
  }, [currentPath]);

  return (
    <>
      {response.data && response.isSuccess ? (
        <div className="profileGamesScrollbar flex h-[97%] overflow-x-auto pr-2">
          {response.data.length > 0 ? (
            <ProductTable productType="game" products={response.data} />
          ) : (
            <h1 className="mt-40 text-6xl font-bold text-slate-500/50">
              НЕ МАЄ ОЦІНЕНИХ ІГОР
            </h1>
          )}
        </div>
      ) : (
        <svg>
          <Loading hexColor="#e2e8f0" />
        </svg>
      )}
    </>
  );
};

export { Games };
