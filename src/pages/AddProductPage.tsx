import { DeveloperContainer } from '../components/addProductPage/DeveloprerContainer';
import { FieldContainer } from '../components/addProductPage/FieldContainer';
import { ListContainer } from '../components/addProductPage/ListContainer';
import { Button } from '../components/ui/Button';
import { useNavigation } from '../hooks/use-navigation';
import { MainProductInfo } from '../interfaces/product/addProduct/MainProductInfo';
import {
  useGetAllCountriesQuery,
  useGetAllGameTypesQuery,
  useGetAllGenresQuery,
  useSaveGameTypeMutation,
  useSaveGenreMutation,
  useSaveProductMutation,
} from '../store/apis/addProductApis';
import { useLazyIsAdminQuery } from '../store/apis/authorizationApis';
import { useEffect, useState } from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { RiErrorWarningFill } from 'react-icons/ri';
import { useLazyGetProductQuery } from '../store/apis/productApis';
import { Developer } from '../interfaces/product/addProduct/Developer';
import { IdAndName } from '../interfaces/product/addProduct/IdAndName';
import { Pathes } from '../store/Pathes';

const AddProductPage: React.FC = () => {
  const [isAdmin, isAdminResponse] = useLazyIsAdminQuery();
  const [getProduct, getProductResponse] = useLazyGetProductQuery();
  const { user, refetchUser, chatValidation, currentPath } = useNavigation();
  const [productType, setProducType] = useState('');

  const [fieldReady, setFieldReady] = useState(false);
  const [countryReady, setCountryReady] = useState(false);
  const [genreReady, setGenreReady] = useState(false);
  const [developersReady, setDevelopersReady] = useState(false);
  const [gameTypeReady, setGameTypeReady] = useState(false);

  const [mainInfo, setMainInfo] = useState<MainProductInfo>();
  const [countries, setCountries] = useState<IdAndName[]>([]);
  const [genres, setGenres] = useState<IdAndName[]>([]);
  const [gameTypes, setGameTypes] = useState<IdAndName[]>([]);
  const [developers, setDevelopers] = useState<Map<string, Developer[]>>(
    new Map()
  );

  const [receivedProductType, setReceivedProducType] = useState('');
  const [receivedMainInfo, setReceivedMainInfo] = useState<MainProductInfo>();
  const [receivedCountries, setReceivedCountries] = useState<IdAndName[]>([]);
  const [receivedGenres, setReceivedGenres] = useState<IdAndName[]>([]);
  const [receivedGameTypes, setReceivedGameTypes] = useState<IdAndName[]>([]);
  const [receivedDevelopers, setReceivedDevelopers] = useState<
    Map<string, Developer[]>
  >(new Map());

  const [updateTabs, setUpdateTubs] = useState(false);
  const [productId, setProductid] = useState(0);

  const [saveProduct, saveResponse] = useSaveProductMutation();
  const [saveGenre, genreResponse] = useSaveGenreMutation();
  const [saveGameType, setSaveGameTypeResponse] = useSaveGameTypeMutation();

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    refetchUser();
  }, []);

  useEffect(() => {
    if (getProductResponse.data) {
      var p = getProductResponse.data;
      var sizeTime = p.type !== 'game' ? (p.size ? p.size : p.time!) : '';
      setProductid(p.id);
      setReceivedMainInfo({
        name: p.name,
        description: p.description ? p.description : '',
        releaseDate: p.releaseDate,
        picture: p.picture,
        size: `${sizeTime}`,
        ageRestriction: p.ageRestriction,
        type: p.type.toLocaleLowerCase(),
      });
      setReceivedProducType(p.type);
      setReceivedCountries(p.countries ? p.countries : []);
      setReceivedGenres(p.genres ? p.genres : []);
      setReceivedDevelopers(
        p.developers ? Pathes.mapParser(p.developers) : new Map()
      );
      setReceivedGameTypes(p.gameTypes ? p.gameTypes : []);
    }
  }, [getProductResponse]);

  useEffect(() => {
    updateTabs && sleep(100).then(() => setUpdateTubs(false));
  }, [updateTabs]);

  useEffect(() => {
    isAdminResponse.isError && window.location.replace('/RateThis');
    console.log(Pathes.pathParser(currentPath) > 0);
    if (isAdminResponse.isSuccess && Pathes.pathParser(currentPath) > 0) {
      getProduct(
        `${currentPath
          .split('=')[1]
          .split('_')[0]
          .toLocaleLowerCase()}s/${Pathes.pathParser(currentPath)}`
      );
    }
  }, [isAdminResponse]);

  useEffect(() => {
    if (saveResponse.isSuccess) {
      setProducType('');
      setUpdateTubs(true);
      if (Pathes.pathParser(currentPath) > 0) {
        getProduct(
          `${currentPath.split('=')[1].split('_')[0].toLocaleLowerCase()}s/${
            currentPath.split('=')[1].split('_')[1]
          }`
        );
      }
    }
  }, [saveResponse]);

  useEffect(() => {
    if (chatValidation === 1) {
      isAdmin(user!?.token);
    }
    if (chatValidation === 0) {
      window.location.replace('/RateThis');
    }
  }, [chatValidation]);

  const allReady =
    productType === 'game'
      ? fieldReady &&
        countryReady &&
        genreReady &&
        developersReady &&
        gameTypeReady
      : fieldReady && countryReady && genreReady && developersReady;

  const publishButton = (
    <div>
      <Button
        rounded
        success={allReady}
        secondary={!allReady}
        disabled={!allReady}
        className={`${
          allReady ? 'cursor-pointer' : 'cursor-not-allowed'
        } select-none text-2xl font-semibold shadow shadow-black/50 duration-150 hover:brightness-105`}
        onClick={() => {
          var mapToSend: Map<string, number[]> = new Map();
          developers.forEach((v, k) => {
            mapToSend.set(
              k,
              v.map((dev) => dev.id)
            );
          });
          var product = {
            product: {
              id: productId,
              ...mainInfo!,
              countries: countries.map((c) => c.id),
              genres: genres.map((c) => c.id),
              gameTypes: gameTypes.map((c) => c.id),
              developers: Array.from(mapToSend.entries()),
            },
            token: user!?.token,
          };
          saveProduct(product);
        }}
      >
        Опублікувати
      </Button>
      {saveResponse.isSuccess && (
        <span className=" flex justify-center pt-2 font-semibold text-green-700">
          Збережено{' '}
          <span className=" pl-2 text-xl">
            <BsFillPatchCheckFill />
          </span>
        </span>
      )}
      {saveResponse.isError && (
        <span className=" flex justify-center pt-2 font-semibold text-red-700">
          Помилка збереження{' '}
          <span className="pl-2 text-xl">
            <RiErrorWarningFill />
          </span>
        </span>
      )}
    </div>
  );
  return (
    <div className="flex min-h-screen w-full bg-slate-300 pt-[64px] ">
      {isAdminResponse.isSuccess &&
        (Pathes.pathParser(currentPath) > 0
          ? receivedMainInfo &&
            receivedCountries.length > 0 &&
            receivedGenres.length > 0 &&
            receivedDevelopers.size > 0 &&
            (receivedProductType === 'game'
              ? receivedGameTypes.length > 0
              : true)
          : true) && (
          <>
            <div className="min-w-[2%]  max-w-[2%]"></div>
            <div className="flex w-[97%] flex-col">
              <div className="min-h-[3vh] w-full"></div>
              <div className="flex w-full flex-wrap justify-evenly">
                {!updateTabs && (
                  <>
                    <div className="pr-5 pb-5">
                      <FieldContainer
                        setProductType={setProducType}
                        productType={productType}
                        setReadiness={setFieldReady}
                        readiness={fieldReady}
                        setData={setMainInfo}
                        data={receivedMainInfo}
                      />
                    </div>
                    <div className="pr-5 pb-5">
                      <ListContainer
                        getObjects={useGetAllCountriesQuery}
                        containerName="КРАЇНИ"
                        setReadiness={setCountryReady}
                        readiness={countryReady}
                        setData={setCountries}
                        existingData={receivedCountries}
                      />
                    </div>
                    <div className="pr-5 pb-5">
                      <ListContainer
                        getObjects={useGetAllGenresQuery}
                        containerName="ЖАНР"
                        setReadiness={setGenreReady}
                        readiness={genreReady}
                        setData={setGenres}
                        saver={saveGenre}
                        existingData={receivedGenres}
                      />
                    </div>
                    <div className="pr-5 pb-5">
                      <DeveloperContainer
                        setReadiness={setDevelopersReady}
                        readiness={developersReady}
                        setData={setDevelopers}
                        existingData={receivedDevelopers}
                      />
                    </div>
                    {productType === 'game' ? (
                      <div className="h-[820px] max-h-[820px] pr-5 pb-5">
                        <div className="h-[90%] min-h-[90%]">
                          <ListContainer
                            getObjects={useGetAllGameTypesQuery}
                            containerName="ТИП ГРИ"
                            setReadiness={setGameTypeReady}
                            readiness={gameTypeReady}
                            setData={setGameTypes}
                            saver={saveGameType}
                            existingData={receivedGameTypes}
                          />
                        </div>
                        <div className="flex h-[10%] min-h-[10%] w-full items-center justify-center pt-2">
                          {publishButton}
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto">{publishButton}</div>
                    )}
                  </>
                )}
              </div>
              <div className="min-h-[3vh] w-full"></div>
            </div>
            <div className="min-w-[1%]  max-w-[1%]"></div>
          </>
        )}
    </div>
  );
};

export { AddProductPage };
