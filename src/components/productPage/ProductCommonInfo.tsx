import moment from 'moment';
import { Product } from '../../interfaces/product/Product';
import { Developer } from '../../interfaces/product/Developer';
import { useEstimateColor } from '../../hooks/use-estimate-color';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../hooks/use-navigation';
import { useState, useEffect } from 'react';
import { useDeleteProductMutation } from '../../store/apis/productApis';
import { Button } from '../ui/Button';
import { AiFillEdit } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { SureMessage } from '../SureMessage';

interface ProductsCommonInfoProps {
  product: Product;
}

const ProductsCommonInfo: React.FC<ProductsCommonInfoProps> = ({ product }) => {
  const { user, navigate, unauthorizeUser, basePath } = useNavigation();
  const [deleteProduct, deleteProductResponse] = useDeleteProductMutation();
  const [deleteAssurance, setDeleteAssurance] = useState(false);
  const { chooseBackground } = useEstimateColor();
  const itemStyle =
    'mr-3 mb-1 w-fit rounded-xl bg-slate-400/80 px-1 py-[1px] shadow shadow-black/40';

  const countries = product.countries!.map((c) => {
    return (
      <span className={itemStyle} key={c.id}>
        {c.name}
      </span>
    );
  });
  const genres = product.genres!.map((g) => {
    return (
      <span className={itemStyle} key={g.id}>
        {g.name}
      </span>
    );
  });

  useEffect(() => {
    deleteProductResponse.isError && unauthorizeUser();
    deleteProductResponse.isSuccess &&
      window.location.replace(`/RateThis/${product.type.toLowerCase()}s`);
  }, [deleteProductResponse]);

  let gameTypes: JSX.Element[] | null = null;
  if (product.gameTypes) {
    gameTypes = product.gameTypes!.map((t) => {
      return (
        <span className={itemStyle} key={t.id}>
          {t.name}
        </span>
      );
    });
  }
  var serviceColors = '';
  if (product.type === 'FILM') {
    serviceColors = 'bg-gradient-to-r from-sky-300 to-blue-400 rounded';
  }
  if (product.type === 'BOOK') {
    serviceColors = 'bg-gradient-to-r from-emerald-300 to-green-400 rounded';
  }
  if (product.type === 'GAME') {
    serviceColors = 'bg-gradient-to-r from-rose-300 to-red-400 rounded';
  }

  const developerInfo = (devs: Developer[]) => {
    return devs.map((d) => {
      return (
        <div className="mb-3 mr-6 " key={d.id}>
          <Link
            title={d.name}
            to={`/${basePath}/developer/${d.id}`}
            onClick={() => navigate(`/${basePath}/developer/${d.id}`)}
          >
            <div
              className={`${serviceColors} h-fit max-w-[6rem] cursor-pointer overflow-hidden break-words pt-2 pb-1 text-center shadow shadow-black/40 duration-150 hover:brightness-110`}
            >
              <div className="mx-auto max-h-[4rem] min-w-[3rem] max-w-[3rem] overflow-hidden rounded">
                <img
                  alt="developer_photo"
                  src={
                    d.photo.startsWith('link:')
                      ? d.photo.substring(5)
                      : `data:image/jpeg;base64,${d.photo}`
                  }
                  className="min-w-[3rem] max-w-[3rem]"
                ></img>
              </div>
              <h1 className="px-2 pt-1 text-base font-bold text-slate-700 line-clamp-2">
                {d.name}
              </h1>
            </div>
          </Link>
        </div>
      );
    });
  };

  const developers = Object.entries(product.developers!).map(
    ([devRole, [...devs]]: [devRole: string, devs: Developer[]]) => {
      return (
        <div
          className={`mt-6 w-fit rounded border-b-4 border-zinc-600 text-lg`}
          key={devRole}
        >
          <h1 className=" mb-2 font-black uppercase text-slate-700">
            {devRole}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start">
            {developerInfo(devs)}
          </div>
        </div>
      );
    }
  );

  const uniqueProductInfo = () => {
    if (product?.type === 'FILM') {
      return (
        <h1 className="pt-1">
          <span className="font-bold">Тривалість: </span> {product.time} хвилин
        </h1>
      );
    }
    if (product?.type === 'BOOK') {
      return (
        <h1 className="pt-1">
          <span className="font-bold">Кількість сторінок: </span> {product.size}
        </h1>
      );
    }
    if (product?.type === 'GAME') {
      return (
        <>
          <h1 className="pt-1">
            <span className="font-bold">
              Середня кількість часу проведеного гравцями:{' '}
            </span>
            {product.spentTime} години
          </h1>
          <div className="flex w-full flex-wrap justify-start pt-1 text-lg">
            <span className="pt-[1px] pr-1 font-bold">Тип гри: </span>
            {gameTypes && gameTypes}
          </div>
        </>
      );
    }
  };

  const actionBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        deleteProduct({
          productId: product.id,
          token: user!?.token,
        });
        setDeleteAssurance(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center justify-center md:flex-row md:items-start">
        <div className="w-[2%]"></div>

        <div className="min-w-[16rem] max-w-[16rem] px-2 pt-2 sm:px-0 2xl:min-w-[24rem] 2xl:max-w-[24rem]">
          <div className="relative rounded-lg shadow shadow-zinc-900">
            <img
              alt="product_picture"
              className="min-w-[16rem] max-w-[16rem] rounded-lg 2xl:min-w-[24rem] 2xl:max-w-[24rem]"
              src={
                product?.picture.startsWith('link:')
                  ? product?.picture.substring(5)
                  : `data:image/jpeg;base64,${product?.picture}`
              }
            />
            <h1 className={chooseBackground(product?.rating)}>
              {product?.rating}
            </h1>
          </div>
          <div className="flex w-full pt-4 pb-8">
            <div className="w-[70%]">
              <h1 className="text-lg text-slate-600">
                Дата додання: {new Date(product?.addDate!).toLocaleDateString()}
              </h1>
              <h1 className="pt-4 text-lg text-slate-600">
                Кількість оцінок: {product?.estimatesQuantity}
              </h1>
              <h1 className="text-lg text-slate-600">
                Кількість рецензій: {product?.reviewQuantity}
              </h1>
            </div>
            <div className="flex w-[30%] justify-center">
              {user && user?.role === 'ADMIN' && (
                <>
                  <div className=" text-4xl">
                    <Link
                      to={`/RateThis/add-product?id=${product.type}_${product.id}`}
                    >
                      <span
                        title="Редагувати"
                        className="cursor-pointer text-blue-600 brightness-125  hover:brightness-150"
                        onClick={() => {
                          navigate(
                            `/RateThis/add-product?id=${product.type}_${product.id}`
                          );
                        }}
                      >
                        <AiFillEdit />
                      </span>
                    </Link>
                  </div>
                  <div className="pl-5 text-4xl">
                    <span
                      title="Видалити"
                      className="cursor-pointer text-red-600 hover:brightness-125"
                      onClick={() => {
                        setDeleteAssurance(true);
                      }}
                    >
                      <FaTrashAlt />
                    </span>
                  </div>
                </>
              )}
              {deleteAssurance && (
                <SureMessage
                  onClose={setDeleteAssurance}
                  actionBar={actionBar}
                  elementName={`видалити продукт ${product.name}, відновити його буде вже неможливо. Будуть втрачені усі рецензії та коментарі до нього.`}
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-[4%]"></div>

        <div className="w-[90%] text-lg text-zinc-700 md:w-[62%]">
          <h1 className="break-words text-4xl font-bold ">
            {product.name} ({new Date(product?.releaseDate).getFullYear()})
          </h1>
          <div className="flex w-full flex-wrap justify-start pt-5 text-lg">
            <span className="pt-[1px] pr-1 font-bold">Країни: </span>
            {countries}
          </div>
          <h1 className="">
            <span className="font-bold">Дата виходу: </span>
            {new Date(product?.releaseDate).getDate() === 1 &&
            new Date(product?.releaseDate).getMonth() === 0
              ? new Date(product?.releaseDate).getFullYear()
              : moment(product?.releaseDate).format('LL')}
          </h1>
          {uniqueProductInfo()}
          <h1 className="pt-1">
            <span className="font-bold">Обмеження за віком: </span>
            {product.ageRestriction}
          </h1>
          <div className="flex w-full flex-wrap justify-start pt-1 text-lg">
            <span className="pr-1 pt-[1px] font-bold">Жанри: </span>
            {genres}
          </div>
          <h1 className="whitespace-pre-line pt-6 text-justify">
            <span className="font-bold">Опис:</span> {product.description}
          </h1>
          <div className="">{developers}</div>
        </div>

        <div className="w-[2%]"></div>
      </div>
    </div>
  );
};

export { ProductsCommonInfo };
