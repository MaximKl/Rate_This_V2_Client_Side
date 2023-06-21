import { BsSpeedometer2 } from 'react-icons/bs';
import { ImFileText } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { useNavigation } from '../hooks/use-navigation';
import { Button } from './ui/Button';
import { Product } from '../interfaces/product/Product';
import { useEstimateColor } from '../hooks/use-estimate-color';
import { AiFillEdit } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { useDeleteProductMutation } from '../store/apis/productApis';
import { useEffect, useState } from 'react';
import { SureMessage } from './SureMessage';
import { IdAndName } from '../interfaces/product/addProduct/IdAndName';

interface ProductsListProps {
  products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  const { navigate, currentPath, user, unauthorizeUser } = useNavigation();
  const { chooseBackground } = useEstimateColor();
  const [deleteProduct, deleteProductResponse] = useDeleteProductMutation();
  const [productForDelete, setProductForDelete] = useState<Product>();
  const [deleteAssurance, setDeleteAssurance] = useState(false);

  const handleClick = (id: number) => {
    navigate(`${currentPath}/${id}`);
  };

  useEffect(() => {
    deleteProductResponse.isError && unauthorizeUser();
  }, [deleteProductResponse]);

  const actionBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        if (productForDelete) {
          deleteProduct({
            productId: productForDelete.id,
            token: user!?.token,
          });
          setDeleteAssurance(false);
        }
      }}
    >
      Так, я впевнений
    </Button>
  );
  const itemStyle =
    'mr-2 mb-1 w-fit rounded-xl bg-slate-800/80 px-1 py-[2px] shadow shadow-black/40 ';

  let multipleItems = (items: IdAndName[]) => {
    return items.map((c) => {
      return (
        <span className={itemStyle} key={c.id}>
          {c.name}
        </span>
      );
    });
  };

  const list = products.map((p) => {
    return (
      <div
        className="relative mb-7 mr-4 flex h-[8rem] w-[29rem] justify-center rounded-md bg-slate-600 shadow-md shadow-slate-800/50 duration-100 hover:bg-slate-700"
        key={p.id}
      >
        <Link
          to={`${currentPath}/${p.id}`}
          onClick={() => handleClick(p.id)}
          className="relative flex h-full w-full justify-center"
          key={p.id}
        >
          <div className="flex w-[20%]">
            <div
              className="background relative mr-2 w-full rounded-l-md bg-cover bg-center duration-150 hover:bg-top"
              style={{
                backgroundImage: `url(${
                  p.picture.startsWith('link:')
                    ? p.picture.substring(5)
                    : `data:image/jpeg;base64,${p.picture}`
                })`,
              }}
            >
              <div className={chooseBackground(p.rating)}>{p.rating}</div>
            </div>
          </div>
          <div className="flex w-[78%] flex-col text-zinc-200">
            <h1 className=" pt-1 text-base font-bold">
              <span className=" w-fit  break-words  border-b-2 border-b-slate-500 line-clamp-1">
                {p.name}
              </span>
            </h1>
            <div className="pt-1 text-[11px] text-xs">
              Реліз: {new Date(p.releaseDate).getFullYear()} рік
            </div>
            <div className="flex max-h-[26px] w-full flex-wrap justify-start overflow-hidden pt-1 text-xs">
              <span className="py-[2px] pr-[2px]">Країни:</span>
              {multipleItems(p.countries!)}
            </div>
            <div className="flex max-h-[25px] w-full flex-wrap justify-start overflow-hidden pt-[2px] text-xs">
              <span className="py-[2px] pr-[2px]">Жанри:</span>
              {multipleItems(p.genres!)}
            </div>
            <div className="pt-[2px] text-xs">Рейтинг: {p.ageRestriction}</div>
            <div className="absolute right-1 bottom-[2px] hidden text-[10px] text-slate-400/80 sm:block">
              Додано {new Date(p.addDate!).toLocaleDateString()}
            </div>
            <div className="absolute bottom-[10px] right-1 hidden max-w-[290px] overflow-hidden p-0.5 text-xs font-bold text-slate-400/80 sm:flex">
              <BsSpeedometer2 title={p.estimatesQuantity.toLocaleString()} />
              <h1
                title={`Кількість оцінок: ${p.estimatesQuantity.toLocaleString()}`}
                className="pl-1 pr-2"
              >
                {p.estimatesQuantity.toLocaleString()}
              </h1>
              <ImFileText
                title={`Кількість відгуків: ${p.reviewQuantity.toLocaleString()}`}
              />
              <h1
                title={p.reviewQuantity.toLocaleString()}
                className="truncate pl-1"
              >
                {p.reviewQuantity.toLocaleString()}
              </h1>
            </div>
          </div>
          <div className="w-[2%]"></div>
        </Link>
        {user && user?.role === 'ADMIN' && (
          <>
            <div className="absolute top-2 right-2 text-2xl">
              <Link to={`/RateThis/add-product?id=${p.type}_${p.id}`}>
                <span
                  title="Редагувати"
                  className="cursor-pointer text-blue-600 brightness-125  hover:brightness-150"
                  onClick={() => {
                    navigate(`/RateThis/add-product?id=${p.type}_${p.id}`);
                  }}
                >
                  <AiFillEdit />
                </span>
              </Link>
            </div>
            <div className="absolute top-14 right-2 text-xl">
              <span
                title="Видалити"
                className="cursor-pointer text-red-600 hover:brightness-125"
                onClick={() => {
                  setProductForDelete(p);
                  setDeleteAssurance(true);
                }}
              >
                <FaTrashAlt />
              </span>
            </div>
          </>
        )}
      </div>
    );
  });

  return (
    <div className="flex w-full flex-wrap justify-evenly">
      {list}
      {deleteAssurance && (
        <SureMessage
          onClose={setDeleteAssurance}
          actionBar={actionBar}
          elementName={`видалити продукт ${
            productForDelete!?.name
          }, відновити його буде вже неможливо. Будуть втрачені усі рецензії та коментарі до нього.`}
        />
      )}
    </div>
  );
};

export { ProductsList };
