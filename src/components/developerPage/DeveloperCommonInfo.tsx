import moment from 'moment';
import { UniqueDeveloper } from '../../interfaces/product/UniqueDeveloper';
import { Product } from '../../interfaces/product/Product';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../hooks/use-navigation';
import { useEstimateColor } from '../../hooks/use-estimate-color';
import { BsSpeedometer2 } from 'react-icons/bs';
import { ImFileText } from 'react-icons/im';
import { useState, useEffect } from 'react';
import { useDeleteDeveloperMutation } from '../../store/apis/productApis';
import { Button } from '../ui/Button';
import { FaTrashAlt } from 'react-icons/fa';
import { SureMessage } from '../SureMessage';

interface DeveloperCommonInfoProps {
  developer: UniqueDeveloper;
}

const DeveloperCommonInfo: React.FC<DeveloperCommonInfoProps> = ({
  developer,
}) => {
  const { basePath, navigate, user, unauthorizeUser } = useNavigation();
  const { chooseBackground } = useEstimateColor();
  const [deleteDeveloper, deleteDeveloperResponse] =
    useDeleteDeveloperMutation();
  const [deleteAssurance, setDeleteAssurance] = useState(false);

  useEffect(() => {
    deleteDeveloperResponse.isError && unauthorizeUser();
    deleteDeveloperResponse.isSuccess && window.location.replace(`/RateThis`);
  }, [deleteDeveloperResponse]);

  const actionBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        deleteDeveloper({
          developerId: developer.id,
          token: user!?.token,
        });
        setDeleteAssurance(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  const productInfo = (projects: Product[]) =>
    projects.map((p) => {
      return (
        <div key={p.id} className="mb-3 mr-6 ">
          <Link
            title={`${p.name} (${new Date(p.releaseDate).getFullYear()})`}
            to={`/${basePath}/${p.type.toLocaleLowerCase()}s/${p.id}`}
            onClick={() =>
              navigate(`/${basePath}/${p.type.toLocaleLowerCase()}s/${p.id}`)
            }
          >
            <div
              className={`h-fit max-w-[8rem] cursor-pointer overflow-hidden break-words rounded bg-slate-800/90 pt-2 pb-1 text-center shadow shadow-black/40 duration-150 hover:brightness-110`}
            >
              <div className="relative mx-auto min-w-[5rem] max-w-[5rem] overflow-hidden rounded shadow-lg shadow-zinc-900/60">
                <div className={chooseBackground(p.rating)}>{p.rating}</div>
                <img
                  alt="product_photo"
                  src={
                    p.picture.startsWith('link:')
                      ? p.picture.substring(5)
                      : `data:image/jpeg;base64,${p.picture}`
                  }
                  className="min-w-[5rem] max-w-[5rem]"
                ></img>
                <div className="absolute -bottom-1 right-0 hidden max-w-[4rem] overflow-hidden p-0.5 text-[12px] font-bold text-white sm:flex lg:text-[13px]">
                  <BsSpeedometer2
                    title={`Оцінки: ${p.estimatesQuantity.toLocaleString()}`}
                  />
                  <h1
                    title={`Оцінки: ${p.estimatesQuantity.toLocaleString()}`}
                    className="truncate pl-1 pr-2 shadow-black text-shadow"
                  >
                    {p.estimatesQuantity.toLocaleString()}
                  </h1>
                  <ImFileText
                    title={`Рецензії: ${p.reviewQuantity.toLocaleString()}`}
                  />
                  <h1
                    title={`Рецензії: ${p.reviewQuantity.toLocaleString()}`}
                    className="truncate pl-1 shadow-black text-shadow"
                  >
                    {p.reviewQuantity.toLocaleString()}
                  </h1>
                </div>
              </div>

              <h1 className="px-2 pt-2 text-base font-bold text-slate-200/90 line-clamp-3">
                {p.name}{' '}
                <span className="">
                  ({moment(p.releaseDate).format('YYYY')})
                </span>
              </h1>
            </div>
          </Link>
        </div>
      );
    });

  const productsHeader = Object.entries(developer.projects).map(
    ([role, [...projects]]: [role: string, projects: Product[]]) => {
      return (
        <div
          className={`w-fit rounded border-b-4 border-zinc-600 pt-5 text-lg`}
          key={role}
        >
          <h1 className=" mb-2 font-bold uppercase text-slate-800">{role}</h1>
          <div className="flex flex-wrap justify-center sm:justify-start">
            {productInfo(projects)}
          </div>
        </div>
      );
    }
  );

  return (
    <div className="flex w-full flex-col sm:flex-row">
      <div className="flex flex-col">
        <div className=" ml-8 w-full max-w-[20rem]">
          <img
            alt="developer_photo"
            src={
              developer.photo.startsWith('link:')
                ? developer.photo.substring(5)
                : `data:image/jpeg;base64,${developer.photo}`
            }
            className="w-full max-w-[20rem]"
          />
        </div>
        <div className="flex justify-end pt-8 pb-8">
          {user && user?.role === 'ADMIN' && (
            <>
              <div className="text-4xl">
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
              elementName={`видалити творця ${developer.name}, відновити його буде вже неможливо.`}
            />
          )}
        </div>
      </div>
      <div className="w-[75%]">
        <div className="pl-10">
          <h1 className=" text-4xl font-medium text-slate-700">
            {developer.name}
          </h1>
          <div className="pt-5">
            <h1 className=" text-2xl text-slate-800">
              <span className=" text-xl font-bold text-slate-800">
                Дата народження або створення:{' '}
              </span>
              {new Date(developer.birthday).getDate() === 1 &&
              new Date(developer.birthday).getMonth() === 0
                ? new Date(developer.birthday).getFullYear()
                : moment(developer.birthday).format('LL')}
            </h1>
          </div>
          <div className="pt-5">
            <h1 className=" text-2xl text-slate-800">
              <span className=" text-xl font-bold">Країна: </span>
              {developer.country}
            </h1>
          </div>
          <div className="pt-5">
            <h1 className=" whitespace-pre-wrap break-words text-xl text-slate-800">
              <span className=" text-xl font-bold">Опис: </span>
              {developer.description}
            </h1>
          </div>
          <div className="">{productsHeader}</div>
        </div>
      </div>
    </div>
  );
};

export { DeveloperCommonInfo };
