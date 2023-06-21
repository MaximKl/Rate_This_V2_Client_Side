import { Link } from 'react-router-dom';
import { MainPageProduct } from '../components/MainPageProduct';
import { useNavigation } from '../hooks/use-navigation';
import { useGetMainPageProductsQuery } from '../store/apis/productApis';
import { useEffect } from 'react';
import { Loading } from '../assets/Loading';

const MainPage: React.FC = () => {
  const { navigate, basePath } = useNavigation();

  const handleClick = (to: string) => {
    navigate(`/${basePath}/${to}`);
  };

  const { data, isSuccess } = useGetMainPageProductsQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-300 min-h-screen">
      <div className="flex pt-[80px] pb-[80px] md:pt-[150px] md:pb-[180px] text-center md:text-4xl lg:text-5xl text-lg font-bold ">
        <div className="w-1/3 relative flex-initial min-w-[100px] lg:min-w-[250px]">
          <Link to="games" onClick={() => handleClick('games')}>
            <div className="p-2  md:p-5 absolute hover:text-slate-300 duration-300 text-slate-800 shadow-2xl shadow-black/50 rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-300 cursor-pointer">
              ВІДЕОІГРИ
            </div>
          </Link>
        </div>
        <div className="w-1/3 flex-initial min-w-[100px] md:min-w-[340px] relative duration-300">
          <Link to="films" onClick={() => handleClick('films')}>
            <div className="p-2  md:p-5 absolute hover:text-slate-300 duration-300 text-slate-800 shadow-2xl shadow-black/50 rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300 cursor-pointer">
              ФІЛЬМИ
            </div>
          </Link>
        </div>
        <div className=" w-1/3 flex-initial min-w-[40px] relative hover:text-slate-600 duration-300">
          <Link to="books" onClick={() => handleClick('books')}>
            <div className="p-2  md:p-5  absolute hover:text-slate-300 duration-300 text-slate-800 shadow-2xl shadow-black/50 rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300 cursor-pointer">
              КНИГИ
            </div>
          </Link>
        </div>
      </div>

      <div className="flex w-full pb-[30px] sm:pb-[60px]">
        <div className="w-1/6 min-w-0"></div>
        <h1
          className="lg:p-3 pt-1 min-w-fit text-zinc-700 rounded bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 w-full text-center brightness-110 contrast-125
         justify-center uppercase italic sm:text-xl md:text-2xl lg:text-4xl font-black text-[11px] 2xl:text-5xl shadow shadow-slate-900/50"
        >
          найпопулярніші продукти для оцінки
        </h1>
        <div className="w-1/6 min-w-0"></div>
      </div>
      <div className="flex w-full">
        <div className="w-1/3 border-r-4 border-slate-700">
          {isSuccess ? (
            <MainPageProduct
              game
              products={data!?.filter((p) => p.type === 'GAME')}
            />
          ) : (
            <div className="w-full flex justify-center">
              <svg>
                <Loading hexColor="#f7637c" />
              </svg>
            </div>
          )}
        </div>
        <div className="w-1/3 border-r-4 border-slate-700">
          {isSuccess ? (
            <MainPageProduct
              film
              products={data!?.filter((p) => p.type === 'FILM')}
            />
          ) : (
            <div className="w-full flex justify-center">
              <svg>
                <Loading hexColor="#4f8ff7" />
              </svg>
            </div>
          )}
        </div>
        <div className=" w-1/3">
          {isSuccess ? (
            <MainPageProduct
              book
              products={data!?.filter((p) => p.type === 'BOOK')}
            />
          ) : (
            <div className="w-full flex justify-center">
              <svg>
                <Loading hexColor="#3bbf94" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { MainPage };
