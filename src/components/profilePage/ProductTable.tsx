import { CategoriesHeaders } from '../../interfaces/product/CategoriesHeaders';
import { Book } from '../../interfaces/product/profileProduct/estimatesCategories/Book';
import { Film } from '../../interfaces/product/profileProduct/estimatesCategories/Film';
import { Game } from '../../interfaces/product/profileProduct/estimatesCategories/Game';
import moment from 'moment';
import { useEstimateColor } from '../../hooks/use-estimate-color';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from 'react-icons/ti';
import { useNavigation } from '../../hooks/use-navigation';

interface ProductTableProps {
  productType: 'game' | 'film' | 'book';
  products: Game[] | Film[] | Book[];
}

const ProductTable: React.FC<ProductTableProps> = ({
  productType,
  products,
}) => {
  const { chooseBackground, chooseColor } = useEstimateColor();
  const { navigate, currentPath } = useNavigation();
  const [productId, setProductId] = useState(0);
  const [sortColumn, setSortColumn] = useState({ id: 4, position: 1 });
  const [renderProducts, setRenderProducts] = useState<
    Game[] | Film[] | Book[]
  >([]);

  const sortLogic = () => {
    if (sortColumn.position === 0) {
      setSortColumn({ id: 4, position: 1 });
      return;
    }
    sortColumn.id === 1 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          return (o2.commonRating - o1.commonRating) * sortColumn.position;
        })
      );
    sortColumn.id === 2 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          return o1.name.localeCompare(o2.name) * sortColumn.position;
        })
      );
    sortColumn.id === 3 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          return (
            (new Date(o2.releaseDate).getTime() -
              new Date(o1.releaseDate).getTime()) *
            sortColumn.position
          );
        })
      );
    sortColumn.id === 4 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          return (
            (new Date(o2.rateDate).getTime() -
              new Date(o1.rateDate).getTime()) *
            sortColumn.position
          );
        })
      );
    sortColumn.id === 7 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          return (o2.rating - o1.rating) * sortColumn.position;
        })
      );

    sortColumn.id === 8 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          if (isBook(o1) && isBook(o2)) {
            return (o2.storyMark - o1.storyMark) * sortColumn.position;
          }
          if (isGame(o1) && isGame(o2)) {
            return (o2.visualMark - o1.visualMark) * sortColumn.position;
          }
          if (isFilm(o1) && isFilm(o2)) {
            return (o2.visualMark - o1.visualMark) * sortColumn.position;
          }
          return 0;
        })
      );
    sortColumn.id === 9 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          if (isBook(o1) && isBook(o2)) {
            return (o2.artMark - o1.artMark) * sortColumn.position;
          }
          if (isGame(o1) && isGame(o2)) {
            return (o2.storyMark - o1.storyMark) * sortColumn.position;
          }
          if (isFilm(o1) && isFilm(o2)) {
            return (o2.storyMark - o1.storyMark) * sortColumn.position;
          }
          return 0;
        })
      );
    sortColumn.id === 10 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          if (isBook(o1) && isBook(o2)) {
            return (o2.infoMark - o1.infoMark) * sortColumn.position;
          }
          if (isGame(o1) && isGame(o2)) {
            return (o2.gameplayMark - o1.gameplayMark) * sortColumn.position;
          }
          if (isFilm(o1) && isFilm(o2)) {
            return (o2.soundMark - o1.soundMark) * sortColumn.position;
          }
          return 0;
        })
      );
    sortColumn.id === 11 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          if (isGame(o1) && isGame(o2)) {
            return (o2.soundMark - o1.soundMark) * sortColumn.position;
          }
          if (isFilm(o1) && isFilm(o2)) {
            return (o2.actMark - o1.actMark) * sortColumn.position;
          }
          return 0;
        })
      );
    sortColumn.id === 12 &&
      setRenderProducts(
        products.slice().sort((o1, o2) => {
          if (isGame(o1) && isGame(o2)) {
            return (o2.spentTime - o1.spentTime) * sortColumn.position;
          }
          return 0;
        })
      );
  };

  useEffect(() => {
    sortLogic();
  }, [sortColumn, products]);

  const positionHandler = (currentPosition: number, id: number): number => {
    if (id === sortColumn.id) {
      if (currentPosition === 0) return 1;
      if (currentPosition === 1) return -1;
      return 0;
    }
    return 1;
  };

  const handleArrows = (id: number) => {
    if (sortColumn.id === id) {
      if (sortColumn.position === 1) return <TiArrowSortedUp />;
      if (sortColumn.position === -1) return <TiArrowSortedDown />;
    }
    return <TiArrowUnsorted />;
  };

  const sort = (id: number) => {
    setSortColumn((s) => ({
      id: id,
      position: positionHandler(s.position, id),
    }));
  };

  const renderCategoriesHeader = (
    <>
      {productType === 'book' &&
        CategoriesHeaders.BOOK.map((b, i) => (
          <th
            className="w-[5%] border-l-2 border-slate-800/80 p-2 text-xs"
            key={i}
          >
            <span
              onClick={() => sort(i + 8)}
              className="relative cursor-pointer select-none"
            >
              {b}
              <span className="absolute bottom-0 text-xs">
                {handleArrows(i + 8)}
              </span>
            </span>
          </th>
        ))}
      {productType === 'film' &&
        CategoriesHeaders.FILM.map((b, i) => (
          <th
            className="w-[5%] cursor-pointer border-l-2 border-slate-800/80 p-2 text-xs"
            key={i}
          >
            <span
              onClick={() => sort(i + 8)}
              className="relative cursor-pointer select-none"
            >
              {b}
              <span className="absolute bottom-0 text-xs">
                {handleArrows(i + 8)}
              </span>
            </span>
          </th>
        ))}
      {productType === 'game' &&
        CategoriesHeaders.GAME.map((b, i) => (
          <th
            className="w-[5%] border-l-2 border-slate-800/80 p-2 text-xs"
            key={i}
          >
            <span
              onClick={() => sort(i + 8)}
              className="relative cursor-pointer select-none"
            >
              {b}
              <span className="absolute bottom-0 text-xs">
                {handleArrows(i + 8)}
              </span>
            </span>
          </th>
        ))}
    </>
  );

  const isBook = (product: Game | Film | Book): product is Book => {
    return (product as Book).infoMark !== undefined;
  };
  const isFilm = (product: Game | Film | Book): product is Film => {
    return (product as Film).actMark !== undefined;
  };
  const isGame = (product: Game | Film | Book): product is Game => {
    return (product as Game).spentTime !== undefined;
  };

  let row: HTMLAnchorElement | null = null;

  useEffect(() => {
    productId > 0 && row?.click();
  }, [productId]);

  const renderBasicFields = renderProducts.map((p) => (
    <tr
      className={`${productType === 'book' && 'border-emerald-100'} ${
        productType === 'film' && 'border-blue-200'
      } ${
        productType === 'game' && 'border-rose-100'
      } cursor-pointer border-b-8 bg-slate-600 text-center text-slate-100 duration-100  hover:bg-slate-600/90`}
      key={p.id}
      onClick={() => {
        setProductId(p.id);
      }}
    >
      <td className=" p-1 text-slate-900">
        <div className="relative my-auto w-1/5 min-w-[4rem] max-w-[6rem]">
          <div className={chooseBackground(p.commonRating)}>
            {p.commonRating}
          </div>
          <img
            className="my-auto"
            alt="game_picture"
            src={
              p.picture.startsWith('link:')
                ? p.picture.substring(5)
                : `data:image/jpeg;base64,${p.picture}`
            }
          />
        </div>
      </td>
      <td className="  py-1 pr-1 italic">
        <span className="break-all">{p.name} </span>
        <span className="text-slate-400/70">
          ({new Date(p.releaseDate).getFullYear()})
        </span>
      </td>
      <td className="border-l-2 border-slate-900/30 p-1 text-sm font-bold">
        {new Date(p.releaseDate).getDate() === 1 &&
        new Date(p.releaseDate).getMonth() === 0
          ? new Date(p.releaseDate).getFullYear()
          : moment(p.releaseDate).format('LL')}
      </td>
      <td className="border-x-2 border-slate-900/30 p-1 text-sm font-bold">
        {moment(p.rateDate).format('LL')}
      </td>
      <td>
        <div className="flex w-full justify-center">
          <div className="w-[190px]">
            {p.genres.map((g, i) => (
              <h1
                className=" m-1 truncate rounded-md bg-slate-500/90 px-1 py-[2px] text-xs"
                key={i}
              >
                {g}
              </h1>
            ))}
          </div>
        </div>
      </td>
      <td>
        <div className="flex w-full justify-center">
          <div className="w-[180px]">
            {p.countries.map((c, i) => (
              <h1
                className=" m-1 rounded-md bg-slate-500/90 px-1 py-[2px] text-xs"
                key={i}
              >
                {c}
              </h1>
            ))}
          </div>
        </div>
      </td>
      <td
        className={`${chooseColor(
          p.rating
        )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
      >
        {p.rating}
      </td>
      {isBook(p) && (
        <>
          <td
            className={`${chooseColor(
              p.storyMark
            )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.storyMark}
          </td>
          <td
            className={`${chooseColor(
              p.artMark
            )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.artMark}
          </td>
          <td
            className={`${chooseColor(
              p.infoMark
            )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.infoMark}
          </td>
        </>
      )}
      {isFilm(p) && (
        <>
          <td
            className={`${chooseColor(
              p.visualMark
            )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.visualMark}
          </td>
          <td
            className={`${chooseColor(
              p.storyMark
            )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.storyMark}
          </td>
          <td
            className={`${chooseColor(
              p.soundMark
            )} border-l-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.soundMark}
          </td>
          <td
            className={`${chooseColor(
              p.actMark
            )} border-l-2  border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.actMark}
          </td>
        </>
      )}
      {isGame(p) && (
        <>
          <td
            className={`${chooseColor(
              p.visualMark
            )} border-l-2  border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.visualMark}
          </td>
          <td
            className={`${chooseColor(
              p.storyMark
            )} border-l-2  border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.storyMark}
          </td>
          <td
            className={`${chooseColor(
              p.gameplayMark
            )} border-l-2  border-r-2 border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.gameplayMark}
          </td>
          <td
            className={`${chooseColor(
              p.soundMark
            )} border-l-2  border-slate-900/80 text-2xl font-bold brightness-150`}
          >
            {p.soundMark}
          </td>
          <td className={` border-l-2 border-slate-900/80  text-2xl font-bold`}>
            {p.spentTime}
          </td>
        </>
      )}
    </tr>
  ));

  return (
    <>
      <table className="h-fit w-full border-collapse">
        <thead className="sticky top-0 z-10 w-full">
          <tr
            className={`w-full bg-slate-500/[0.96] text-slate-800 shadow-md shadow-black/40`}
          >
            <th className="w-[5%]">
              <div className=" flex h-full w-full items-center justify-center">
                <span
                  onClick={() => sort(1)}
                  className="cursor-pointer select-none text-3xl"
                >
                  {handleArrows(1)}
                </span>
              </div>
            </th>
            <th className="w-[18%] py-1 pr-1">
              <span
                onClick={() => sort(2)}
                className="relative cursor-pointer select-none"
              >
                Назва
                <span className="absolute bottom-[2px] text-sm">
                  {handleArrows(2)}
                </span>
              </span>
            </th>
            <th className="w-[6%] border-l-2 border-slate-800/80 p-1 text-sm">
              <span
                onClick={() => sort(3)}
                className="relative cursor-pointer select-none"
              >
                Дата виходу
                <span className="absolute bottom-3 text-xs">
                  {handleArrows(3)}
                </span>
              </span>
            </th>
            <th className="w-[6%] border-x-2 border-slate-800/80 p-1 text-sm">
              <span
                onClick={() => sort(4)}
                className=" relative cursor-pointer select-none"
              >
                Дата оцінення
                <span className="absolute bottom-3 text-xs">
                  {handleArrows(4)}
                </span>
              </span>
            </th>
            <th className="w-[15%] p-1">Жанри</th>
            <th className="w-[15%] p-1">Країни</th>
            <th className="w-[5%] border-l-2 border-slate-800/80 p-1 text-xs">
              <span
                onClick={() => sort(7)}
                className="relative flex cursor-pointer select-none"
              >
                Загальна оцінка
                <span className="absolute bottom-0 right-0 text-xs">
                  {handleArrows(7)}
                </span>
              </span>
            </th>
            {renderCategoriesHeader}
          </tr>
        </thead>
        <tbody>{renderBasicFields}</tbody>
      </table>
      <Link
        ref={(el) => (row = el)}
        to={`${productType}/${productId}`}
        onClick={() => navigate(`${currentPath}/${productType}/${productId}`)}
      ></Link>
    </>
  );
};

export { ProductTable };
