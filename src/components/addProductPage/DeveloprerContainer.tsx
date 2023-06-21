import { useNavigation } from '../../hooks/use-navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  useGetAllDevelopersQuery,
  useLazyGetDeveloperQuery,
  useSaveDeveloperMutation,
} from '../../store/apis/addProductApis';
import { Developer } from '../../interfaces/product/addProduct/Developer';
import moment from 'moment';
import { MdAddBox } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import { AddProductEntities } from './AddProductEntities';
import { Button } from '../ui/Button';
import { DeveloperToAdd } from '../../interfaces/product/addProduct/DeveloperToAdd';
import { Pathes } from '../../store/Pathes';
import { DeveloperForUpdate } from '../../interfaces/product/addProduct/DeveloperForUpdate';

interface DeveloperContainerProps {
  setReadiness: React.Dispatch<React.SetStateAction<boolean>>;
  readiness: boolean;
  setData: React.Dispatch<React.SetStateAction<Map<string, Developer[]>>>;
  existingData?: Map<string, Developer[]>;
}

const DeveloperContainer: React.FC<DeveloperContainerProps> = ({
  setReadiness,
  readiness,
  setData,
  existingData,
}) => {
  const { user } = useNavigation();
  const { data, isError } = useGetAllDevelopersQuery(user!.token);
  const [objects, setObjects] = useState<Map<string, Developer[]>>(new Map());
  const [selectedObjects, setSelectedObjects] = useState<
    Map<string, Developer[]>
  >(new Map());
  const [search, setSearch] = useState('');
  const [searchByRole, setSearchByRole] = useState('');
  const [saveDeveloper] = useSaveDeveloperMutation();
  const [getDeveloper, getDeveloperResponse] = useLazyGetDeveloperQuery();
  const [openSaver, setOpenSaver] = useState(false);
  const [pickForUpdate, setPickForUpdate] = useState(false);
  const [updateReadiness, setUpdateReadiness] = useState(false);
  const [objectForUpdate, setObjectForUpdate] = useState<DeveloperForUpdate>();
  const [developer, setDeveloper] = useState<DeveloperToAdd>();

  useEffect(() => {
    existingData && setSelectedObjects(existingData);
  }, []);

  useEffect(() => {
    isError && window.location.replace('/RateThis');
  }, [isError]);

  useEffect(() => {
    setObjects(Pathes.mapParser(data!));
  }, [data]);

  useEffect(() => {
    selectedObjects.size > 0 && setData(selectedObjects);
    setReadiness(selectedObjects.size > 0);
  }, [selectedObjects]);

  useEffect(() => {
    objectForUpdate && setOpenSaver(true);
  }, [objectForUpdate]);

  useEffect(() => {
    !getDeveloperResponse.isFetching &&
      !getDeveloperResponse.isLoading &&
      getDeveloperResponse.isSuccess &&
      setObjectForUpdate(getDeveloperResponse.data);
    getDeveloperResponse.isError && window.location.replace('/RateThis');
  }, [getDeveloperResponse]);

  useEffect(() => {
    if (objectForUpdate && !openSaver) {
      setPickForUpdate(false);
      setObjectForUpdate(undefined);
    }
    !openSaver && setDeveloper(undefined);
  }, [openSaver]);

  const removeDeveloper = (
    role: string,
    bufferMap: Map<string, Developer[]>,
    id: number
  ) => {
    selectedObjects.get(role)!.filter((so) => so.id !== id).length > 0
      ? bufferMap.set(role, [
          ...bufferMap.get(role)!.filter((so) => so.id !== id),
        ])
      : bufferMap.delete(role);
    setSelectedObjects(bufferMap);
  };

  useEffect(() => {
    if (search.length > 0 || searchByRole.length > 0) {
      var filteredObjects: Map<string, Developer[]> = new Map();
      if (search.length > 0) {
        var devList: Developer[] = [];
        Pathes.mapParser(data!).forEach((v, k) => {
          devList = v.filter((dev) => {
            return dev.name
              .toLocaleUpperCase()
              .includes(search.toLocaleUpperCase());
          });
          devList.length > 0 && filteredObjects.set(k, devList);
          devList = [];
        });
      }
      if (searchByRole.length > 0) {
        Pathes.mapParser(data!).forEach((v, k) => {
          k.toLocaleUpperCase().includes(searchByRole.toLocaleUpperCase()) &&
            filteredObjects.set(k, v);
        });
      }
      setObjects(filteredObjects);
    } else {
      setObjects(Pathes.mapParser(data!));
    }
  }, [search, searchByRole]);

  var renderObjects: JSX.Element[] = [];

  objects &&
    objects.forEach((devs, role) => {
      renderObjects.push(
        <div className=" select-none border-b-2 border-slate-700/40" key={role}>
          <span className=" font-bold">{role}:</span>
          {devs
            .sort((d1, d2) => d1.name.localeCompare(d2.name))
            .map((d) => {
              var isAdded: boolean = selectedObjects.get(role)
                ? selectedObjects.get(role)!.filter((dev) => dev.id === d.id)
                    .length > 0
                : false;
              return (
                <div
                  className="mb-2 cursor-pointer rounded bg-slate-500/60 py-1 pl-1 pr-2 duration-150 hover:bg-slate-600/70"
                  onClick={() => {
                    let bufferMap = new Map(selectedObjects);
                    if (pickForUpdate) {
                      getDeveloper({ devId: d.id, token: user!?.token });
                      return;
                    }
                    if (isAdded) {
                      removeDeveloper(role, bufferMap, d.id);
                      return;
                    }
                    bufferMap.get(role)
                      ? bufferMap.set(role, [...bufferMap.get(role)!, d])
                      : bufferMap.set(role, [d]);
                    setSelectedObjects(bufferMap);
                  }}
                  key={d.id}
                >
                  <div className="flex items-center justify-between">
                    <span className="break-all font-semibold line-clamp-2">
                      {d.name}{' '}
                      <span className=" font-medium italic text-slate-700/80">
                        ({moment(d.birthday).format('YYYY')})
                      </span>
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
            })}
        </div>
      );
    });

  var renderSelectedObjects: JSX.Element[] = [];
  selectedObjects.forEach((v, k) => {
    renderSelectedObjects.push(
      <div key={k + ':' + v.join()}>
        {v.map((d) => {
          return (
            <div
              onClick={() => {
                removeDeveloper(k, new Map(selectedObjects), d.id);
              }}
              key={k + ':' + d.id}
              className="m-1 h-fit w-fit cursor-pointer select-none rounded-lg bg-slate-700 p-1 duration-150 hover:bg-slate-700/60"
            >
              <span className=" text-xs text-slate-200">
                {k}: {d.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  });

  const saverButton = (
    <Button
      success={updateReadiness}
      secondary={!updateReadiness}
      disabled={!updateReadiness}
      className={`${
        updateReadiness
          ? ' cursor-pointer duration-150 hover:brightness-105'
          : ' cursor-not-allowed'
      } `}
      onClick={() => {
        if (objectForUpdate && updateReadiness && developer) {
          saveDeveloper &&
            saveDeveloper({
              developer: { ...developer, id: objectForUpdate.id },
              token: user!?.token,
            });
        } else {
          developer &&
            updateReadiness &&
            saveDeveloper({
              developer,
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
      className={`relative h-[800px] ${
        readiness
          ? 'border-green-800 shadow-green-800/90'
          : 'border-red-800 shadow-red-800/60'
      } ${
        pickForUpdate ? 'bg-blue-400/50' : 'bg-slate-400'
      } max-h-[800px] w-[22rem] max-w-[22rem] rounded-lg border-4  pl-2 shadow-2xl`}
    >
      <div className=" h-[1%] max-h-[1%]"></div>
      <div className=" flex h-[4%] max-h-[4%] select-none items-center justify-center text-xl font-bold uppercase">
        <span className="text-slate-800">творці</span>
      </div>
      <div className=" h-[1%] max-h-[1%]"></div>
      <div className="flex h-[5%] max-h-[5%] items-center justify-center">
        <input
          type="text"
          className=" w-[80%] max-w-[80%] rounded-md bg-slate-200 pl-1 font-medium text-slate-800 outline-none"
          placeholder="назва або ім'я"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </div>
      <div className="flex h-[5%] max-h-[5%] items-center justify-center">
        <input
          type="text"
          className=" w-[80%] max-w-[80%] rounded-md bg-slate-200 pl-1 font-medium text-slate-800 outline-none"
          placeholder="роль, приклад: актор"
          value={searchByRole}
          onChange={(e) => setSearchByRole(e.target.value)}
        ></input>
      </div>
      <div className=" h-[1%] max-h-[1%]"></div>
      <div className="addProductScrollbar h-[60%] max-h-[60%] overflow-y-auto pr-2">
        {data && renderObjects}
      </div>
      <div className=" h-[2%] max-h-[2%]"></div>
      <div className=" h-[20%] max-h-[20%]">
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
          onClick={() => {
            setPickForUpdate((pu) => (pu ? false : true));
          }}
        >
          <AiFillEdit />
        </span>
      </div>
      {openSaver && (pickForUpdate ? objectForUpdate : true) && (
        <AddProductEntities
          actionBar={saverButton}
          setIsOpen={setOpenSaver}
          setDeveloper={setDeveloper}
          developer={objectForUpdate}
          setReadiness={setUpdateReadiness}
          isUpdate={pickForUpdate}
        />
      )}
    </div>
  );
};

export { DeveloperContainer };
