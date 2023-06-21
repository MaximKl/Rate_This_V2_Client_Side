import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
  QueryDefinition,
} from '@reduxjs/toolkit/dist/query';
import { useNavigation } from '../../hooks/use-navigation';
import { IdAndName } from '../../interfaces/product/addProduct/IdAndName';
import {
  MutationTrigger,
  UseQuery,
} from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useState, useEffect } from 'react';
import { MdAddBox } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import { AddProductEntities } from './AddProductEntities';
import { Button } from '../ui/Button';

interface ListContainerProps {
  getObjects: UseQuery<
    QueryDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      IdAndName[],
      'addProduct'
    >
  >;
  containerName: string;
  setReadiness: React.Dispatch<React.SetStateAction<boolean>>;
  readiness: boolean;
  setData: React.Dispatch<React.SetStateAction<IdAndName[]>>;
  isSingleObjectNeed?: boolean;
  existingData?: IdAndName[];
  saver?: MutationTrigger<
    MutationDefinition<
      {
        object: IdAndName;
        token: string;
      },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      void,
      'addProduct'
    >
  >;
}
const ListContainer: React.FC<ListContainerProps> = ({
  getObjects,
  containerName,
  setReadiness,
  readiness,
  setData,
  saver,
  isSingleObjectNeed,
  existingData,
}) => {
  const { user } = useNavigation();
  const { data, isError } = getObjects(user!.token);
  const [objects, setObjects] = useState<IdAndName[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<IdAndName[]>([]);
  const [search, setSearch] = useState('');

  const [openSaver, setOpenSaver] = useState(false);
  const [pickForUpdate, setPickForUpdate] = useState(false);
  const [name, setName] = useState('');
  const [objectForUpdate, setObjectForUpdate] = useState<IdAndName>();

  useEffect(() => {
    existingData && setSelectedObjects(existingData);
  }, []);

  useEffect(() => {
    isError && window.location.replace('/RateThis');
  }, [isError]);

  useEffect(() => {
    data && setObjects(data);
  }, [data]);

  useEffect(() => {
    search.length > 0
      ? setObjects(
          data!.filter((d) => {
            return d.name.toUpperCase().includes(search.toUpperCase());
          })
        )
      : setObjects(data!);
  }, [search]);

  useEffect(() => {
    selectedObjects.length > 0 && setData(selectedObjects);
    setReadiness(selectedObjects.length > 0);
  }, [selectedObjects]);

  useEffect(() => {
    objectForUpdate && setName(objectForUpdate.name);
    objectForUpdate && setOpenSaver(true);
  }, [objectForUpdate]);

  useEffect(() => {
    if (objectForUpdate && !openSaver) {
      setPickForUpdate(false);
      setObjectForUpdate(undefined);
    }
    !openSaver && setName('');
  }, [openSaver]);

  var nameError = name.length > 700 || name.length < 2;

  const renderObjects = objects?.map((d) => {
    var isAdded: boolean =
      selectedObjects.filter((ob) => ob.id === d.id).length > 0;
    return (
      <div
        className="mb-2 cursor-pointer select-none  rounded bg-slate-500/60 py-1 pl-1 pr-2 duration-150 hover:bg-slate-600/70"
        onClick={() => {
          if (pickForUpdate) {
            setObjectForUpdate(d);
            return;
          }
          if (isSingleObjectNeed) {
            if (selectedObjects.length > 0) {
              selectedObjects[0].id === d.id
                ? setSelectedObjects([])
                : setSelectedObjects([d]);
            } else {
              setSelectedObjects([d]);
            }
            return;
          }
          if (isAdded) {
            setSelectedObjects([
              ...selectedObjects.filter((ob) => {
                return ob.id !== d.id;
              }),
            ]);
            return;
          }
          setSelectedObjects([...selectedObjects, d]);
        }}
        key={d.id}
      >
        <div className="flex items-center justify-between">
          <span className=" break-words text-left font-semibold line-clamp-2">
            {d.name}
          </span>
          <div
            className={`ml-2 max-h-[15px] min-h-[15px] min-w-[15px] max-w-[15px]
           border-2 border-slate-900 ${
             isAdded ? 'bg-slate-900' : 'bg-slate-300'
           }`}
          ></div>
        </div>
      </div>
    );
  });

  const renderSelectedObjects = selectedObjects.map((so) => {
    return (
      <div
        onClick={() => {
          setSelectedObjects([
            ...selectedObjects.filter((ob) => {
              return ob.id !== so.id;
            }),
          ]);
        }}
        key={so.id}
        className="m-1 h-fit w-fit cursor-pointer select-none rounded-lg bg-slate-700 p-1 duration-150 hover:bg-slate-700/60"
      >
        <span className=" text-sm text-slate-200">{so.name}</span>
      </div>
    );
  });

  const saverButton = (
    <Button
      success={!nameError}
      secondary={nameError}
      disabled={nameError}
      className={`${
        nameError ? ' cursor-not-allowed' : ' cursor-pointer'
      } duration-150 hover:brightness-105`}
      onClick={() => {
        if (objectForUpdate) {
          saver &&
            saver({
              object: { id: objectForUpdate.id, name },
              token: user!?.token,
            });
        } else {
          saver &&
            saver({
              object: { id: 0, name },
              token: user!?.token,
            });
        }
        setOpenSaver(false);
      }}
    >
      ЗБЕРЕГТИ
    </Button>
  );

  return (
    <div
      className={`relative h-[700px] max-h-[700px] w-[20rem] max-w-[20rem] rounded-lg border-4 ${
        readiness
          ? 'border-green-800 shadow-green-800/90'
          : 'border-red-800 shadow-red-800/60'
      } ${pickForUpdate ? 'bg-blue-400/50' : 'bg-slate-400'}  pl-2 shadow-2xl`}
    >
      <div className=" h-[1%] max-h-[1%]"></div>
      <div className=" flex h-[4%] max-h-[4%] select-none items-center justify-center text-xl font-bold uppercase">
        <span className="text-slate-800">{containerName}</span>
      </div>
      <div className=" h-[1%] max-h-[1%]"></div>
      <div className="flex h-[5%] max-h-[5%] items-center justify-center">
        <input
          type="text"
          className=" w-[80%] max-w-[80%] rounded-md bg-slate-200 pl-1 font-medium text-slate-800 outline-none"
          placeholder="назва"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </div>
      <div className=" h-[1%] max-h-[1%]"></div>
      <div className="addProductScrollbar h-[67%] max-h-[67%] overflow-y-auto pr-2">
        {data && renderObjects}
      </div>
      <div className=" h-[2%] max-h-[2%]"></div>

      <div className=" h-[18%] max-h-[18%]">
        <div className=" addProductScrollbar mr-2 flex h-full flex-wrap justify-start overflow-y-auto rounded-lg bg-slate-600/90">
          {!pickForUpdate && renderSelectedObjects}
          {pickForUpdate && (
            <h1 className="text-center text-3xl font-semibold text-slate-200">
              Оберіть об'єкт для редагування
            </h1>
          )}
        </div>
      </div>

      <div className=" h-[1%] max-h-[1%]"></div>

      {saver && (
        <>
          <div className="absolute top-1 right-2 text-3xl">
            <span
              title="Додати"
              className="cursor-pointer text-blue-600 hover:brightness-110"
              onClick={() => setOpenSaver(true)}
            >
              <MdAddBox />
            </span>
          </div>
          <div className="absolute top-1 left-2 text-3xl">
            <span
              title="Редагувати"
              className="cursor-pointer text-blue-600  hover:brightness-110"
              onClick={() => setPickForUpdate((pu) => (pu ? false : true))}
            >
              <AiFillEdit />
            </span>
          </div>
        </>
      )}
      {openSaver && (
        <AddProductEntities
          actionBar={saverButton}
          elementName={containerName}
          setIsOpen={setOpenSaver}
          setName={setName}
          name={name}
        />
      )}
    </div>
  );
};

export { ListContainer };
