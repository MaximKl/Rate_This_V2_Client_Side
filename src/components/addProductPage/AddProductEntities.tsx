import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { RxCrossCircled } from 'react-icons/rx';
import { DeveloperToAdd } from '../../interfaces/product/addProduct/DeveloperToAdd';
import { ListContainer } from './ListContainer';
import {
  useGetAllCountriesQuery,
  useGetAllRolesQuery,
  useSaveDeveloperRoleMutation,
} from '../../store/apis/addProductApis';
import { DeveloperFieldContainer } from './DeveloperFieldContainer';
import { IdAndName } from '../../interfaces/product/addProduct/IdAndName';
import { DeveloperForUpdate } from '../../interfaces/product/addProduct/DeveloperForUpdate';

interface AddProductEntitiesProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  actionBar: React.ReactNode;
  elementName?: string;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  name?: string;
  setDeveloper?: React.Dispatch<
    React.SetStateAction<DeveloperToAdd | undefined>
  >;
  developer?: DeveloperForUpdate;
  setReadiness?: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdate?: boolean;
}
const AddProductEntities: React.FC<AddProductEntitiesProps> = ({
  setIsOpen,
  actionBar,
  elementName,
  setDeveloper,
  setName,
  name,
  developer,
  setReadiness,
  isUpdate,
}) => {
  const [devCountry, setDevCountry] = useState<IdAndName[]>([]);
  const [devRole, setDevRole] = useState<IdAndName[]>([]);
  const [devMainInfo, setDevMainInfo] = useState<DeveloperToAdd>();

  const [countryReadiness, setCountryReadiness] = useState(false);
  const [roleReadiness, setRoleReadiness] = useState(false);
  const [fieldsReadiness, setFieldsReadiness] = useState(false);

  const [saveRole] = useSaveDeveloperRoleMutation();

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    document.getElementById('root')?.classList.add('blur-sm');
    return () => {
      document.getElementById('root')?.classList.remove('blur-sm');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  useEffect(() => {
    if (setDeveloper && setReadiness) {
      if (countryReadiness && roleReadiness && fieldsReadiness) {
        setDeveloper({
          ...devMainInfo!,
          roles: devRole.map((r) => r.id),
          country: devCountry[0].id,
        });
        setReadiness(true);
      } else {
        setReadiness(false);
      }
    }
  }, [
    countryReadiness,
    roleReadiness,
    fieldsReadiness,
    devMainInfo,
    devRole,
    devCountry,
  ]);

  return ReactDOM.createPortal(
    <div className="">
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        className="fixed inset-0 z-40 bg-slate-700 opacity-80"
      ></div>
      <div
        className={`fixed ${
          setDeveloper
            ? 'registrationScrollbar inset-x-[10%] inset-y-[5%] max-h-[95%] overflow-y-auto'
            : 'inset-x-[30%] inset-y-[30%]'
        }  z-40 h-fit min-w-fit rounded-lg bg-slate-300 p-6 shadow-lg shadow-black/30`}
      >
        <div className="relative">
          <RxCrossCircled
            onClick={() => {
              setIsOpen(false);
            }}
            className="absolute right-0 cursor-pointer text-3xl font-extrabold text-slate-800 duration-150 hover:text-slate-600"
          />
        </div>
        <div className="mb-5 flex justify-center text-xl font-bold text-slate-700">
          {setDeveloper ? (
            <h1>ДОДАТИ РОЗРОБНИКА</h1>
          ) : (
            <h1>
              {name!?.length > 0 ? 'РЕДАГУВАТИ' : 'ДОДАТИ'} {elementName}
            </h1>
          )}
        </div>
        <div className="flex min-w-fit flex-col items-center justify-between text-center text-lg">
          {setDeveloper && (isUpdate ? developer : true) ? (
            <div className="flex w-full justify-evenly pb-5">
              <div className="w-20%">
                <ListContainer
                  getObjects={useGetAllCountriesQuery}
                  containerName="КРАЇНА"
                  setReadiness={setCountryReadiness}
                  readiness={countryReadiness}
                  setData={setDevCountry}
                  isSingleObjectNeed={true}
                  existingData={developer && [developer.country]}
                />
              </div>
              <div className="w-20%">
                <ListContainer
                  getObjects={useGetAllRolesQuery}
                  containerName="РОЛЬ"
                  setReadiness={setRoleReadiness}
                  readiness={roleReadiness}
                  setData={setDevRole}
                  saver={saveRole}
                  existingData={developer && developer.roles}
                />
              </div>
              <div className="w-60%">
                <DeveloperFieldContainer
                  readiness={fieldsReadiness}
                  setReadiness={setFieldsReadiness}
                  setData={setDevMainInfo}
                  updateInfo={developer}
                />
              </div>
            </div>
          ) : (
            <>
              {name !== undefined && setName && (
                <>
                  <h1 className="mb-2">Уведіть назву</h1>
                  <div className="mb-5">
                    <input
                      type="text"
                      className=" h-10 w-[30rem] rounded border-2 border-blue-800 px-2"
                      value={name}
                      onChange={(e) => setName && setName(e.target.value)}
                    />
                    <h1
                      className={`text-right font-medium ${
                        name!?.length > 700 || name!?.length < 2
                          ? 'text-red-700'
                          : 'text-slate-800'
                      }`}
                    >
                      {name.length}/700
                    </h1>
                  </div>
                </>
              )}
            </>
          )}
          <div className=" top-0 mb-3 flex justify-center">{actionBar}</div>
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')!
  );
};

export { AddProductEntities };
