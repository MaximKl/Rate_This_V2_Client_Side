import { useState } from 'react';
import { Books } from './Books';
import { Films } from './Films';
import { Games } from './Games';
import { useEffect } from 'react';

const ProductInfo: React.FC = () => {
  const [isBooks, setIsBooks] = useState(false);
  const [isFilms, setIsFilms] = useState(false);
  const [isGames, setIsGames] = useState(false);

  useEffect(() => {
    const choice = Math.random();
    choice < 0.33 && setIsBooks(true);
    choice > 0.33 && choice < 0.66 && setIsFilms(true);
    choice > 0.66 && setIsGames(true);
  }, []);

  return (
    <>
      <div
        className={`flex h-[12%] min-h-[100px] w-full justify-center pt-10 pb-7 text-slate-700
        ${
          isBooks
            ? 'border-b-4 border-dashed border-emerald-400 bg-emerald-200/40'
            : 'bg-slate-300'
        } 
        ${
          isFilms
            ? 'border-b-4 border-dashed border-blue-400 bg-blue-200/40'
            : 'bg-slate-300'
        }
        ${
          isGames
            ? 'border-b-4 border-dashed border-rose-400 bg-rose-200/40'
            : 'bg-slate-300'
        }`}
      >
        <div
          className={`flex w-[33%] flex-col text-center ${
            isBooks
              ? ' text-3xl font-bold tracking-widest underline'
              : 'text-2xl'
          } `}
        >
          <h1>
            <span
              onClick={() => {
                setIsBooks((s) => (s ? false : true));
                isGames && setIsGames(false);
                isFilms && setIsFilms(false);
              }}
              className={`cursor-pointer select-none rounded-lg border-4 border-slate-600/30 p-1 duration-150 hover:shadow-slate-700/90 ${
                isBooks
                  ? 'shadow shadow-slate-700/60'
                  : 'shadow-inner shadow-slate-700/60'
              }`}
            >
              КНИГИ
            </span>
          </h1>
        </div>

        <div
          className={`flex w-[33%] flex-col text-center ${
            isFilms
              ? ' text-3xl font-bold tracking-widest underline'
              : 'text-2xl'
          } `}
        >
          <h1>
            <span
              onClick={() => {
                setIsFilms((s) => (s ? false : true));
                isGames && setIsGames(false);
                isBooks && setIsBooks(false);
              }}
              className={`cursor-pointer select-none rounded-lg border-4 border-slate-600/30 p-1 duration-150 hover:shadow-slate-700/90 ${
                isFilms
                  ? 'shadow shadow-slate-700/60'
                  : 'shadow-inner shadow-slate-700/60'
              }`}
            >
              ФІЛЬМИ
            </span>
          </h1>
        </div>

        <div
          className={`flex w-[33%] flex-col text-center ${
            isGames
              ? ' text-3xl font-bold tracking-widest underline'
              : 'text-2xl'
          } `}
        >
          <h1>
            <span
              onClick={() => {
                setIsGames((s) => (s ? false : true));
                isFilms && setIsFilms(false);
                isBooks && setIsBooks(false);
              }}
              className={`cursor-pointer select-none rounded-lg border-4 border-slate-600/30 p-1 duration-150 hover:shadow-slate-700/90 ${
                isGames
                  ? 'shadow shadow-slate-700/60'
                  : 'shadow-inner shadow-slate-700/60'
              }`}
            >
              ВІДЕОІГРИ
            </span>
          </h1>
        </div>
      </div>
      <div
        className={`w-fill flex h-[88%] justify-center overflow-hidden px-10 pt-10
        ${isBooks && 'bg-emerald-100'} 
        ${isFilms && 'bg-blue-200'}
        ${isGames && 'bg-rose-100'} ${
          !isBooks && !isFilms && !isGames && 'bg-slate-300'
        } `}
      >
        {isBooks && <Books />} {isFilms && <Films />}
        {isGames && <Games />}
        {!isBooks && !isFilms && !isGames && (
          <h1 className="mt-40 text-6xl font-bold text-slate-500/50">
            ОБЕРІТЬ КАТЕГОРІЮ
          </h1>
        )}
      </div>
    </>
  );
};

export { ProductInfo };
